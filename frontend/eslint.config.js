import path from 'node:path'
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import boundaries from 'eslint-plugin-boundaries'
import { defineConfig, globalIgnores } from 'eslint/config'

const root = import.meta.dirname

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },

  // shadcn/ui primitives co-export variants (e.g. buttonVariants)
  {
    files: ['src/common/ui/**/*.{ts,tsx}'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },

  // Route config files export data, not components
  {
    files: ['src/app/router.tsx'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },

  // Architecture: app -> pages -> features -> common
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { boundaries },
    settings: {
      'import/resolver': {
        typescript: { project: path.join(root, 'tsconfig.app.json') },
      },
      'boundaries/root-path': path.join(root, 'src'),
      'boundaries/elements': [
        { type: 'app', pattern: 'app' },
        { type: 'pages', pattern: 'pages/*', capture: ['page'] },
        { type: 'features', pattern: 'features/*', capture: ['feature'] },
        { type: 'common', pattern: 'common' },
      ],
      'boundaries/ignore': ['**/*.css'],
    },
    rules: {
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          policies: [
            {
              from: { element: { type: 'app' } },
              allow: { to: { element: { types: { anyOf: ['pages', 'common'] } } } },
              message: 'app may only depend on pages and common',
            },
            {
              from: { element: { type: 'pages' } },
              allow: { to: { element: { types: { anyOf: ['features', 'common'] } } } },
              message: 'pages may only depend on features and common',
            },
            {
              from: { element: { type: 'features' } },
              allow: { to: { element: { type: 'common' } } },
              message: 'features are isolated: they may only depend on common',
            },
          ],
        },
      ],
    },
  },
])
