# API Contract

Base URL development: `http://localhost:8000`  
OpenAPI docs: `http://localhost:8000/docs`

## Task representation

```json
{
  "id": 1,
  "title": "Finish technical test",
  "description": "Implement and test the task tracker",
  "status": "In Progress"
}
```

`status` harus persis salah satu dari `Todo`, `In Progress`, atau `Done`.

## `GET /tasks`

Mengambil semua task.

- Success: `200 OK`
- Response: array Task; jika belum ada data, return `[]`.
- Ordering: konsisten dan deterministik (misalnya `id` ascending). Tidak perlu pagination untuk scope ini.

## `POST /tasks`

Membuat task.

Request:

```json
{
  "title": "Review API design",
  "description": "Check validation and error handling",
  "status": "Todo"
}
```

Aturan:

- `title` wajib dan tidak boleh kosong setelah trimming.
- `description` boleh tidak diberikan; default `""`.
- `status` boleh tidak diberikan; default `"Todo"`.
- Status di luar enum ditolak.

Success: `201 Created`, response berisi task dengan `id` hasil database.

## `PUT /tasks/{task_id}`

Memperbarui satu atau lebih field task. Endpoint memakai `PUT` karena endpoint tersebut ditentukan oleh brief. Karena requirement menyatakan bahwa judul, deskripsi, **atau** status dapat diperbarui, implementasi menerima partial body dan hanya mengubah field yang dikirim. Secara semantik HTTP yang ketat, `PATCH` biasanya lebih cocok untuk partial update; jangan mengganti path/method dari brief tanpa izin recruiter.

Contoh mengubah status saja:

```json
{
  "status": "Done"
}
```

Contoh mengubah judul dan deskripsi:

```json
{
  "title": "Review completed API design",
  "description": "Validation and error handling are reviewed"
}
```

Aturan:

- Minimal satu field harus diberikan.
- Field yang tidak dikirim tidak diubah.
- Field yang dikirim tetap divalidasi.
- Explicit `null` tidak boleh menghapus nilai wajib/non-null; tolak dengan validasi.
- ID tidak ditemukan: `404 Not Found`.

Success: `200 OK`, response berisi task terbaru.

## `DELETE /tasks/{task_id}`

Menghapus satu task berdasarkan ID.

- Success: `204 No Content` dan response tidak memiliki JSON body.
- ID tidak ditemukan: `404 Not Found`.

## Validation and errors

- Schema/type/input validation: `422 Unprocessable Entity` dari FastAPI/Pydantic.
- Record yang tidak ditemukan: `404 Not Found`.
- Jangan mengirim stack trace, connection string, atau detail credential kepada client.
- Format validation error bawaan FastAPI boleh dipertahankan; frontend cukup menampilkan pesan error yang user-friendly.

## CORS

Backend harus menerima origin frontend yang dikonfigurasi, default `http://localhost:5173`. Origin harus dapat diubah melalui environment configuration; jangan mengandalkan wildcard sebagai default.

## Database persistence requirement

Semua operasi CRUD harus benar-benar menggunakan PostgreSQL melalui SQLModel. Array frontend atau list Python in-memory tidak boleh menjadi sumber data utama. Setelah backend/frontend restart, task yang sudah tersimpan harus tetap ada.
