-- +goose Up

-- Remove old products and 'all' category
DELETE FROM products WHERE slug IN ('nido', 'flock', 'nido-night', 'flock-night');
DELETE FROM categories WHERE slug = 'all';

-- Insert new products with full details

INSERT INTO products (name, name_ru, slug, price, badge, colors, bg_color, category_id, in_stock, details) VALUES (
  'Arcane', 'Аркейн', 'arkane', 5900, 'ПРЕМИУМ',
  '["#2d1b4e","#00c4b8","#ff4d00","#ffd600","#1a1a2e"]',
  '#2d1b4e',
  (SELECT id FROM categories WHERE slug = 'nightlights'),
  false,
  '{"description":"Ночник Аркейн — это премиальный светильник, вдохновлённый вселенной Arcane. Каждая деталь продумана до мелочей, от формы до светораспределения.","subtitle":"Премиальный ночник","badge_text":"ЛИМИТИРОВАННАЯ СЕРИЯ","lead_time":"Готов к отправке через 3–5 дней","gallery":[{"image_url":"","bg_color":"#2d1b4e"},{"image_url":"","bg_color":"#00c4b8"},{"image_url":"","bg_color":"#ff4d00"}],"specifications":[{"label":"Материал","value":"PLA-пластик"},{"label":"Технология","value":"FDM-печать"},{"label":"Цоколь","value":"E27"},{"label":"Рекомендуемая лампа","value":"LED, до 40 Вт"},{"label":"Питание","value":"220 В"},{"label":"Габариты","value":"180×180×250 мм"},{"label":"Вес","value":"~350 г"}],"box_contents":["Ночник Аркейн","Плафон","Кабель питания с выключателем","Инструкция","Гарантийный талон"],"story_paragraphs":["Ночник Аркейн родился из вдохновения вселенной Arcane — мира, где технологии и магия переплетаются в единое целое.","Каждый экземпляр создаётся методом 3D-печати с последующей ручной обработкой. Мы используем премиальные PLA-филаменты пяти цветов, чтобы вы могли выбрать идеальное сочетание для вашего интерьера.","Градиентный переход цветов и уникальная текстура делают каждый светильник по-настоящему уникальным. Свет, проходящий через слои пластика, создаёт мягкие тени и атмосферу уюта."]}'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, name_ru, slug, price, badge, colors, bg_color, category_id, in_stock, details) VALUES (
  'Kristall', 'Кристалл', 'kristall', 4500, '',
  '["#e8f0fe","#b0d4ff","#fff5e6"]',
  '#e8f0fe',
  (SELECT id FROM categories WHERE slug = 'lamps'),
  false,
  '{"description":"Светильник Кристалл — минималистичный геометрический светильник, напоминающий природные кристаллические формы. Лаконичный дизайн впишется в любой интерьер.","subtitle":"Геометрический светильник","badge_text":"","lead_time":"Готов к отправке через 5–7 дней","gallery":[{"image_url":"","bg_color":"#e8f0fe"},{"image_url":"","bg_color":"#b0d4ff"}],"specifications":[{"label":"Материал","value":"PLA-пластик"},{"label":"Технология","value":"FDM-печать"},{"label":"Цоколь","value":"E27"},{"label":"Рекомендуемая лампа","value":"LED, до 40 Вт"},{"label":"Питание","value":"220 В"},{"label":"Габариты","value":"150×150×300 мм"},{"label":"Вес","value":"~300 г"}],"box_contents":["Светильник Кристалл","Плафон","Кабель питания с выключателем","Инструкция","Гарантийный талон"],"story_paragraphs":["Кристалл — это ода природной геометрии. Форма светильника повторяет структуру природных кристаллов, где каждая грань играет со светом.","Благодаря точной 3D-печати и многослойной обработке, светильник приобретает матовую текстуру, напоминающую натуральный камень. LED-лампа мягко подсвечивает каждую грань, создавая игру теней вокруг.","Кристалл доступен в трёх цветовых решениях: от прозрачно-голубого до тёплого кремового. Выберите тот, который идеально дополнит ваше пространство."]}'
) ON CONFLICT (slug) DO NOTHING;

-- +goose Down
DELETE FROM products WHERE slug IN ('arkane', 'kristall');
INSERT INTO categories (name, slug) VALUES ('Все', 'all') ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (name, name_ru, price, badge, colors, bg_color, category_id, in_stock, slug, details) VALUES ('Nido', 'Гнездо', 4900, 'ХИТ', '["#c84b00","#1a1a2e","#f5f0e8"]', '#fff0eb', (SELECT id FROM categories WHERE slug = 'lamps'), false, 'nido', '{}') ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (name, name_ru, price, badge, colors, bg_color, category_id, in_stock, slug, details) VALUES ('Flock', 'Стая', 7800, 'ПРЕМИУМ', '["#ff4d00","#ffd600","#58cc02"]', '#f0edff', (SELECT id FROM categories WHERE slug = 'lamps'), false, 'flock', '{}') ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (name, name_ru, price, badge, colors, bg_color, category_id, in_stock, slug, details) VALUES ('Nido', 'Гнездо', 4900, 'ХИТ', '["#c84b00","#1a1a2e","#f5f0e8"]', '#fff0eb', (SELECT id FROM categories WHERE slug = 'nightlights'), false, 'nido-night', '{}') ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (name, name_ru, price, badge, colors, bg_color, category_id, in_stock, slug, details) VALUES ('Flock', 'Стая', 7800, 'ПРЕМИУМ', '["#ff4d00","#ffd600","#58cc02"]', '#f0edff', (SELECT id FROM categories WHERE slug = 'nightlights'), false, 'flock-night', '{}') ON CONFLICT (slug) DO NOTHING;
