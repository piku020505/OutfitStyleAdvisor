"""
Manual Fashion Styling & Rule Matrix Engine.

Takes structured image analysis parameters (garment type, pattern,
dominant colors, style category) and generates grounded styling recommendations,
color-theory guidance, and handcrafted next outfit transition concepts using a
deterministic fashion styling algorithm.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Any, Dict, List

logger = logging.getLogger(__name__)


@dataclass
class StyleReport:
    headline: str
    analysis: str
    occasions: List[str]
    pairing_suggestions: List[str]
    color_tip: str
    generated_by: str
    next_outfit_styles: List[Dict[str, Any]]


def generate_style_report(
    garment_type: str,
    pattern: str,
    style: str,
    dominant_colors: List[str],
) -> StyleReport:
    color_list = ", ".join(colors for colors in dominant_colors[:3]) if dominant_colors else "a neutral palette"
    primary_color = dominant_colors[0] if dominant_colors else "neutral"

    # Handcrafted fashion recommendation matrix
    headline = f"A {style.capitalize()} {garment_type.capitalize()} Look in {primary_color.capitalize()}"
    analysis = (
        f"This {garment_type} features a clean {pattern} design leaning {style}. "
        f"Anchored around {color_list}, it forms a versatile foundational piece for structured outfit layering and balanced color coordination."
    )

    occasions = [
        f"Smart Casual & {style.capitalize()} Gatherings",
        "Daytime Outings & Social Events",
        "Versatile Everyday Wear",
    ]

    pairing_suggestions = [
        f"Pair with neutral-toned footwear to keep the focus on the {garment_type}.",
        f"Incorporate textured layering (e.g. wool blazer or washed denim) to elevate the {style} aesthetic.",
        f"Use subtle metallic or leather accessories to complement the {primary_color} tones.",
    ]

    color_tip = f"Dominant shades like {color_list} create strong visual harmony when paired with foundational neutrals like cream, charcoal, or navy."

    next_outfit_styles = [
        {
            "title": "Evening Glamour Upgrade",
            "concept": f"Elevate this {style} {garment_type} for night outings by pairing structured satin or leather outerwear with metallic accents.",
            "garments": ["Structured Black Blazer", "Leather Ankle Boots", "Gold Statement Watch"],
            "palette": ["#1A1A1F", "#B8562F", "#D4AF37"],
            "vibe": "Chic & Polished Nightwear",
        },
        {
            "title": "Urban Layered Contrast",
            "concept": f"Transform the {garment_type} into high-street casual fashion with oversized denim layers and crisp white leather sneakers.",
            "garments": ["Oversized Washed Denim Jacket", "Minimalist White Sneakers", "Ribbed Beanie"],
            "palette": ["#2C3E50", "#ECF0F1", "#8E44AD"],
            "vibe": "Relaxed Streetwear",
        },
        {
            "title": "Monochrome Minimalist Pivot",
            "concept": f"Simplify the palette around {color_list} with clean architectural cuts and tonal accessory matching.",
            "garments": ["Wool Trench Coat", "Monochrome Leather Tote", "Chunky Sole Loafers"],
            "palette": ["#FFFFFF", "#111111", "#7F8C8D"],
            "vibe": "Contemporary High-Fashion",
        },
        {
            "title": "Resort Warm-Toned Harmony",
            "concept": f"Pair light linen trousers or a woven tote to create an effortless sunny getaway look.",
            "garments": ["Off-White Linen Trousers", "Woven Straw Tote", "Leather Slide Sandals"],
            "palette": ["#F4E1D2", "#D5A6BD", "#C39BD3"],
            "vibe": "Effortless Resort Chic",
        },
    ]

    return StyleReport(
        headline=headline,
        analysis=analysis,
        occasions=occasions,
        pairing_suggestions=pairing_suggestions,
        color_tip=color_tip,
        generated_by="Manual-Fashion-Rule-Engine-v2",
        next_outfit_styles=next_outfit_styles,
    )
