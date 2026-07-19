# StadiumPilot AI 🏟️

> Enterprise-grade AI platform for FIFA World Cup 2026 — stadium operations and fan experience, powered by Groq.

![License](https://img.shields.io/badge/license-MIT-blue)
![Python](https://img.shields.io/badge/python-3.11+-blue)
![React](https://img.shields.io/badge/react-18-blue)
![FastAPI](https://img.shields.io/badge/fastapi-latest-green)
![Groq](https://img.shields.io/badge/Groq-AI-orange)

---

## 📖 Project Overview

**StadiumPilot AI** is an enterprise AI operations dashboard built for the FIFA World Cup 2026 GenAI Challenge. It uses **Groq** to deliver intelligent, context-aware assistance for:

- **Fans** — Navigate the stadium, find food, restrooms, parking, and get real-time crowd info
- **Organizers** — AI-powered operational recommendations for crowd management and emergency response
- **Volunteers** — Multilingual support and coordination tools
- **Security Staff** — Incident management and risk assessment
- **Venue Managers** — Real-time analytics, KPIs, and predictive intelligence

---

## 🏗️ Architecture

StadiumPilot AI follows **Clean Architecture** principles:

```
┌─────────────────────────────────────────────┐
│                  Frontend                    │
│         React 18 + Vite + Tailwind          │
├─────────────────────────────────────────────┤
│                  REST API                    │
│        FastAPI Routes (API Layer)           │
├─────────────────────────────────────────────┤
│               Services Layer                 │
│   Decision Engine │ Navigation │ Operations  │
│   Transport │ Accessibility │ Groq         │
├─────────────────────────────────────────────┤
│              Core / Prompts                  │
│     Config │ Prompt Templates │ Models       │
├─────────────────────────────────────────────┤
│                 Data Layer                   │
│     stadium.json │ crowd.json │ transport    │
└─────────────────────────────────────────────┘
```

All business logic lives in the **Services** layer — API routes are thin controllers.

### 🧠 Hybrid AI Architecture (Intent Router & Context Reduction)

To achieve maximum performance and avoid hitting rate limits, StadiumPilot AI implements a **Hybrid AI Architecture**:

1. **Intent Detection:** User queries are classified (e.g., navigation, food, medical).
2. **Fast Factual Response (Bypass):** If the query asks for simple facts (e.g., "Where is Gate A1?"), the system bypasses the LLM entirely and serves an immediate response from local JSON.
3. **Context Reduction:** If Groq is needed, the system only injects relevant JSON context based on the detected intent (e.g., only `food_courts` data for a food query), significantly reducing token usage and latency.

### 🤖 Prompt Engineering

The system uses advanced prompt templates with explicit instructions for:
- Markdown formatting and structure
- Concise, actionable responses
- Persona adherence (professional, helpful stadium guide)
- Fallback behaviors (never hallucinating missing data)

---

## 🚀 Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI Stadium Assistant** | Natural language Q&A powered by Groq — gates, food, restrooms, medical, parking |
| 🗺️ **Navigation AI** | Step-by-step wayfinding with walking times, crowd levels, and accessible routes |
| 📊 **Crowd Intelligence** | Real-time zone occupancy, risk levels, hotspots, and AI recommendations |
| ⚙️ **Operations Copilot** | AI-powered action plans for crowd management, emergencies, and resource deployment |
| 🚌 **Transport AI** | Metro, bus, taxi, rideshare, parking — real-time status and AI guidance |
| ♿ **Accessibility** | Wheelchair routes, accessible facilities, medical assistance, volunteer support |
| 🌍 **Multilingual** | Auto-detect and respond in English, Spanish, French, Arabic, Hindi, Japanese |
| 📈 **Dashboard** | Enterprise analytics with KPI cards, charts, alerts, and predictive intelligence |
| 🌙 **Dark Mode** | Professional dark theme with glassmorphism and FIFA-themed gradients |

---

## 🛠️ Tech Stack

### Frontend
- React 18 + Vite
- Tailwind CSS
- React Router v6
- Framer Motion
- Recharts
- React Markdown
- React Icons
- Axios

### Backend
- Python 3.11 + FastAPI
- Groq API (`groq`)
- Pydantic v2
- Python-dotenv
- Uvicorn

### Deployment
- Frontend → Vercel (Static)
- Backend → Vercel Python Runtime

---

## 📁 Folder Structure

```
stadiumpilot-ai/
├── backend/
│   ├── app/
│   │   ├── api/              # FastAPI route handlers
│   │   ├── core/             # Config, prompts
│   │   ├── data/             # JSON datasets
│   │   ├── models/           # Pydantic models
│   │   ├── schemas/          # Request/response schemas
│   │   ├── services/         # Business logic + Groq
│   │   ├── utils/            # Helpers, logger
│   │   └── main.py           # FastAPI entry point
│   ├── tests/
│   ├── requirements.txt
│   ├── vercel.json
│   └── .env.example
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Route pages
│   │   ├── layouts/          # Page layouts
│   │   ├── context/          # React Context
│   │   ├── hooks/            # Custom hooks
│   │   ├── services/         # API service
│   │   ├── utils/            # Constants
│   │   └── styles/           # Global CSS
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── vercel.json
├── README.md
├── LICENSE
└── .gitignore
```

---

## ⚡ Installation

### Prerequisites
- Node.js 18+
- Python 3.11+
- Groq API key ([Get one here](https://console.groq.com/keys))

### Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your GROQ_API_KEY

# Run server
uvicorn app.main:app --reload --port 8000
```

### ⚙️ Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GROQ_API_KEY` | **Yes** | None | Your Groq Cloud API key |
| `GROQ_MODEL` | No | `llama3-70b-8192` | The specific Groq LLM to use |
| `VITE_API_URL` | No | `http://127.0.0.1:8000` | The backend URL for the frontend |
| `APP_NAME` | No | `StadiumPilot AI` | Application title |

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run dev server
npm run dev
```

The frontend runs at `http://localhost:5173` and proxies API calls to `http://localhost:8000`.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/stadium` | Stadium dataset |
| `GET` | `/api/crowd` | Crowd intelligence data |
| `GET` | `/api/transport` | Transport data |
| `POST` | `/api/chat` | AI assistant chat |
| `POST` | `/api/navigate` | Navigation directions |
| `POST` | `/api/operations` | Operational recommendations |
| `POST` | `/api/transport/ask` | Transport AI guidance |
| `POST` | `/api/accessibility` | Accessibility support |

### Example — Chat

```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Where is Gate B12?"}'
```

---

## 🚀 Deployment

### Backend (Vercel Python)
```bash
cd backend
vercel --prod
```

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

Set `VITE_API_URL` environment variable in your frontend Vercel project to point to your deployed backend URL.

---

## 🔮 Future Scope

- Real-time WebSocket updates for crowd data
- Computer vision integration for crowd density estimation
- Push notifications for emergency alerts
- Interactive stadium map with Leaflet markers
- Voice assistant integration
- Ticket scanning and seat finder
- Multi-venue support for all FIFA 2026 stadiums
- Historical analytics and reporting

---

## 🤝 Contribution Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](./LICENSE) for details.

---

<div align="center">
  <p>Built with ❤️ for the <strong>FIFA World Cup 2026 GenAI Challenge</strong></p>
  <p>Powered by <strong>Groq</strong> · <strong>React</strong> · <strong>FastAPI</strong></p>
</div>
