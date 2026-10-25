# SimpleTask — Backend API Service

Layanan RESTful API backend berkinerja tinggi untuk aplikasi manajemen tugas (Task Management) yang dibangun menggunakan **Python 3.9+**, **FastAPI**, **SQLModel**, dan **PostgreSQL 17**.

Layanan ini dirancang mengikuti prinsip Clean Architecture, tipe data statis yang ketat (_type hints_), validasi data bertingkat, serta dokumentasi OpenAPI/Swagger interaktif otomatis.

---

## Daftar Library & Dependensi yang Digunakan

### Dependensi Runtime Produksi (`requirements.txt`)

| Library                 | Batasan Versi   | Fungsi & Alasan Penggunaan                                                                                                                                                                                                      |
| :---------------------- | :-------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`fastapi`**           | `>=0.115,<1.0`  | Framework web async Python modern dengan performa setara Node.js dan Go. Menyediakan routing RESTful deklaratif, integrasi OpenAPI/Swagger otomatis di `/docs`, serta sistem Dependency Injection bawaan yang sangat fleksibel. |
| **`uvicorn[standard]`** | `>=0.30,<1.0`   | Server web ASGI (_Asynchronous Server Gateway Interface_) berkecepatan tinggi yang dibangun di atas `uvloop` dan `httptools`. Menjalankan aplikasi FastAPI di lingkungan pengembangan dan produksi.                             |
| **`sqlmodel`**          | `>=0.0.22,<1.0` | ORM modern rancangan pembuat FastAPI yang menggabungkan SQLAlchemy Core/ORM dengan Pydantic. Mengeliminasi redundansi pendefinisian model tabel dan schema validasi tanpa mengorbankan kekuatan query SQLModel/SQLAlchemy.      |
| **`psycopg[binary]`**   | `>=3.2,<4.0`    | Driver/adapter resmi PostgreSQL generasi terbaru untuk Python (Psycopg 3). Menyediakan performa native binary C, dukungan koneksi pooling, dan kesiapan penuh untuk async I/O.                                                  |
| **`pydantic-settings`** | `>=2.6,<3.0`    | Modul manajemen konfigurasi aplikasi berbasis kelas. Membaca dan memvalidasi variabel lingkungan dari file `.env` dengan tipe data yang ketat (_type-safe_).                                                                    |
| **`python-dotenv`**     | `>=1.0,<2.0`    | Utilitas pembaca berkas konfigurasi `.env` ke dalam environment sistem Python secara otomatis saat aplikasi dimuat.                                                                                                             |

### Dependensi Pengembangan & Pengujian (`requirements-dev.txt`)

| Library      | Batasan Versi | Fungsi & Alasan Penggunaan                                                                                                                                                                                              |
| :----------- | :------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`pytest`** | `>=8,<10`     | Framework pengujian standar industri Python yang sangat ekspresif, mendukung fixture modular, dan pelaporan eksekusi tes yang mendalam.                                                                                 |
| **`httpx`**  | `>=0.27,<1.0` | HTTP client modern berbasis async yang digunakan oleh `TestClient` FastAPI untuk mensimulasikan panggilan REST API pada test suite tanpa perlu menjalankan port jaringan fisik.                                         |
| **`ruff`**   | `>=0.11,<1.0` | Linter dan code formatter berbasis Rust yang bekerja 10-100x lebih cepat dibanding tools Python tradisional. Menggantikan peran Flake8, Black, isort, dan pyupgrade dalam satu konfigurasi terpadu di `pyproject.toml`. |

---

## 📂 Struktur Folder & Fungsi Modul

```text
backend/
├── app/
│   ├── api/                    # Layer presentasi / endpoint REST API
│   │   ├── routes/
│   │   │   └── tasks.py        # Controller endpoint CRUD tasks (/tasks)
│   │   └── __init__.py
│   │
│   ├── core/                   # Konfigurasi inti dan variabel lingkungan
│   │   ├── config.py           # Class Settings berbasis pydantic-settings
│   │   └── __init__.py
│   │
│   ├── db/                     # Koneksi dan siklus hidup database
│   │   ├── session.py          # SQLAlchemy Engine, get_session generator, & inisialisasi tabel
│   │   └── __init__.py
│   │
│   ├── models/                 # Database Entity (Tabel PostgreSQL)
│   │   ├── task.py             # Model tabel Task dengan CheckConstraint & PostgreSQL indexes
│   │   └── __init__.py
│   │
│   ├── schemas/                # Data Transfer Objects (Pydantic v2 DTOs)
│   │   ├── task.py             # Schema TaskCreate, TaskUpdate, TaskRead & validator kustom
│   │   └── __init__.py
│   │
│   ├── services/               # Layer logika bisnis & operasi data terisolasi
│   │   ├── task_service.py     # Logika CRUD database murni (create, list, get, update, delete)
│   │   └── __init__.py
│   │
│   └── main.py                 # Application factory, lifespan event, CORS middleware, router registration
│
├── tests/                      # Test suite otomatis (42 test komprehensif)
│   ├── conftest.py             # Fixture pytest: test database in-memory/isolated & TestClient
│   ├── test_data_layer.py      # Pengujian koneksi DB, check constraints, & session handling
│   ├── test_health.py          # Pengujian endpoint health check (/health)
│   ├── test_task_schemas.py    # Pengujian validasi schema Pydantic (trim, validasi status, karakter)
│   └── test_tasks_api.py       # Pengujian integrasi fungsional penuh HTTP REST endpoints
│
├── .env.example                # Template konfigurasi variabel lingkungan
├── pyproject.toml              # Konfigurasi linting Ruff dan testing pytest
├── requirements.txt            # Dependensi runtime produksi
└── requirements-dev.txt        # Dependensi pengembangan dan pengujian
```

