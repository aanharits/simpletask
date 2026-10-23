# Technical Architecture

## 1. Stack

| Layer | Pilihan | Tujuan |
|---|---|---|
| Frontend | React + JavaScript + Vite | UI dan client-side state. |
| Styling | CSS biasa + design tokens dari GetDesign Mastercard reference | Menekan dependency; menjaga palette, typography, spacing, radius, dan state tetap konsisten. Lihat `docs/07-DESIGN-GUIDELINES.md`. |
| HTTP | `fetch` | Komunikasi REST dengan backend. |
| Backend | FastAPI | Routing HTTP, dependency injection, OpenAPI docs. |
| Validation | Pydantic | Validasi request dan serialization response. |
| ORM | SQLModel | Mapping model Python ke tabel PostgreSQL. |
| Driver | Psycopg 3 (`psycopg[binary]`) | Koneksi PostgreSQL untuk SQLAlchemy/SQLModel. |
| Settings | Pydantic Settings + `python-dotenv` | Load konfigurasi dari environment/`.env`. |
| Database | PostgreSQL 17 | Persistence. |
| Local runtime | OrbStack + Docker Compose | Menjalankan PostgreSQL tanpa install server native pada macOS. |
| Backend tests | pytest + HTTPX/TestClient | Unit dan API integration tests. |
| Frontend tests | Vitest + React Testing Library + jsdom | Menguji UI berdasarkan perilaku pengguna. |
| Python lint/format | Ruff | Konsistensi style dan deteksi sejumlah masalah umum. |

## 2. Dependency policy

- Gunakan dependency minimum yang menyelesaikan kebutuhan nyata.
- Jangan tambahkan Redux/Zustand, Axios, Tailwind, Alembic, Celery, atau library lain hanya karena populer. Untuk scope ini, React state + `fetch` + CSS cukup.
- Jangan pindah ke TypeScript tanpa instruksi baru; brief memperbolehkan React dan tidak mensyaratkan TypeScript.
- Pisahkan runtime dependencies dan development dependencies di backend (`requirements.txt`, `requirements-dev.txt`).
- Commit lockfile frontend (`package-lock.json`) agar dependency frontend dapat direproduksi.

## 3. Suggested repository structure

```text
project-root/
├── DESIGN.md                 # Generated from GetDesign preset; source of design tokens
├── docs/
│   ├── 00-START-HERE.md
│   ├── 01-PRD.md
│   ├── 02-AGENT-CONTEXT.md
│   ├── 03-TECHNICAL-ARCHITECTURE.md
│   ├── 04-API-CONTRACT.md
│   ├── 05-TESTING-STRATEGY.md
│   ├── 06-SUBMISSION-CHECKLIST.md
│   ├── 07-DESIGN-GUIDELINES.md
│   └── phases/
├── backend/
│   ├── .venv/                  # ignored by Git
│   ├── .env                    # ignored by Git
│   ├── .env.example
│   ├── requirements.txt
│   ├── requirements-dev.txt
│   ├── pyproject.toml          # Ruff/pytest config, if used
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   └── config.py
│   │   ├── db/
│   │   │   ├── __init__.py
│   │   │   └── session.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── task.py
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   └── task.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   └── task_service.py
│   │   └── api/
│   │       ├── __init__.py
│   │       └── routes/
│   │           ├── __init__.py
│   │           └── tasks.py
│   └── tests/
│       ├── conftest.py
│       ├── test_task_schemas.py
│       └── test_tasks_api.py
├── frontend/
│   ├── .env.example
│   ├── package.json
│   ├── package-lock.json
│   └── src/
│       ├── api/
│       │   └── tasks.js
│       ├── components/
│       │   ├── TaskForm.jsx
│       │   ├── TaskList.jsx
│       │   └── TaskItem.jsx
│       ├── test/
│       │   └── setup.js
│       ├── App.jsx
│       ├── App.css
│       ├── index.css
│       └── main.jsx
├── compose.yaml
├── .gitignore
└── README.md
```

Boleh sedikit disesuaikan jika struktur hasil scaffold Vite sudah ada. Jangan membuat file kosong hanya agar mengikuti diagram; struktur harus mencerminkan code yang benar-benar dipakai.

## 4. Backend responsibilities

