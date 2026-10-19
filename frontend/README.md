# Vitasil — frontend

Minimal React 19 + Vite + TypeScript single-page app.

## Stack

- React 19, TypeScript, Vite
- Tailwind CSS v4
- shadcn/ui (`base-nova`) on `@base-ui/react`
- React Router (data router, lazy code-split pages)
- Zustand
- ESLint flat config + `eslint-plugin-boundaries` (architecture enforcement)

## Scripts

- `npm run dev` — dev server
- `npm run build` — typecheck + production build
- `npm run lint` — ESLint, including architecture boundaries
- `npm run typecheck` — `tsc -b`
- `npm run preview` — preview the built app

## Structure

```
src/
  app/       # composition root: entry, shell, providers
  pages/     # route screens
  features/  # self-contained, independent units
  common/    # shared ui / lib / hooks
```

Layers import only downward: `app → pages → features → common`.
Features are isolated and may depend on `common` only. See [AGENTS.md](./AGENTS.md) for the full rules.
