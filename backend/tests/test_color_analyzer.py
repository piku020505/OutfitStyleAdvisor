from PIL import Image

from app.vision.color_analyzer import extract_dominant_colors


def test_extract_dominant_colors_solid_black():
    img = Image.new("RGB", (200, 200), color=(5, 5, 5))
    colors = extract_dominant_colors(img, n_colors=3)
    assert len(colors) >= 1
    assert colors[0].name == "black"
    assert colors[0].hex.startswith("#")
    assert 0.0 <= colors[0].weight <= 1.0


def test_extract_dominant_colors_returns_ranked_by_weight():
    img = Image.new("RGB", (200, 200), color=(240, 210, 60))  # yellow
    colors = extract_dominant_colors(img, n_colors=2)
    weights = [c.weight for c in colors]
    assert weights == sorted(weights, reverse=True)
