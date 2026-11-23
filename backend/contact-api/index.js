const { createHash } = require('node:crypto')
const { isIP } = require('node:net')
const { SESv2Client, SendEmailCommand } = require('@aws-sdk/client-sesv2')

const consentVersion = 'onix-personal-data-2026-11-18'
const requestLabels = {
  order: 'Обсудить заказ',
  quote: 'Запросить коммерческое предложение',
  demo: 'Запросить демонстрацию',
}

const maxBodyBytes = 12_000
const maxBase64BodyBytes = Math.ceil(maxBodyBytes / 3) * 4
const controlCharacters = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/
const excessiveWhitespace = /\s{10,}/
const base64Body = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/

function createDefaultEmailClient() {
  return new SESv2Client({
    region: 'ru-central1',
    endpoint: 'https://postbox.cloud.yandex.net',
  })
}

function headerValue(headers, name) {
  const source = headers && typeof headers === 'object' ? headers : {}
  const entry = Object.entries(source).find(([key]) => key.toLowerCase() === name.toLowerCase())
  const value = entry?.[1]
  return typeof value === 'string' ? value : ''
}

function response(statusCode, body = '', extraHeaders = {}, env = process.env) {
  const origin = configValue(env.ALLOWED_ORIGIN)
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

  return { statusCode, headers: { ...headers, ...extraHeaders }, body }
}

function jsonResponse(statusCode, value, extraHeaders = {}, env = process.env) {
  return response(statusCode, JSON.stringify(value), extraHeaders, env)
}

function decodeBody(event) {
  if (!event || typeof event.body !== 'string') return null

  const encoded = event.isBase64Encoded === true
  const rawBody = event.body
  if (Buffer.byteLength(rawBody, 'utf8') > (encoded ? maxBase64BodyBytes : maxBodyBytes)) return null

  let raw = rawBody
  if (encoded) {
    if (!base64Body.test(rawBody)) return null
    raw = Buffer.from(rawBody, 'base64').toString('utf8')
  }

  if (Buffer.byteLength(raw, 'utf8') > maxBodyBytes) return null

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function hasInvalidText(value) {
  return controlCharacters.test(value) || excessiveWhitespace.test(value)
}

function normalizeEmail(value) {
  return value.trim().toLowerCase()
}

function validEmail(value) {
  if (value.length > 254 || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value)) return false

  const [local, domain] = value.split('@')
  return local.length <= 64
    && !local.startsWith('.')
    && !local.endsWith('.')
    && !local.includes('..')
    && !domain.startsWith('.')
    && !domain.endsWith('.')
    && !domain.includes('..')
}

function validatePayload(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return null

  const stringFields = {
    type: 20,
    name: 100,
    email: 254,
    company: 160,
    item: 160,
    message: 5_000,
    website: 200,
  }
  const values = {}

  for (const [field, maxLength] of Object.entries(stringFields)) {
    const raw = payload[field] === undefined ? '' : payload[field]
    if (typeof raw !== 'string' || hasInvalidText(raw)) return null

    const value = raw.trim()
    if (value.length > maxLength) return null
    values[field] = value
  }

  if (values.website) return { honeypot: true }

  const email = normalizeEmail(values.email)
  if (
    !Object.hasOwn(requestLabels, values.type)
    || values.name.length < 1
    || !validEmail(email)
    || values.message.length < 3
    || payload.consent !== true
    || payload.consentVersion !== consentVersion
  ) {
    return null
  }

  return { values: { ...values, email } }
}

function clientIp(event) {
  const context = event?.requestContext
  const forwardedFor = headerValue(event?.headers, 'x-forwarded-for').split(',').at(-1) ?? ''
  const candidates = [
    context?.identity?.sourceIp,
    context?.http?.sourceIp,
    forwardedFor,
    headerValue(event?.headers, 'x-real-ip'),
  ]

  for (const candidate of candidates) {
    if (typeof candidate !== 'string') continue
    const value = candidate.trim().replace(/^\[|\]$/g, '')
    if (isIP(value)) return value
  }

  return ''
}

function hashKey(prefix, value) {
  return createHash('sha256').update(prefix).update('\0').update(value).digest('hex')
}

