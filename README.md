# InternAtlas

InternAtlas is a monorepo capstone app with a Next.js frontend, FastAPI backend, and Postgres + pgvector.

## Docker quick start

```bash
cp .env.example .env
make dev
```

In another terminal:

```bash
make seed
```

## Preview mode (no Docker)

Preview mode is designed for environments like Codex cloud previews where Docker is unavailable.

```bash
cp .env.example .env
make preview
```

This starts:
- API on `http://0.0.0.0:8000` (sqlite by default)
- Web on `http://0.0.0.0:3000`

### Codex preview checklist
1. Open `http://localhost:3000/opportunities` and test search/filter states.
2. Open one opportunity detail page and try Save + Rate.
3. Open `/tracker` and create/edit/delete an application.
4. Open `/insights` and verify funnel cards and export action.
5. Open `/profile` and save updated skills.
6. Open `/admin/import` and run seed import.

## Tests

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
