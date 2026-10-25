# SimpleTask — Frontend Client

Aplikasi antarmuka web modern untuk manajemen tugas (Task Management) yang dibangun dengan **React 19**, **Vite**, dan **Tailwind CSS v4**. Mengusung prinsip desain clean, responsif, dan interaktif dengan pengalaman Kanban board yang mulus baik di desktop maupun perangkat mobile.

---

## 📦 Daftar Library & Dependensi yang Digunakan

### Dependensi Utama (Production Dependencies)

| Library | Versi | Fungsi & Alasan Penggunaan |
| :--- | :--- | :--- |
| **`react`** | `^19.3.1` | Core UI library deklaratif untuk membangun antarmuka pengguna berbasis komponen. Menggunakan React 19 dengan performa rendering optimal dan ekosistem hooks modern. |
| **`react-dom`** | `^19.3.1` | Paket perekat antara React virtual DOM dengan Document Object Model (DOM) browser. |
| **`axios`** | `^1.20.0` | HTTP client berbasis Promise untuk komunikasi REST API ke backend. Dipilih dibanding `fetch` bawaan karena dukungan interceptor yang matang, otomatisasi serialisasi JSON, penanganan timeout, dan normalisasi format error yang konsisten. |
| **`tailwindcss`** | `^4.3.3` | Framework utility-first CSS generasi terbaru (Tailwind v4) dengan engine berkecepatan tinggi tanpa konfigurasi `tailwind.config.js` yang rumit. Menggunakan `@theme` berbasis CSS-first tokens. |
| **`@tailwindcss/vite`** | `^4.3.3` | Plugin resmi Tailwind CSS untuk integrasi langsung ke Vite pipeline, memastikan build CSS instan dan HMR super cepat. |

### Dependensi Pengembangan & Pengujian (DevDependencies)

| Library | Versi | Fungsi & Alasan Penggunaan |
| :--- | :--- | :--- |
| **`vite`** | `^8.3.4` | Build tool dan dev server generasi baru yang menyediakan Hot Module Replacement (HMR) dalam hitungan milidetik dan bundler production berbasis Rollup/esbuild. |
| **`@vitejs/plugin-react`** | `^6.1.2` | Plugin resmi Vite untuk mendukung transformasi JSX dan integrasi React Fast Refresh. |
| **`vitest`** | `^4.1.12` | Test runner modern yang berjalan secara native di atas arsitektur Vite. Sangat cepat, kompatibel dengan sintaks Jest, dan mengeksekusi test suite secara paralel. |
| **`@testing-library/react`** | `^16.3.3` | Library pengujian UI yang berfokus pada perilaku pengguna (*user-centric testing*) daripada detail implementasi internal. |
| **`@testing-library/dom`** | `^10.4.2` | Core query selector DOM berbasis aksesibilitas (getByRole, getByText, dll.). |
| **`@testing-library/user-event`** | `^14.6.8` | Simulasi interaksi pengguna nyata di browser (mengetik, mengklik, memilih opsi dropdown). |
| **`@testing-library/jest-dom`** | `^7.0.1` | Kumpulan custom matcher untuk Jest/Vitest (misal: `toBeInTheDocument()`, `toHaveValue()`). |
| **`jsdom`** | `^29.1.1` | Lingkungan virtual DOM browser di Node.js untuk mengeksekusi pengujian komponen tanpa browser fisik. |
| **`eslint`** | `^10.13.0` | Alat analisis kode statis untuk menjaga standar kualitas kode dan konsistensi sintaks. |
| **`eslint-plugin-react-hooks`** | `^7.1.1` | Penegak aturan resmi React Hooks (Rules of Hooks). |

---

## 📂 Struktur Folder & Fungsi Modul

