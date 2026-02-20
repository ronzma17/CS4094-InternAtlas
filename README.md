# InternAtlas

InternAtlas is a monorepo capstone app with a Next.js frontend, FastAPI backend, and Postgres + pgvector.

## Quick start

```bash
cp .env.example .env
make dev
```

In another terminal:

```bash
make seed
```

Run tests:

```bash
make test
```

## URLs
- Web: http://localhost:3000
- API: http://localhost:8000
- OpenAPI docs: http://localhost:8000/docs

## Notes
- Vector backend defaults to `auto` (pgvector if available, JSON fallback in app code).
- First registered user is admin.
