# Weather Explorer API

Simple Express API that proxies OpenWeather and now caches responses.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root:

```dotenv
PORT=8080
OPENWEATHER_API_KEY=YOUR_REAL_OPENWEATHER_KEY
```

## Run

```bash
npm run dev
```

Server listens on `http://localhost:8080`.

## Endpoints

- `GET /weather/current?city=London`
- `GET /weather/forecast/:id`

## Caching

- Responses are cached in memory and persisted to `weather-cache.json` in the project root.
- Default TTL is 10 minutes.
- Cache is automatically loaded on server start.
