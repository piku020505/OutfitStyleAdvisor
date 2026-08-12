import io
import pytest
from fastapi.testclient import TestClient
from PIL import Image

from app.main import app


@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c


def _sample_image_bytes(color=(30, 60, 120), size=(200, 300)) -> bytes:
    img = Image.new("RGB", size, color=color)
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    buf.seek(0)
    return buf.read()


def test_root(client):
    resp = client.get("/")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"


def test_health(client):
    resp = client.get("/api/health")
    assert resp.status_code == 200
    assert "vision_backend" in resp.json()


def test_analyze_valid_image(client):
    img_bytes = _sample_image_bytes()
    resp = client.post(
        "/api/analyze",
        files={"file": ("outfit.jpg", img_bytes, "image/jpeg")},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "garment_type" in data
    assert "style_report" in data
    assert len(data["dominant_colors"]) > 0
    assert 0.0 <= data["garment_confidence"] <= 1.0


def test_analyze_rejects_bad_content_type(client):
    resp = client.post(
        "/api/analyze",
        files={"file": ("outfit.txt", b"not an image", "text/plain")},
    )
    assert resp.status_code == 400


def test_analyze_rejects_corrupt_image(client):
    resp = client.post(
        "/api/analyze",
        files={"file": ("outfit.jpg", b"\xff\xd8\xff\x00garbage", "image/jpeg")},
    )
    assert resp.status_code == 400


def test_auth_and_history_flow(client):
    # 1. Register User
    reg_payload = {
        "email": "engineer.test@example.com",
        "password": "SecurePassword123!",
        "full_name": "Senior Software Engineer",
    }
    reg_resp = client.post("/api/auth/register", json=reg_payload)
    assert reg_resp.status_code == 201
    token_data = reg_resp.json()
    assert "access_token" in token_data
    token = token_data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Fetch User Profile
    me_resp = client.get("/api/auth/me", headers=headers)
    assert me_resp.status_code == 200
    user_info = me_resp.json()
    assert user_info["email"] == "engineer.test@example.com"

    # 3. Analyze outfit with auth header (auto saves to history)
    img_bytes = _sample_image_bytes()
    analyze_resp = client.post(
        "/api/analyze",
        files={"file": ("outfit.jpg", img_bytes, "image/jpeg")},
        headers=headers,
    )
    assert analyze_resp.status_code == 200

    # 4. Retrieve saved user history
    history_resp = client.get("/api/history", headers=headers)
    assert history_resp.status_code == 200
    history_items = history_resp.json()
    assert len(history_items) >= 1
    assert "garment_type" in history_items[0]

    # 5. Test Login
    login_resp = client.post(
        "/api/auth/login",
        json={"email": "engineer.test@example.com", "password": "SecurePassword123!"},
    )
    assert login_resp.status_code == 200
    assert "access_token" in login_resp.json()
