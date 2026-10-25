# Backend — SimpleTask

Layanan RESTful API task management berbasis Python 3.9+, FastAPI, SQLModel, dan PostgreSQL 17.

---

## Daftar Library

| Library | Fungsi |
| :--- | :--- |
| `fastapi` | Framework web asynchronous REST API dengan validasi deklaratif dan auto-generated OpenAPI/Swagger docs di `/docs`. |
| `uvicorn[standard]` | Server web ASGI berkinerja tinggi berbasis `uvloop` dan `httptools` untuk menjalankan aplikasi FastAPI. |
| `sqlmodel` | ORM yang menggabungkan SQLAlchemy Core/ORM dan Pydantic untuk pemetaan model ke tabel database. |
| `psycopg[binary]` | Driver PostgreSQL generasi terbaru (Psycopg 3) dengan binary C extensions dan connection pooling. |
| `pydantic-settings` | Pengelolaan dan validasi variabel lingkungan (`.env`) berbasis kelas secara *type-safe*. |
| `python-dotenv` | Utilitas pembaca berkas `.env` ke dalam environment sistem Python. |
| `pytest` | Test runner standar untuk mengeksekusi unit dan integration test suite. |
| `httpx` | HTTP client async yang digunakan oleh TestClient FastAPI untuk pengujian rute API. |
| `ruff` | Linter dan code formatter Python berbasis Rust yang cepat dan terpadu. |

---

## Struktur Folder

```text
backend/
├── app/
│   ├── api/
│   │   ├── routes/
│   │   │   └── tasks.py        # Controller endpoint REST API (/tasks: GET, POST, PUT, DELETE)
│   │   └── __init__.py
│   │
│   ├── core/
│   │   ├── config.py           # Class Settings untuk validasi variabel lingkungan (.env)
│   │   └── __init__.py
│   │
│   ├── db/
│   │   ├── session.py          # SQLAlchemy engine, get_session generator, dan create_db_and_tables
│   │   └── __init__.py
│   │
│   ├── models/
│   │   ├── task.py             # Entity model tabel Task dengan PostgreSQL CheckConstraints
│   │   └── __init__.py
│   │
│   ├── schemas/
│   │   ├── task.py             # Pydantic v2 DTOs (TaskCreate, TaskUpdate, TaskRead) dan custom validators
│   │   └── __init__.py
│   │
│   ├── services/
│   │   ├── task_service.py     # Logika bisnis dan query database murni (CRUD)
│   │   └── __init__.py
│   │
│   └── main.py                 # Application factory, lifespan startup, CORS middleware, registrasi router
│
├── tests/                      # Test suite otomatis (42 tests)
│   ├── conftest.py             # Fixture pytest: test database session terisolasi dan TestClient
│   ├── test_data_layer.py      # Pengujian model database, constraints, dan session generator
│   ├── test_health.py          # Pengujian endpoint health check (/health)
│   ├── test_task_schemas.py    # Pengujian validasi schema Pydantic (trim, validasi status, karakter)
│   └── test_tasks_api.py       # Pengujian integrasi fungsional penuh HTTP REST endpoints
│
├── .env.example                # Template konfigurasi variabel lingkungan
├── pyproject.toml              # Konfigurasi linter Ruff dan test runner pytest
├── requirements.txt            # Dependensi runtime produksi
└── requirements-dev.txt        # Dependensi pengembangan dan pengujian
```

---

## Perintah Eksekusi

```bash
# Mengaktifkan virtual environment
source .venv/bin/activate

# Menjalankan server backend lokal dengan hot-reload (http://localhost:8000)
uvicorn app.main:app --reload --port 8000

# Menjalankan seluruh test suite otomatis (42 tests)
pytest tests/ -v

# Memeriksa standar dan kualitas kode (Ruff linter)
ruff check .

# Melakukan format kode otomatis dengan Ruff
ruff format .
```

Dokumentasi interaktif OpenAPI dapat diakses langsung melalui browser di:
- **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)
