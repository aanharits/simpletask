# Phase 04 — React Frontend CRUD

## Goal

Bangun UI yang konsumsi API FastAPI. Gunakan React + JavaScript sesuai keputusan project, bukan TypeScript. UI harus mengikuti `docs/07-DESIGN-GUIDELINES.md` dan `DESIGN.md` hasil GetDesign.

## Design-system setup

Sebelum implementasi styling, dari root repository jalankan:

```bash
npx getdesign@latest add mastercard
```

Baca `DESIGN.md` yang dihasilkan. Implementasikan palette, typography, spacing, radii, elevation, dan component guidance melalui CSS custom properties (design tokens) di `frontend/src/index.css`. Preset adalah referensi visual, bukan izin untuk menggunakan logo/wordmark Mastercard. Jika command gagal, laporkan secara eksplisit dan ikuti fallback guidance pada `docs/07-DESIGN-GUIDELINES.md`. Jangan menambah styling dependency tanpa kebutuhan nyata.

## API configuration

Buat `frontend/.env.example`:

```dotenv
VITE_API_BASE_URL=http://localhost:8000
```

Buat `frontend/.env` untuk lokal dengan nilai yang sama dan pastikan di-ignore Git. Semua environment variables dengan prefix `VITE_` dapat diekspos ke browser; jangan menaruh secret di sana.

Buat `src/api/tasks.js` sebagai HTTP boundary. Gunakan `fetch` dan helper kecil untuk:

- `getTasks()`
- `createTask(payload)`
- `updateTask(taskId, payload)`
- `deleteTask(taskId)`

HTTP helper harus memeriksa `response.ok`, membaca error response secara aman, melempar error yang bisa ditampilkan UI, dan menangani `204 No Content` tanpa mencoba parse JSON.

## UI components

Implementasikan secukupnya:

- `App.jsx`: state tasks, initial loading, load error, dan orchestration aksi.
- `TaskForm.jsx`: create form; edit form dapat menggunakan komponen yang sama jika tidak membuat code rumit.
- `TaskList.jsx`: list/empty state.
- `TaskItem.jsx`: detail task, status select/toggler, edit, delete.

Jangan memasukkan seluruh alur ke satu file besar. Namun, jangan membuat component untuk setiap elemen dekoratif tanpa alasan.

## Required behavior

- Load tasks dari API saat aplikasi dibuka.
- Create: validasi title, submit ke API, lalu masukkan response sukses ke UI tanpa reload.
- Update status: kirim `PUT` dengan status; update item berdasarkan response sukses.
- Edit title/description: sediakan UI edit yang jelas dan kirim field yang diubah melalui `PUT`.
- Delete: kirim `DELETE`; hapus item dari state hanya setelah request sukses.
- Loading: cegah aksi submit berulang ketika request berjalan.
- Error: tampilkan pesan dan pertahankan input/data jika request gagal.
- Empty state: jelaskan bahwa belum ada task dan sediakan jalur untuk membuatnya.
- Status tampil dengan label yang konsisten.
- Gunakan semantic HTML, label input, tombol dengan nama yang jelas, dan focus state.
- Layout responsif dengan CSS sederhana. Ikuti responsive breakpoints dan accessibility checklist di `docs/07-DESIGN-GUIDELINES.md`.

## State management

Untuk scope ini, gunakan React built-in state (`useState`, `useEffect`) secukupnya. Tidak perlu Redux, Zustand, React Query, atau library state lain kecuali scope berkembang dan keputusan baru disetujui.

Jangan gunakan optimistic updates di awal. Update UI setelah API mengonfirmasi mutation berhasil; ini lebih mudah dipahami dan mengurangi state inconsistency.

## Verification

- Semua CRUD bekerja tanpa browser page reload.
- Setelah reload browser, data tetap muncul karena berasal dari PostgreSQL.
- Loading/empty/error states mudah dibedakan.
- Browser console tidak punya error yang diketahui.
- UI menggunakan design tokens secara konsisten, dapat digunakan di mobile/desktop, dan memiliki focus state serta contrast yang layak.
- CORS tidak menghasilkan error saat React memanggil FastAPI.
- `npm run lint` dan `npm run build` sukses.