---

## 🏛️ Mengapa Memilih Pendekatan Arsitektur Ini?

### 1. Pola Berlapis (Layered Clean Architecture: Route ➔ Service ➔ Data)

- **Router Ramping (_Thin Controllers_):** File `app/api/routes/tasks.py` hanya bertugas menerima HTTP request, memvalidasi input via schema DTO, memanggil service layer, dan mengembalikan HTTP status code yang sesuai (misal `201 Created`, `200 OK`, `204 No Content`).
- **Service Layer Terisolasi:** File `app/services/task_service.py` membungkus operasi database. Keuntungannya:
  - Logika bisnis dapat diuji secara terpisah (_unit testable_) tanpa harus mensimulasikan request HTTP.
  - Memudahkan penggantian database atau mekanisme caching di masa depan tanpa mengubah endpoint API.

### 2. Pemisahan Tegas Antara DTO (_Data Transfer Object_) dan Entity Database

Meskipun SQLModel memungkinkan penggunaan kelas yang sama untuk tabel DB dan schema validasi, kami secara eksplisit memisahkan keduanya:

- **`app/models/task.py` (Entity):** Merepresentasikan struktur fisik tabel di PostgreSQL (`id`, `title`, `description`, `status`).
- **`app/schemas/task.py` (DTOs):**
  - **`TaskCreate`:** Hanya mengekspos field yang boleh diinput user saat pembuatan (`title` wajib, `description` opsional, default `status="Todo"`).
  - **`TaskUpdate`:** Mengizinkan pembaruan parsial (_partial update_). Semua field opsional, namun jika dikirimkan tetap divalidasi ketat (judul tidak boleh string kosong atau hanya spasi).
  - **`TaskRead`:** Representasi data keluar terstandarisasi untuk client.
- **Manfaat Keamanan:** Mencegah celah keamanan _Mass Assignment Vulnerability_ (user jahat tidak dapat memanipulasi kolom yang tidak diizinkan seperti `id`).

### 3. Validasi Ganda (_Dual-Layer Data Integrity_)

Data dilindungi pada dua lapis keamanan:

1. **Application Layer (Pydantic v2 Validators):**
   - Membersihkan spasi liar di awal/akhir teks (`strip_whitespace`).
   - Memvalidasi enum status (`Todo`, `In Progress`, `Done`).
   - Membatasi panjang maksimal judul (120 karakter) dan deskripsi (2000 karakter).
2. **Database Layer (PostgreSQL `CheckConstraint`):**
   - Di level tabel PostgreSQL, disematkan constraint `status IN ('Todo', 'In Progress', 'Done')` dan `length(trim(title)) > 0`.
   - **Manfaat:** Menjamin integritas data tetap terjaga 100% bahkan jika data dimanipulasi langsung melalui SQL script di luar aplikasi.

### 4. Dependency Injection untuk Manajemen Sesi Database

- Sesi database (`Session`) disuntikkan (_injected_) ke dalam route handlers menggunakan `Depends(get_session)`.
- **Manfaat:**
  - Siklus hidup sesi database tertutup dengan aman (_deterministic cleanup_). Jika terjadi unhandled error, transaksi otomatis di-_rollback_ dan koneksi dikembalikan ke connection pool, mencegah kebocoran koneksi (_connection leak_).
  - Memudahkan mocking sesi database pada pengujian otomatis tanpa menyentuh database produksi.

### 5. Fail-Fast Configuration

- Melalui `app/core/config.py`, aplikasi akan langsung menolak berjalan (_crash fast_) saat startup jika variabel wajib seperti `DATABASE_URL` belum terdefinisi atau tidak valid, mencegah aplikasi beroperasi dalam status yang salah secara diam-diam (_silent failure_).

---

## 🚀 Perintah yang Tersedia

```bash
# Mengaktifkan virtual environment
source .venv/bin/activate

# Menjalankan local development server dengan hot-reload (http://localhost:8000)
uvicorn app.main:app --reload --port 8000

# Menjalankan seluruh test suite otomatis (42 test)
pytest tests/ -v

# Memeriksa kualitas kode dan formatting dengan Ruff linter
ruff check .

# Melakukan format kode otomatis dengan Ruff
ruff format .
```

Dokumentasi interaktif OpenAPI/Swagger dapat diakses langsung melalui browser di:

- **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)
