const { test } = require('node:test')
const assert = require('node:assert/strict')

const { createHandler, createRateLimiter } = require('../index')

const fixedNow = 1_760_000_000_000
const consentVersion = 'onix-personal-data-2026-11-18'
const origin = 'https://example.github.io'

function makeEnv(overrides = {}) {
  return {
    ALLOWED_ORIGIN: origin,
    CONTACT_FROM_EMAIL: 'no-reply@example.com',
    CONTACT_TO_EMAIL: 'operator@example.com',
    AWS_ACCESS_KEY_ID: 'test-key-id',
    AWS_SECRET_ACCESS_KEY: 'test-secret',
    ...overrides,
  }
}

function makeClient({ fail = false } = {}) {
  const calls = []

  return {
    calls,
    async send(command) {
      if (fail) throw new Error('postbox unavailable')
      calls.push(command)
      return { MessageId: 'test-message' }
    },
  }
}

function makePayload(overrides = {}) {
  return {
    type: 'order',
    name: 'Иван',
    email: 'User@Example.COM',
    company: 'ООО Ромашка',
    item: 'Сайт',
    message: 'Здравствуйте! Хочу обсудить заказ.',
    consent: true,
    consentVersion,
    ...overrides,
  }
}

function makeEvent(payload = makePayload(), overrides = {}) {
  return {
    httpMethod: 'POST',
    headers: { Origin: origin, 'Content-Type': 'application/json' },
    body: typeof payload === 'string' ? payload : JSON.stringify(payload),
    isBase64Encoded: false,
    requestContext: { identity: { sourceIp: '203.0.113.10' } },
    ...overrides,
  }
}

function createTestHandler(options = {}) {
  const client = options.emailClient ?? makeClient()
  const { env, ...rest } = options

  return {
    client,
    handler: createHandler({
      now: () => fixedNow,
      ...rest,
      emailClient: client,
      env: makeEnv(env),
    }),
  }
}

function bodyOf(result) {
  return result.body ? JSON.parse(result.body) : null
}

test('accepts a valid request and sends the expected SES command', async () => {
  const { handler, client } = createTestHandler()

  const result = await handler(makeEvent())

  assert.equal(result.statusCode, 202)
  assert.deepEqual(bodyOf(result), { accepted: true })
  assert.equal(result.headers['Access-Control-Allow-Origin'], origin)
  assert.equal(client.calls.length, 1)

  const input = client.calls[0].input
  assert.equal(input.FromEmailAddress, 'no-reply@example.com')
  assert.deepEqual(input.Destination.ToAddresses, ['operator@example.com'])
  assert.deepEqual(input.ReplyToAddresses, ['user@example.com'])
  assert.equal(input.Content.Simple.Subject.Charset, 'UTF-8')
  assert.equal(input.Content.Simple.Subject.Data, 'Заявка ONIX: Обсудить заказ')
  assert.equal(input.Content.Simple.Body.Text.Charset, 'UTF-8')

  const text = input.Content.Simple.Body.Text.Data
  assert.match(text, /^Новая заявка с сайта ONIX/)
  assert.match(text, /Имя: Иван/)
  assert.match(text, /Email: user@example\.com/)
  assert.match(text, /Компания: ООО Ромашка/)
  assert.match(text, /Направление: Сайт/)
  assert.match(text, /Здравствуйте! Хочу обсудить заказ\./)
  assert.match(text, new RegExp(consentVersion))
})

test('decodes a base64 JSON body', async () => {
  const { handler, client } = createTestHandler()
  const body = Buffer.from(JSON.stringify(makePayload()), 'utf8').toString('base64')

  const result = await handler(makeEvent(body, { isBase64Encoded: true }))

  assert.equal(result.statusCode, 202)
  assert.equal(client.calls.length, 1)
})

test('returns 204 for the honeypot and for OPTIONS without sending email', async () => {
  const { handler, client } = createTestHandler()

  const honeypot = await handler(makeEvent(makePayload({ website: 'https://spam.example' })))
  const preflight = await handler(makeEvent('', { httpMethod: 'OPTIONS' }))

  assert.equal(honeypot.statusCode, 204)
  assert.equal(honeypot.body, '')
  assert.equal(preflight.statusCode, 204)
  assert.equal(preflight.body, '')
  assert.equal(client.calls.length, 0)
})

