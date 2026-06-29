-- +goose Up
-- Schema: all tables

-- Content table
CREATE TABLE IF NOT EXISTS content (
    id BIGSERIAL PRIMARY KEY,
    component TEXT NOT NULL UNIQUE,
    data JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Categories and products
CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    name_ru TEXT NOT NULL DEFAULT '',
    slug TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    price INTEGER NOT NULL,
    image_url TEXT NOT NULL DEFAULT '',
    badge TEXT NOT NULL DEFAULT '',
    colors JSONB NOT NULL DEFAULT '[]',
    bg_color TEXT NOT NULL DEFAULT '',
    details JSONB NOT NULL DEFAULT '{}',
    category_id BIGINT REFERENCES categories(id),
    in_stock BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Digital products
CREATE TABLE IF NOT EXISTS digital_products (
    id BIGSERIAL PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    number INTEGER NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    content JSONB NOT NULL DEFAULT '{}'
);

-- Preorders
CREATE TABLE IF NOT EXISTS preorders (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL DEFAULT '',
    email TEXT DEFAULT '',
    address TEXT DEFAULT '',
    comment TEXT DEFAULT '',
    order_data JSONB NOT NULL DEFAULT '{}',
    origin TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'new',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Configurator options
CREATE TABLE IF NOT EXISTS configurator_options (
    id SERIAL PRIMARY KEY,
    options JSONB NOT NULL
);

-- +goose Down
DROP TABLE IF EXISTS configurator_options;
DROP TABLE IF EXISTS preorders;
DROP TABLE IF EXISTS digital_products;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS content;