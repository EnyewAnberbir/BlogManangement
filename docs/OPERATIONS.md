# BlogManangement Operations Guide

This document describes how to operate the platform in development and staging environments.

## Service components

- API process (`npm start`) serves Express routes from `appi/`.
- React client (`client/`) is developed separately and consumes API endpoints.
- MongoDB stores users, posts, comments, tags, categories, revisions, media assets, and audit events.

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `JWT_SECRET` | yes | Cookie session signing secret |
| `MONGODB_URI` | yes | Mongo connection string |
| `PORT` | no | API port, default `4000` |
| `CORS_ORIGIN` | no | Frontend origin, default `http://localhost:3000` |
| `SEED_EDITOR_USERNAME` | no | Seed script editor username |
| `SEED_EDITOR_PASSWORD` | no | Seed script editor password |

## Boot sequence

1. Ensure MongoDB is reachable.
2. Copy `.env.example` to `.env` and fill secrets.
3. Install dependencies with `npm install`.
4. Run API with `npm start`.
5. Optional: seed local fixtures via `node scripts/seed-database.js`.

## Background jobs

- `POST /jobs/weekly-digest` (admin only) composes a digest payload from active subscribers and recent posts.
- Jobs are intentionally idempotent and return JSON summaries for observability.

## Exports

Editors and admins can export CSV snapshots:

- `GET /exports/posts.csv`
- `GET /exports/comments.csv?status=approved`
- `GET /exports/users.csv` (admin only)

## Moderation operations

- Reader comments are created as `pending` unless the author is an editor/admin.
- Editors can patch comment status through `PATCH /comments/:id/status`.
- Use `/analytics/dashboard` to monitor pending comment and draft counts.

## Media library

- Authenticated users can upload supported image types and plain text to `/media`.
- Files are stored in `uploads/` and referenced by `MediaAsset` records.
- Deleting an asset removes both the database row and local file when present.

## Incident response checklist

1. Check `/health` for process availability.
2. Review `/admin/audit` for recent security-sensitive events.
3. Validate MongoDB connectivity and disk space for `uploads/`.
4. Re-run readiness checks: `npm run quality:ready`.

## Release checklist

1. `npm run quality:silver-metrics`
2. `npm run quality:boilerplate:strict`
3. Package zip with `.git/` included and without `node_modules/`.
4. Upload private repository archive to Silver.
