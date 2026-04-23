# Survey URL

A small **MERN-style** survey application: an **Express** REST API backed by **MongoDB** (via **Mongoose**), plus a static **customer survey** page served from the same server. Visitors submit name, email, a text response, and a 1–5 star rating; submissions are validated, rate-limited, and stored in the database.

## Features

- **Single-page survey** (`/`) — HTML form with star rating, submits to the API with `fetch`
- **REST endpoint** — `POST /api/response` creates a survey record
- **Request validation** — [Joi](https://joi.dev/) schemas with sensible length and format limits
- **Rate limiting** — Per-IP cap on survey submissions to reduce abuse
- **CORS** — Enabled for cross-origin clients if you add a separate frontend later
- **Graceful shutdown** — On `SIGINT`, the HTTP server and Mongoose connection close cleanly

## Tech stack

| Layer        | Technology                          |
| ------------ | ----------------------------------- |
| Runtime      | Node.js                             |
| HTTP         | Express 5                           |
| Database     | MongoDB                             |
| ODM          | Mongoose                            |
| Validation   | Joi                                 |
| Config       | dotenv                              |
| Dev workflow | nodemon (file watching for `dev`)   |

## Prerequisites

- **Node.js** (LTS recommended)
- A running **MongoDB** instance and a connection string (local, Atlas, or other)

## Getting started

### 1. Clone and install

```bash
git clone <repository-url>
cd surveyurl
npm install
```

### 2. Environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description |
| -------- | ----------- |
| `PORT`   | HTTP port for the Express server. If unset, `src/config/index.js` defaults it to **6000** (see `src/index.js` for an extra fallback only when `Port` is missing). |
| `DB_URI` | **Required** for a successful DB connection. Standard MongoDB URI, e.g. `mongodb://localhost:27017/surveyurl` or Atlas `mongodb+srv://...`. |

Example `.env`:

```env
PORT=7000
DB_URI=mongodb://127.0.0.1:27017/surveyurl
```

If `DB_URI` is missing or invalid, the process exits after a connection error (see `src/config/dbConnection.js`).

### 3. Run the server

**Development** (auto-restart on file changes):

```bash
npm run dev
```

**Production**:

```bash
npm run prod
```

Open the survey in a browser: `http://localhost:<PORT>/` — with no `PORT` in `.env`, try `http://localhost:6000/`.

## API reference

### `POST /api/response`

Creates one survey response document.

**Headers**

- `Content-Type: application/json`

**Body (JSON)**

| Field      | Type   | Rules |
| ---------- | ------ | ----- |
| `name`     | string | Required, trimmed, length 2–100 |
| `email`    | string | Required, valid email format |
| `response` | string | Required, trimmed, length 5–1000 (free-text feedback) |
| `rating`   | number | Required, integer 1–5 |

**Example request**

```bash
curl -s -X POST http://localhost:6000/api/response \
  -H "Content-Type: application/json" \
  -d '{"name":"Ada Lovelace","email":"ada@example.com","response":"Great experience overall.","rating":5}'
```

**Success (typical)** — HTTP `200`, JSON body includes `success`, `message`, and `data` (the created document, including `_id` and timestamps).

**Validation error** — HTTP `400`, JSON with a `message` describing the first Joi error.

**Business / server error** — HTTP `400` or `500` depending on the path; see `src/controller/surveyController.js` and `src/utils/customResponse.js`.

### Rate limiting

Submissions to the survey endpoint are limited per IP: **15 requests per 15 minutes** (see `src/utils/rateLimter.js`). When exceeded, the client receives HTTP `429` with a JSON body containing a “too many requests” style message.

### Other routes

- **Static files** — Files under `src/public/` are served at the site root (e.g. `/` → `index.html`).
- **Unknown paths** — Return **404** JSON: `{ "error": "Not Found", "message": "..." }`.

## Data model

Mongoose model: **`Response`** (`src/models/SurveyResponse.js`).

| Field      | Type   | Notes |
| ---------- | ------ | ----- |
| `name`     | String | Required |
| `email`    | String | Required |
| `response` | String | Required (comments / feedback) |
| `rating`   | Number | Required |
| `createdAt` / `updatedAt` | Date | Added by `{ timestamps: true }` |

Collection name in MongoDB follows Mongoose defaults (typically pluralized, lowercase form of the model name).

## Project structure

```
surveyurl/
├── package.json
├── .env.example
├── README.md
└── src/
    ├── index.js              # Entry: dotenv, listen, graceful shutdown
    ├── app.js                # Express app, middleware, static files, routes
    ├── config/
    │   ├── index.js          # PORT, DB_URI from env
    │   └── dbConnection.js   # mongoose.connect
    ├── controller/
    │   └── surveyController.js
    ├── services/
    │   └── survey.service.js
    ├── models/
    │   └── SurveyResponse.js
    ├── routes/
    │   └── index.js          # POST /api/response
    ├── utils/
    │   ├── customResponse.js
    │   ├── validation.js     # Joi schemas
    │   ├── rateLimter.js     # express-rate-limit
    │   └── middleware/
    │       └── validate.js
    └── public/
        └── index.html        # Survey UI
```

## Scripts

| Script      | Command              | Purpose |
| ----------- | -------------------- | ------- |
| `dev`       | `nodemon src/index.js` | Local development with reload |
| `prod`      | `node src/index.js`  | Run without nodemon |
| `test`      | `jest.js`            | Placeholder; Jest is not listed in `package.json` dependencies — adjust or add tests if you need automated testing |

## Security and operations notes

- **Secrets** — Never commit `.env`; only `.env.example` with empty or placeholder values.
- **Payload size** — JSON body limit is **10 KB** (`src/app.js`).
- **Production** — Use a reverse proxy (TLS, timeouts), restrict MongoDB network access, and tune rate limits for your traffic.

## License

ISC (see `package.json`).

## Author

Krishan Kumar (see `package.json`).
