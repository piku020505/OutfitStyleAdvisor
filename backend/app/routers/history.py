from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import get_current_user
from app.db import get_db
from app.models import OutfitAnalysis, User
from app.schemas import HistoryItemOut

router = APIRouter(prefix="/api/history", tags=["history"])


@router.get("", response_model=List[HistoryItemOut])
async def get_user_history(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(OutfitAnalysis)
        .where(OutfitAnalysis.user_id == current_user.id)
        .order_by(OutfitAnalysis.created_at.desc())
    )
    analyses = result.scalars().all()
    return analyses


@router.delete("/{analysis_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_history_item(
    analysis_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(OutfitAnalysis).where(
            OutfitAnalysis.id == analysis_id,
            OutfitAnalysis.user_id == current_user.id,
        )
    )
    analysis = result.scalar_one_or_none()
    if not analysis:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="History item not found.")

    await db.execute(delete(OutfitAnalysis).where(OutfitAnalysis.id == analysis_id))
