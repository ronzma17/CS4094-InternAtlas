from fastapi import Depends, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.db import get_db
from app.core.security import decode_token
from app.models.models import User


async def get_current_user(request: Request, db: AsyncSession = Depends(get_db)) -> User:
    token = request.cookies.get("internatlas_token")
    uid = decode_token(token) if token else None

    if uid:
        user = (await db.execute(select(User).where(User.id == uid))).scalar_one_or_none()
        if user:
            return user

    # No valid login cookie: reject instead of falling back to a shared demo admin account.
    raise HTTPException(status_code=401, detail="Please log in")
