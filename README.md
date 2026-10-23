# Simple Task/Project Tracker

A full-stack, accessible CRUD application built as a technical assessment deliverable for the **Full-Stack Developer Intern (Python + React)** role.

The application allows users to create tasks, track progress across distinct statuses (`Todo`, `In Progress`, `Done`), edit details in-place, filter tasks, and delete completed deliverables without page reloads. Data is persistently stored in **PostgreSQL 17** via **SQLModel** and **FastAPI**, with a responsive **React (Vite)** frontend styled using a warm editorial design system inspired by GetDesign tokens.

---

## Features

- **Full-Stack CRUD:** Create, list, partially update (title, description, or status), and delete tasks.
- **Persistent Storage:** Backed by PostgreSQL 17 running in Docker/OrbStack.
- **Automatic Initialization:** Database tables and constraints are created automatically upon backend startup via FastAPI lifespan.
- **Zero Page Reload:** Reactive UI updates state immediately upon server confirmation.
- **Strict Validation:** Non-empty trimmed title requirement, character limits (120 chars for title, 2000 chars for description), and strict enum enforcement for status (`Todo`, `In Progress`, `Done`).
- **Resilient Error Handling:** Prevents double-submission, displays user-friendly field-level validation errors, and handles connection interruptions gracefully.
- **Clean Design System:** Warm editorial aesthetic (`#F3F0EE` Canvas Cream, `#141413` Ink Black, stadium pill buttons, accessible WCAG 2.2 AA contrast) inspired by the GetDesign Mastercard reference without proprietary branding.
- **Accessible & Responsive:** Semantic HTML, screen-reader labels, visible keyboard focus rings, and seamless layout adaptation from 360px mobile viewports to desktop.

---

## Tech Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | React 19 + Vite + Axios | JavaScript template, Axios HTTP client with baseURL & error normalization |
| **Styling** | Vanilla CSS + Design Tokens | Custom properties (`:root`), stadium radii, responsive media queries |
| **Frontend Tests** | Vitest + React Testing Library | DOM testing with `@testing-library/jest-dom` and `jsdom` |
| **Backend** | Python 3.9+ / FastAPI | Async framework with REST routing and dependency injection |
| **ORM & Database Driver** | SQLModel + Psycopg 3 | Python models mapped to PostgreSQL tables via SQLAlchemy core |
| **Validation & Settings** | Pydantic v2 + Pydantic Settings | Explicit schemas, field validators, `.env` file loading |
| **Backend Tests & Lint** | pytest + HTTPX / TestClient, Ruff | Unit tests, PostgreSQL integration tests, formatting checks |
| **Database** | PostgreSQL 17 (Alpine) | Containerized via Docker Compose / OrbStack with named volume |

---

## Prerequisites

Ensure the following tools are installed on your machine:
- **Node.js**: v20+ / v22 LTS (tested on v25.7) & `npm` (v11+)
- **Python**: 3.9+ (3.12 recommended; tested on 3.9.6)
- **Docker & Docker Compose**: Docker Engine / OrbStack running on your system

---

## Getting Started

### 1. Clone & Setup Environment Files

```bash
git clone <repository-url>
cd simpletask

# Copy backend environment template
cp backend/.env.example backend/.env

# Copy frontend environment template
cp frontend/.env.example frontend/.env
```

> **Note:** The default credentials in `backend/.env` work out-of-the-box for local development with the provided `compose.yaml`.

---

### 2. Start PostgreSQL Database

From the project root:

```bash
docker compose --env-file backend/.env up -d db
```

Verify that the database container is healthy:

```bash
docker compose --env-file backend/.env ps
```

---

### 3. Setup and Start Backend API

Navigate to the `backend/` directory, create a virtual environment, install dependencies, and start the FastAPI server:

```bash
cd backend

# Create and activate Python virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Upgrade pip and install dependencies
python -m pip install -r requirements-dev.txt

# Start FastAPI development server
uvicorn app.main:app --reload --port 8000
```

- **API Base URL:** `http://localhost:8000`
- **Interactive OpenAPI Documentation:** `http://localhost:8000/docs`
- **Health Check Probe:** `http://localhost:8000/health`

