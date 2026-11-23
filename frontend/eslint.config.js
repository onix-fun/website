import path from 'node:path'
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import boundaries from 'eslint-plugin-boundaries'
import { uiKitColorPlugin } from '@onix/ui-kit/eslint'
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
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: ['*.scss', '**/*.scss'] },
      ],
    },
  },

  // The color-token rule lives in the UI kit so both repositories share it.
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { 'onix-ui': uiKitColorPlugin },
    rules: {
      'onix-ui/no-hardcoded-colors': 'error',
    },
  },

  // Route config files export data, not components
  {
    files: ['src/app/router.tsx'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },

  // Barrel files compose components with shared values (nav config, utils)
  {
    files: ['src/**/index.ts'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },

  // Styling policy: product and page styling is composed with styled-components.
  // Tailwind utility classes are compiled inside @onix/ui-kit primitives.
  {
    files: ['src/features/**/*.{ts,tsx}', 'src/pages/**/*.{ts,tsx}', 'src/app/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector:
            'JSXAttribute[name.name="className"] > Literal',
          message:
            'Raw utility class strings are restricted to @onix/ui-kit primitives. Use styled-components and semantic data-part selectors.',
        },
        {
          selector:
            'JSXAttribute[name.name="className"] > JSXExpressionContainer > TemplateLiteral',
          message:
            'Raw utility class strings are restricted to @onix/ui-kit primitives. Use styled-components and semantic data-part selectors.',
        },
        {
          selector:
            'JSXAttribute[name.name="className"] > JSXExpressionContainer > Literal',
          message:
            'Raw utility class strings are restricted to @onix/ui-kit primitives. Use styled-components and semantic data-part selectors.',
        },
      ],
    },
  },

  // Architecture: app -> pages -> features -> @onix/ui-kit
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
      ],
      'boundaries/ignore': ['**/*.css'],
    },
    rules: {
      'boundaries/dependencies': [
        'error',
        {
          checkAllOrigins: true,
          default: 'disallow',
          policies: [
            {
              from: { element: { type: 'app' } },
              allow: { to: { element: { type: 'pages' } } },
              message: 'app may only depend on pages and @onix/ui-kit',
            },
            {
              from: { element: { type: 'app' } },
              allow: { to: { module: { origin: 'external', source: '@onix/ui-kit' } } },
              message: 'app may only depend on pages and @onix/ui-kit',
            },
            {
              from: { element: { type: 'pages' } },
              allow: { to: { element: { type: 'features' } } },
              message: 'pages may only depend on features and @onix/ui-kit',
            },
            {
              from: { element: { type: 'pages' } },
              allow: { to: { module: { origin: 'external', source: '@onix/ui-kit' } } },
              message: 'pages may only depend on features and @onix/ui-kit',
            },
            {
              from: { element: { type: 'features' } },
              allow: { to: { module: { origin: 'external', source: '@onix/ui-kit' } } },
              message: 'features are isolated: they may only depend on @onix/ui-kit',
            },
            {
              allow: { to: { module: { origin: ['external', 'core'] } } },
            },
          ],
        },
      ],
    },
  },
])
