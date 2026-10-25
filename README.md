# SimpleTask

Aplikasi task management full-stack berbasis FastAPI (Python 3.9+) dan React 19 (Vite) dengan database persisten PostgreSQL 17.

## Tech Stack

| Layer            | Teknologi                       | Keterangan                                                                                              |
| :--------------- | :------------------------------ | :------------------------------------------------------------------------------------------------------ |
| **Frontend**     | React 19, Vite, Axios           | Single Page Application (SPA), Pure Presenter Component, Axios Client dengan normalisasi error terpusat |
| **Styling**      | Tailwind CSS v4, CSS Tokens     | Utility-first styling framework v4, transisi form accordion, dan layout Kanban responsif                |
| **Backend**      | Python 3.9+, FastAPI            | Framework web async berkecepatan tinggi dengan dokumentasi OpenAPI/Swagger otomatis di `/docs`          |
| **ORM & Driver** | SQLModel, Psycopg 3             | Abstraksi model database berbasis SQLAlchemy Core/ORM dan Pydantic v2 dengan connection pooling         |
| **Database**     | PostgreSQL 17 Alpine            | Database relasional persisten via Docker Compose (OrbStack / Docker Engine)                             |
| **Testing**      | Vitest, Testing Library, pytest | Test suite otomatis: 38 frontend tests dan 42 backend tests                                             |
| **Linter**       | ESLint, Ruff                    | Pemeliharaan standar kode statis JavaScript dan Python                                                  |

---

## Prasyarat Sistem

Pastikan perangkat Anda telah terpasang:

- **Node.js**: v20+ / v22 LTS & `npm`
- **Python**: 3.9+ (disarankan 3.11 atau 3.12)
- **Docker & Docker Compose**: Docker Engine atau OrbStack

---

## Panduan Memulai Cepat (Quickstart)

### 1. Salin Berkas Konfigurasi Lingkungan

```bash
# Salin template environment backend
cp backend/.env.example backend/.env

# Salin template environment frontend
cp frontend/.env.example frontend/.env
```

> Kredensial default pada `backend/.env` sudah disesuaikan agar langsung berfungsi dengan konfigurasi `compose.yaml`.

---

### 2. Jalankan Database PostgreSQL

Dari root direktori project:

```bash
docker compose --env-file backend/.env up -d db
```

Periksa status container untuk memastikan database berstatus healthy:

```bash
docker compose --env-file backend/.env ps
```

---

### 3. Jalankan Backend API Service

Buka terminal dan navigasikan ke folder `backend`:

```bash
cd backend

# Buat dan aktifkan virtual environment Python
python3 -m venv .venv
source .venv/bin/activate

# Install dependensi
pip install -r requirements-dev.txt

# Jalankan server backend FastAPI
uvicorn app.main:app --reload --port 8000
```

- **Backend API URL:** `http://localhost:8000`
- **Dokumentasi Swagger UI:** `http://localhost:8000/docs`
- **Health Check Endpoint:** `http://localhost:8000/health`

---

### 4. Jalankan Frontend Client

Buka terminal baru dan navigasikan ke folder `frontend`:

```bash
cd frontend

# Install dependensi Node
npm install

# Jalankan Vite development server
npm run dev
```

- **Frontend Application URL:** `http://localhost:5173`

---

## Kontrak REST API

Seluruh endpoint tugas berada di bawah rute `/tasks`:

| Method   | Endpoint      | Deskripsi                                                        | Status Code                       |
| :------- | :------------ | :--------------------------------------------------------------- | :-------------------------------- |
| `GET`    | `/tasks`      | Mengambil seluruh daftar task (terurut ascending berdasarkan ID) | `200 OK`                          |
| `POST`   | `/tasks`      | Membuat task baru (payload: `TaskCreate`)                        | `201 Created`                     |
| `PUT`    | `/tasks/{id}` | Memperbarui field task secara parsial (payload: `TaskUpdate`)    | `200 OK`, `404 Not Found`         |
| `DELETE` | `/tasks/{id}` | Menghapus task berdasarkan ID                                    | `204 No Content`, `404 Not Found` |

---

## Pengujian Otomatis & Kualitas Kode

### Backend Tests & Linting

Jalankan dari direktori `backend/` dengan virtual environment aktif:

```bash
cd backend
source .venv/bin/activate

# Menjalankan seluruh test suite (42 tests)
pytest tests/ -v

# Memeriksa standar kode dan format dengan Ruff
ruff check .
ruff format --check .
```

_Status:_ **42 tests passed** (mencakup validasi schema Pydantic, database check constraints, session lifecycle, dan endpoint REST API).

### Frontend Tests & Linting

Jalankan dari direktori `frontend/`:

```bash
cd frontend

# Menjalankan seluruh test suite Vitest (43 tests)
npm test

# Memeriksa linter ESLint
npm run lint

# Memvalidasi hasil build bundle produksi
npm run build
```

_Status:_ **43 tests passed** (mencakup Axios client, hook `useTasks`, hook `useTaskCard`, hook `useToast`, rendering komponen, interaksi form, dan skenario CRUD lengkap di `App.test.jsx`).

---

## Menghentikan Database

Untuk menghentikan container PostgreSQL tanpa menghapus data task:

```bash
docker compose --env-file backend/.env down
```

Untuk menghentikan container sekaligus menghapus volume database (_clean reset_):

```bash
docker compose --env-file backend/.env down -v
```

---

## Dokumentasi Detail Sub-Repositori

Untuk penjelasan mendalam mengenai arsitektur internal, struktur folder, dan library spesifik pada masing-masing layer:

- **Dokumentasi Frontend:** [frontend/README.md](frontend/README.md)
- **Dokumentasi Backend:** [backend/README.md](backend/README.md)
