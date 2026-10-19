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
- Styling with Tailwind v4 utility classes.
- Routing: `react-router` data router in `src/app/router.tsx`. Pages are lazy-loaded (`lazy(() => import('@/pages/*'))`) so each becomes its own chunk. Route-level boundaries are the only place `app` imports `pages`.

## Commands

- `npm run lint` — lint + architecture boundaries
- `npm run typecheck` — `tsc -b`
- `npm run build` — typecheck + production build
