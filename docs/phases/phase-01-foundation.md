# Phase 01 — Foundation and Environment Setup

## Goal

Menyiapkan struktur repository, React + JavaScript, Python virtual environment, dependency backend, dan PostgreSQL lokal melalui OrbStack. Pada fase ini belum perlu mengimplementasikan CRUD lengkap.

## Prerequisites

- Git.
- Node.js yang memenuhi requirement Vite saat ini. Gunakan Node 22 LTS yang kompatibel dengan Vite/Vitest versi yang dipasang; cek `node --version`.
- Python 3.12 direkomendasikan; cek `python3 --version`.
- OrbStack berjalan dan menyediakan Docker-compatible CLI + Docker Compose.

Verifikasi CLI:

```bash
docker --version
docker compose version
```

Jika perintah tidak ditemukan, periksa integrasi CLI OrbStack sebelum memasang runtime lain. Tidak perlu memasang Docker Desktop hanya untuk project ini.

## Step 1 — Repository structure

Dari root project, pastikan direktori `docs/` yang berisi dokumen ini tetap dipertahankan. Buat direktori `backend/` dan `frontend/` jika belum ada. Jangan menghapus file existing tanpa inspeksi.

## Step 2 — Scaffold frontend React + JavaScript

Jika folder `frontend/` belum ada:

```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
```

Template `react` adalah template JavaScript. Jangan pilih `react-ts`.

Install library testing frontend:

```bash
npm install -D vitest jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom @testing-library/user-event
```

Gunakan CSS biasa. Jangan menambahkan Axios, Tailwind, Redux, atau komponen library untuk fase setup kecuali ada kebutuhan baru yang disetujui.

Tambahkan script berikut ke `frontend/package.json` tanpa menghapus script scaffold yang sudah ada:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

Jangan mengganti seluruh `package.json` dengan snippet di atas; merge scripts dan pertahankan dependency yang dibuat Vite.

Konfigurasikan Vitest agar menggunakan `jsdom` dan setup file `src/test/setup.js`, termasuk import matcher dari `@testing-library/jest-dom`. Setelah konfigurasi, tambahkan satu test smoke kecil untuk membuktikan test runner bekerja.

## Step 3 — Setup backend Python virtual environment

```bash
mkdir -p backend
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
```

Semua instalasi Python berikut dilakukan saat `.venv` aktif. Jangan menginstal dependency ke global Python.

Buat `backend/requirements.txt` untuk runtime dependencies:

```text
fastapi>=0.115,<1.0
uvicorn[standard]>=0.30,<1.0
sqlmodel>=0.0.22,<1.0
psycopg[binary]>=3.2,<4.0
pydantic-settings>=2.6,<3.0
python-dotenv>=1.0,<2.0
```

Buat `backend/requirements-dev.txt`:

```text
-r requirements.txt
pytest>=8,<10
httpx>=0.27,<1.0
ruff>=0.11,<1.0
```

Install:

```bash
python -m pip install -r requirements-dev.txt
python -m pip check
```

Range version di atas adalah batas kompatibilitas awal, bukan lockfile. Setelah dependency berhasil dipasang, commit file dependency dan `frontend/package-lock.json`. Jika ada konflik resolusi, agent harus mengoreksi batas versi berdasarkan versi yang benar-benar compatible dan melaporkannya; jangan menyiasati konflik dengan mengabaikan error.

## Step 4 — Create backend directories and package files

Buat struktur dasar:

```text
backend/app/
├── __init__.py
├── main.py
├── core/__init__.py
├── db/__init__.py
├── models/__init__.py
├── schemas/__init__.py
├── services/__init__.py
└── api/
    ├── __init__.py
    └── routes/__init__.py
backend/tests/
```

`main.py` pada fase ini cukup membuat app FastAPI sederhana dan endpoint health-check seperti `GET /health` jika berguna. Jangan implementasi semua CRUD di satu file.

## Step 5 — PostgreSQL via OrbStack

Buat `compose.yaml` di root project:

```yaml
services:
  db:
    image: postgres:17-alpine
    environment:
      POSTGRES_DB: ${POSTGRES_DB:?Set POSTGRES_DB in backend/.env}
      POSTGRES_USER: ${POSTGRES_USER:?Set POSTGRES_USER in backend/.env}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:?Set POSTGRES_PASSWORD in backend/.env}
    ports:
      - "127.0.0.1:5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}"]
      interval: 5s
      timeout: 3s
      retries: 10

volumes:
  postgres_data:
```

Buat `backend/.env.example`:

```dotenv
POSTGRES_DB=task_tracker
POSTGRES_USER=task_user
POSTGRES_PASSWORD=replace_with_local_dev_password
DATABASE_URL=postgresql+psycopg://task_user:replace_with_local_dev_password@localhost:5432/task_tracker
FRONTEND_ORIGIN=http://localhost:5173
```

Salin file tersebut menjadi `backend/.env` untuk local development lalu ganti password placeholder:

```bash
cp backend/.env.example backend/.env
```

Pastikan `.env` masuk `.gitignore`. Connection string `DATABASE_URL` harus menggunakan kredensial yang sama seperti nilai `POSTGRES_USER`, `POSTGRES_PASSWORD`, dan `POSTGRES_DB`.

Jalankan database dari root repository:

```bash
docker compose --env-file backend/.env up -d db
docker compose --env-file backend/.env ps
docker compose --env-file backend/.env logs db
```

Jika image belum tersedia, OrbStack akan mengunduhnya. Tidak perlu install PostgreSQL server secara native pada macOS. Named volume menjaga data tetap ada ketika container berhenti atau dibuat ulang.

Untuk menghentikan database tanpa menghapus datanya:

```bash
docker compose --env-file backend/.env down
```

Hindari `down -v` kecuali memang bermaksud menghapus database volume.

## Step 6 — `.gitignore`

Pastikan setidaknya mengabaikan:

```gitignore
# Environment secrets
.env
**/.env
!.env.example
!**/.env.example

# Python
.venv/
**/.venv/
__pycache__/
*.py[cod]
.pytest_cache/
.ruff_cache/
.coverage
htmlcov/

# Node
node_modules/
frontend/dist/

# OS / editor
.DS_Store
.vscode/
```

Tinjau aturan `.gitignore` terhadap repository aktual. Pastikan `.env.example` tetap dapat di-commit.

## Step 7 — Initial verification

- [ ] `node --version`, `npm --version`, `python3 --version` menampilkan versi.
- [ ] `docker compose version` tersedia melalui OrbStack.
- [ ] Frontend berjalan melalui `npm run dev` di `frontend/`.
- [ ] Backend dapat dijalankan dari direktori `backend/` dengan `.venv` aktif:

```bash
uvicorn app.main:app --reload
```

- [ ] `http://localhost:8000/health` merespons jika health route dibuat.
- [ ] PostgreSQL container sehat dan port lokal tersedia.
- [ ] `python -m pip check` tidak melaporkan konflik dependency.
- [ ] Frontend `npm run lint` dan `npm run build` berfungsi.
- [ ] Satu frontend smoke test dan `python -m pytest -v` berjalan.

## Completion output

Agent melaporkan dependency yang dipasang, file konfigurasi yang dibuat, command verifikasi yang benar-benar dijalankan, dan masalah setup bila ada. Jangan lanjut implementasi CRUD sampai environment foundation dapat dijalankan.
