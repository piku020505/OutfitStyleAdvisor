<div align="center">

# 👗 Outfit Style Advisor — Enterprise AI Platform

### *Vision-Powered Outfit Analysis, K-Means Color Theory & Grounded AI Next Style Recommendations*

[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.4-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)](https://pytorch.org)
[![HuggingFace](https://img.shields.io/badge/HuggingFace-Transformers-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black)](https://huggingface.co)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0_Async-D71F00?style=for-the-badge&logo=sqlalchemy&logoColor=white)](https://sqlalchemy.org)
[![Docker](https://img.shields.io/badge/Docker-Containers-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com)
[![CI/CD](https://img.shields.io/badge/GitHub_Actions-CI-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/piku020505/OutfitStyleAdvisor/actions)

<p align="center">
  <a href="#-key-features">Key Features</a> •
  <a href="#-application-showcase">Application Showcase</a> •
  <a href="#-system-architecture">Architecture</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-api-documentation">API Docs</a>
</p>

---

</div>

## 📸 Application Showcase

### 1. 🧥 Live Outfit Showcase & Vision AI Dashboard
> Real-time garment classification using HuggingFace **CLIP zero-shot**, Scikit-Learn **K-Means dominant color extraction**, and AI-generated style analysis.

<div align="center">
  <img src="assets/dashboard_showcase.png" alt="Outfit Style Advisor Dashboard" width="100%" style="border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.12);" />
</div>

<br/>

### 2. ✨ Next Outfit Style Variations & Evolution Studio
> Interactive **"What to Wear Next"** recommendation engine providing 4 grounded outfit transition concepts with color harmony swatches and key garment pairing suggestions.

<div align="center">
  <img src="assets/next_style_modal.png" alt="Next Outfit Style Modal Preview" width="85%" style="border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.12);" />
</div>

<br/>

### 3. 🔒 User Auth Session & Saved Outfit History Drawer
> Complete OAuth2 **Bearer JWT Authentication** (`bcrypt` password hashing) with async database persistence (**SQLAlchemy 2.0**) for auto-saving user analysis history.

<div align="center">
  <img src="assets/history_drawer.png" alt="Saved Outfit History Drawer" width="85%" style="border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.12);" />
</div>

---

## 🌟 Key Features

- 👁️ **Swappable Computer Vision Engine**: Primary zero-shot CLIP classification (`openai/clip-vit-base-patch32`) paired with an offline edge-density heuristic engine fallback for air-gapped or CI environments.
- 🎨 **K-Means Color Theory Processor**: Uses Scikit-Learn k-means clustering over RGB pixel arrays to compute dominant color distributions and map them to curated fashion palettes.
- ✨ **Grounded LLM Style Generator**: Integrates Anthropic Claude API / rule-based fashion engine to generate structured styling reports strictly grounded in detected attributes.
- ⏭️ **"What to Wear Next" Evolution Engine**: Generates 4 tailored outfit transition variations (*Evening Glamour*, *Urban Streetwear*, *Monochrome Minimalist*, *Resort Warm-Toned*).
- 🔒 **Enterprise JWT Authentication**: Full user signup & login flow using `passlib` bcrypt hashing and signed JWT bearer tokens (`/api/auth/register`, `/api/auth/login`, `/api/auth/me`).
- 💾 **Async Database Layer**: Built on **SQLAlchemy 2.0 Async** (`aiosqlite` SQLite for local zero-config, `asyncpg` PostgreSQL for production database clusters).
- 🗂️ **Saved Outfit History Drawer**: Slide-over drawer allowing authenticated users to browse past outfit analyses, reload reports with 1-click, or manage saved items.
- ⏭️ **Live Outfit Carousel & Auto Stream**: Interactive preset bar featuring 6 high-definition canvas outfit presets, 1-click **Next Outfit Style** rotation, and auto-play showcase timer.
- 🐳 **Multi-Stage Docker Architecture**: `docker-compose.yml` orchestrating PostgreSQL database, FastAPI async application server, and Vite React frontend.
- 🔄 **Production CI/CD Pipeline**: GitHub Actions workflow running backend Pytest suites, verifying frontend production compilation, and validating container builds.

---

## 🧠 System Architecture

```
                       +-----------------------------------+
                       |        Outfit Photo / Preset      |
                       +-----------------------------------+
                                         |
                                         v
               +---------------------------------------------------+
               |               FastAPI Async REST API              |
               +---------------------------------------------------+
                    |                                  |
                    v                                  v
+------------------------------------+   +------------------------------------+
|        Vision Pipeline Layer       |   |       Color Analyzer Engine        |
|  - Primary: CLIP Zero-Shot (Torch) |   |  - Scikit-Learn K-Means (RGB)      |
|  - Fallback: Heuristic Classifier  |   |  - Curated Palette Mapping         |
+------------------------------------+   +------------------------------------+
                    |                                  |
                    +----------------+-----------------+
                                     |
                                     v
                       +---------------------------+
                       |   Gen AI Styling Layer    |
                       |  - Anthropic Claude API   |
                       |  - Grounded Prompting     |
                       |  - Next Style Evolution   |
                       +---------------------------+
                                     |
                                     v
                       +---------------------------+
                       |    SQLAlchemy 2.0 Async   |
                       | (SQLite / PostgreSQL DB)  |
                       +---------------------------+
                                     |
                                     v
                       +---------------------------+
                       |  Vite React 18 Dashboard  |
                       +---------------------------+
```

---

## 🛠️ Tech Stack

| Layer | Technologies & Libraries |
|---|---|
| **Frontend UI** | React 18, Vite, Tailwind CSS, Lucide React Icons |
| **Backend API** | FastAPI 0.115, Pydantic v2, Python 3.12 |
| **Database & ORM** | SQLAlchemy 2.0 Async, SQLite (`aiosqlite`), PostgreSQL (`asyncpg`) |
| **Authentication** | OAuth2 Bearer, PyJWT, Passlib (`bcrypt`), Email-Validator |
| **Vision & ML** | HuggingFace Transformers, PyTorch, OpenAI CLIP (`clip-vit-base-patch32`), Pillow, OpenCV |
| **Color Processing** | Scikit-Learn K-Means Clustering, NumPy, Webcolors |
| **Generative AI** | Anthropic Claude API (`claude-sonnet-4-6`), JSON-constrained Prompting |
| **Testing** | Pytest, FastAPI TestClient |
| **DevOps & Cloud** | Docker, Docker Compose, GitHub Actions CI/CD, Render Spec |

---

## 🔌 API Documentation Reference

| Endpoint | Method | Auth Required | Description |
|---|---|---|---|
| `/` | `GET` | No | Service status and API version |
| `/api/health` | `GET` | No | System health, vision backend, & DB status |
| `/api/auth/register` | `POST` | No | Register a new user account & return JWT token |
| `/api/auth/login` | `POST` | No | Authenticate user credentials & return JWT token |
| `/api/auth/me` | `GET` | Yes | Get authenticated user profile details |
| `/api/analyze` | `POST` | Optional | Analyze outfit photo; auto-saves history if authenticated |
| `/api/history` | `GET` | Yes | Retrieve user's saved outfit style analyses |
| `/api/history/{id}` | `DELETE` | Yes | Delete a saved outfit analysis entry |

---

## 🚀 Quickstart Guide

### Option A — Docker Compose (Recommended)

Run the full stack (PostgreSQL + FastAPI Backend + React Frontend) with a single command:

```bash
docker-compose up --build
```
- **Frontend Dashboard**: `http://localhost:5173`
- **Backend Interactive Docs**: `http://localhost:8000/docs`

---

### Option B — Run Locally

#### 1. Backend Setup
```bash
cd backend

# Create virtual environment
uv venv venv --python 3.12
venv\Scripts\activate

# Install dependencies
uv pip install -r requirements.txt

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```

#### 2. Frontend Setup
```bash
cd frontend

# Install Node packages
npm install

# Start Vite dev server
npm run dev
```

Open **`http://localhost:5173`** in your browser.

---

## 🧪 Running Automated Tests

```bash
cd backend
venv\Scripts\pytest -v
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
