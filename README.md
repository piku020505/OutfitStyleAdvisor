# Outfit Style Advisor — Enterprise AI Platform

Upload a photo of an outfit or choose from live style presets to receive **structured computer-vision analysis**, **dominant color palette extraction**, **AI styling advice**, and **grounded "What to Wear Next" outfit evolution recommendations**.

Built as an **Enterprise-Grade Full-Stack AI Platform**: React frontend, FastAPI async backend, JWT Authentication, SQLAlchemy 2.0 async database persistence (SQLite/PostgreSQL), swappable computer vision layer (CLIP zero-shot + heuristic fallback), Docker containerization, and GitHub Actions CI/CD.

---

## 🌟 Key Features & Architectural Capabilities

- 🤖 **Swappable Vision Pipeline**: Primary zero-shot CLIP classifier (`openai/clip-vit-base-patch32`) with automatic offline heuristic fallback.
- 🎨 **K-Means Color Theory Engine**: Extracts dominant RGB pixel clusters and maps them to fashion color names & hex values.
- ✨ **Grounded AI Style Generator**: Anthropic Claude API / Rule-based engine producing structured style reports and **Next Outfit Style Variations**.
- 🔒 **JWT Authentication & Passwords**: OAuth2 Bearer JWT token auth with `bcrypt` password hashing (`/api/auth/register`, `/api/auth/login`, `/api/auth/me`).
- 💾 **Async Database Persistence**: SQLAlchemy 2.0 Async (`aiosqlite` SQLite local / `asyncpg` PostgreSQL) storing user accounts and analysis history.
- 🗂 **Saved Outfit History Drawer**: Slide-over panel to review past saved outfit analyses, reload reports with 1-click, or delete entries.
- ⏭ **Live Outfit Showcase & Next Style Stream**: Interactive carousel with **"Next Outfit Style"** button, **"Auto Stream"** timer mode, and sample canvas generators.
- 🐳 **Docker Multi-Container Stack**: Complete `docker-compose.yml` orchestrating PostgreSQL, FastAPI, and React Vite.
- 🔄 **Enterprise CI/CD Pipeline**: GitHub Actions workflow testing backend pytest suite, verifying frontend production build, and checking Docker builds.
- ☁️ **Cloud Deployment Ready**: `render.yaml` specification for 1-click cloud deployments on Render/Railway/AWS.

---

## 🏗 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons |
| **Backend Framework** | FastAPI (Python 3.12), Pydantic v2 |
| **Database** | SQLAlchemy 2.0 Async, SQLite (`aiosqlite`), PostgreSQL (`asyncpg`) |
| **Authentication** | OAuth2 Bearer, PyJWT, Passlib (`bcrypt`) |
| **Vision (Primary)** | CLIP (`openai/clip-vit-base-patch32`) Zero-Shot Classification via HuggingFace Transformers |
| **Vision (Fallback)** | Offline Heuristic Classifier (Edge Density, Aspect Ratio, Color Variance) |
| **Color Analysis** | Scikit-Learn K-Means Clustering |
| **Gen AI Styling** | Anthropic Claude API / Fashion Rule-Based Fallback Engine |
| **Testing** | Pytest, FastAPI TestClient |
| **DevOps & Infra** | Docker, Docker Compose, GitHub Actions CI/CD, Render Cloud Spec |

---

## 📂 Project Structure

```
OutfitStyleAdvisor/
├── backend/
│   ├── app/
│   │   ├── main.py               # FastAPI entry point & lifespan DB init
│   │   ├── auth.py               # JWT encoding/decoding & security dependencies
│   │   ├── db.py                 # Async SQLAlchemy 2.0 engine & sessionmaker
│   │   ├── models.py             # User and OutfitAnalysis database models
│   │   ├── schemas.py            # Pydantic v2 validation models
│   │   ├── routers/
│   │   │   ├── auth.py           # Register, Login, Me REST endpoints
│   │   │   └── history.py        # Saved outfit history REST endpoints
│   │   ├── vision/
│   │   │   ├── garment_classifier.py
│   │   │   └── color_analyzer.py
│   │   └── llm/
│   │       └── stylist.py        # AI style report & next style evolution
│   ├── tests/                    # Pytest suite
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── AuthModal.jsx             # JWT Login & Registration Modal
│   │   │   ├── OutfitHistoryDrawer.jsx   # Slide-over Saved History panel
│   │   │   ├── LiveShowcaseBar.jsx       # Next Outfit Carousel Bar
│   │   │   ├── NextOutfitStyleSection.jsx # Next Outfit Style Variations
│   │   │   ├── ImageUploader.jsx
│   │   │   ├── ColorPalette.jsx
│   │   │   └── StyleReport.jsx
│   │   └── utils/
│   │       └── sampleGenerator.js        # Canvas outfit generator
│   └── package.json
├── docker-compose.yml
├── render.yaml
└── .github/workflows/ci.yml
```

---

## 🚀 Getting Started

### Option A — Docker Compose (Recommended)

```bash
docker-compose up --build
```
- **Frontend Dashboard**: http://localhost:5173
- **Backend Swagger Docs**: http://localhost:8000/docs

### Option B — Run Locally

**1. Backend**:
```bash
cd backend
uv venv venv --python 3.12
venv\Scripts\activate
uv pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**2. Frontend**:
```bash
cd frontend
npm install
npm run dev
```
Then open http://localhost:5173.

---

## 🧪 Running Automated Tests

```bash
cd backend
venv\Scripts\pytest -v
```
