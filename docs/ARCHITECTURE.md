# BlogManangement Architecture

BlogManangement is a layered full-stack publishing platform designed for long-term maintenance and task authoring.

## Backend layers

| Layer | Responsibility |
|-------|----------------|
| `appi/routes` | HTTP mapping, auth guards, request parsing |
| `appi/services` | Business rules, orchestration, authorization checks |
| `appi/repositories` | Persistence access for Mongoose models |
| `appi/models` | Schema definitions and document lifecycle hooks |
| `appi/middleware` | Cross-cutting concerns: auth, logging, rate limits, roles |
| `appi/lib` | Shared helpers (validation, pagination, search, passwords) |

Requests enter through Express, pass middleware, hit a route, and flow through a service before repositories touch MongoDB. Audit events are recorded for security-sensitive operations.

## Domain modules

- **Identity** — registration, login, profile updates, JWT cookie sessions, role-based access.
- **Posts** — draft/publish workflow, cover uploads, tags, categories, pagination, view counts.
- **Comments** — per-post threads with moderation states (`pending`, `approved`, `rejected`).
- **Taxonomy** — tags and categories for discovery and filtering.
- **Search** — published-post query endpoint with pagination metadata.
- **Admin audit** — admin-only audit trail for operational review.

## API surfaces

Routes are mounted at the legacy root paths (for backward compatibility) and under `/api/v1`.

## Frontend structure

- `client/src/services/blogApi.js` centralizes API calls.
- `client/src/hooks` encapsulates list/detail state for posts and comments.
- `client/src/components` contains reusable UI blocks (cards, comments, search).

## Testing strategy

Backend tests use Node's built-in test runner with `supertest` and model stubs for deterministic integration checks. Coverage gates enforce minimum line/branch thresholds across `appi/**`.
