# Backend — SimpleTask

Layanan RESTful API task management berbasis Python 3.9+, FastAPI, SQLModel, dan PostgreSQL 17.

---

## Daftar Library

| Library | Versi | Fungsi |
| :--- | :--- | :--- |
| `fastapi` | `>=0.115,<1.0` | Framework web asynchronous REST API dengan validasi deklaratif dan auto-generated OpenAPI/Swagger docs di `/docs`. |
| `uvicorn[standard]` | `>=0.30,<1.0` | Server web ASGI berkinerja tinggi berbasis `uvloop` dan `httptools` untuk menjalankan aplikasi FastAPI. |
| `sqlmodel` | `>=0.0.22,<1.0` | ORM yang menggabungkan SQLAlchemy Core/ORM dan Pydantic untuk pemetaan model ke tabel database. |
| `psycopg[binary]` | `>=3.2,<4.0` | Driver PostgreSQL generasi terbaru (Psycopg 3) dengan binary C extensions dan connection pooling. |
| `pydantic-settings` | `>=2.6,<3.0` | Pengelolaan dan validasi variabel lingkungan (`.env`) berbasis kelas secara *type-safe*. |
| `python-dotenv` | `>=1.0,<2.0` | Utilitas pembaca berkas `.env` ke dalam environment sistem Python. |
| `pytest` | `>=8,<10` | Test runner standar untuk mengeksekusi unit dan integration test suite. |
| `httpx` | `>=0.27,<1.0` | HTTP client async yang digunakan oleh TestClient FastAPI untuk pengujian rute API. |
| `ruff` | `>=0.11,<1.0` | Linter dan code formatter Python berbasis Rust yang cepat dan terpadu. |

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