---

### 4. Setup and Start Frontend Application

In a separate terminal window, navigate to the `frontend/` directory, install dependencies, and start the Vite dev server:

```bash
cd frontend

# Install Node dependencies
npm install

# Start Vite dev server
npm run dev
```

- **Frontend Application URL:** `http://localhost:5173`

---

## API Contract

All task routes are prefixed under `/tasks`:

| Method | Endpoint | Description | Status Code |
|---|---|---|---|
| `GET` | `/tasks` | List all tasks ordered deterministically by ID ascending | `200 OK` |
| `POST` | `/tasks` | Create a new task (body: `TaskCreate`) | `201 Created` |
| `PUT` | `/tasks/{id}` | Partially update task fields (body: `TaskUpdate`) | `200 OK`, `404 Not Found` |
| `DELETE` | `/tasks/{id}` | Delete task by ID | `204 No Content`, `404 Not Found` |

### Sample Schemas

#### Request: Create Task (`POST /tasks`)
```json
{
  "title": "Build technical assessment deliverable",
  "description": "Implement backend and frontend with automated tests",
  "status": "Todo"
}
```

#### Request: Partial Update (`PUT /tasks/{id}`)
```json
{
  "status": "In Progress"
}
```

#### Response: Task Object
```json
{
  "id": 1,
  "title": "Build technical assessment deliverable",
  "description": "Implement backend and frontend with automated tests",
  "status": "In Progress"
}
```

---

## Automated Testing & Quality Checks

### Backend Tests & Linting
Run from the `backend/` directory with `.venv` active:

```bash
cd backend
source .venv/bin/activate

# Run full test suite (unit + PostgreSQL integration tests)
python -m pytest tests/ -v

# Run code style and lint check with Ruff
ruff check .

# Check code formatting with Ruff
ruff format --check .
```

*Results:* **42 tests passed** (schema validation, check constraints, database session lifecycle, error handling, and CRUD endpoints).

### Frontend Tests & Linting
Run from the `frontend/` directory:

```bash
cd frontend

# Run component and workflow tests with Vitest
npm test

# Run ESLint check
npm run lint

# Verify production bundle build
npm run build
```

*Results:* **9 tests passed** (initial load, empty state, form validation, mutation without reload, quick status updates, in-place editing, filtering tabs, deletion confirmation, and network error handling).

---

## Architecture & Design Decisions

### 1. Database Model vs. API Schemas
- **`app/models/task.py`** defines the SQLModel table schema with PostgreSQL-level check constraints (`length(trim(title)) > 0` and status membership).
- **`app/schemas/task.py`** defines separate Pydantic models for incoming requests (`TaskCreate`, `TaskUpdate`) and responses (`TaskRead`). This prevents ORM internals or database state from leaking into API contracts and allows granular input validation (e.g. rejecting explicit `null` on required fields).

### 2. Session Lifecycle Dependency Injection
- Database sessions are created per-request via FastAPI's `Depends(get_session)`.
- Using Python's `yield`, each session is cleanly closed when the HTTP response finishes, preventing connection leaks.

### 3. Startup Table Initialization
- `SQLModel.metadata.create_all(engine)` is executed inside FastAPI's async `lifespan` handler upon application startup.
- *Trade-off:* While optimal for rapid setup in single-entity assessments without manual migration scripts, production applications with evolving schemas would use Alembic for version-controlled schema migrations.

### 4. CORS Whitelisting
- CORS is restricted to the development origin (`http://localhost:5173`) read from `settings.frontend_origin`, rather than using an insecure wildcard `*`.

### 5. UI Design Tokens
- Design tokens are specified as CSS custom properties in `frontend/src/index.css`.
- The interface adapts the warm stone and cream palette (`#F3F0EE`), stadium pill contours, and clear typography from the GetDesign Mastercard reference while respecting brand neutrality (no proprietary logos or brand marks).

---

## Stopping the Database

To stop the PostgreSQL container without deleting stored task data:

```bash
docker compose --env-file backend/.env down
```

To stop the container and completely reset the database volume:

```bash
docker compose --env-file backend/.env down -v
```

---

## License

This project was developed for the GLI Technical Assessment.
