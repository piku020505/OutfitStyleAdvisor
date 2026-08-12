from datetime import datetime
from typing import Optional
from sqlalchemy import String, Integer, DateTime, ForeignKey, JSON, Float, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    analyses: Mapped[list["OutfitAnalysis"]] = relationship("OutfitAnalysis", back_populates="user", cascade="all, delete-orphan")


class OutfitAnalysis(Base):
    __tablename__ = "outfit_analyses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    garment_type: Mapped[str] = mapped_column(String(100), nullable=False)
    garment_confidence: Mapped[float] = mapped_column(Float, nullable=False)
    pattern: Mapped[str] = mapped_column(String(100), nullable=False)
    style: Mapped[str] = mapped_column(String(100), nullable=False)
    style_confidence: Mapped[float] = mapped_column(Float, nullable=False)
    vision_backend: Mapped[str] = mapped_column(String(100), nullable=False)
    dominant_colors: Mapped[dict] = mapped_column(JSON, nullable=False)
    style_report: Mapped[dict] = mapped_column(JSON, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user: Mapped["User"] = relationship("User", back_populates="analyses")
