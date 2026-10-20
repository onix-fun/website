# AGENTS

## Architecture

Layers, where imports are allowed **only downward**:

```
app → pages → features → common
```

| Layer      | May import              | Purpose                                  |
| ---------- | ----------------------- | ---------------------------------------- |
| `app`      | `pages`, `common`       | Composition root: entry, shell, providers |
| `pages`    | `features`, `common`    | Route-level screens                      |
| `features` | `common`                | Self-contained, independent units        |
| `common`   | — (only its own files)  | Shared primitives: `ui`, `lib`, `hooks`  |

Rules:

- Features are isolated: a feature must **never** import another feature, a page, or `app`.
- No sibling/layer imports other than those listed above. No upward imports.
- Import a layer through its public API (`index.ts`), never a deep path.
- `common` is the only shared layer; put reusable code there, not in features.

Enforced by `eslint-plugin-boundaries` (`boundaries/dependencies`) in `eslint.config.js`.
Run `npm run lint` — violations fail with the offending layer types.

## Conventions

- Path alias `@/` → `src/`.
- shadcn/ui primitives live in `src/common/ui`.
- Export each feature/page via an `index.ts` barrel.
- Routing: `react-router` data router in `src/app/router.tsx`. Pages are lazy-loaded (`lazy(() => import('@/pages/*'))`) so each becomes its own chunk. Route-level boundaries are the only place `app` imports `pages`.

## Design system

Single global source of truth: **`src/common/styles/tokens.css`**. Every shared
color, surface, spacing, radius, motion value and the page grid lives there.
Never hardcode a color/size in a component — reference a token.

- `tokens.css` is the canon. Change a value **only** here.
- `index.css` bridges the tokens into Tailwind via `@theme inline`: it maps
  shadcn-style names (`--color-primary`, `--color-muted-foreground`, …) onto the
  canon, so `bg-primary` and `var(--color-accent)` resolve to the same value.
  Do not redefine brand values there — only wire names together.
- Feature/page/app code styles with `*.module.scss` referencing tokens
  (`var(--space-md)`, `var(--color-accent)`, `var(--radius-lg)`…). Tailwind
  utility classes are allowed **only in `common/ui`**.
- Header-specific, non-shared values (capsule blur/radius, item shadows, the
  fixed-bar offsets) stay scoped to the header root in
  `features/header/styles/header.module.scss`, composed from global tokens.
- Breakpoint-dependent sizes are computed in JS (e.g.
  `features/header/model/header-metrics.ts`) and passed to primitives as props,
  not via CSS `@media`.

## Commands

- `npm run lint` — lint + architecture boundaries
- `npm run typecheck` — `tsc -b`
- `npm run build` — typecheck + production build
