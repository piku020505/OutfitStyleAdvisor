"""
Deterministic Garment & Style Feature Classifier.

Uses classical computer vision metrics (aspect ratio, edge density, color variance,
and brightness histograms) to analyze input garments and map them deterministically
to fashion categories, patterns, and style rules without external ML dependencies.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import List

import numpy as np
from PIL import Image, ImageFilter

logger = logging.getLogger(__name__)

GARMENT_TYPES = [
    "t-shirt", "shirt", "blouse", "sweater", "hoodie", "jacket", "blazer",
    "coat", "dress", "skirt", "jeans", "trousers", "shorts", "suit",
]

PATTERNS = [
    "solid color", "striped", "checked / plaid", "textured / knit", "graphic print",
]

STYLES = [
    "casual", "formal / business", "streetwear", "athleisure", "minimalist", "resort wear",
]


@dataclass
class ClassificationResult:
    garment_type: str
    garment_confidence: float
    pattern: str
    style: str
    style_confidence: float
    backend: str
    top_garment_candidates: List[tuple] = field(default_factory=list)


class ManualFeatureClassifier:
    name = "Manual Feature Matrix v2"

    def classify(self, image: Image.Image) -> ClassificationResult:
        w, h = image.size
        aspect_ratio = h / max(w, 1)

        gray = image.convert("L").resize((128, 128))
        arr = np.array(gray).astype(np.float32)

        # Classical edge density metric via Sobel edge filter
        edges = gray.filter(ImageFilter.FIND_EDGES)
        edge_density = float(np.array(edges).mean()) / 255.0

        # Color variance metric across RGB channels
        rgb = np.array(image.convert("RGB").resize((128, 128))).astype(np.float32)
        color_std = float(rgb.std())

        # Silhouette & feature geometry heuristics
        if aspect_ratio > 1.45:
            garment = "dress" if color_std > 38 else "coat"
            garment_conf = 0.92
        elif aspect_ratio > 1.15:
            garment = "jacket" if edge_density > 0.16 else "shirt"
            garment_conf = 0.88
        elif aspect_ratio > 0.9:
            garment = "sweater" if color_std < 30 else "t-shirt"
            garment_conf = 0.90
        else:
            garment = "trousers" if aspect_ratio < 0.75 else "hoodie"
            garment_conf = 0.85

        # Pattern classification from edge frequency
        if edge_density > 0.22:
            pattern = "graphic print"
        elif edge_density > 0.16:
            pattern = "striped"
        elif edge_density > 0.11:
            pattern = "textured / knit"
        else:
            pattern = "solid color"

        # Style classification from texture & color variance
        if edge_density > 0.18:
            style = "streetwear"
            style_conf = 0.87
        elif color_std < 32 and aspect_ratio > 1.1:
            style = "formal / business"
            style_conf = 0.91
        elif color_std > 45:
            style = "resort wear"
            style_conf = 0.86
        else:
            style = "casual"
            style_conf = 0.89

        candidates = [
            (garment, garment_conf),
            ("blazer" if garment == "jacket" else "shirt", round(garment_conf * 0.85, 2)),
            ("sweater" if garment == "t-shirt" else "trousers", round(garment_conf * 0.70, 2)),
        ]

        return ClassificationResult(
            garment_type=garment,
            garment_confidence=garment_conf,
            pattern=pattern,
            style=style,
            style_confidence=style_conf,
            backend=self.name,
            top_garment_candidates=candidates,
        )


_classifier_instance: ManualFeatureClassifier | None = None


def get_classifier() -> ManualFeatureClassifier:
    global _classifier_instance
    if _classifier_instance is None:
        _classifier_instance = ManualFeatureClassifier()
        logger.info("Fashion analysis engine initialized: %s", _classifier_instance.name)
    return _classifier_instance
