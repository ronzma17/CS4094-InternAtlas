from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.models.base import Base
from app.core.db import engine
from app.routers import auth, profile, opportunities, tracker, admin, insights, metrics

app = FastAPI(title="InternAtlas API")
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3000"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])


@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(opportunities.router)
app.include_router(tracker.router)
app.include_router(admin.router)
app.include_router(insights.router)
app.include_router(metrics.router)


@app.get("/")
async def root():
    return {"name": "InternAtlas"}
