SHELL := /bin/bash

.PHONY: dev down logs seed test lint

dev:
	cp -n .env.example .env || true
	docker compose up --build

down:
	docker compose down -v

logs:
	docker compose logs -f --tail=200

seed:
	docker compose run --rm api bash -lc "alembic upgrade head && python -m app.scripts.seed"

test:
	cd apps/api && pytest -q
	cd apps/web && npm install && npm run build

lint:
	cd apps/api && ruff check .
	cd apps/web && npm install && npm run lint
