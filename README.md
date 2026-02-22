# Co-OpFlow

Co-OpFlow is a full-stack collaboration platform where people can discover projects, find teammates, communicate, and build ideas together.

It combines:
- A **FastAPI + MongoDB backend** for authentication, data models, and APIs
- A **React + Tailwind frontend** for browsing, collaboration, messaging, and profile workflows

---

## What the project does

Co-OpFlow helps users:
- Create accounts and manage profiles
- Explore projects and teams
- Join or manage collaboration teams
- Participate in community spaces (forums and events)
- Message other users and receive notifications
- Interact with projects (likes/stars, uploads, details)

It is designed as a single platform for startup ideas, hackathon teams, and passion projects.

---

## Repository structure

```text
vas-original/
├── Backend/     # FastAPI application, MongoDB models/services, tests
└── Frontend/    # React application, pages/components, API client/store
```

### Backend key areas
- `Backend/app/main.py` – FastAPI app setup, routers, startup/shutdown hooks
- `Backend/app/api/` – REST endpoints (`auth`, `users`, `projects`, `teams`, `forums`, `events`, `messages`, `notifications`)
- `Backend/app/services/` – business logic layer
- `Backend/app/models/` – request/response and domain models
- `Backend/tests/` + root test files – backend test suite
- `Backend/docker-compose.yml` – local MongoDB + backend container orchestration

### Frontend key areas
- `Frontend/src/App.jsx` – app router and protected routes
- `Frontend/src/pages/` – top-level pages (Discover, Collaborate, Community, Funding, etc.)
- `Frontend/src/components/` – reusable UI pieces (Navbar, Footer, auth/profile components)
- `Frontend/src/services/api.js` – API communication layer
- `Frontend/src/store/` – Zustand stores (auth/theme)

---

## Tech stack

### Backend
- FastAPI
- MongoDB (Motor async driver)
- JWT authentication
- Pytest (async testing)

### Frontend
- React (Create React App)
- React Router
- Tailwind CSS
- Zustand state management

---

## How it works (high-level flow)

1. User accesses the React app.
2. Frontend calls backend API endpoints under `/api/v1`.
3. Backend validates auth (JWT), processes business logic in services, and reads/writes MongoDB.
4. Frontend renders project/team/community data and handles user interactions (messaging, profile updates, applications, etc.).

Public sections can be browsed, while profile, messages, and personal actions are protected behind authentication.

---

## Local development setup

## 1) Backend

From `Backend/`:

```bash
pip install -r requirements.txt
```

Create `.env` (or use defaults) and ensure MongoDB is running.

Option A: run MongoDB via Docker Compose:

```bash
docker-compose up -d mongodb
```

Run backend:

```bash
python run.py
```

Backend runs on `http://localhost:8000` by default.

Useful backend URLs:
- Swagger docs: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
- Health: `http://localhost:8000/health`

## 2) Frontend

From `Frontend/`:

```bash
npm install
npm start
```

Frontend runs on `http://localhost:3000` by default.

Set API URL in `Frontend/.env` if needed:

```env
REACT_APP_API_BASE_URL=http://localhost:8000/api/v1
```

---

## Running with Docker (backend-focused)

From `Backend/`:

```bash
docker-compose up -d
```

This starts:
- MongoDB
- Backend API

---

## Testing

### Backend tests
From `Backend/`:

```bash
python run_tests.py
```

Or directly:

```bash
pytest
```

### Frontend tests
From `Frontend/`:

```bash
npm test
```

---

## Main product sections (frontend)

- **Discover**: browse projects
- **Collaborate**: teams and collaboration matching
- **Community**: forums and events
- **Funding**: funding-related pages
- **Messages / Notifications / Profile**: authenticated user workflows

---

## Notes

- Current CORS setup in backend is permissive (`allow_origins=["*"]`) and should be restricted in production.
- Default development config uses local MongoDB and local uploads directory.
- The project name has been rebranded to **Co-OpFlow**.

---

## Quick start checklist

1. Start MongoDB (Docker or local)
2. Start backend (`Backend/`)
3. Start frontend (`Frontend/`)
4. Open `http://localhost:3000`
5. Register/login and explore collaboration flows
