# ONIX contact form API

This small public endpoint accepts the native React form and forwards each
consented request to the operator's mailbox through Yandex Cloud Postbox. It
does not write form contents to a database or application logs. The email
recipient's mailbox remains the place where submitted requests are stored.

The frontend is hosted on GitHub Pages, so Postbox credentials stay in this
server-side function. Configure the function and a verified sender address
before adding its HTTPS URL to the site.

## Cloud setup

1. Create a Yandex Cloud Postbox address and verify the sender domain. Use a
   service account in the same folder as the Postbox address and grant it the
   `postbox.sender` role.
2. Create a static access key for that service account. Store the key ID and
   the secret as two key/value pairs in one Yandex Lockbox secret; do not
   commit them or put them in a `VITE_` value.
3. In this directory, run:

   ```sh
   npm ci
   npm test
   zip -r onix-contact-api.zip index.js package.json package-lock.json node_modules
   ```

   Create a private Cloud Function using the supported Node.js 22 runtime and
   entry point `index.handler`. Grant the function's service account
   `lockbox.payloadViewer` on the secret (and `kms.keys.encrypterDecrypter` if
   the secret uses your own KMS key), then expose the two Lockbox keys as
   `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`. Injecting secrets creates
   a new function version; after access is revoked, Yandex Cloud Functions may
   keep a cached value for up to five minutes. See the [Node.js function
   setup](https://yandex.cloud/ru/docs/functions/quickstart/create-function/node-function-quickstart)
   and [Lockbox secret setup](https://yandex.cloud/en/docs/functions/operations/function/lockbox-secret-transmit).
4. Configure these non-secret environment variables on the function:
   - `ALLOWED_ORIGIN` — the exact website origin, including `https://` but
     without a trailing slash (for example, `https://example.github.io`).
   - `CONTACT_FROM_EMAIL` — the verified Postbox sender address.
   - `CONTACT_TO_EMAIL` — the operator's mailbox that receives the requests.
5. Make the function private: disable **Public function** (or run
   `yc serverless function deny-unauthenticated-invoke <name>`) and make sure
   the `All users` group has no invoke permission. Put a public Yandex API
   Gateway in front of it, set `service_account_id` in the
   `x-yc-apigateway-integration:cloud_functions` extension, and give that
   service account `functions.functionInvoker` on the function. See the
   [gateway extension](https://yandex.cloud/en/docs/api-gateway/concepts/extensions/cloud-functions),
   [private functions](https://yandex.cloud/en/docs/functions/operations/function/function-private)
   and [function authentication](https://yandex.cloud/en/docs/functions/operations/function/auth).
   CORS is not authentication: the `ALLOWED_ORIGIN` check only controls
   browsers, so the function must stay private.
6. In API Gateway, expose only the contact path and `POST`/`OPTIONS`. Attach a
   Yandex Smart Web Security profile to the gateway: create an Advanced Rate
   Limiter (ARL) profile with limits grouped by client IP and/or path + method
   for the contact route, create a security profile from the preset template
   (API protection mode), select that ARL profile, connect the gateway, and
   enable rule logging. Use `DENY`, `CAPTCHA` or IP blocks for abuse. The
   legacy `x-yc-apigateway-rate-limit` extensions are deprecated; use SWS for
   throttling. Smart Web Security has a separate charge, and the current
   [API Gateway limits](https://yandex.cloud/en/docs/api-gateway/concepts/limits)
   page lists a quota of one gateway per cloud with throttling or SWS (the RU
   page is more explicit); request an increase if needed. See the
   [SWS integration guide](https://yandex.cloud/en/docs/smartwebsecurity/tutorials/api-gw-sws-integration)
   and [profile setup](https://yandex.cloud/en/docs/smartwebsecurity/operations/profile-create).
7. Add the public API Gateway URL as the GitHub repository Actions variable
   `VITE_CONTACT_API_URL` (Settings → Secrets and variables → Actions →
   Variables). The frontend workflow injects it into both Pages and release
   builds. For local development, copy `frontend/.env.example` to
   `frontend/.env.local` and set the same URL.

The Postbox SDK connection follows the [Yandex Cloud email sending guide](https://yandex.cloud/ru/docs/postbox/tutorials/send-emails-aws-sdk-js).

## Rate limiting and validation

The handler enforces at most 5 valid submissions per 60 seconds per client
IP and per normalized email, plus a 60-second cooldown for the same email and
message. Limited requests get `429` with a `Retry-After` header. Counters use
bounded, periodically pruned Maps of SHA-256 hashes, so raw IPs, emails and
messages are not retained in memory. The body limit is 12 KB (including
Base64-encoded bodies), and control characters, excessive whitespace,
overlong fields and invalid consent are rejected with `400`. Invalid requests
do not consume quota; honeypot hits and `OPTIONS` return `204`.

**This is per-instance, best-effort protection only.** State is local to one
function instance, is not shared between concurrent instances and is lost on
cold starts. The client IP is taken from the platform-provided
`requestContext.identity.sourceIp` (or `requestContext.http.sourceIp` for
payload format 2.0) when present, otherwise from the last `X-Forwarded-For`
value or `X-Real-IP`; forwarded headers can be spoofed unless the gateway
normalizes them. API Gateway and Smart Web Security are the real protection
layer for distributed throttling, DDoS/bot filtering, WAF, CAPTCHA, IP blocks,
TLS and gateway-level request size/timeout quotas. Those controls cannot be
enforced from this code, nor can Lockbox access control and secret rotation.

Keep the recipient mailbox provider and retention period in the privacy policy
aligned with the mailbox actually configured. Do not publish the legal pages
until the operator's identity and contact address have been filled in.
