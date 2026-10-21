# ONIX Frontend Architecture

## Dependency direction

Imports flow downward through these layers:

```text
app → pages → features → common
```

| Layer | May import | Responsibility |
| --- | --- | --- |
| `app` | `pages`, `common` | Router, providers, and the application shell |
| `pages` | `features`, `common` | Route-level composition |
| `features` | `common` | Product behavior and domain-specific UI |
| `common` | its own files | Generic primitives, layout, hooks, and utilities |

Features remain independent. A feature must not import another feature, a page,
or the app. Route components are lazy-loaded in `src/app/router.tsx`; each page
and feature exposes its public API through `index.ts`. Use a layer's public
barrel when crossing a layer boundary.

ESLint enforces these dependencies with `eslint-plugin-boundaries`.

## UI composition

- `src/common/ui` contains shadcn-style primitives and neutral layout/brand
  components. Keep product copy, catalog cards, filters, and product-detail
  composition in their feature. The shared showcase interface lives in
  `src/features/showcase`.
- Build screens by composing primitives such as `Button`, `Card`, `Badge`,
  `Input`, `Label`, and `Separator`. Add a reusable primitive only when it has a
  neutral purpose and a small, explicit API.
- Put component styles in co-located `*.styles.ts` files using
  `styled-components`. Mark internal style targets with `data-part`; do not
  attach feature CSS classes to consumer markup.
- SCSS and Sass are not used. `npm run lint` rejects `.scss` files and imports.
- UI primitives use semantic shadcn variants and design tokens. Do not put
  literal colors in `common/ui`; the `architecture/no-hardcoded-colors` lint
  rule checks hex, RGB, and HSL color literals.
- Avoid one-off inline styles. Dynamic geometry that cannot be expressed as a
  CSS token or styled prop may be passed to a layout primitive as a value.

## Design tokens and responsive styles

- `src/common/styles/tokens.css` is the canonical source for color, surface,
  spacing, radius, motion, elevation, page-grid, and header tokens.
- `src/common/styles/index.css` maps those tokens to shadcn semantic names for
  Tailwind. It may map names but must not define brand values.
- Styled components reference tokens with `var(--...)`; add a token before
  introducing a shared design value. Keep component styles focused on layout
  and composition.
- Responsive boundaries come from `src/common/styles/breakpoints.ts` and are
  interpolated in styled-components. Do not introduce a second breakpoint
  scale.
- `components.json` is the shadcn source of truth. Keep aliases pointed at
  `src/common/ui` and the local `src/common/lib/utils.ts` utility.

## Commands

- `npm run lint` — architecture scan, hardcoded-color checks, and ESLint.
- `npm run typecheck` — TypeScript project checks.
- `npm run build` — typecheck plus optimized production build.
