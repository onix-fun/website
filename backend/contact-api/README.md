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
   secret in Yandex Lockbox; do not commit them or put them in a `VITE_` value.
3. In this directory, run:

   ```sh
   npm ci --omit=dev
   zip -r onix-contact-api.zip index.js package.json package-lock.json node_modules
   ```

   Create a private Cloud Function using the supported Node.js 22 runtime and
   entry point `index.handler`. Grant the function's service account access to
   the Lockbox secret, then expose the key ID and secret as
   `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`. See the [Node.js function
   setup](https://yandex.cloud/ru/docs/functions/quickstart/create-function/node-function-quickstart)
   and [Lockbox secret setup](https://yandex.cloud/ru/docs/functions/operations/function/lockbox-secret-transmit).
4. Configure these non-secret environment variables on the function:
   - `ALLOWED_ORIGIN` — the exact website origin, including `https://` but
     without a trailing slash (for example, `https://example.github.io`).
   - `CONTACT_FROM_EMAIL` — the verified Postbox sender address.
   - `CONTACT_TO_EMAIL` — the operator's mailbox that receives the requests.
5. Put a public Yandex API Gateway in front of the private function and attach
   a Yandex Smart Web Security profile. Give the gateway's service account
   `functions.functionInvoker` on the function. The handler checks the exact
   browser origin, but CORS is not authentication; keep the function private
   so traffic cannot bypass the protection layer. See [Smart Web Security for
   API Gateway](https://yandex.cloud/ru/docs/api-gateway/concepts/extensions/sws).
   Smart Web Security has a separate charge.
6. Add the public API Gateway URL as the GitHub repository Actions variable
   `VITE_CONTACT_API_URL` (Settings → Secrets and variables → Actions →
   Variables). The frontend workflow injects it into both Pages and release
   builds. For local development, copy `frontend/.env.example` to
   `frontend/.env.local` and set the same URL.

The Postbox SDK connection follows the [Yandex Cloud email sending guide](https://yandex.cloud/ru/docs/postbox/tutorials/send-emails-aws-sdk-js).

Keep the recipient mailbox provider and retention period in the privacy policy
aligned with the mailbox actually configured. Do not publish the legal pages
until the operator's identity and contact address have been filled in.
