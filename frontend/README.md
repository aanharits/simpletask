# Frontend — SimpleTask

Aplikasi antarmuka web task management berbasis React 19, Vite, dan Tailwind CSS v4.

---

## Daftar Library

| Library | Fungsi |
| :--- | :--- |
| `react` / `react-dom` | Core UI library deklaratif berbasis komponen untuk rendering antarmuka pengguna. |
| `axios` | HTTP client untuk komunikasi REST API ke backend dengan normalisasi error terpusat. |
| `tailwindcss` | Utility-first CSS framework v4 berbasis CSS-first tokens (`@theme`). |
| `@tailwindcss/vite` | Plugin resmi Tailwind CSS untuk integrasi langsung ke build pipeline Vite. |
| `vite` | Build tool dan development server berkecepatan tinggi dengan Hot Module Replacement (HMR). |
| `vitest` | Test runner native Vite untuk eksekusi unit dan integration testing. |
| `@testing-library/react` | Library pengujian komponen React berbasis perilaku interaksi pengguna (*user-centric*). |
| `@testing-library/dom` | Core query selector berbasis aksesibilitas DOM. |
| `@testing-library/user-event` | Simulasi interaksi pengguna nyata di browser (click, type, select). |
| `@testing-library/jest-dom` | Custom DOM matcher untuk assertions pengujian (contoh: `toBeInTheDocument`). |
| `jsdom` | Simulasi browser DOM environment di Node.js untuk eksekusi unit test. |
| `eslint` | Linter statis untuk menjaga standar dan kualitas kode JavaScript. |
| `eslint-plugin-react-hooks` | Penegak aturan resmi React Hooks. |

---

## Struktur Folder

```text
src/
├── api/                # Konfigurasi Axios instance dan endpoint HTTP request
│   ├── client.js       # Instance Axios terpusat (baseURL, timeout, headers) + normalisasi error
│   └── tasks.js        # Fungsi API CRUD tasks
│
├── constants/
│   └── task.js         # Single source of truth: status task, filter, batas validasi, metadata kolom
│
├── components/
│   ├── layout/         # Kerangka halaman
│   │   ├── Header.jsx  # Breadcrumb, task counter badge, search, tombol toggle form
│   │   └── Footer.jsx
│   │
│   ├── ui/             # Komponen generik tanpa pengetahuan domain task (reusable)
│   │   ├── Button.jsx       # Tombol dasar dengan variant primary & secondary
│   │   ├── EmptyState.jsx   # Blok kosong/error: ikon, judul, deskripsi, aksi
│   │   ├── LoadingState.jsx # Spinner + pesan loading yang aksesibel
│   │   └── Toast.jsx        # Floating toaster container dan item notifikasi
│   │
│   └── task/           # Komponen fitur task
│       ├── TaskBoard.jsx          # Orchestrator board: empty state, Kanban, atau grid sesuai filter
│       ├── StatusFilterTabs.jsx   # Tab filter Board / Todo / In Progress / Done + jumlah task
│       ├── KanbanColumn.jsx       # Kolom Kanban (drop target, limit 3 kartu + expand/collapse)
│       ├── TaskGrid.jsx           # Grid responsif saat tab status tunggal aktif
│       ├── StatusColumnHeader.jsx # Header kolom: ikon status, judul, jumlah (KanbanColumn & TaskGrid)
│       ├── TaskForm.jsx           # Form terkontrol reusable (Create & Edit)
│       ├── TaskCreatePanel.jsx    # Panel accordion untuk membuat task baru
│       └── task-card/             # Kartu task beserta sub-komponennya
│           ├── TaskCard.jsx         # Orchestrator kartu (menghubungkan useTaskCard ke sub-komponen)
│           ├── TaskCardBody.jsx     # Judul, deskripsi, meta ID, progress badge
│           ├── TaskCardFooter.jsx   # Quick status, tombol aksi, konfirmasi hapus 2 langkah
│           ├── TaskCardEditView.jsx # Mode edit inline
│           └── TaskCardError.jsx    # Banner error lokal per kartu
│
├── hooks/              # Custom hooks (business logic & state controller)
│   ├── useTasks.js          # State data, CRUD request, loading, tracking request per task
│   ├── useTaskPage.js       # Controller halaman: search, filter, visibilitas form, fokus, toast
│   ├── useTaskCard.js       # Controller kartu: edit, konfirmasi hapus, sync status, drag start
│   ├── useBoardDragDrop.js  # Controller drag-and-drop antar kolom Kanban
│   └── useToast.js          # Antrean notifikasi dengan auto-dismiss timer
│
├── test/               # Test suite (Vitest + Testing Library)
│   ├── setup.js
│   ├── client.test.js, useTasks.test.js, useTaskPage.test.js, useToast.test.js
│   └── App.test.jsx, TaskBoard.test.jsx, TaskCard.test.jsx, Toast.test.jsx
│
├── assets/image.png    # Screenshot preview untuk README root
├── App.jsx             # Root presenter: merangkai layout, panel, dan board
├── index.css           # Tailwind v4 theme tokens, keyframe animasi, utility classes
└── main.jsx            # Entry point React ke DOM (#root)
```

> Import memakai alias `@/` → `src/` (dikonfigurasi di `vite.config.js` dan `jsconfig.json`),
> misalnya `import Button from '@/components/ui/Button'`.

**Aturan penempatan komponen:**
- `ui/` — generik, tidak tahu apa itu "task"; bisa dipindah ke project lain apa adanya.
- `layout/` — kerangka halaman (header, footer).
- `task/` — semua yang berkaitan dengan domain task.

---

## Perintah Eksekusi

```bash
# Menjalankan development server lokal (http://localhost:5173)
npm run dev

# Menjalankan seluruh test suite otomatis (52 tests)
npm test

# Menjalankan test dalam mode watch interaktif
npm run test:watch

# Memeriksa standar dan kualitas kode (ESLint)
npm run lint

# Membangun bundle produksi teroptimasi ke dist/
npm run build

# Menjalankan preview dari build produksi
npm run preview
```