test('rejects malformed JSON, invalid base64 and non-object payloads', async () => {
  const { handler, client } = createTestHandler()
  const events = [
    makeEvent('{"type":'),
    makeEvent('null'),
    makeEvent('[]'),
    makeEvent('42'),
    makeEvent('"text"'),
    makeEvent('!!!', { isBase64Encoded: true }),
  ]

  for (const event of events) {
    const result = await handler(event)
    assert.equal(result.statusCode, 400)
    assert.deepEqual(bodyOf(result), { error: 'Invalid request.' })
  }

  assert.equal(client.calls.length, 0)
})

test('rejects a body larger than 12 KB', async () => {
  const { handler, client } = createTestHandler()
  const result = await handler(makeEvent(makePayload({ message: 'x'.repeat(12_001) })))

  assert.equal(result.statusCode, 400)
  assert.deepEqual(bodyOf(result), { error: 'Invalid request.' })
  assert.equal(client.calls.length, 0)
})

test('rejects wrong origin, method and content type', async () => {
  const { handler, client } = createTestHandler()
  const cases = [
    [makeEvent(makePayload(), { headers: { Origin: 'https://evil.example', 'Content-Type': 'application/json' } }), 403, 'Request origin is not allowed.'],
    [makeEvent(makePayload(), { headers: { 'Content-Type': 'application/json' } }), 403, 'Request origin is not allowed.'],
    [makeEvent('', { httpMethod: 'OPTIONS', headers: { Origin: 'https://evil.example' } }), 403, 'Request origin is not allowed.'],
    [makeEvent('', { httpMethod: 'GET' }), 405, 'Method not allowed.'],
    [makeEvent('', { headers: { Origin: origin, 'Content-Type': 'text/plain' } }), 415, 'JSON is required.'],
  ]

  for (const [event, statusCode, error] of cases) {
    const result = await handler(event)
    assert.equal(result.statusCode, statusCode)
    assert.deepEqual(bodyOf(result), { error })
  }

  assert.equal(client.calls.length, 0)
})

test('requires consent and the exact consent version', async () => {
  const { handler, client } = createTestHandler()
  const payloads = [
    makePayload({ consent: undefined }),
    makePayload({ consent: false }),
    makePayload({ consentVersion: 'onix-personal-data-2025-01-01' }),
    makePayload({ consentVersion: undefined }),
  ]

  for (const payload of payloads) {
    const result = await handler(makeEvent(payload))
    assert.equal(result.statusCode, 400)
    assert.deepEqual(bodyOf(result), { error: 'Please check the required fields and consent.' })
  }

  assert.equal(client.calls.length, 0)
})

test('rejects invalid emails, control characters, repeated whitespace and overlength fields', async () => {
  const { handler, client } = createTestHandler()
  const payloads = [
    makePayload({ email: 'not-an-email' }),
    makePayload({ email: 'a@b' }),
    makePayload({ email: 'a..b@example.com' }),
    makePayload({ email: 'user name@example.com' }),
    makePayload({ name: 'Иван\u0000' }),
    makePayload({ message: `Привет${' '.repeat(20)}мир` }),
    makePayload({ name: 'x'.repeat(101) }),
    makePayload({ company: 'x'.repeat(161) }),
    makePayload({ item: 'x'.repeat(161) }),
    makePayload({ message: 'x'.repeat(5_001) }),
  ]

  for (const payload of payloads) {
    const result = await handler(makeEvent(payload))
    assert.equal(result.statusCode, 400)
    assert.deepEqual(bodyOf(result), { error: 'Please check the required fields and consent.' })
  }

  assert.equal(client.calls.length, 0)
})

test('rejects unexpected non-string field values', async () => {
  const { handler, client } = createTestHandler()
  const payloads = [
    makePayload({ name: 42 }),
    makePayload({ email: null }),
    makePayload({ website: [] }),
    makePayload({ message: { text: 'hello' } }),
    makePayload({ consent: 'true' }),
  ]

  for (const payload of payloads) {
    const result = await handler(makeEvent(payload))
    assert.equal(result.statusCode, 400)
  }

  assert.equal(client.calls.length, 0)
})

