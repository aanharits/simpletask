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
├── api/            # Konfigurasi Axios instance dan endpoint HTTP request
│   ├── client.js   # Instance Axios terpusat (baseURL, timeout, headers)
│   └── tasks.js    # Fungsi API CRUD tasks dan normalisasi format error
│
├── components/     # Komponen UI modular
│   ├── Header.jsx          # Top navigation: breadcrumb, task counter badge, search, toggle form
│   ├── TaskCreatePanel.jsx # Panel accordion collapsible untuk membuat task baru
│   ├── TaskForm.jsx        # Form input terkontrol reusable (digunakan saat Create dan Edit)
│   ├── TaskBoard.jsx       # Kanban board orchestrator, filter tabs, dan drag-and-drop
│   ├── KanbanColumn.jsx    # Kolom status Kanban (limit 3 data + expand/collapse, drop target)
│   ├── TaskCard.jsx        # Orchestrator kartu task (menghubungkan useTaskCard ke sub-komponen)
│   ├── task-card/          # Sub-komponen modular kartu task
│   │   ├── TaskCardBody.jsx     # Judul, deskripsi, meta ID, dan progress status badge
│   │   ├── TaskCardFooter.jsx   # Quick status dropdown, tombol aksi, dan dialog konfirmasi hapus
│   │   ├── TaskCardEditView.jsx # Tampilan pembungkus form saat mode edit inline aktif
│   │   └── TaskCardError.jsx    # Banner alert error lokal per kartu jika operasi gagal
│   ├── TaskGrid.jsx        # Layout multi-kolom responsif saat filter tab status aktif
│   ├── Toast.jsx           # Floating toaster container dan alert notifikasi
│   └── Footer.jsx          # Footer aplikasi
│
├── hooks/          # Custom React Hooks (Business Logic & State Controller)
│   ├── useTasks.js    # Controller utama: state data, CRUD request, search filter, form visibility
│   ├── useTaskCard.js # Controller kartu task: state edit, konfirmasi hapus, status sync, DnD
│   └── useToast.js    # Manajer antrean floating notification dengan auto-dismiss timer
│
├── test/           # Test suite otomatis (Vitest + Testing Library)
│   ├── setup.js          # Konfigurasi global DOM matchers
│   ├── client.test.js    # Pengujian Axios client dan normalisasi error
│   ├── useTasks.test.js  # Pengujian controller logic hook useTasks
│   ├── useToast.test.js  # Pengujian antrean notifikasi useToast
│   ├── TaskCard.test.jsx # Pengujian unit interaksi kartu task (render, status, edit, delete, error)
│   ├── Toast.test.jsx    # Pengujian rendering komponen Toast
│   └── App.test.jsx      # Pengujian integrasi alur kerja CRUD pada komponen App
│
├── App.jsx         # Pure presenter component (merangkai komponen UI tanpa inline logic)
├── index.css       # Tailwind v4 theme tokens, keyframe animasi, dan utility classes
└── main.jsx        # Entry point React ke DOM (#root)
```

---

## Perintah Eksekusi

```bash
# Menjalankan development server lokal (http://localhost:5173)
npm run dev

# Menjalankan seluruh test suite otomatis (43 tests)
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