- `core/config.py`: baca dan validasi environment configuration.
- `db/session.py`: buat SQLModel engine, `get_session()` dependency, dan helper table initialization.
- `models/task.py`: representasi tabel database saja; jangan mencampur HTTP concerns.
- `schemas/task.py`: request/response schema dan validasi input.
- `services/task_service.py`: operasi data/CRUD yang dapat dipanggil router.
- `api/routes/tasks.py`: definisi endpoint, status code, dan pemetaan kondisi menjadi HTTP response.
- `main.py`: create FastAPI app, configure CORS, include router, dan startup/lifespan.

Untuk satu entitas, service layer cukup. Tidak perlu menambah repository layer kecuali ada alasan yang benar-benar dapat dijelaskan.

## 5. Frontend responsibilities

- `api/tasks.js`: fungsi HTTP untuk list/create/update/delete dan normalisasi error API.
- `components/TaskForm.jsx`: form create atau reusable edit form sesuai desain yang dipilih.
- `components/TaskList.jsx`: menangani empty/list states.
- `components/TaskItem.jsx`: merender satu task, status editor, edit, dan delete actions.
- `App.jsx`: mengoordinasikan load data dan state level halaman.
- CSS: layout responsif, state disabled, focus-visible, error message, dan status badge. Gunakan design tokens yang mengikuti `DESIGN.md` serta `docs/07-DESIGN-GUIDELINES.md`; jangan hard-code palette berbeda per komponen.

Jangan membuat komponen untuk setiap elemen kecil yang tidak punya perilaku/tanggung jawab sendiri. Pemisahan komponen harus membantu readability atau reusability.

## 6. Database model and schemas

Pisahkan model tabel dengan schema request/response. Rekomendasi fields:

- `Task` table: `id`, `title`, `description`, `status`.
- `TaskCreate`: `title`, `description`, `status`.
- `TaskUpdate`: field optional untuk partial update; setidaknya satu field harus diberikan.
- `TaskRead`: `id`, `title`, `description`, `status`.
- `TaskStatus`: enum dengan value persis `Todo`, `In Progress`, dan `Done`.

Rekomendasi batas input (implementasi, bukan angka dari brief): `title` maksimum 120 karakter, `description` maksimum 2.000 karakter. Trim `title` dan tolak string yang menjadi kosong setelah trimming.

Database initialization menggunakan `SQLModel.metadata.create_all(engine)` saat startup. Pastikan model table sudah di-import/terdaftar sebelum pemanggilan `create_all()`.

## 7. Database connection lifecycle

- Baca `DATABASE_URL` dari environment.
- Gunakan satu engine aplikasi yang reusable (`pool_pre_ping=True` boleh digunakan untuk mendeteksi koneksi stale).
- Buat satu `Session` per request melalui FastAPI dependency yang memakai `yield` dan menutup session setelah request.
- Jangan membuat session global yang dibagi antar-request.
- Commit setelah mutation; refresh object jika perlu mendapatkan nilai database seperti `id`.
- Jangan logging connection string atau credential.
- `create_all()` memenuhi kebutuhan initialization awal, tetapi tidak menggantikan migration management ketika perubahan schema menjadi kompleks. Untuk scope test ini, Alembic opsional dan tidak wajib.

## 8. Local development environment

- PostgreSQL berjalan sebagai service `db` pada `compose.yaml` melalui OrbStack.
- Backend berjalan di host dalam `backend/.venv`.
- Frontend berjalan melalui Vite dev server.
- Origin frontend development default: `http://localhost:5173`.
- Backend API default: `http://localhost:8000`.
- OpenAPI UI tersedia di `http://localhost:8000/docs` saat backend berjalan.
- Port PostgreSQL dipetakan hanya ke `127.0.0.1:5432` pada host development.

## 9. Error and state handling

Backend:

- Input schema tidak valid: response validation FastAPI (umumnya `422`).
- ID tidak ditemukan pada update/delete: `404`.
- Delete berhasil: `204 No Content`.
- Jangan mengembalikan detail internal exception/database ke client.

Frontend:

- Bedakan initial loading, empty list, loaded list, dan load error.
- Tampilkan action-specific errors jika create/update/delete gagal.
- Optimistic update tidak wajib; pendekatan lebih aman untuk assessment ini adalah memperbarui state setelah response sukses.
- Cegah double-submit selama request mutation aktif.
- Jangan menelan error dengan `catch` kosong.
