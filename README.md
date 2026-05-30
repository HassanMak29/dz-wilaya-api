# dz-wilaya-api

> Free, fast REST API for Algeria's **58 wilayas** and **1541 communes** — trilingual names (العربية / Français / English), postal codes, and GPS coordinates. Built for [Cloudflare Workers](https://workers.cloudflare.com/) (free tier).

[![CI](https://github.com/HassanMak29/dz-wilaya-api/actions/workflows/ci.yml/badge.svg)](https://github.com/HassanMak29/dz-wilaya-api/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

🇩🇿 العربية: [README.ar.md](README.ar.md)

---

## Features

- ✅ **58 wilayas** — the official 2021 administrative division (codes `01`–`58`).
- ✅ **1541 communes** — every commune, mapped to its wilaya.
- 🌍 **Trilingual** — `ar`, `fr`, `en` names for both wilayas and communes.
- 📮 **Postal codes** — 5-digit Algerian postal code per commune.
- 📍 **GPS** — latitude/longitude centroid for every commune and wilaya.
- 🏛️ **Daira** — each commune includes its daira (district), AR + FR.
- 🗺️ **Regions** — wilayas grouped into macro-regions.
- ⚡ **Edge-native** — runs on Cloudflare Workers with optional KV caching.
- 🔓 **CORS enabled** — call it from any browser app.

## Quick start

```bash
git clone https://github.com/HassanMak29/dz-wilaya-api.git
cd dz-wilaya-api
npm install
npm run dev        # local dev server (wrangler)
npm test           # run the test suite
```

Deploy your own copy (free):

```bash
npm run deploy     # wrangler deploy
```

## Endpoints

Base URL: your Worker URL (e.g. `https://dz-wilaya-api.<you>.workers.dev`).

| Method & path                     | Description                                                  |
| --------------------------------- | ------------------------------------------------------------ |
| `GET /`                           | API index / metadata.                                        |
| `GET /health`                     | Health check.                                                |
| `GET /api/wilayas`                | List all 58 wilayas (summaries, no communes).                |
| `GET /api/wilayas/:code`          | One wilaya **with** its communes. Code may be `16` or `1`.   |
| `GET /api/wilayas/:code/communes` | Communes of a wilaya.                                        |
| `GET /api/communes`               | Every commune (flat list).                                   |
| `GET /api/communes/:postCode`     | Communes matching a postal code.                             |
| `GET /api/regions`                | Wilayas grouped by region.                                   |
| `GET /api/search?q=`              | Search wilayas & communes by name (AR/FR/EN) or postal code. |

### Response shape

All successful responses follow:

```json
{
  "success": true,
  "count": 58,
  "data": [
    /* ... */
  ]
}
```

Errors:

```json
{ "success": false, "error": "Wilaya not found" }
```

### Examples

**List wilayas** — `GET /api/wilayas`

```json
{
  "success": true,
  "count": 58,
  "data": [
    {
      "code": "16",
      "name": { "ar": "الجزائر", "fr": "Alger", "en": "Algiers" },
      "region": "North-Center",
      "lat": 36.730045,
      "lng": 3.073365,
      "communeCount": 57
    }
  ]
}
```

**One wilaya with communes** — `GET /api/wilayas/16`

```json
{
  "success": true,
  "data": {
    "code": "16",
    "name": { "ar": "الجزائر", "fr": "Alger", "en": "Algiers" },
    "region": "North-Center",
    "lat": 36.730045,
    "lng": 3.073365,
    "communes": [
      {
        "name": { "ar": "عين بنيان", "fr": "Ain Benian", "en": "Ain Benian" },
        "daira": { "ar": "الشراقة", "fr": "Cheraga" },
        "code": "1657",
        "postCode": "16044",
        "lat": 36.791944,
        "lng": 2.933792
      }
    ]
  }
}
```

**Search** — `GET /api/search?q=Oran`

```json
{
  "success": true,
  "query": "Oran",
  "count": 2,
  "data": {
    "wilayas": [
      { "code": "31", "name": { "en": "Oran", "fr": "Oran", "ar": "وهران" } }
    ],
    "communes": [
      { "name": { "en": "Oran" }, "wilayaCode": "31", "postCode": "31001" }
    ]
  }
}
```

## Data model

```ts
interface Wilaya {
  code: string; // "01"–"58"
  name: { ar: string; fr: string; en: string };
  region: string; // North-Center | North-East | North-West | Highlands | South
  lat: number;
  lng: number; // centroid
  communes: Commune[];
}

interface Commune {
  name: { ar: string; fr: string; en: string };
  daira: { ar: string; fr: string };
  code: string; // official commune code
  postCode: string | null; // 5-digit postal code (null if unknown)
  lat: number;
  lng: number; // centroid (WGS84)
}
```

> **Postal codes:** ~98% of communes have a verified postal code. A small number are `null` where no reliable source value was available, rather than guessing.

## Architecture

- **Runtime:** Cloudflare Workers + [Hono](https://hono.dev/) router.
- **Data:** generated into `src/data/wilayas.json` and bundled into the Worker.
- **KV (optional):** the Worker reads from a `WILAYA_KV` namespace first and falls back to the bundled data, so it works with or without KV.

Enable KV caching:

```bash
wrangler kv namespace create WILAYA_KV   # then paste the id into wrangler.toml
npm run seed-kv                          # uploads the dataset to KV
```

## Regenerating the dataset

The committed `src/data/wilayas.json` is generated from upstream administrative
data:

```bash
npm run fetch-sources   # download source datasets into scripts/.cache
npm run build-data      # regenerate src/data/wilayas.json
```

The build script folds the proposed "wilayas déléguées" (administrative
districts numbered 59–69 in community datasets) back into their official parent
wilaya, producing the official 58-wilaya scheme, and joins postal codes by
normalized name + coordinate proximity.

## Data sources & attribution

Administrative facts (names, postal codes, coordinates) are factual data
re-compiled into this project's own schema. Source datasets:

- [ihahachi/Algeria-Cities](https://github.com/ihahachi/Algeria-Cities) — commune names (AR/FR), daira, commune codes, coordinates.
- [Kenandarabeh/algeria-wilayas-communes-2026](https://github.com/Kenandarabeh/algeria-wilayas-communes-2026) — postal codes.

## License

[MIT](LICENSE) © HassanMak29
