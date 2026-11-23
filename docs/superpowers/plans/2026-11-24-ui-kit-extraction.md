# ONIX UI Kit Extraction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans. Steps use checkbox (`- [x]`) syntax.

**Goal:** Вынести весь слой `frontend/src/common` в отдельный git-репозиторий `@onix/ui-kit` на базе существующих shadcn-примитивов, добавить Histoire и перевести frontend на импорты пакета без визуальных изменений Home/Header.

**Architecture:** Репозиторий `ui-kit/` внутри каталога проекта, но со своим `.git` и игнорируется внешним репозиторием. Пакет собирается Vite в library-режим: JS + `styles.css` + `.d.ts`; frontend подключает его через `file:../ui-kit`. Tailwind, shadcn `components.json`, токены, маппинг и UI-правила ESLint живут в пакете; frontend сохраняет только правила слоёв `app → pages → features`.

**Tech Stack:** React 19, TypeScript 5.9, Vite 8, Tailwind 4, shadcn/base-ui, styled-components, Vitest, Playwright, Histoire 1.0-beta.2+ (`Story`/`Variant`), Node 22 в CI.

**Spec:** запрос пользователя и ответы на вопросы в этой сессии (отдельный репозиторий, всё `common`, токены+маппинг+ESLint, замена импортов, Histoire локально + CI build, Node 22 в CI).

## Global Constraints

- Home/Header визуально и текстово не меняются; допустимы только замены путей импорта и внутренние оптимизации без изменения DOM, CSS и анимации.
- Контроль эталона: `docs/audit/baseline-home.json` vs новый замер — хеши Header, анимации, hero-текст и геометрия капсулы должны совпасть.
- Публичный контракт Contact API, формулировка согласия и юридические тексты не меняются.
- Реальные заявки, push, релизы и публикация запрещены.
- Направление зависимостей `app → pages → features → common`; `common` теперь внешний пакет, обратные импорты запрещены.
- Histoire требует Node ≥22: локально Node 20.19.4 допустим с предупреждениями, CI использует Node 22.
- Новые тяжёлые зависимости не добавляются: переиспользуем уже установленные в frontend runtime-библиотеки.

## Review Focus

1. **Home/Header-регрессия при переносе `navPanel`, `logo`, `onix-mark`, `tokens.css`** → повторный замер хешей и геометрии в 5 состояниях.
2. **Потеря Tailwind-утилит в собранном CSS пакета** → smoke-тест Story build и проверка, что `styles.css` содержит `bg-primary`, `text-primary-foreground`.
3. **Расхождение публичного API после замены deep-imports на barrel** → `tsc -b`, `npm test`, `npx playwright test` должны пройти без правок контракта.
4. **Сломанная установка `file:../ui-kit` в CI** → локальный `npm install` и CI-шаги устанавливают ui-kit до frontend, `npm ci` воспроизводим.
5. **Отсутствие Histoire-сборки на Node 22** → `npm run story:build` в отдельном workflow пакета; локальный запуск на Node 20 только дополнительный.

---

### Task 1: Каркас репозитория `@onix/ui-kit`

**Files:**
- Create: `ui-kit/package.json`, `ui-kit/tsconfig.json`, `ui-kit/tsconfig.build.json`, `ui-kit/vite.config.ts`, `ui-kit/vite.lib.config.ts`, `ui-kit/components.json`, `ui-kit/eslint.config.js`, `ui-kit/vitest.config.ts`, `ui-kit/README.md`, `ui-kit/.gitignore`, `ui-kit/.github/workflows/ci.yml`
- Modify: `.gitignore` (корневой), `.github/workflows/frontend.yml`

- [x] **Step 1: Создать структуру и конфигурации пакета**

