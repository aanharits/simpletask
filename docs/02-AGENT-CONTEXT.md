# Coding Agent Context — GLI Technical Test

## Mission

Implementasikan Simple Task/Project Tracker untuk technical test Full-Stack Developer Intern. Deliverable harus memenuhi instruksi assignment, mudah dijalankan reviewer, readable, testable, dan mudah dijelaskan kandidat saat interview teknis.

## Read these files first

- `docs/00-START-HERE.md`
- `docs/01-PRD.md`
- `docs/03-TECHNICAL-ARCHITECTURE.md`
- `docs/04-API-CONTRACT.md`
- `docs/05-TESTING-STRATEGY.md`
- `docs/07-DESIGN-GUIDELINES.md`
- `DESIGN.md` di root project setelah preset GetDesign berhasil dipasang
- fase aktif di `docs/phases/`

## Source-of-truth hierarchy

1. Instruksi technical test terbaru dari HR.
2. Requirement yang diberi label **[REQUIREMENT RESMI]** dalam PRD.
3. Keputusan arsitektur dalam dokumen ini.
4. Preferensi/ide baru dari agent.

Jika menemukan konflik, jangan diam-diam mengganti requirement. Jelaskan konflik secara singkat, pilih opsi yang paling sesuai dengan sumber kebenaran di atas, lalu perbarui dokumentasi jika memang dibutuhkan.

## Fixed technical decisions

- Frontend: React + JavaScript (Vite React JS template), bukan TypeScript.
- Backend: Python + FastAPI.
- Python environment: `backend/.venv`; jangan menginstall dependency project ke Python global.
- ORM: SQLModel; database wajib PostgreSQL.
- Local PostgreSQL: OrbStack melalui Docker-compatible CLI + Docker Compose.
- Validation: Pydantic schemas; jangan mempercayakan validasi hanya kepada frontend.
- HTTP client frontend: `fetch`.
- Styling: CSS biasa kecuali ada alasan kuat untuk dependency tambahan.
- Design reference: jalankan `npx getdesign@latest add mastercard` dari root repository, baca `DESIGN.md` hasil generator, lalu terapkan token dan guidance yang relevan dengan task-management UI sesuai `docs/07-DESIGN-GUIDELINES.md`. Jangan klaim command berhasil jika belum dijalankan.
- Backend automated tests: pytest + HTTPX/FastAPI TestClient.
- Frontend automated tests: Vitest + React Testing Library.
- Database initialization: SQLModel `create_all()` saat startup sebagaimana diperbolehkan assignment.
- API paths harus sesuai brief: `/tasks`, `/tasks/{task_id}`.

## Working protocol

Untuk setiap fase:

1. Baca dokumen fase dan periksa repository saat ini sebelum mengubahnya.
2. Sampaikan plan singkat: scope, file yang akan dibuat/diubah, dan risiko penting.
3. Implementasikan fase aktif saja. Jangan melompat ke fitur nice-to-have.
4. Jalankan verifikasi yang relevan (test, lint, build, smoke test).
5. Perbaiki regression yang disebabkan perubahan tersebut sebelum menyatakan fase selesai.
6. Laporkan file yang berubah, command yang dijalankan, hasil nyata, serta pekerjaan/batasan yang tersisa.
7. Tunggu arahan untuk lanjut fase berikutnya bila pemilik project sedang melakukan review bertahap. Jika diminta mengerjakan semua fase, tetap kerjakan dalam urutan dan checkpoint yang sama.

## Engineering rules

- Ikuti separation of concerns, tetapi hindari overengineering untuk aplikasi satu entitas.
- Pisahkan routing HTTP, business/data operations, model database, request/response schema, konfigurasi, dan UI components.
- Jangan membuat lapisan abstraksi hanya demi pola arsitektur populer. Setiap layer harus memiliki alasan yang jelas.
- Gunakan nama eksplisit dan konsisten; hindari singkatan tidak jelas.
- Utamakan fungsi kecil dengan satu tanggung jawab dan side effect yang jelas.
- Gunakan dependency injection FastAPI untuk database session.
- Session database memiliki lifecycle per request; jangan membuat satu session global dan membaginya ke semua request.
- Pastikan commit dilakukan saat mutation berhasil dan rollback/cleanup terjaga ketika ada exception.
- Jangan mengembalikan ORM internals tanpa response schema yang jelas.
- Validasi input dan handle `404`, invalid input, database errors, serta network errors secara wajar.
- Jangan expose stack trace atau credential ke response frontend.
- Jangan menyimpan secret di source code, commit `.env`, atau memasukkan secret ke output/log.
- Gunakan CORS allowlist untuk origin frontend; jangan gunakan wildcard tanpa alasan.
- Gunakan `fetch` wrapper kecil bila membantu konsistensi error handling; jangan membangun HTTP client framework sendiri.
- Pertahankan accessibility dasar: label form, semantic buttons, focus states, dan pesan status yang bisa dipahami.
- Terapkan `docs/07-DESIGN-GUIDELINES.md` untuk responsive layout, typography, token consistency, contrast, dan UI states. Adaptasikan reference Mastercard sebagai visual inspiration; jangan memakai logonya, wordmark, atau meniru marketing landing page-nya.
- Jangan menambahkan dependency tanpa menjelaskan alasan manfaatnya.

## Comment and documentation policy

- Komentar menjelaskan **why**, trade-off, constraint, atau perilaku yang tidak obvious; jangan mengulang apa yang sudah jelas dari kode.
- Hindari komentar per baris, komentar sementara yang basi, emoji di komentar, serta docstring panjang yang tidak memberi nilai.
- Beri docstring singkat pada module/function publik atau logic dengan kontrak tidak trivial jika itu membantu pembaca.
- Dokumentasi setup harus sesuai kode aktual. Jika command tidak pernah dijalankan, jangan klaim berhasil.

## AI-assisted implementation constraints

- Jangan menghasilkan seluruh aplikasi dalam satu perubahan besar yang sulit direview.
- Buat perubahan incremental dan verifikasi tiap vertical slice.
- Setelah menghasilkan kode, lakukan self-review terhadap correctness, security, edge cases, maintainability, dan requirement coverage.
- Jangan menghapus atau menimpa kode yang sudah ada tanpa inspeksi.
- Jangan menyamarkan penggunaan AI atau membuat klaim palsu tentang authorship. Kandidat harus mampu memahami dan menjelaskan semua bagian yang dikumpulkan.
- Jangan menandai test/lint/build sebagai lulus jika command tidak benar-benar dijalankan atau gagal.

## Definition of done per phase

Satu fase selesai jika:

- Scope fase terpenuhi.
- Aplikasi/repository tidak mengalami regression yang diketahui.
- Verifikasi relevan dijalankan dan hasilnya dilaporkan secara akurat.
- Dokumentasi yang dipengaruhi perubahan diperbarui.
- Tidak ada credential yang bocor dan tidak ada perubahan di luar scope tanpa alasan.
