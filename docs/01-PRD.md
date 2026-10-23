# PRD — Simple Task/Project Tracker

## 1. Ringkasan

**Nama kerja:** Simple Task/Project Tracker  
**Tujuan:** membangun aplikasi CRUD fullstack sederhana untuk mengelola task, sebagai deliverable technical test Full-Stack Developer Intern.

Aplikasi memungkinkan pengguna melihat daftar task, membuat task, mengubah detail/status task, dan menghapus task. Frontend mengonsumsi REST API Python; data disimpan secara persisten di PostgreSQL.

## 2. Konteks dan requirement resmi

Dokumen ini diturunkan dari PDF technical test yang diberikan HR. Ketentuan eksplisitnya mencakup:

- **[REQUIREMENT RESMI] Backend:** REST API menggunakan Python; FastAPI direkomendasikan.
- **[REQUIREMENT RESMI] Endpoint:** `GET /tasks`, `POST /tasks`, `PUT /tasks/{id}`, dan `DELETE /tasks/{id}`.
- **[REQUIREMENT RESMI] Task fields:** `title`, `description`, dan `status`.
- **[REQUIREMENT RESMI] Status:** `Todo`, `In Progress`, atau `Done`.
- **[REQUIREMENT RESMI] Database:** PostgreSQL wajib digunakan.
- **[REQUIREMENT RESMI] Initialization:** tabel dibuat otomatis ketika aplikasi dijalankan, misalnya dengan SQLModel/SQLAlchemy `create_all()`, migrations, atau SQL migration script.
- **[REQUIREMENT RESMI] Validation:** judul tidak boleh kosong dan status harus sesuai pilihan.
- **[REQUIREMENT RESMI] CORS:** frontend harus dapat mengakses API.
- **[REQUIREMENT RESMI] Secrets/configuration:** konfigurasi database melalui environment variables dan tidak di-hardcode.
- **[REQUIREMENT RESMI] Frontend:** kandidat boleh memilih Vue 3 Composition API atau React. Vue 3 direkomendasikan oleh brief, tetapi React secara eksplisit diperbolehkan.
- **[REQUIREMENT RESMI] UI:** tampilkan task, buat task tanpa reload, ubah status, hapus task, tampilan bersih/responsif, dan state diperbarui setelah operasi berhasil.
- **[REQUIREMENT RESMI] Pengumpulan:** repository GitHub/GitLab publik atau memberikan akses reviewer; README harus berisi instruksi setup yang komprehensif.

## 3. Pilihan implementasi yang ditetapkan untuk project ini

Pilihan ini bukan requirement eksplisit dari recruiter, tetapi keputusan untuk menjaga scope tetap fokus:

- Frontend: React + JavaScript menggunakan Vite. **Tidak menggunakan TypeScript** agar fokus tetap pada requirement utama dan stack yang sudah familier bagi kandidat.
- Styling: CSS biasa; tidak menambah UI framework kecuali ada kebutuhan jelas.
- HTTP client: browser `fetch`; tidak menambahkan Axios tanpa alasan.
- Backend: FastAPI dengan Python virtual environment `.venv`.
- ORM: SQLModel.
- Request/schema validation: Pydantic melalui model request yang terpisah dari model tabel.
- Database: PostgreSQL 17 dalam container via OrbStack dan Docker Compose untuk development lokal. Neon/Supabase tetap dapat digunakan bila dibutuhkan, tetapi submission sebaiknya mudah dijalankan secara lokal.
- Testing: pytest + FastAPI TestClient/HTTPX untuk backend; Vitest + React Testing Library untuk frontend.
- Database initialization: `SQLModel.metadata.create_all()` saat startup, sesuai opsi yang disebutkan di brief. Alembic bukan prioritas untuk scope ini.
- Tidak ada authentication/user account karena tidak diminta.

## 4. Tujuan produk

1. Menyediakan alur CRUD task yang berfungsi dari UI sampai PostgreSQL.
2. Memisahkan tanggung jawab frontend, API layer, validasi, business logic, dan database access dengan struktur yang mudah dipahami.
3. Memenuhi requirement dengan dependency sesedikit mungkin.
4. Memudahkan reviewer menjalankan aplikasi dari README tanpa harus menebak konfigurasi.
5. Menghasilkan kode yang dapat dijelaskan kandidat saat interview user, termasuk trade-off dan keterbatasannya.

