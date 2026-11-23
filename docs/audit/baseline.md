# Базовый аудит ONIX Website

Дата: 2026-11-23.

## Область и ограничения

Исследовался существующий проект без создания нового сайта. Главная страница и Header считались визуальным эталоном: тексты, структура, анимация, геометрия, blur, тени, скругления, навигация, темы и взаимодействия не должны меняться. Внутренние страницы допускали полноценную доработку.

Проверены:

- `frontend/src/app`, `pages`, `features`, `common`;
- все 12 маршрутов SPA;
- обе темы и ширины 320, 375, 430, 768, 1024, 1440, 1920 px;
- Contact API и его контракт;
- CI и рабочий процесс GitHub Pages;
- Lighthouse (мобильный профиль, simulate throttling).

## Окружение

- Локальный production preview: `npm run preview -- --port 4173 --strictPort`.
- Lighthouse CLI `12.8.2`, `CHROME_PATH=/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`.
- Playwright CLI для ручного браузерного аудита; Playwright Test для автоматизированных проверок.
- Локальный Node `v20.19.4`; CI использует Node `22`.
- Vite `8.3.4`, React `19.3.1`, react-router `7.18.4`.

## Результаты baseline

| Проверка | Результат |
| --- | --- |
| `npm run lint` | пройдена |
| `npm run typecheck` | пройдена |
| `npm run build` | пройдена, 2143 модуля |
| Маршруты | все 12 отвечают SPA, `lang="ru"`, favicon есть, ошибок страниц нет |
| Метаданные | у всех 12 маршрутов одинаковые title/description, `canonical: null`, OG/robots не заданы |
| Горизонтальный overflow | `/privacy`: +85 px при 320 px и +30 px при 375 px в обеих темах; остальные маршруты — 0 |
| Детальные страницы | `[data-part=detail]` ограничен 768 px вместо доступных 1296 px при 1440 px из-за дублирующего правила `max-width: 48rem` |
| Lighthouse `/` | Performance 96, Accessibility 100, Best Practices 100, SEO 91; FCP 2.2 s, LCP 2.3 s, CLS 0.04, TBT 20 ms |
| Lighthouse `/about` | Performance 96, Accessibility 96, Best Practices 100, SEO 91; LCP 2.3 s, CLS 0.001, TBT 0 ms; найден низкий контраст акцентного текста 1.93:1 |
| Lottie | `onix-orbit.json`: 228 K, 60 fps, 3708 кадров, 12 слоёв, без expressions/effects; `lottie-web` 5.13.0 |
| Demo GitHub Pages | `/` — 200, `/favicon.svg` — 200, `/about` отдаёт HTML, `404.html` — 200; `robots.txt` и `sitemap.xml` — 404 |

## Home/Header-эталон

Снимки и измерения сохранены до изменений:

- `docs/audit/baseline-home.json` — хеши Header и анимации, текст hero, геометрия капсулы Header;
- `docs/audit/screenshots/baseline/` — светлая/тёмная темы, мобильная версия, меню, скролл и состояния Header.

Ключевые значения: hero-текст сохранён; капсула на 1440 px — `{x:1102,y:24,width:266,height:74}`, после скролла и повторного раскрытия возвращается к исходному хешу; на 375 px — `{x:293,y:20,width:58,height:58}`.

## Артефакты

- `docs/audit/baseline-routes.json`
- `docs/audit/baseline-overflow.json`
- `docs/audit/baseline-home.json`
- `docs/audit/lighthouse-home-before.json`
- `docs/audit/lighthouse-about-before.json`
- `docs/audit/screenshots/baseline/`

Полевые данные CrUX/RUM для домена недоступны: все performance-выводы baseline являются лабораторными.
