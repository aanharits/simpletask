# Phase 03 — Backend CRUD API

## Goal

Implementasikan endpoint sesuai `docs/04-API-CONTRACT.md` dengan error handling dan database access yang konsisten.

## Required endpoints

- `GET /tasks` — list tasks.
- `POST /tasks` — create task; success `201`.
- `PUT /tasks/{task_id}` — partial update sesuai kontrak test; success `200`.
- `DELETE /tasks/{task_id}` — delete task; success `204`.

## Suggested responsibilities

- `app/services/task_service.py`: query/create/update/delete terhadap SQLModel session.
- `app/api/routes/tasks.py`: endpoint, request/response models, status codes, mapping missing records ke `HTTPException(404)`.
- `app/main.py`: register router prefix dan konfigurasi CORS.

Jaga service functions tetap jelas. Jangan membuat repository layer terpisah jika hanya meneruskan pemanggilan service tanpa manfaat.

## CRUD behavior

### List

- Query Task dari PostgreSQL.
- Gunakan ordering deterministik, misalnya `id` ascending.
- Response `[]` ketika belum ada records.

### Create

- Terima `TaskCreate`.
- Gunakan model database, bukan langsung menyimpan raw request dictionary.
- `add`, `commit`, `refresh` record, lalu return response schema.
- Pastikan nilai status disimpan sebagai value yang sesuai kontrak (`Todo`, `In Progress`, `Done`).

### Update

- Cari record terlebih dahulu; jika tidak ada, return `404`.
- Gunakan `model_dump(exclude_unset=True, mode="json")` atau pendekatan Pydantic yang sesuai agar hanya field yang dikirim yang diubah.
- Tolak update body kosong dan nilai eksplisit `null` untuk field non-null.
- Jangan reset field yang tidak dikirim ke default.
- Commit lalu refresh record sebelum response.

### Delete

- Cari record terlebih dahulu; jika tidak ada, return `404`.
- Hapus dan commit.
- Return `204 No Content` tanpa JSON body.

### CORS

- Gunakan `CORSMiddleware`.
- `allow_origins` harus berasal dari setting `FRONTEND_ORIGIN`.
- Batasi methods/headers yang dibutuhkan dengan masuk akal; jangan menggunakan wildcard origin sebagai default.

## Basic service/error handling

- Tangani record not found dengan status HTTP yang benar.
- Pastikan database session dikelola dependency dan tidak dibiarkan terbuka.
- Pastikan perubahan ditulis ke database dan transaksi gagal tidak meninggalkan state palsu di frontend.
- Jangan expose SQL error/detail exception mentah kepada user.
- Hindari `try/except Exception` yang menelan seluruh error tanpa logging/penanganan yang benar.

## Verification with OpenAPI docs

Jalankan backend lalu buka `http://localhost:8000/docs`. Uji keempat endpoint dengan data valid dan invalid. Verifikasi data benar-benar tersimpan di PostgreSQL, bukan sekadar ada di memory.

## Completion criteria

Semua endpoint mempunyai test untuk happy path dan kasus gagal utama. Frontend belum menjadi dependency untuk membuktikan backend CRUD berfungsi.