test('limits repeated submissions per IP and returns Retry-After', async () => {
  let time = fixedNow
  const { handler, client } = createTestHandler({
    now: () => time,
    rateLimits: { maxSubmissions: 2, windowMs: 60_000, duplicateWindowMs: 0 },
  })

  assert.equal((await handler(makeEvent(makePayload({ message: 'Первое сообщение' })))).statusCode, 202)
  assert.equal((await handler(makeEvent(makePayload({ message: 'Второе сообщение' })))).statusCode, 202)

  const limited = await handler(makeEvent(makePayload({ message: 'Третье сообщение' })))
  assert.equal(limited.statusCode, 429)
  assert.deepEqual(bodyOf(limited), { error: 'Too many requests. Please try again later.' })
  assert.equal(limited.headers['Retry-After'], '60')
  assert.equal(client.calls.length, 2)
})

test('limits repeated submissions per email across IP changes', async () => {
  const { handler, client } = createTestHandler({
    rateLimits: { maxSubmissions: 2, windowMs: 60_000, duplicateWindowMs: 0 },
  })

  for (const [index, ip] of ['203.0.113.1', '203.0.113.2'].entries()) {
    const event = makeEvent(
      makePayload({ message: `Сообщение номер ${index}` }),
      { requestContext: { identity: { sourceIp: ip } } },
    )
    assert.equal((await handler(event)).statusCode, 202)
  }

  const event = makeEvent(makePayload({ message: 'Третье сообщение' }), {
    requestContext: { identity: { sourceIp: '203.0.113.3' } },
  })
  assert.equal((await handler(event)).statusCode, 429)
  assert.equal(client.calls.length, 2)
})

test('applies a duplicate-submission cooldown keyed by email and message', async () => {
  let time = fixedNow
  const { handler, client } = createTestHandler({
    now: () => time,
    rateLimits: { maxSubmissions: 10, duplicateWindowMs: 60_000 },
  })
  const payload = makePayload()

  assert.equal((await handler(makeEvent(payload))).statusCode, 202)

  const duplicate = await handler(makeEvent(payload))
  assert.equal(duplicate.statusCode, 429)
  assert.match(duplicate.headers['Retry-After'], /^\d+$/)
  assert.equal(client.calls.length, 1)

  time += 61_000
  assert.equal((await handler(makeEvent(payload))).statusCode, 202)
  assert.equal(client.calls.length, 2)
})

test('returns 502 when email delivery fails', async () => {
  const { handler } = createTestHandler({ emailClient: makeClient({ fail: true }) })
  const result = await handler(makeEvent())

  assert.equal(result.statusCode, 502)
  assert.deepEqual(bodyOf(result), { error: 'Email delivery failed.' })
})

test('returns 503 when email configuration is missing', async () => {
  const missing = [
    { CONTACT_FROM_EMAIL: '' },
    { CONTACT_TO_EMAIL: '' },
    { AWS_ACCESS_KEY_ID: '' },
    { AWS_SECRET_ACCESS_KEY: '' },
  ]

  for (const env of missing) {
    const { handler, client } = createTestHandler({ env })
    const result = await handler(makeEvent())

    assert.equal(result.statusCode, 503)
    assert.deepEqual(bodyOf(result), { error: 'Email delivery is not configured.' })
    assert.equal(client.calls.length, 0)
  }
})

test('rate limiter prunes expired keys and bounds its maps', () => {
  let time = fixedNow
  const limiter = createRateLimiter({
    now: () => time,
    maxSubmissions: 1,
    windowMs: 1_000,
    duplicateWindowMs: 0,
    maxKeys: 10,
    cleanupIntervalMs: 0,
  })

  assert.equal(limiter.check({ ip: '', email: 'a@example.com', message: 'one' }).limited, false)
  assert.equal(limiter.check({ ip: '', email: 'a@example.com', message: 'two' }).limited, true)

  time += 1_001
  assert.equal(limiter.check({ ip: '', email: 'a@example.com', message: 'three' }).limited, false)

  const bounded = createRateLimiter({
    now: () => fixedNow,
    maxSubmissions: 1,
    windowMs: 60_000,
    duplicateWindowMs: 0,
    maxKeys: 2,
    cleanupIntervalMs: 0,
  })

  for (const email of ['a@example.com', 'b@example.com', 'c@example.com']) {
    assert.equal(bounded.check({ ip: '', email, message: 'hello' }).limited, false)
  }

  assert.equal(bounded.check({ ip: '', email: 'a@example.com', message: 'again' }).limited, false)

  limiter.dispose()
  bounded.dispose()
})
