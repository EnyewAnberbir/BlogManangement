# BlogManangement

BlogManangement is a full-stack blog platform with:

- account registration and login
- JWT cookie authentication
- create/edit/list/read blog posts
- image upload support for post cover assets

## Repository Goals

This repository is maintained as a real application workspace and includes:

- backend API code under `appi/`
- frontend code under `client/`
- quality checks under `scripts/`
- automated backend checks under `tests/`

## Security Requirements

No credentials should be committed in source code.

Set environment variables before running:

- `JWT_SECRET` (required)
- `MONGODB_URI` (required for database-backed routes)
- `PORT` (optional, defaults to 4000)
- `CORS_ORIGIN` (optional, defaults to `http://localhost:3000`)

Create a local `.env` from `.env.example`.

## Local Setup

1. Install dependencies:
   - `npm install`
2. Set environment variables:
   - copy `.env.example` to `.env`
   - update values for your environment
3. Start server:
   - `npm start`

## Docker Setup

Build and run with Docker:

- `docker build -t blogmanangement .`
- `docker run --rm -p 4000:4000 --env-file .env blogmanangement`

Health check endpoint:

- `GET /health` returns `{ "ok": true }`

## Quality Checks

- Run tests:
  - `npm test`
- Run coverage-enforced test suite:
  - `npm run quality:coverage`
- Run boilerplate/starter-project quality check:
  - `npm run quality:boilerplate`
- Run strict Silver-style maturity gate:
  - `npm run quality:boilerplate:strict`
- Run full readiness check (format + lint + tests + strict gate):
  - includes coverage enforcement
  - `npm run quality:ready`

The boilerplate filter checks:

- minimum commit history count (configurable)
- minimum tracked files count (configurable)
- README language patterns that often indicate tutorial/scaffold content

You can override thresholds with:

- `MIN_COMMIT_COUNT`
- `MIN_TRACKED_FILES`

Notes:

- `quality:boilerplate` is developer-friendly and warns when commit history is short.
- `quality:boilerplate:strict` fails on short commit history and should be used before packaging for final Silver submission.

## API Notes

- `GET /health` returns service status.
- `GET /profile` requires auth cookie (`token`).
- `GET /post` returns an array (backward-compatible).
- `GET /post?withMeta=true&page=1&limit=20` returns paginated metadata and items.
- `POST /post` and `PUT /post` require auth and validate payload fields.
