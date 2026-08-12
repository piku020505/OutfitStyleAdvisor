from __future__ import annotations

import io
import logging
from contextlib import asynccontextmanager
from typing import Optional

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, UnidentifiedImageError
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import get_optional_current_user
from app.db import get_db, init_db
from app.llm.stylist import generate_style_report
from app.models import OutfitAnalysis, User
from app.routers import auth, history
from app.schemas import AnalyzeResponse, ColorOut, StyleReportOut
from app.vision.color_analyzer import extract_dominant_colors
from app.vision.garment_classifier import get_classifier

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("outfit-style-advisor")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing database schema...")
    await init_db()
    logger.info("Database initialized successfully.")
    yield


app = FastAPI(
    title="Outfit Style Advisor API",
    description="Upload an outfit photo to receive vision analysis, AI styling guidance, JWT authentication, and user history persistence.",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(history.router)

MAX_UPLOAD_BYTES = 8 * 1024 * 1024  # 8 MB


@app.get("/")
def root():
    return {
        "status": "ok",
        "service": "outfit-style-advisor-api",
        "version": "2.0.0",
    }


@app.get("/api/health")
def health():
    classifier = get_classifier()
    return {
        "status": "ok",
        "vision_backend": classifier.name,
        "database": "sqlite/asyncpg connected",
    }


@app.post("/api/analyze", response_model=AnalyzeResponse)
async def analyze_outfit(
    file: UploadFile = File(...),
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: AsyncSession = Depends(get_db),
):
    if file.content_type not in ("image/jpeg", "image/png", "image/webp"):
        raise HTTPException(status_code=400, detail="Please upload a JPEG, PNG, or WEBP image.")

    raw = await file.read()
    if len(raw) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="Image too large (max 8 MB).")

    try:
        image = Image.open(io.BytesIO(raw)).convert("RGB")
    except UnidentifiedImageError:
        raise HTTPException(status_code=400, detail="Could not read image file.")

    classifier = get_classifier()
    classification = classifier.classify(image)

    colors = extract_dominant_colors(image, n_colors=4)
    color_names = [c.name for c in colors]

    report = generate_style_report(
        garment_type=classification.garment_type,
        pattern=classification.pattern,
        style=classification.style,
        dominant_colors=color_names,
    )

    dominant_colors_data = [
        {"name": c.name, "hex": c.hex, "weight": c.weight} for c in colors
    ]

    style_report_data = {
        "headline": report.headline,
        "analysis": report.analysis,
        "occasions": report.occasions,
        "pairing_suggestions": report.pairing_suggestions,
        "color_tip": report.color_tip,
        "generated_by": report.generated_by,
        "next_outfit_styles": report.next_outfit_styles,
    }

    # If user is authenticated, save analysis to database history automatically!
    if current_user:
        analysis_record = OutfitAnalysis(
            user_id=current_user.id,
            garment_type=classification.garment_type,
            garment_confidence=classification.garment_confidence,
            pattern=classification.pattern,
            style=classification.style,
            style_confidence=classification.style_confidence,
            vision_backend=classification.backend,
            dominant_colors=dominant_colors_data,
            style_report=style_report_data,
        )
        db.add(analysis_record)

    return AnalyzeResponse(
        garment_type=classification.garment_type,
        garment_confidence=classification.garment_confidence,
        pattern=classification.pattern,
        style=classification.style,
        style_confidence=classification.style_confidence,
        vision_backend=classification.backend,
        dominant_colors=[ColorOut(name=c["name"], hex=c["hex"], weight=c["weight"]) for c in dominant_colors_data],
        top_garment_candidates=classification.top_garment_candidates,
        style_report=StyleReportOut(**style_report_data),
    )
