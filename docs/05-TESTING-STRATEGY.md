# Testing Strategy

## Tujuan

Automated tests digunakan untuk memverifikasi behavior yang diharapkan dan mencegah regression. Tidak perlu mengejar coverage tinggi dengan test yang tidak bermakna; utamakan requirement dan edge cases yang penting.

## Test levels

### Backend unit tests — pytest

Fokus pada logic yang bisa diuji terpisah, misalnya:

- Judul whitespace ditolak setelah trimming.
- Status valid diterima dan status invalid ditolak.
- `TaskUpdate` tidak menerima body kosong.
- Field yang tidak diberikan tidak ikut berubah.

### Backend API/integration tests — FastAPI TestClient + HTTPX

Minimal uji:

- `GET /tasks` mengembalikan `200` dan daftar kosong saat belum ada data.
- `POST /tasks` membuat task dan mengembalikan `201` plus ID.
- `POST /tasks` menolak judul kosong dan status invalid.
- `PUT /tasks/{id}` mengubah status saja.
- `PUT /tasks/{id}` mengubah title/description dan mempertahankan field lain yang tidak dikirim.
- `PUT` pada ID yang tidak ada mengembalikan `404`.
- `DELETE` mengembalikan `204`; task tidak muncul lagi setelahnya.
- `DELETE` pada ID yang tidak ada mengembalikan `404`.

Prefer gunakan database test PostgreSQL terpisah untuk verifikasi database integration. Jangan pernah menjalankan test yang membersihkan tabel pada database production atau database cloud dengan data penting.

Untuk implementasi awal, boleh memakai dependency override untuk memberi test session kepada FastAPI. Pastikan test tidak memakai `DATABASE_URL` production secara tidak sengaja. Jika integration test PostgreSQL dirasa terlalu berat untuk fase pertama, jangan menyebut test SQLite/mock sebagai bukti bahwa integrasi PostgreSQL sudah teruji; lakukan smoke test terpisah terhadap PostgreSQL lokal.

### Frontend component tests — Vitest + React Testing Library

Prioritaskan perilaku yang terlihat pengguna:

- Form menampilkan validasi untuk judul kosong.
- Loading/empty/error state tampil dengan benar.
- Task tampil dengan judul, deskripsi, dan status yang tepat.
- Click status/edit/delete memanggil action yang sesuai.
- State UI hanya berubah setelah API mutation sukses.
- API error ditampilkan dan tidak membuat task seolah-olah berhasil tersimpan.

Gunakan mock `fetch` atau mock API boundary untuk component tests. Jangan menjadikan mock sebagai pengganti pengujian backend sesungguhnya.

### Manual end-to-end smoke test

Sebelum submit, jalankan keseluruhan stack dengan PostgreSQL lokal dan uji manual:

1. Buka frontend.
2. Pastikan empty state terlihat ketika database kosong.
3. Tambahkan task.
4. Reload halaman dan pastikan task tetap ada.
5. Edit judul/deskripsi.
6. Ubah status dan pastikan perubahan bertahan setelah reload.
7. Hapus task dan pastikan task hilang.
8. Hentikan backend sebentar atau simulasikan error request dan periksa feedback UI.

Playwright E2E adalah **opsional**, bukan prioritas jika waktu terbatas.

## Commands yang diharapkan

Backend (dari direktori `backend/`, dengan `.venv` aktif):

```bash
python -m pytest -v
ruff check .
ruff format --check .
```

Frontend (dari `frontend/`):

```bash
npm run lint
npm test
npm run build
```

Jalankan command yang sudah dikonfigurasi di project. Jika command belum tersedia, konfigurasi script/tool terlebih dahulu atau laporkan secara eksplisit.

## Test quality guidelines

- Test harus memverifikasi behavior, bukan hanya bahwa function terpanggil.
- Beri nama test berdasarkan hasil/behavior yang diharapkan.
- Hindari ketergantungan antar-test dan reset state/database test secara aman.
- Tambahkan kasus error yang relevan, bukan hanya happy path.
- Jangan menulis test yang menduplikasi implementasi tanpa memverifikasi hasil eksternal.
- Laporkan jumlah test, hasil, dan test yang tidak dijalankan dengan jujur.