// Best-effort, per-instance limiter: state lives in this function instance only,
// is reset on cold starts and is not shared between instances. Yandex API Gateway
// and Smart Web Security limits are the real protection layer. Keys are hashed so
// neither IP addresses nor emails/messages are kept in memory.
function createRateLimiter({
  now = Date.now,
  maxSubmissions = 5,
  windowMs = 60_000,
  duplicateWindowMs = 60_000,
  maxKeys = 5_000,
  cleanupIntervalMs = 60_000,
} = {}) {
  const submissionsByIp = new Map()
  const submissionsByEmail = new Map()
  const duplicates = new Map()

  function prune(time) {
    const maps = [
      [submissionsByIp, windowMs],
      [submissionsByEmail, windowMs],
      [duplicates, duplicateWindowMs],
    ]

    for (const [map, lifetime] of maps) {
      for (const [key, stored] of map) {
        const timestamps = Array.isArray(stored) ? stored : [stored]
        const fresh = timestamps.filter((timestamp) => time - timestamp < lifetime)

        if (fresh.length === 0) {
          map.delete(key)
        } else if (fresh.length !== timestamps.length) {
          map.set(key, Array.isArray(stored) ? fresh : fresh[0])
        }
      }
    }
  }

  function boundedSet(map, key, value) {
    map.delete(key)
    map.set(key, value)

    while (map.size > maxKeys) {
      const oldest = map.keys().next().value
      if (oldest === undefined) break
      map.delete(oldest)
    }
  }

  function retryAfter(timestamp, lifetime, time) {
    return Math.max(1, Math.ceil((timestamp + lifetime - time) / 1000))
  }

  const timer = cleanupIntervalMs > 0 ? setInterval(() => prune(now()), cleanupIntervalMs) : null
  timer?.unref?.()

  return {
    check({ ip, email, message, at } = {}) {
      const time = typeof at === 'number' ? at : now()
      prune(time)

      const duplicateKey = hashKey('duplicate', `${email}\n${message}`)
      const duplicateAt = duplicates.get(duplicateKey)
      if (duplicateAt !== undefined && time - duplicateAt < duplicateWindowMs) {
        return { limited: true, retryAfter: retryAfter(duplicateAt, duplicateWindowMs, time) }
      }

      const ipKey = ip ? hashKey('ip', ip) : ''
      const emailKey = hashKey('email', email)
      const ipTimes = ipKey ? submissionsByIp.get(ipKey) ?? [] : []
      const emailTimes = submissionsByEmail.get(emailKey) ?? []

      if (ipTimes.length >= maxSubmissions) {
        return { limited: true, retryAfter: retryAfter(ipTimes[0], windowMs, time) }
      }

      if (emailTimes.length >= maxSubmissions) {
        return { limited: true, retryAfter: retryAfter(emailTimes[0], windowMs, time) }
      }

      if (ipKey) boundedSet(submissionsByIp, ipKey, [...ipTimes, time])
      boundedSet(submissionsByEmail, emailKey, [...emailTimes, time])
      boundedSet(duplicates, duplicateKey, time)

      return { limited: false }
    },
    dispose() {
      if (timer) clearInterval(timer)
    },
  }
}

function configValue(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function createHandler({
  emailClient = createDefaultEmailClient(),
  now = Date.now,
  rateLimits = {},
  env = process.env,
} = {}) {
  const limiter = rateLimits && typeof rateLimits.check === 'function'
    ? rateLimits
    : createRateLimiter({ now, ...(rateLimits || {}) })
  const reply = (statusCode, body = '', extraHeaders = {}) => response(statusCode, body, extraHeaders, env)
  const json = (statusCode, value, extraHeaders = {}) => jsonResponse(statusCode, value, extraHeaders, env)

  return async function handler(event = {}) {
    const allowedOrigin = configValue(env.ALLOWED_ORIGIN)
    const origin = headerValue(event.headers, 'origin')

    if (!allowedOrigin || !origin || origin !== allowedOrigin) {
      return json(403, { error: 'Request origin is not allowed.' })
    }

    if (event.httpMethod === 'OPTIONS') {
      return reply(204)
    }

    if (event.httpMethod !== 'POST') {
      return json(405, { error: 'Method not allowed.' })
    }

    const contentType = headerValue(event.headers, 'content-type')
    if (!contentType.toLowerCase().startsWith('application/json')) {
      return json(415, { error: 'JSON is required.' })
    }

    const payload = decodeBody(event)
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      return json(400, { error: 'Invalid request.' })
    }

    const validated = validatePayload(payload)
    if (!validated) {
      return json(400, { error: 'Please check the required fields and consent.' })
    }

    if (validated.honeypot) {
      return reply(204)
    }

    const sender = configValue(env.CONTACT_FROM_EMAIL)
    const recipient = configValue(env.CONTACT_TO_EMAIL)
    const accessKeyId = configValue(env.AWS_ACCESS_KEY_ID)
    const secretAccessKey = configValue(env.AWS_SECRET_ACCESS_KEY)

    if (!sender || !recipient || !accessKeyId || !secretAccessKey) {
      return json(503, { error: 'Email delivery is not configured.' })
    }

    const { type, name, email, company, item, message } = validated.values
    const submittedAtMs = now()
    let limit = { limited: false }

    try {
      limit = limiter.check({
        ip: clientIp(event),
        email,
        message,
        at: submittedAtMs,
      })
    } catch {
      // Best effort only: API Gateway/SWS remains the protection layer.
    }

    if (limit.limited) {
      const retryAfter = Math.max(1, Math.ceil(Number(limit.retryAfter) || 1))
      return json(429, { error: 'Too many requests. Please try again later.' }, {
        'Retry-After': String(retryAfter),
      })
    }

    const submittedAt = new Date(submittedAtMs).toISOString()
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
      return json(502, { error: 'Email delivery failed.' })
    }

    return json(202, { accepted: true })
  }
}

exports.createHandler = createHandler
exports.createRateLimiter = createRateLimiter
exports.handler = createHandler()
