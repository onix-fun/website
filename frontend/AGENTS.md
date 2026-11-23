# ONIX Frontend Architecture

## Dependency direction

Imports flow downward through these layers; the shared layer is the external
`@onix/ui-kit` package (a separate git repository in `../ui-kit`):

```text
app → pages → features → @onix/ui-kit
```

| Layer | May import | Responsibility |
| --- | --- | --- |
| `app` | `pages`, `@onix/ui-kit` | Router, providers, and the application shell |
| `pages` | `features`, `@onix/ui-kit` | Route-level composition |
| `features` | `@onix/ui-kit` | Product behavior and domain-specific UI |
| `@onix/ui-kit` | its own files | Tokens, primitives, layout, hooks, and utilities |

Features remain independent. A feature must not import another feature, a page,
or the app. Route components are lazy-loaded in `src/app/router.tsx`; each page
and feature exposes its public API through `index.ts`. Use a layer's public
barrel when crossing a layer boundary.

ESLint enforces these dependencies with `eslint-plugin-boundaries`. The UI kit
is an external module, so layer policies explicitly allow `@onix/ui-kit` from
`app`, `pages`, and `features`; reverse imports are impossible because the kit
does not depend on this application.

## UI composition

- `@onix/ui-kit` contains shadcn-style primitives and neutral layout/brand
  components. Keep product copy, catalog cards, filters, and product-detail
  composition in their feature. The shared showcase interface lives in
  `src/features/showcase`.
- Build screens by composing primitives exported from `@onix/ui-kit`, such as
  `Button`, `Card`, `Badge`, `Input`, `Label`, and `Separator`. Add a reusable
  primitive to the kit only when it has a neutral purpose and a small, explicit
  API.
- Put component styles in co-located `*.styles.ts` files using
  `styled-components`. Mark internal style targets with `data-part`; do not
  attach feature CSS classes to consumer markup.
- SCSS and Sass are not used. `npm run lint` rejects `.scss` files and imports.
- UI primitives use semantic shadcn variants and design tokens. Do not put
  literal colors in frontend UI code; the `onix-ui/no-hardcoded-colors` rule is
  imported from `@onix/ui-kit/eslint` and checks hex, RGB, and HSL literals.
- Avoid one-off inline styles. Dynamic geometry that cannot be expressed as a
  CSS token or styled prop may be passed to a layout primitive as a value.

## Design tokens and responsive styles

- `../ui-kit/src/styles/tokens.css` is the canonical source for color, surface,
  spacing, radius, motion, elevation, page-grid, and header tokens.
- `../ui-kit/src/styles/index.css` maps those tokens to shadcn semantic names
  for Tailwind. It may map names but must not define brand values.
- `src/app/main.tsx` imports only `@onix/ui-kit/styles.css`; the frontend must
  not keep a local copy of Tailwind, `components.json`, or token files.
- Styled components reference tokens with `var(--...)`; add a token in the kit
  before introducing a shared design value. Keep component styles focused on
  layout and composition.
- Responsive boundaries come from the `BREAKPOINTS` export of `@onix/ui-kit`
  and are interpolated in styled-components. Do not introduce a second
  breakpoint scale.
- `../ui-kit/components.json` is the shadcn source of truth. Keep its aliases
  pointed at the kit's `src/ui` and `src/lib/utils.ts`.

## Commands

- `npm run lint` — architecture scan, shared color-token checks, and ESLint.
- `npm run typecheck` — TypeScript project checks.
- `npm test` — all frontend unit and integration tests.
- `npm run test:unit` — application-level unit tests (hook tests live in the kit).
- `npm run build` — typecheck plus optimized production build.
