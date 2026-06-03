# BlogManangement API

Base URL: `http://localhost:4000` (also available under `/api/v1`).

## Health

- `GET /health` → `{ "ok": true }`

## Auth

- `POST /register` — create account
- `POST /login` — set JWT cookie
- `POST /logout` — clear cookie
- `GET /profile` — current session (auth required)
- `PUT /profile` — update `displayName` and `bio` (auth required)

## Posts

- `GET /post` — list posts (`withMeta`, `page`, `limit`, `status`, `tag`, `category`, `q`)
- `GET /post/:id` — fetch one post (`trackView=true` increments views)
- `POST /post` — create post (multipart: `file`, `title`, `summary`, `content`, optional `tags`, `categoryId`, `status`)
- `PUT /post` — update post (auth, ownership/editor/admin)
- `POST /post/:id/publish` — publish draft (auth)

## Comments

- `GET /post/:postId/comments` — list comments
- `POST /post/:postId/comments` — add comment (auth)
- `PATCH /comments/:id/status` — moderate comment (editor/admin)

## Taxonomy

- `GET /tags`
- `GET /categories`

## Search

- `GET /search/posts?q=...&page=1&limit=20`

## Admin

- `GET /admin/audit` — paginated audit events (admin only)
