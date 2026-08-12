from __future__ import annotations

from datetime import datetime
from typing import List, Tuple, Optional
from pydantic import BaseModel, EmailStr


class ColorOut(BaseModel):
    name: str
    hex: str
    weight: float


class NextOutfitStyleOut(BaseModel):
    title: str
    concept: str
    garments: List[str]
    palette: List[str]
    vibe: str


class StyleReportOut(BaseModel):
    headline: str
    analysis: str
    occasions: List[str]
    pairing_suggestions: List[str]
    color_tip: str
    generated_by: str
    next_outfit_styles: List[NextOutfitStyleOut]


class AnalyzeResponse(BaseModel):
    garment_type: str
    garment_confidence: float
    pattern: str
    style: str
    style_confidence: float
    vision_backend: str
    dominant_colors: List[ColorOut]
    top_garment_candidates: List[Tuple[str, float]]
    style_report: StyleReportOut


# Auth & User Schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    email: str
    full_name: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# History Schemas
class HistoryItemOut(BaseModel):
    id: int
    garment_type: str
    garment_confidence: float
    pattern: str
    style: str
    style_confidence: float
    vision_backend: str
    dominant_colors: List[ColorOut]
    style_report: StyleReportOut
    created_at: datetime

    class Config:
        from_attributes = True
