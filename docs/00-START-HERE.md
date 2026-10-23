# GLI Technical Test — Documentation Index

Dokumen ini menjadi panduan kerja untuk membangun **Simple Task/Project Tracker** dalam rangka *Technical Test: Full-Stack Developer Intern (Python + Vue/React)*.

## Urutan membaca

1. [`01-PRD.md`](./01-PRD.md) — tujuan, scope, user stories, dan acceptance criteria.
2. [`02-AGENT-CONTEXT.md`](./02-AGENT-CONTEXT.md) — konteks yang wajib dipahami coding agent dan aturan cara bekerja.
3. [`03-TECHNICAL-ARCHITECTURE.md`](./03-TECHNICAL-ARCHITECTURE.md) — stack, struktur folder, batas tanggung jawab, dan konfigurasi.
4. [`04-API-CONTRACT.md`](./04-API-CONTRACT.md) — kontrak endpoint dan format request/response.
5. [`05-TESTING-STRATEGY.md`](./05-TESTING-STRATEGY.md) — strategi automated testing.
6. [`06-SUBMISSION-CHECKLIST.md`](./06-SUBMISSION-CHECKLIST.md) — pengecekan sebelum submission dan persiapan interview.
7. [`07-DESIGN-GUIDELINES.md`](./07-DESIGN-GUIDELINES.md) — GetDesign Mastercard reference, tokens, typography, responsive layout, accessibility, dan UI states.
8. [`phases/phase-01-foundation.md`](./phases/phase-01-foundation.md) sampai [`phase-06-final-review.md`](./phases/phase-06-final-review.md) — rencana implementasi per fase.

## Label sumber informasi

- **[REQUIREMENT RESMI]**: diminta secara eksplisit di PDF technical test dari HR.
- **[KEPUTUSAN IMPLEMENTASI]**: pilihan teknis yang direkomendasikan agar implementasi tetap sederhana, readable, dan maintainable.
- **[OPSIONAL]**: hanya dikerjakan jika semua requirement wajib selesai dan waktu masih tersedia.

Jika sebuah keputusan implementasi bertentangan dengan instruksi terbaru dari recruiter, ikuti instruksi recruiter dan perbarui dokumen ini.

## Prompt awal untuk coding agent

> Baca `docs/00-START-HERE.md`, `docs/01-PRD.md`, `docs/02-AGENT-CONTEXT.md`, `docs/03-TECHNICAL-ARCHITECTURE.md`, `docs/07-DESIGN-GUIDELINES.md`, `DESIGN.md` jika sudah tersedia, dan phase yang sedang dikerjakan sebelum mengubah kode. Ikuti requirement resmi secara ketat, bedakan requirement dengan rekomendasi, dan implementasikan hanya satu fase pada satu waktu. Sebelum coding, rangkum rencana singkat dan file yang akan dibuat/diubah. Setelah coding, jalankan verifikasi yang relevan dan laporkan file yang berubah, perintah yang benar-benar dijalankan, hasil test, serta batasan yang masih ada. Jangan menyatakan test lulus jika belum benar-benar dijalankan.

## Referensi resmi

- [FastAPI documentation](https://fastapi.tiangolo.com/)
- [SQLModel documentation](https://sqlmodel.tiangolo.com/)
- [Pydantic Settings](https://pydantic.dev/docs/validation/latest/concepts/pydantic_settings/)
- [Vite getting started](https://vite.dev/guide/)
- [React documentation](https://react.dev/)
- [pytest documentation](https://docs.pytest.org/en/stable/)
- [Vitest documentation](https://vitest.dev/guide/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Docker PostgreSQL guide](https://docs.docker.com/guides/postgresql/)