## 5. Di luar scope

Jangan implementasikan hal berikut kecuali instruksi test berubah atau seluruh requirement wajib sudah selesai:

- Login, registrasi, JWT, role, multi-tenant, atau user ownership.
- Project/team management multi-entitas; scope data utama hanya task.
- Real-time updates, WebSocket, notifications, background jobs.
- Drag-and-drop kanban, pagination, advanced filtering/search, dan file upload.
- Deployment cloud wajib atau CI pipeline lengkap.
- Abstraction/architecture berlebihan, repository pattern tambahan tanpa kebutuhan jelas, atau banyak state-management libraries.

## 6. Data model

Satu task memiliki:

| Field | Type konseptual | Aturan |
|---|---|---|
| `id` | integer | Primary key, dibuat database, tidak dikirim saat create. |
| `title` | string | Wajib, setelah `strip()` tidak boleh kosong; maksimum 120 karakter sebagai keputusan implementasi. |
| `description` | string | Opsional; default string kosong; maksimum 2.000 karakter sebagai keputusan implementasi. |
| `status` | string/enum | Salah satu `Todo`, `In Progress`, `Done`; default `Todo`. |

Batas panjang 120/2.000 karakter adalah **[KEPUTUSAN IMPLEMENTASI]**, bukan angka yang ditentukan oleh brief. Jika agent memilih batas berbeda, pastikan konsisten di API schema, database, UI, tests, dan dokumentasi.

## 7. User stories

- Sebagai pengguna, saya bisa melihat semua task yang tersimpan.
- Sebagai pengguna, saya bisa membuat task dengan judul, deskripsi, dan status.
- Sebagai pengguna, saya mendapat feedback jika input tidak valid atau request gagal.
- Sebagai pengguna, saya bisa mengubah status task.
- Sebagai pengguna, saya bisa mengubah judul/deskripsi task.
- Sebagai pengguna, saya bisa menghapus task.
- Sebagai pengguna, saya tidak perlu reload halaman setelah operasi CRUD berhasil.

## 8. Acceptance criteria

### Backend/API

- [ ] `GET /tasks` mengembalikan daftar task dari PostgreSQL.
- [ ] `POST /tasks` menyimpan task baru dan mengembalikan data yang sudah memiliki `id`.
- [ ] `PUT /tasks/{id}` dapat memperbarui detail dan/atau status sesuai kontrak API.
- [ ] `DELETE /tasks/{id}` menghapus record yang benar.
- [ ] ID yang tidak ditemukan menghasilkan `404` untuk operasi update/delete.
- [ ] Judul kosong/whitespace ditolak.
- [ ] Status selain tiga pilihan yang diperbolehkan ditolak.
- [ ] Invalid request menghasilkan response error yang masuk akal; data invalid tidak tersimpan.
- [ ] Tabel dibuat otomatis ketika aplikasi backend startup dan model terdaftar sebelum `create_all()` dipanggil.
- [ ] Database credentials dibaca dari environment, bukan hard-coded.
- [ ] CORS mengizinkan origin frontend development yang dikonfigurasi.

### Frontend

- [ ] Daftar task berasal dari API, bukan array dummy hard-coded.
- [ ] Form create mengirim `POST` dan menampilkan hasil tanpa page reload.
- [ ] Status dapat diubah melalui UI dan hasilnya bertahan setelah refresh.
- [ ] Judul/deskripsi dapat diedit.
- [ ] Task dapat dihapus.
- [ ] UI memiliki loading, empty, success, dan error states yang sesuai.
- [ ] Tombol submit mencegah request ganda saat request sedang berlangsung.
- [ ] Layout tetap dapat digunakan di viewport sempit.
- [ ] Pesan validasi dapat dipahami pengguna.

### Delivery

- [ ] Setup lokal berfungsi berdasarkan README.
- [ ] `.env` dan credential aktual tidak di-commit.
- [ ] `.env.example` tersedia tanpa secret.
- [ ] Test/lint/build yang diklaim di README benar-benar pernah dijalankan.
- [ ] Tidak ada fitur wajib yang sengaja diganti dengan mock atau TODO.

## 9. Success criteria

Submission dianggap siap ketika acceptance criteria wajib terpenuhi, aplikasi berjalan dari setup yang terdokumentasi, dan kandidat bisa menjelaskan alur data, validasi, error handling, database session, testing, serta batasan solusi.
