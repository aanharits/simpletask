# Phase 02 — Backend Configuration and Data Layer

## Goal

Siapkan konfigurasi environment, SQLModel engine/session, model tabel Task, schema request/response, dan automatic table initialization.

## Implementation order

### 1. Settings

Buat `app/core/config.py` menggunakan `pydantic-settings`.

Requirements:

- `DATABASE_URL` wajib dibaca dari environment/`.env`.
- `FRONTEND_ORIGIN` punya default development `http://localhost:5173`.
- Gunakan `SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")` bila backend dijalankan dari direktori `backend/`.
- Jangan memberikan fallback password/database URL ke dalam source code.
- Jangan mencetak seluruh settings atau database URL ke log.

### 2. Database engine and session dependency

Buat `app/db/session.py`:

- Buat satu engine dari `settings.database_url`; nonaktifkan SQL echo default.
- Sediakan dependency `get_session()` yang membuka SQLModel `Session`, melakukan `yield`, lalu memastikan session ditutup.
- Sediakan helper `create_db_and_tables()` yang memanggil `SQLModel.metadata.create_all(engine)`.
- Pastikan semua model table sudah di-import sebelum `create_all()` dipanggil.

### 3. Task status

Definisikan enum dengan value persis:

- `Todo`
- `In Progress`
- `Done`

Jangan mengganti value menjadi lowercase, underscore, atau nama lain karena status tersebut diberikan dalam brief.

### 4. Database model

Buat `app/models/task.py` dengan table model SQLModel. Field minimum: `id`, `title`, `description`, `status`.

- `id`: primary key integer auto-generated.
- `title`: required, non-null, length terbatas.
- `description`: non-null string, default empty string.
- `status`: non-null string dengan default `Todo`.
- Pertimbangkan constraint database untuk title non-empty dan status yang valid jika implementasinya tetap sederhana dan compatible dengan PostgreSQL.

Jangan memaksa ORM table model menjadi satu-satunya schema API. Model tabel dan schema input/output memiliki tanggung jawab berbeda.

### 5. API schemas

Buat `app/schemas/task.py` dengan schema terpisah:

- `TaskCreate`: title wajib, description default kosong, status default `Todo`.
- `TaskUpdate`: semua field mutable optional agar request dapat mengubah title saja, description saja, status saja, atau kombinasi; wajib setidaknya satu field dikirim.
- `TaskRead`: response berisi `id`, `title`, `description`, `status`.
- Custom validation harus trim title dan menolak title yang kosong setelah trimming.
- Status menggunakan enum dan input status invalid ditolak.
- Explicit `null` untuk kolom yang harus non-null ditolak, bukan disimpan ke database.

### 6. Automatic initialization

Di `app/main.py`, gunakan FastAPI lifespan untuk memanggil helper initialization saat aplikasi startup. Jangan melakukan query/create table sebagai side effect saat module di-import.

Pastikan model `Task` telah di-import/register sebelum `create_all()` berjalan. `create_all()` membuat tabel yang belum ada tetapi bukan migration system untuk perubahan schema yang sudah berjalan.

## Verification

- [ ] App gagal dengan error konfigurasi yang jelas jika `DATABASE_URL` tidak ada.
- [ ] Dengan PostgreSQL berjalan dan `.env` benar, backend startup sukses.
- [ ] Tabel Task dibuat secara otomatis jika belum ada.
- [ ] Restart backend tidak menghilangkan data.
- [ ] Tidak ada credential dalam logs.
- [ ] Model, schema, dan database session berada di module terpisah sesuai tanggung jawab.
