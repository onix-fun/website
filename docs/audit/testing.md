# Тестирование и CI

## Локальные проверки

| Команда | Результат |
| --- | --- |
| `npm run lint` frontend | пройдена |
| `npm run typecheck` frontend | пройдена |
| `npm test` frontend | 3 файла, 8 тестов, все пройдены |
| `npm run test:unit` frontend | 1 файл, 3 теста |
| `npm run test:integration` frontend | 2 файла, 5 тестов |
| `npm run build` frontend | пройдена, 2122 модуля |
| `VITE_BASE_PATH=/website npx vite build` | пройдена, base в HTML и `404.html` совпадает |
| `npm run lint` ui-kit | пройдена |
| `npm run typecheck` ui-kit | пройдена |
| `npm test` ui-kit | 2 файла, 5 тестов |
| `npm run story:build` ui-kit | 5 stories, 38 variants |
| `npm run build` ui-kit | пройдена: `index.js`, `index.d.ts`, `styles.css`, внешние `.woff2` |
| `npm test` backend/contact-api | 15 тестов, все пройдены |
| `npx playwright test` | 35 тестов, все пройдены |
| Lighthouse `/`, `/about` | см. `performance.md` |

Локальный Node — v20.19.4. Backend и UI kit тесты проходят; AWS SDK выдаёт предупреждение о будущей поддержке Node ≥22, а Histoire требует Node ≥22.12.0 и локально запускается с предупреждением `EBADENGINE`. CI frontend и UI kit используют Node 22; `story:dev` локально не поднимался, но `story:build` прошёл.

## Состав тестов

### Unit (Vitest + React Testing Library)

- `frontend/src/app/__tests__/navigation.test.ts` — восстановление SPA deep link из query fallback и sessionStorage.
- `frontend/src/features/showcase/__tests__/showcase-listing.test.tsx` — фильтрация, поиск, empty state и сброс.
- `frontend/src/features/contact-form/__tests__/contact-form.test.tsx` — точный payload API, успех/ошибка, honeypot и редакционный placeholder.
- `ui-kit/src/hooks/__tests__/useDocumentMeta.test.tsx` — title, canonical, description, OG, robots и защита от дублирования имени сайта.
- `ui-kit/src/ui/__tests__/primitives.test.tsx` — `cn`, рендер `Button` и `Badge` с семантическими вариантами.

### Backend (node:test)

`backend/contact-api/test/index.test.js`: валидная заявка, Base64 body, honeypot/OPTIONS, malformed payload, лимит размера, origin/method/content-type, consent и версия, email/control-символы, типы полей, rate limit по IP и email, cooldown, 502/503, очистка и ограничение Map.

### E2E (Playwright)

- `e2e/a11y.spec.ts` — axe WCAG A/AA на 11 внутренних маршрутах.
- `e2e/routes.spec.ts` — отсутствие горизонтального overflow на 320/375/768/1440, skip-link с клавиатуры, route-specific метаданные и noindex.
- `e2e/responsive.spec.ts` — 200% текст и альбомная ориентация 812×375 в обеих темах.
- `e2e/form.spec.ts` — отправка только на моковый `https://contact.test/submit`; проверка payload и статуса успеха. Реальные заявки не отправлялись.
- `e2e/visual.spec.ts` — 10 критических снимков `/about`, `/services`, `/catalog`, `/digital`, `/form` на 1440 и 375 px.
- `e2e/home-baseline.spec.ts` — 5 состояний Home/Header: хеши Header и SVG-анимации, hero-текст и геометрия капсулы сравниваются с `docs/audit/baseline-home.json`.

Снимки хранятся в `frontend/e2e/visual.spec.ts-snapshots/` и скопированы в `docs/audit/screenshots/after/internal/`. Порог сравнения — 5% пикселей, имена снимков не привязаны к ОС.

Измерение после переноса UI kit сохранено в `docs/audit/after-ui-kit-home.json`; `docs/audit/after-home.json` синхронизирован с ним и совпадает с baseline.

## CI

`.github/workflows/frontend.yml` разделён на быстрые и тяжёлые проверки:

- `check` — lint, typecheck, unit, integration, build;
- `verify` — Playwright E2E, accessibility, responsive и visual;
- `backend` — тесты Contact API;
- `deploy` — GitHub Pages только после `check`, `verify`, `backend` на `main`;
- `release` — только по тегу `front_v*.*.*` и после тех же проверок.

Jobs `check`, `verify` и `release` предварительно делают checkout `onix-fun/ui-kit` в `ui-kit`, используют Node 22, выполняют `npm ci` и `npm run build` пакета до установки frontend. Отдельный `ui-kit/.github/workflows/ci.yml` прогоняет lint, typecheck, test, `story:build` и build на Node 22.

Политика GitHub Pages, `VITE_BASE_PATH` из `actions/configure-pages` и `basename` роутера сохранены. Устаревший шаг копирования `dist/index.html` в `dist/404.html` удалён: теперь используется статический fallback с восстановлением deep link.

Workflow не запускался на GitHub в рамках задачи: выполнялись локальные эквиваленты всех команд. Публикация, релиз и push в `main` не выполнялись. Для работы CI репозиторий `https://github.com/onix-fun/ui-kit.git` должен содержать закоммиченное состояние `ui-kit/`.