`package.json`: `@onix/ui-kit`, `type: module`, `engines.node >=22`, scripts `dev`/`build`/`typecheck`/`lint`/`test`/`story:dev`/`story:build`/`story:preview`; exports `.` → `dist/index.js` + `dist/index.d.ts`, `./styles.css` → `dist/styles.css`, `./eslint` → `eslint.config.js`; peerDependencies React/ReactDOM/styled-components/react-router; dependencies только из уже используемых frontend: `@base-ui/react`, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`; devDependencies Histoire, `@histoire/plugin-react`, Vite, Tailwind, TypeScript, ESLint, Vitest, jsdom, Testing Library.

- [x] **Step 2: Инициализировать отдельный git-репозиторий**

`git init` в `ui-kit/`, без commit. По просьбе пользователя добавлен `origin https://github.com/onix-fun/ui-kit.git`; push не выполнялся. Корневой `.gitignore` добавляет `ui-kit/`.

- [x] **Step 3: Добавить CI пакета**

Workflow `ui-kit/.github/workflows/ci.yml`: Node 22, `npm ci`, lint, typecheck, test, story:build, build. В `frontend.yml` добавить checkout `onix-fun/ui-kit` в `ui-kit` и последовательную установку до frontend-шагов.

- [x] **Step 4: Проверка**

`ls ui-kit/.git`, `ruby -ryaml -e '...'` для обоих workflow.

### Task 2: Перенос исходников common

**Files:**
- Create: `ui-kit/src/**` (полное копирование `frontend/src/common`)
- Delete: `frontend/src/common/**`

- [x] **Step 1: Скопировать файлы без изменения содержимого**

`tokens.css`, `styles/index.css`, `styles/breakpoints.ts`, `lib/*`, `hooks/*`, `ui/*` перенести в `ui-kit/src/`, сохранив структуру.

- [x] **Step 2: Заменить внутренние импорты**

`@/common/lib/utils` → `../lib/utils` (или `@/lib/utils` с алиасом пакета); `@/common/styles/breakpoints` → `../styles/breakpoints`; `@/common/styles/index.css` → `./styles/index.css`. Внутри пакета не использовать `@/common`.

- [x] **Step 3: Расширить публичный barrel**

`ui-kit/src/index.ts` экспортирует всё из старого `common/index.ts` плюс `BREAKPOINTS`, `useColorTheme`, `cn`, `SITE_CONTACT_URL`, типы layout. Добавить `@source "../";` в `styles/index.css` для детерминированного сканирования Tailwind.

- [x] **Step 4: Проверка**

`rg '@/common' ui-kit/src` — 0 совпадений; `npx tsc -p ui-kit/tsconfig.json --noEmit` после установки зависимостей.

### Task 3: Сборка пакета и тесты

**Files:**
- Modify: `ui-kit/src/index.ts` (side-effect import CSS для генерации `styles.css`)
- Create: `ui-kit/src/**/__tests__/*`

- [x] **Step 1: Настроить library build**

`vite.lib.config.ts`: entry `src/index.ts`, `formats: ['es']`, `cssFileName: 'styles'`, `cssCodeSplit: false`, external для React/ReactDOM/router/styled-components/base-ui/lucide/cva/clsx/tailwind-merge. `tsconfig.build.json` эмитит `.d.ts` в `dist`.

- [x] **Step 2: Перенести unit-тест хука**

`useDocumentMeta.test.tsx` переезжает в `ui-kit/src/hooks/__tests__/`. Добавить smoke-тесты `cn` и рендера `Button`/`Badge`.

- [x] **Step 3: Проверка**

`npm --prefix ui-kit install`, `npm --prefix ui-kit run build`, `npm --prefix ui-kit test`. В `dist` есть `index.js`, `index.d.ts`, `styles.css`; `styles.css` содержит `.bg-primary` или `--color-primary`.

### Task 4: Histoire

**Files:**
- Create: `ui-kit/histoire.config.ts`, `ui-kit/src/histoire.setup.tsx`, `ui-kit/src/**/*.story.tsx`

- [x] **Step 1: Конфигурация**

`defineConfig({ plugins: [HstReact()], setupFile: '/src/histoire.setup.tsx', theme: { title: 'ONIX UI Kit' } })`. Setup импортирует `./styles/index.css` и экспортирует `setupReact` через `defineSetupReact` с wrapper, переключающим `data-theme` по кнопке в story.