```text
frontend/
├── public/                 # Aset statis yang disajikan langsung tanpa kompilasi
├── src/
│   ├── api/                # Layer integrasi jaringan dan HTTP request
│   │   ├── client.js       # Instance Axios terpusat (baseURL, timeout, headers)
│   │   └── tasks.js        # Service fungsi CRUD tasks & normalisasi error API
│   │
│   ├── components/         # Komponen presentasi UI modular
│   │   ├── Footer.jsx          # Komponen footer aplikasi
│   │   ├── Header.jsx          # Top bar: breadcrumb, task badge, search bar, toggle form
│   │   ├── KanbanColumn.jsx    # Kolom Kanban (Todo/In Progress/Done) dengan limit data & expand
│   │   ├── TaskBoard.jsx       # Board utama, tab switcher (Board/Grid), DnD orchestrator
│   │   ├── TaskCard.jsx        # Kartu task individual (badge status, inline edit, delete confirm)
│   │   ├── TaskCreatePanel.jsx # Panel accordion collapsible untuk membuat task baru
│   │   ├── TaskForm.jsx        # Form terkontrol yang reusable (untuk Create & Edit mode)
│   │   ├── TaskGrid.jsx        # Grid layout responsif saat tab filter status aktif
│   │   └── Toast.jsx           # Floating toaster container & toast notification alerts
│   │
│   ├── hooks/              # Custom React Hooks (Business Logic & State)
│   │   ├── useTasks.js     # Controller utama: mengelola data tasks, search filter, visibilitas form
│   │   └── useToast.js     # Manajer antrean notifikasi toaster dengan auto-dismiss timer
│   │
│   ├── test/               # Test suite otomatis (Vitest + React Testing Library)
│   │   ├── setup.js        # Konfigurasi awal test environment (jest-dom matcher)
│   │   ├── client.test.js  # Unit test untuk Axios client dan normalisasi error
│   │   ├── useTasks.test.js# Unit test logika controller hook useTasks
│   │   ├── useToast.test.js# Unit test logika antrean notifikasi useToast
│   │   ├── Toast.test.jsx  # UI test rendering komponen Toast
│   │   └── App.test.jsx    # Integration test alur lengkap CRUD pada komponen App
│   │
│   ├── App.jsx             # Root presentation component (Pure Presenter Layer)
│   ├── index.css           # Tailwind v4 theme, utility classes, dan keyframe animasi
│   └── main.jsx            # Entry point aplikasi React ke elemen #root di index.html
│
├── index.html              # HTML shell dengan meta tags SEO dan Google Fonts
├── package.json            # Manifest dependensi dan npm scripts
├── vite.config.js          # Konfigurasi bundler Vite dan Vitest runner
└── eslint.config.js        # Aturan linter ESLint
```

---

## 🏛️ Mengapa Memilih Pendekatan Arsitektur Ini?

### 1. Pola Pemisahan Tugas (Separation of Concerns: Controller vs Presentation)
* **`App.jsx` sebagai Pure Presentation Layer:**
  `App.jsx` tidak memiliki `useState`, `useEffect`, maupun query DOM manual. Tugasnya murni merangkai komponen modular (`Header`, `TaskCreatePanel`, `TaskBoard`, `ToastContainer`, `Footer`).
* **`useTasks.js` sebagai Central Controller Hook:**
  Seluruh logika state, komunikasi REST API, kalkulasi filter pencarian (`useMemo`), penanganan status form accordion, dan pemicu notifikasi toaster diisolasi ke dalam hook ini. Hal ini mencegah *state synchronization bugs* antar `useEffect` dan mempermudah unit testing independen.

### 2. Komponen Atomik & Reusable
* **`TaskForm.jsx` Reusable:** Satu komponen form yang sama digunakan untuk dua konteks berbeda: membuat task baru di `TaskCreatePanel` dan mengedit task secara *in-place* di dalam `TaskCard`. Tidak ada duplikasi kode validasi form.
* **Unified Prefix `Task*`:** Semua komponen yang berkaitan langsung dengan entitas task diberi awalan seragam (`TaskBoard`, `TaskCard`, `TaskCreatePanel`, `TaskForm`, `TaskGrid`), membuat struktur proyek rapi dan mudah dinavigasi oleh reviewer.

### 3. Native Drag & Drop tanpa Library Pihak Ketiga
* Menggunakan standar native **HTML5 Drag and Drop API** (`draggable`, `onDragStart`, `onDragOver`, `onDrop`).
* **Alasan:** Menghindari penambahan dependensi berat seperti `react-beautiful-dnd` atau `@hello-pangea/dnd` yang berukuran puluhan kilobyte dan sering kali belum kompatibel penuh dengan React 19. Pendekatan ini menjaga bundle production sangat ringan (~300 kB).

### 4. Responsivitas Mobile-First yang Ergonomis
* **Kanban Snap-Scroll di Mobile:** Pada layar kecil, tampilan Board tidak ditumpuk ke bawah (*vertical stack*) yang melelahkan untuk di-scroll, melainkan menggunakan horizontal snap-scroll (`snap-x snap-mandatory`). Pengguna cukup menggeser layar ke kiri/kanan untuk berpindah kolom Kanban.
* **Preservasi Desktop:** Di layar tablet/desktop (`sm:` ke atas), layout otomatis beralih menjadi 3 kolom sejajar tanpa ada perubahan tampilan yang mengganggu pengguna desktop.

---

## 🚀 Perintah yang Tersedia (NPM Scripts)

```bash
# Menjalankan local development server (http://localhost:5173)
npm run dev

# Menjalankan test suite secara menyeluruh (Vitest)
npm test

# Menjalankan test dalam mode watch (interaktif saat ngoding)
npm run test:watch

# Memeriksa kualitas kode dengan ESLint
npm run lint

# Membangun bundle production yang teroptimasi ke folder dist/
npm run build

# Menjalankan preview dari hasil build production
npm run preview
```
