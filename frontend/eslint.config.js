import path from 'node:path'
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import boundaries from 'eslint-plugin-boundaries'
import { defineConfig, globalIgnores } from 'eslint/config'

const root = import.meta.dirname

const colorLiteralPattern = /#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})\b|\b(?:rgba?|hsla?)\s*\(/i
const architecturePlugin = {
  rules: {
    'no-hardcoded-colors': {
      meta: {
        type: 'problem',
        docs: { description: 'Use the shared design tokens for colors in common UI primitives.' },
        schema: [],
        messages: { token: 'Use a semantic design token instead of a literal color in common/ui.' },
      },
      create(context) {
        const reportIfColorLiteral = (node, value) => {
          if (typeof value === 'string' && colorLiteralPattern.test(value)) {
            context.report({ node, messageId: 'token' })
          }
        }

        return {
          Literal(node) {
            reportIfColorLiteral(node, node.value)
          },
          TemplateLiteral(node) {
            for (const quasi of node.quasis) reportIfColorLiteral(quasi, quasi.value.raw)
          },
        }
      },
    },
  },
}

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

  // shadcn/ui primitives co-export variants (e.g. buttonVariants)
  {
    files: ['src/common/ui/**/*.{ts,tsx}'],
    plugins: { architecture: architecturePlugin },
    rules: {
      'react-refresh/only-export-components': 'off',
      'architecture/no-hardcoded-colors': 'error',
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
  // Tailwind utility classes belong to shadcn primitives in `common/ui`.
  {
    files: ['src/features/**/*.{ts,tsx}', 'src/pages/**/*.{ts,tsx}', 'src/app/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector:
            'JSXAttribute[name.name="className"] > Literal',
          message:
            'Raw utility class strings are restricted to common/ui primitives. Use styled-components and semantic data-part selectors.',
        },
        {
          selector:
            'JSXAttribute[name.name="className"] > JSXExpressionContainer > TemplateLiteral',
          message:
            'Raw utility class strings are restricted to common/ui primitives. Use styled-components and semantic data-part selectors.',
        },
        {
          selector:
            'JSXAttribute[name.name="className"] > JSXExpressionContainer > Literal',
          message:
            'Raw utility class strings are restricted to common/ui primitives. Use styled-components and semantic data-part selectors.',
        },
      ],
    },
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
