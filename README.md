# InternAtlas

InternAtlas is a capstone app with a Next.js frontend, FastAPI backend, and Postgres + pgvector.

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

Preview mode is designed for previews where Docker is unavailable.

```bash
cp .env.example .env
make preview
```

This starts:
- API on `http://0.0.0.0:8000` (sqlite by default)
- Web on `http://0.0.0.0:3000`

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

## Manual Acceptance Checklist (v2)
- [ ] `make dev` works cleanly; web + api + db all stay running.
- [ ] Signup -> edit profile -> opportunities list shows results -> open detail -> see explanation -> save -> unsave -> rate.
- [ ] Application tracker -> create -> insights shows updated stats.
- [ ] Insights -> export CSV downloads correctly.
- [ ] No 404s for buttons/links. No placeholder features.
- [ ] UI looks modern and consistent in light + dark.
