const { SESv2Client, SendEmailCommand } = require('@aws-sdk/client-sesv2')

const consentVersion = 'onix-personal-data-2026-11-18'
const requestLabels = {
  order: 'Обсудить заказ',
  quote: 'Запросить коммерческое предложение',
  demo: 'Запросить демонстрацию',
}

const emailClient = new SESv2Client({
  region: 'ru-central1',
  endpoint: 'https://postbox.cloud.yandex.net',
})

function headerValue(headers = {}, name) {
  const entry = Object.entries(headers).find(([key]) => key.toLowerCase() === name.toLowerCase())
  return entry?.[1] ?? ''
}

function response(statusCode, body = '') {
  const origin = process.env.ALLOWED_ORIGIN?.trim()
  const headers = {
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json; charset=utf-8',
    Vary: 'Origin',
  }

  if (origin) {
    headers['Access-Control-Allow-Origin'] = origin
    headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
    headers['Access-Control-Allow-Headers'] = 'Content-Type'
    headers['Access-Control-Max-Age'] = '600'
  }

  return { statusCode, headers, body }
}

function jsonResponse(statusCode, value) {
  return response(statusCode, JSON.stringify(value))
}

function decodeBody(event) {
  if (typeof event.body !== 'string') return null
  const raw = event.isBase64Encoded
    ? Buffer.from(event.body, 'base64').toString('utf8')
    : event.body

  if (Buffer.byteLength(raw, 'utf8') > 12_000) return null

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function cleanText(value, maxLength) {
  if (typeof value !== 'string') return ''
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, maxLength)
}

function validEmail(value) {
  return value.length <= 254 && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value)
}

exports.handler = async function handler(event) {
  const allowedOrigin = process.env.ALLOWED_ORIGIN?.trim()
  const origin = headerValue(event.headers, 'origin')

  if (!allowedOrigin || !origin || origin !== allowedOrigin) {
    return jsonResponse(403, { error: 'Request origin is not allowed.' })
  }

  if (event.httpMethod === 'OPTIONS') {
    return response(204)
  }

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed.' })
  }

  const contentType = headerValue(event.headers, 'content-type')
  if (!contentType.toLowerCase().startsWith('application/json')) {
    return jsonResponse(415, { error: 'JSON is required.' })
  }

  const payload = decodeBody(event)
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return jsonResponse(400, { error: 'Invalid request.' })
  }

  if (cleanText(payload.website, 200)) {
    return response(204)
  }

  const type = cleanText(payload.type, 20)
  const name = cleanText(payload.name, 100)
  const email = cleanText(payload.email, 254)
  const company = cleanText(payload.company, 160)
  const item = cleanText(payload.item, 160)
  const message = cleanText(payload.message, 5_000)

  if (
    !Object.hasOwn(requestLabels, type)
    || name.length < 1
    || !validEmail(email)
    || message.length < 3
    || payload.consent !== true
    || payload.consentVersion !== consentVersion
  ) {
    return jsonResponse(400, { error: 'Please check the required fields and consent.' })
  }

  const sender = process.env.CONTACT_FROM_EMAIL?.trim()
  const recipient = process.env.CONTACT_TO_EMAIL?.trim()
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID?.trim()
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY?.trim()

  if (!sender || !recipient || !accessKeyId || !secretAccessKey) {
    return jsonResponse(503, { error: 'Email delivery is not configured.' })
  }

  const submittedAt = new Date().toISOString()
  const emailBody = [
    'Новая заявка с сайта ONIX',
    '',
    `Тип обращения: ${requestLabels[type]}`,
    `Имя: ${name}`,
    `Email: ${email}`,
    company ? `Компания: ${company}` : null,
    item ? `Направление: ${item}` : null,
    '',
    'Сообщение:',
    message,
    '',
    `Согласие на обработку персональных данных: да (${consentVersion})`,
    `Получено: ${submittedAt}`,
  ].filter((line) => line !== null).join('\n')

  try {
    await emailClient.send(new SendEmailCommand({
      FromEmailAddress: sender,
      Destination: { ToAddresses: [recipient] },
      ReplyToAddresses: [email],
      Content: {
        Simple: {
          Subject: { Charset: 'UTF-8', Data: `Заявка ONIX: ${requestLabels[type]}` },
          Body: { Text: { Charset: 'UTF-8', Data: emailBody } },
        },
      },
    }))
  } catch {
    return jsonResponse(502, { error: 'Email delivery failed.' })
  }

  return jsonResponse(202, { accepted: true })
}
