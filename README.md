# BlogManangement

BlogManangement is a production-style full-stack publishing platform with authentication, editorial workflows, taxonomy, comments, search, and admin audit trails.

## System scope

- **Backend API** (`appi/`) — layered routes, services, repositories, and models
- **Frontend** (`client/`) — React app with reusable hooks/components
- **Quality gates** (`scripts/`, `tests/`) — lint, coverage, and Silver preflight checks
- **Docs** (`docs/`) — architecture and API references

## Security requirements

No credentials should be committed in source code.

Set environment variables before running:

- `JWT_SECRET` (required)
- `MONGODB_URI` (required for database-backed routes)
- `PORT` (optional, defaults to 4000)
- `CORS_ORIGIN` (optional, defaults to `http://localhost:3000`)

Create a local `.env` from `.env.example`.

## Local setup

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and update values
3. Start API server: `npm start`
4. Start frontend (separate terminal): `cd client && npm install && npm start`

## Docker setup

```bash
docker build -t blogmanangement .
docker run --rm -p 4000:4000 --env-file .env blogmanangement
```

Health check: `GET /health` → `{ "ok": true }`

## Quality checks

| Command | Purpose |
|---------|---------|
| `npm test` | Backend integration/unit tests |
| `npm run quality:coverage` | Coverage-enforced test run |
| `npm run quality:boilerplate` | Repo maturity preflight (warn mode) |
| `npm run quality:boilerplate:strict` | Strict maturity gate before Silver zip upload |
| `npm run quality:ready` | Format + lint + tests + strict gate |

Override local thresholds when needed:

- `MIN_COMMIT_COUNT`
- `MIN_TRACKED_FILES`

## Silver repository packaging

When uploading to Silver:

1. Include the `.git/` directory in your zip (required for commit-based tasks).
2. Do **not** exclude `.git/` in `.dockerignore`.
3. Run `npm run quality:boilerplate:strict` before packaging.
4. Keep the repo private on GitHub and avoid public mirrors.

## API quick reference

See `docs/API.md` for endpoint details and `docs/ARCHITECTURE.md` for module boundaries.

Legacy compatibility endpoints remain at the repo root (`/post`, `/login`, etc.) and are also exposed under `/api/v1`.
