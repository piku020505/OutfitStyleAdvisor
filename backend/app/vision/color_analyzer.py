"""
Dominant color extraction and human-readable color naming.

Uses k-means clustering (scikit-learn) over pixel RGB values to find the
most visually dominant colors in an outfit photo, then maps each cluster
centroid to the closest named color from a curated fashion-relevant
palette (more useful for styling than raw CSS3 color names).
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import List, Tuple

import numpy as np
from PIL import Image
from sklearn.cluster import KMeans

# A curated palette biased towards apparel/fashion terminology rather than
# raw web-color names (e.g. "charcoal" instead of "dimgray").
FASHION_PALETTE: dict[str, Tuple[int, int, int]] = {
    "black": (10, 10, 10),
    "charcoal": (54, 54, 58),
    "white": (250, 250, 250),
    "ivory": (240, 234, 214),
    "grey": (140, 140, 140),
    "navy": (23, 35, 71),
    "denim blue": (67, 100, 145),
    "sky blue": (135, 191, 224),
    "teal": (25, 115, 115),
    "forest green": (34, 87, 55),
    "olive": (101, 105, 60),
    "sage green": (150, 168, 141),
    "burgundy": (105, 22, 38),
    "red": (196, 30, 40),
    "coral": (232, 122, 105),
    "blush pink": (232, 187, 190),
    "hot pink": (222, 60, 130),
    "purple": (98, 62, 138),
    "lavender": (190, 175, 219),
    "mustard": (207, 163, 44),
    "yellow": (240, 210, 60),
    "orange": (222, 118, 43),
    "tan": (196, 164, 122),
    "camel": (168, 124, 78),
    "brown": (94, 62, 41),
    "beige": (222, 202, 173),
}


@dataclass
class ColorResult:
    name: str
    hex: str
    rgb: Tuple[int, int, int]
    weight: float  # proportion of the (foreground) image this color covers


def _rgb_to_hex(rgb: Tuple[int, int, int]) -> str:
    return "#{:02x}{:02x}{:02x}".format(*[max(0, min(255, int(c))) for c in rgb])


def _nearest_fashion_name(rgb: Tuple[int, int, int]) -> str:
    best_name, best_dist = "unknown", float("inf")
    for name, ref in FASHION_PALETTE.items():
        dist = sum((a - b) ** 2 for a, b in zip(rgb, ref))
        if dist < best_dist:
            best_dist, best_name = dist, name
    return best_name


def extract_dominant_colors(image: Image.Image, n_colors: int = 4) -> List[ColorResult]:
    """
    Cluster the image's pixels into `n_colors` groups and return them
    ranked by prevalence. A light center-crop is applied to bias sampling
    toward the subject (typical outfit photos are subject-centered) and
    reduce background contamination.
    """
    img = image.convert("RGB")

    # Downscale for speed; clustering doesn't need full resolution.
    img = img.resize((160, 160))

    w, h = img.size
    left, top = int(w * 0.12), int(h * 0.08)
    right, bottom = int(w * 0.88), int(h * 0.95)
    cropped = img.crop((left, top, right, bottom))

    pixels = np.array(cropped).reshape(-1, 3).astype(np.float32)

    k = min(n_colors, len(np.unique(pixels, axis=0)))
    k = max(k, 1)

    kmeans = KMeans(n_clusters=k, n_init=4, random_state=42)
    labels = kmeans.fit_predict(pixels)
    centers = kmeans.cluster_centers_

    counts = np.bincount(labels, minlength=k)
    order = np.argsort(-counts)

    results: List[ColorResult] = []
    total = counts.sum()
    for idx in order:
        rgb = tuple(int(c) for c in centers[idx])
        results.append(
            ColorResult(
                name=_nearest_fashion_name(rgb),
                hex=_rgb_to_hex(rgb),
                rgb=rgb,
                weight=round(float(counts[idx]) / float(total), 3),
            )
        )
    return results
