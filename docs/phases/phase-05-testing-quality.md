# Phase 05 — Automated Testing and Quality

## Goal

Tambahkan test yang memberi confidence terhadap behavior penting. Jangan mengejar test coverage sebagai angka semata.

## Backend

Gunakan pytest dan FastAPI TestClient/HTTPX.

1. Buat `tests/conftest.py` untuk fixture yang memisahkan test dari environment development normal.
2. Gunakan database test terpisah jika menguji interaksi PostgreSQL. Jangan menjalankan cleanup/reset terhadap database yang berisi data penting.
3. Override dependency session FastAPI jika diperlukan agar tiap test menggunakan test session.
4. Test schema validation secara unit.
5. Test endpoint CRUD: success, invalid body, missing ID, dan delete behavior.
6. Pastikan test order tidak mempengaruhi hasil.

Test database tidak boleh secara tidak sengaja menggunakan `DATABASE_URL` production. Pilihan aman adalah memakai `TEST_DATABASE_URL` yang menunjuk pada database khusus test dan memverifikasi value sebelum fixture melakukan operasi destructive.

## Frontend

Gunakan Vitest + React Testing Library + jsdom.

- Tambahkan `src/test/setup.js` untuk matcher DOM.
- Uji behavior berdasarkan apa yang dilihat/dilakukan pengguna.
- Mock `fetch` di component tests untuk menguji loading, success, dan failure tanpa ketergantungan network.
- Uji validasi form dan tombol mutation.
- Hindari assertions yang terlalu terikat pada struktur internal komponen.

## Lint and formatting

- Ruff untuk Python lint/format.
- ESLint dari template Vite untuk JavaScript.
- Jangan menambah formatter atau linter kedua jika tidak diperlukan.

## Manual full-stack verification

Lakukan setelah automated tests:

1. Jalankan PostgreSQL.
2. Jalankan FastAPI.
3. Jalankan Vite.
4. Create, list, edit, status update, dan delete task dari browser.
5. Refresh browser setelah create/update dan pastikan persistence benar.
6. Coba input kosong/status invalid melalui API docs.
7. Periksa error UI saat backend tidak tersedia.

## Completion criteria

Laporkan command dan hasil aktual. Jika test tertentu tidak berhasil disiapkan dalam waktu yang tersedia, jelaskan keterbatasannya secara eksplisit dan jangan mengklaim bahwa behavior tersebut telah teruji otomatis.