- [x] **Step 2: Stories**

По одному файлу на группу: `button.story.tsx`, `primitives.story.tsx` (Badge/Card/Input/Label/Separator/Breadcrumb), `layout.story.tsx` (Page/PageIntro/Container/Stack/Spacer/Position), `brand.story.tsx` (Logo/OnixMark/NavPanel). Использовать `Story` + `Variant` с явными `id`.

- [x] **Step 3: Проверка**

`npm --prefix ui-kit run story:build` создаёт статический book; `story:dev` поднимается локально (при рабочем Node).

### Task 5: Перевод frontend на пакет

**Files:**
- Modify: `frontend/package.json`, `frontend/package-lock.json`, `frontend/src/app/main.tsx`, все файлы с импортами `@/common`, `frontend/eslint.config.js`, `frontend/vitest.config.ts`, `frontend/tsconfig.app.json`, `frontend/AGENTS.md`, `.github/workflows/frontend.yml`
- Delete: `frontend/components.json`, `frontend/src/common/**`

- [x] **Step 1: Подключить зависимость**

`"@onix/ui-kit": "file:../ui-kit"` в `dependencies`; `npm install` в frontend.

- [x] **Step 2: Заменить импорты**

Все `@/common...` → `@onix/ui-kit`; CSS `@/common/styles/index.css` → `@onix/ui-kit/styles.css`. Удалить `src/common` и `components.json`.

- [x] **Step 3: Обновить конфигурации и правила**

ESLint: убрать локальный `no-hardcoded-colors`, импортировать правило из `@onix/ui-kit/eslint`; обновить `boundaries/elements` и политики под внешний ui-kit. `test:unit` больше не ссылается на `src/common`. AGENTS.md описывает новый слой. CI checkouts ui-kit.

- [x] **Step 4: Проверка**

`rg '@/common|src/common' frontend` — 0 совпадений. `npm run lint && npm run typecheck && npm test && npm run build`.

### Task 6: Регрессионная верификация

**Files:**
- Modify: `docs/audit/after-home.json` (новый замер), `docs/audit/design.md`, `docs/audit/testing.md`, `docs/audit/remaining.md`
- Create: `docs/audit/after-ui-kit-home.json`

- [x] **Step 1: Полный локальный прогон**

Frontend lint/typecheck/unit/integration/E2E/build, backend tests, ui-kit lint/typecheck/test/build/story:build.

- [x] **Step 2: Контроль Home/Header**

Переснять 5 состояний через Playwright CLI, сравнить с `baseline-home.json`: все хеши и геометрия совпадают.

- [x] **Step 3: Smoke SEO/overflow**

`npx playwright test e2e/routes.spec.ts e2e/a11y.spec.ts` — зелёные.

- [x] **Step 4: Отчёт**

Обновить audit-документы и `git status --short` — только ожидаемые файлы, без коммитов и push.

## Итог

- Перенос завершён: `frontend/src/common` и `frontend/components.json` удалены, импорты идут через `@onix/ui-kit`.
- Добавлены отдельная CSS-сборка пакета (внешние `.woff2`, без `data:font`), smoke-тесты примитивов, Histoire book на 5 stories / 38 вариантов.
- Локально пройдены lint/typecheck/tests/build обоих репозиториев, 35 Playwright-тестов и 15 backend-тестов; Home/Header совпадает с эталоном в 5 состояниях (`docs/audit/after-ui-kit-home.json`).
- Отклонения от плана: `origin` добавлен по просьбе пользователя; `csstype` зафиксирован на 3.2.3 и `lucide-react` на 1.59.0 для совместимости типов; в Vitest добавлены `dedupe`/`inline` из-за symlink-пакета; `story:dev` локально не запускался из-за Node 20; Lighthouse после переноса измерен через `chrome-headless-shell` 154 из-за обновления системного Chrome.
