"""
Gen AI styling layer.

Takes the structured vision output (garment type, pattern, dominant
colors, style classification) and turns it into a grounded, human-quality
style report using the Anthropic Claude API. The prompt explicitly
constrains the model to the detected attributes so the output stays
factually anchored to what was actually seen in the image, rather than
hallucinating details about a photo it never receives.

Fails soft: if no API key is configured, returns a clearly-labeled
rule-based recommendation instead of raising, so the rest of the app
(and any automated tests) keep working without network/API access.
"""
from __future__ import annotations

import json
import logging
import os
from dataclasses import dataclass
from typing import Any, Dict, List

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are a professional fashion stylist assistant embedded in an app.
You will be given structured, machine-detected attributes of an outfit photo
(garment type, pattern, dominant colors, style category). You did NOT see the
photo yourself -- only these detected attributes. Do not invent details that
were not provided.

Return ONLY valid JSON (no markdown fences, no preamble) matching this shape:
{
  "headline": "a short punchy one-line style summary",
  "analysis": "2-3 sentences analyzing the outfit's color palette and style",
  "occasions": ["occasion 1", "occasion 2", "occasion 3"],
  "pairing_suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"],
  "color_tip": "one sentence of color-theory advice specific to the detected palette",
  "next_outfit_styles": [
    {
      "title": "Style title e.g. Evening Glamour Upgrade",
      "concept": "1 sentence describing the next outfit style concept",
      "garments": ["Item 1", "Item 2", "Item 3"],
      "palette": ["#hex1", "#hex2", "#hex3"],
      "vibe": "Aesthetic vibe"
    }
  ]
}
"""


@dataclass
class StyleReport:
    headline: str
    analysis: str
    occasions: List[str]
    pairing_suggestions: List[str]
    color_tip: str
    generated_by: str
    next_outfit_styles: List[Dict[str, Any]]


def _fallback_report(garment_type: str, style: str, colors: List[str]) -> StyleReport:
    color_list = ", ".join(colors[:3]) if colors else "a neutral palette"
    return StyleReport(
        headline=f"A {style} {garment_type} look",
        analysis=(
            f"This {garment_type} leans {style}, built around {color_list}. "
            "It establishes a versatile base for creative styling transitions."
        ),
        occasions=["Everyday wear", "Casual outings", "Weekend errands"],
        pairing_suggestions=[
            "Pair with neutral footwear to keep the palette balanced.",
            "Add one accent accessory to lift the outfit.",
            "Layer with a plain outer piece for cooler weather.",
        ],
        color_tip=f"Colors like {color_list} generally pair well with neutral tones such as white, black, or beige.",
        generated_by="rule-based-engine",
        next_outfit_styles=[
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
        ],
    )


def generate_style_report(
    garment_type: str,
    pattern: str,
    style: str,
    dominant_colors: List[str],
) -> StyleReport:
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        logger.info("No ANTHROPIC_API_KEY set; using fallback style report.")
        return _fallback_report(garment_type, style, dominant_colors)

    try:
        import anthropic

        client = anthropic.Anthropic(api_key=api_key)
        user_payload = json.dumps(
            {
                "garment_type": garment_type,
                "pattern": pattern,
                "style_category": style,
                "dominant_colors": dominant_colors,
            }
        )

        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=800,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_payload}],
        )

        text = "".join(block.text for block in response.content if block.type == "text")
        data = json.loads(text)

        return StyleReport(
            headline=data["headline"],
            analysis=data["analysis"],
            occasions=data["occasions"],
            pairing_suggestions=data["pairing_suggestions"],
            color_tip=data["color_tip"],
            generated_by="claude-sonnet-4-6",
            next_outfit_styles=data.get("next_outfit_styles", []),
        )
    except Exception as exc:  # noqa: BLE001 - fail soft, never break the request
        logger.warning("Claude generation failed (%s); using fallback.", exc)
        return _fallback_report(garment_type, style, dominant_colors)

