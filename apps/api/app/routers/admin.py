import json
from pathlib import Path
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.db import get_db
from app.routers.deps import get_current_user
from app.services.ingestion import import_rows, parse_upload

router = APIRouter(prefix="/admin", tags=["admin"])


def require_admin(user):
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="admin only")


@router.post("/import")
async def import_file(file: UploadFile = File(...), user=Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    require_admin(user)
    rows = parse_upload(file.filename, await file.read())
    return await import_rows(db, rows)


@router.post("/seed")
async def seed(user=Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    require_admin(user)
    seed_path = Path("/data/seed_opportunities.json")
    if not seed_path.exists():
        seed_path = Path(__file__).resolve().parents[4] / "data" / "seed_opportunities.json"
    rows = json.loads(seed_path.read_text())
    return await import_rows(db, rows)
