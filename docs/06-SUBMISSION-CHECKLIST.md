# Submission and Interview Checklist

## A. Requirement coverage

- [ ] Semua endpoint wajib tersedia dengan method dan path yang benar.
- [ ] Semua operasi CRUD terhubung ke PostgreSQL.
- [ ] Status yang diperbolehkan persis: `Todo`, `In Progress`, `Done`.
- [ ] Input title whitespace/empty ditolak.
- [ ] Update/delete untuk ID tidak ada memberi `404`.
- [ ] Frontend tidak perlu reload untuk operasi CRUD.
- [ ] Loading, empty, validation, dan error states ditangani.
- [ ] CORS terkonfigurasi untuk origin frontend lokal.
- [ ] Tabel dibuat otomatis saat startup backend.

## B. Security and repository hygiene

- [ ] `.env` tidak di-commit.
- [ ] `.env.example` memuat nama variable dan placeholder saja.
- [ ] Tidak ada password/token/connection string sensitif di source, screenshot, atau README.
- [ ] `.venv`, `node_modules`, cache, build output, dan credential di-ignore Git.
- [ ] Database port dibatasi ke loopback untuk development lokal.
- [ ] Tidak ada log yang mengekspos credential atau detail internal.

## C. Clean code

- [ ] Router tidak menampung semua business logic dan database setup sekaligus.
- [ ] Model tabel dan schema request/response dipisah.
- [ ] Database session dibuat per request dan ditutup.
- [ ] Tidak ada fungsi/komponen raksasa tanpa alasan.
- [ ] Tidak ada dead code, debug prints, atau TODO yang menjadi pengganti requirement.
- [ ] Komentar menjelaskan alasan/constraint, bukan menarasikan syntax.
- [ ] Dependency tambahan punya alasan yang jelas.

## D. Testing and reproducibility

- [ ] Backend tests dijalankan dan hasilnya dicatat.
- [ ] Frontend lint/tests/build dijalankan dan hasilnya dicatat.
- [ ] Manual CRUD smoke test pada PostgreSQL sukses.
- [ ] README diuji mengikuti langkah dari awal, bukan hanya berdasarkan environment yang sudah berjalan.
- [ ] `docker compose --env-file backend/.env up -d db` berjalan pada OrbStack.
- [ ] Instruksi cleanup jelas tanpa menghapus data secara tak sengaja.

## E. README minimum

README root setidaknya memuat:

1. Project overview dan fitur.
2. Tech stack.
3. Prerequisites (Node.js, Python, OrbStack/Docker-compatible CLI).
4. Setup `.env` dari `.env.example`.
5. Cara menjalankan PostgreSQL.
6. Cara memasang dependency dan menjalankan backend.
7. Cara memasang dependency dan menjalankan frontend.
8. API endpoints / tautan OpenAPI docs.
9. Cara menjalankan test, lint, dan build.
10. Assumptions, design decisions, dan limitations.

## F. Persiapan interview user

Kandidat harus bisa menjelaskan dengan kata-kata sendiri:

- Mengapa memilih React + JavaScript dan FastAPI untuk scope ini.
- Peran SQLModel dibanding Pydantic schema.
- Perbedaan model database dengan request/response schema.
- Bagaimana dependency injection menyediakan SQLModel Session per request.
- Bagaimana `create_all()` membuat tabel dan apa keterbatasannya dibanding migrations.
- Bagaimana `.env` di-load dan mengapa credential tidak di-hard-code.
- Mengapa perlu CORS dan bagaimana origin frontend diizinkan.
- Bagaimana invalid input dan record not found ditangani.
- Perbedaan unit test, API integration test, dan frontend component test.
- Alternatif yang dipertimbangkan serta trade-off yang diterima.
- Bagian yang belum production-ready dan apa yang akan diperbaiki jika scope membesar.

Jangan mengklaim fitur, test, atau deployment yang tidak benar-benar dikerjakan.
