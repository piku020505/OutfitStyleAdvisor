# Outfit Style Advisor

Upload a photo of an outfit and get back a **structured garment/style analysis**
plus an **AI-generated styling report**: best occasions to wear it, pairing
suggestions, and color-theory tips — all grounded in what the vision pipeline
actually detected in the photo.

Built as a full-stack, deployable application (not a notebook demo): React
frontend, FastAPI backend, a swappable computer-vision classification layer,
and a Gen AI recommendation layer powered by the Claude API.

## How it works

```
 Outfit photo
      |
      v
+-------------------+       +----------------------+
|  Vision pipeline   |       |  Color analyzer       |
|  (CLIP zero-shot   | ----> |  (k-means clustering  |
|   classification,  |       |   + fashion palette   |
|   auto-fallback to |       |   name mapping)        |
|   offline heuristic|       +----------------------+
|   if no GPU/model) |
+-------------------+
      |
      v
 garment type, pattern, style, dominant colors
      |
      v
+---------------------------+
|  Gen AI styling layer      |
|  (Claude API, grounded     |
|   prompt -- only reasons   |
|   about detected attrs)    |
+---------------------------+
      |
      v
 headline + analysis + occasions + pairing tips + color tip
      |
      v
   React dashboard
```

## Tech stack

| Layer            | Technology |
|-------------------|------------|
| Frontend           | React 18, Vite, Tailwind CSS, lucide-react |
| Backend            | FastAPI, Pydantic |
| Vision (primary)   | CLIP (`openai/clip-vit-base-patch32`) zero-shot image/text classification via HuggingFace Transformers |
| Vision (fallback)  | Offline heuristic classifier (edge density, aspect ratio, color variance) — keeps the app fully runnable with no model download, e.g. in CI or air-gapped environments |
| Color analysis     | scikit-learn k-means clustering over pixel RGB values, mapped to a curated fashion color palette |
| Gen AI              | Anthropic Claude API, JSON-constrained prompting grounded strictly in detected attributes |
| Testing            | pytest, FastAPI TestClient (7 automated tests) |
| Infra              | Docker, docker-compose, GitHub Actions CI |

## Why two vision backends?

Zero-shot CLIP classification is the "real" production-grade approach — no
labeled training data required, and it generalizes to garment types it's
never explicitly seen. But it needs a ~600MB model download on first run.
The app auto-detects whether `transformers`/`torch` and the pretrained
weights are available and transparently falls back to a lightweight,
dependency-free heuristic classifier if not — so the entire pipeline
(upload → vision → LLM → UI) is always demoable, including offline.

The active backend is always shown in the UI footer and returned in the API
response (`vision_backend` field), so it's never ambiguous which one
produced a given result.

## Project structure

```
OutfitStyleAdvisor/
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI app & /api/analyze endpoint
│   │   ├── schemas.py               # Pydantic response models
│   │   ├── vision/
│   │   │   ├── garment_classifier.py  # CLIP zero-shot + heuristic fallback
│   │   │   └── color_analyzer.py      # k-means dominant color extraction
│   │   └── llm/
│   │       └── stylist.py           # Claude-powered style report generation
│   ├── tests/                       # pytest suite (7 tests)
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── components/
│   │       ├── ImageUploader.jsx
│   │       ├── ColorPalette.jsx
│   │       └── StyleReport.jsx
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
├── .github/workflows/ci.yml
└── documentation/
    └── resume_bullets.md
```

## Getting started

### Option A — Docker (recommended)

```bash
cp backend/.env.example backend/.env   # add your ANTHROPIC_API_KEY (optional)
docker-compose up --build
```

- Frontend: http://localhost:5173
- Backend docs: http://localhost:8000/docs

### Option B — Run locally

**Backend**
```bash
cd backend
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env   # optional: add ANTHROPIC_API_KEY
uvicorn app.main:app --reload --port 8000
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:5173.

> Note: on first run with `transformers`/`torch` installed, the CLIP model
> weights (~600MB) download automatically from HuggingFace. Without internet
> access or those packages installed, the app automatically uses the
> offline heuristic vision backend instead — no configuration needed.

## Running tests

```bash
cd backend
pytest -v
```

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | No | Enables Gen AI style report generation via Claude. Without it, a clearly-labeled rule-based report is returned instead. |

## Possible extensions

- Fine-tune a garment classifier on a labeled fashion dataset (e.g. DeepFashion) instead of relying purely on zero-shot CLIP
- Add a "wardrobe" mode: analyze multiple items and suggest full outfit combinations
- Persist analysis history per user with a database layer
- Add outfit similarity search (find visually similar looks) using CLIP image embeddings
