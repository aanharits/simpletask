# Phase 06 — Documentation, Final Review, and Submission

## Goal

Pastikan reviewer dapat memahami, menjalankan, dan memverifikasi project dengan langkah yang terdokumentasi.

## README root

README harus memuat:

- Project overview dan fitur.
- Stack frontend/backend/database/testing.
- Prerequisites: Git, Node.js, Python, OrbStack dan Docker Compose CLI.
- Cara menyiapkan `.env` dari `.env.example`.
- Cara start/stop PostgreSQL.
- Cara setup virtual environment, install backend dependencies, dan menjalankan FastAPI.
- Cara install frontend dependencies dan menjalankan Vite.
- Endpoint dan tautan OpenAPI docs.
- Perintah test/lint/build.
- Asumsi dan limitations yang benar-benar berlaku.

Pastikan instruksi run menggunakan working directory yang tepat. Smoke test README dari kondisi terminal baru jika waktu memungkinkan.

## Final technical audit

- Bandingkan seluruh acceptance criteria pada `01-PRD.md` dengan hasil implementasi.
- Periksa kontrak API, status values, status codes, dan error handling.
- Pastikan tabel otomatis dibuat pada startup ketika belum ada.
- Pastikan database credentials tidak hard-coded/ter-commit.
- Periksa `.gitignore`, dependency manifests, dan lockfile.
- Hapus dead code, console prints, debug endpoints yang tidak diperlukan, dan TODO pengganti fitur wajib.
- Pastikan layout usable pada viewport sempit.
- Jalankan automated tests, lint, build, dan manual CRUD smoke test.
- Pastikan README tidak menyatakan test atau behavior yang belum diverifikasi.

## Git hygiene

Gunakan commits yang masuk akal dan menjelaskan scope, misalnya:

- `chore: scaffold frontend and backend`
- `feat(api): add task CRUD endpoints`
- `feat(ui): implement task tracker interactions`
- `test: cover task validation and CRUD behavior`
- `docs: add setup and submission instructions`

Contoh ini hanya usulan; tidak perlu mengubah riwayat Git yang sudah ada dengan force push.

## Interview notes

Tambahkan catatan pendek (boleh sebagai bagian README atau catatan pribadi di luar submission) untuk menjelaskan:

- keputusan ORM dan schema validation;
- per-request database session;
- CORS dan environment variables;
- alasan memilih `create_all()` dan batasannya;
- testing levels serta apa yang belum otomatis diuji;
- trade-off yang sengaja diterima karena scope technical test;
- next steps jika aplikasi dikembangkan menjadi production app.

Jangan menambahkan klaim seperti "production-ready", "fully secure", atau "100% tested" tanpa bukti yang mendukung.
