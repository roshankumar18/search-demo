# Catalog Search UI

React demo app to **compare** Helium search APIs side by side.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4

## Setup

```bash
cp .env.example .env
# Edit .env — set VITE_BRAND_ID (required) and optionally VITE_API_BASE_URL
npm install
npm run dev
```

Opens at **http://localhost:5174**

Example with brand in URL:

```
http://localhost:5174/?shop=your-brand-id
```

The `shop` query param is sent as the `brandid` request header on every search.

## Environment

| Variable | Description |
|----------|-------------|
| `VITE_BRAND_ID` | Fallback brand ID if `?shop=` is not in the URL |
| `VITE_API_BASE_URL` | Backend base URL. Leave empty to use Vite proxy → `localhost:5050` |

## APIs compared

| Column | Endpoint | Method |
|--------|----------|--------|
| Left — Catalog Search | `/api/catalog-search` | POST |
| Right — Legacy Search | `/api/search/products` | GET |

Both use the same query string and `limit` (default 24).

## Features

- Single debounced search bar fires both APIs in parallel
- Side-by-side product grids with shared card layout
- Catalog column: concept meta, Meili query/filter, buckets
- Legacy column: total hits + facet summary
- Independent error handling per column
