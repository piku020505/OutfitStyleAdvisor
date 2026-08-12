"""
Garment & style classification.

Two backends are supported behind one interface:

1. CLIPZeroShotClassifier (preferred, "pro" path)
   Uses a pretrained CLIP model (openai/clip-vit-base-patch32 via
   HuggingFace Transformers) to do zero-shot image/text matching against
   curated label sets for garment type, pattern, and style/occasion.
   No fine-tuning or labeled training data required -- this is the same
   zero-shot technique used in production fashion-tech search/tagging
   systems.

2. HeuristicClassifier (automatic fallback)
   A lightweight, dependency-free classifier using classic computer
   vision signals (edge density via Sobel, aspect ratio, color variance)
   when torch/transformers aren't installed or model weights can't be
   downloaded (e.g. fully offline environments, CI runners). This keeps
   the app fully demoable without a multi-GB model download.

`get_classifier()` auto-selects the best available backend at import
time and logs which one is active.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import List

import numpy as np
from PIL import Image, ImageFilter

logger = logging.getLogger(__name__)

GARMENT_LABELS = [
    "t-shirt", "shirt", "blouse", "sweater", "hoodie", "jacket", "blazer",
    "coat", "dress", "skirt", "jeans", "trousers", "shorts", "suit",
    "activewear", "saree", "kurta",
]

PATTERN_LABELS = [
    "solid color", "striped", "checked / plaid", "floral", "polka dot",
    "graphic print", "animal print", "textured / knit",
]

STYLE_LABELS = [
    "casual", "formal / business", "streetwear", "athleisure",
    "bohemian", "minimalist", "vintage", "party / evening wear",
    "ethnic / traditional",
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


class BaseClassifier:
    name = "base"

    def classify(self, image: Image.Image) -> ClassificationResult:
        raise NotImplementedError


class CLIPZeroShotClassifier(BaseClassifier):
    name = "clip-vit-base-patch32 (zero-shot)"

    def __init__(self) -> None:
        import torch
        from transformers import CLIPModel, CLIPProcessor

        self.torch = torch
        self.model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
        self.processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
        self.model.eval()

    def _rank(self, image: Image.Image, labels: List[str]) -> List[tuple]:
        prompts = [f"a photo of a {label} garment" for label in labels]
        inputs = self.processor(text=prompts, images=image, return_tensors="pt", padding=True)
        with self.torch.no_grad():
            outputs = self.model(**inputs)
            probs = outputs.logits_per_image.softmax(dim=1)[0].tolist()
        ranked = sorted(zip(labels, probs), key=lambda x: -x[1])
        return ranked

    def classify(self, image: Image.Image) -> ClassificationResult:
        garment_ranked = self._rank(image, GARMENT_LABELS)
        pattern_ranked = self._rank(image, PATTERN_LABELS)
        style_ranked = self._rank(image, STYLE_LABELS)

        top_garment, top_garment_conf = garment_ranked[0]
        top_pattern, _ = pattern_ranked[0]
        top_style, top_style_conf = style_ranked[0]

        return ClassificationResult(
            garment_type=top_garment,
            garment_confidence=round(float(top_garment_conf), 3),
            pattern=top_pattern,
            style=top_style,
            style_confidence=round(float(top_style_conf), 3),
            backend=self.name,
            top_garment_candidates=[(l, round(float(p), 3)) for l, p in garment_ranked[:3]],
        )


class HeuristicClassifier(BaseClassifier):
    """
    Offline, dependency-light fallback. Not a substitute for a trained
    model's accuracy -- it exists so the full pipeline (upload -> vision
    -> LLM -> UI) is always runnable end-to-end, including in CI or
    fully air-gapped demo environments.
    """
    name = "heuristic-cv (offline fallback)"

    def classify(self, image: Image.Image) -> ClassificationResult:
        gray = image.convert("L").resize((128, 128))
        arr = np.array(gray).astype(np.float32)

        edges = gray.filter(ImageFilter.FIND_EDGES)
        edge_density = float(np.array(edges).mean()) / 255.0

        w, h = image.size
        aspect = h / max(w, 1)

        rgb = np.array(image.convert("RGB").resize((128, 128))).astype(np.float32)
        color_std = float(rgb.std())

        # Very rough silhouette heuristic based on aspect ratio.
        if aspect > 1.5:
            garment = "dress" if color_std > 40 else "coat"
        elif aspect > 1.15:
            garment = "shirt"
        else:
            garment = "t-shirt"

        pattern = "graphic print" if edge_density > 0.18 else "solid color"
        style = "streetwear" if edge_density > 0.18 else "casual"

        garment_conf = 0.45  # intentionally modest -- this is a fallback, not a trained model
        style_conf = 0.4

        return ClassificationResult(
            garment_type=garment,
            garment_confidence=garment_conf,
            pattern=pattern,
            style=style,
            style_confidence=style_conf,
            backend=self.name,
            top_garment_candidates=[(garment, garment_conf)],
        )


_classifier_instance: BaseClassifier | None = None


def get_classifier() -> BaseClassifier:
    global _classifier_instance
    if _classifier_instance is not None:
        return _classifier_instance

    try:
        _classifier_instance = CLIPZeroShotClassifier()
        logger.info("Vision backend: %s", _classifier_instance.name)
    except Exception as exc:  # noqa: BLE001 - broad on purpose, this is a graceful fallback
        logger.warning("CLIP backend unavailable (%s); using heuristic fallback.", exc)
        _classifier_instance = HeuristicClassifier()

    return _classifier_instance
