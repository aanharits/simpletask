# UI Design Guidelines — Task Tracker

## 1. Purpose

Gunakan dokumen ini sebagai arahan visual dan UX untuk Simple Task/Project Tracker pada technical test GLI. Targetnya adalah UI yang **clean, user-friendly, responsive, accessible, konsisten, dan mudah dipelihara**.

Design reference dipilih dari GetDesign:

```bash
npx getdesign@latest add mastercard
```

Jalankan command dari **root repository** sebelum mengimplementasikan frontend. Baca `DESIGN.md` yang dihasilkan dan gunakan sebagai referensi utama untuk color roles, typography, spacing, radii, elevation, dan component styling.

> **Penting:** GetDesign menyajikan analisis desain independen yang terinspirasi dari pola visual publik Mastercard; analisis ini bukan panduan resmi yang didukung Mastercard. Gunakan sebagai referensi desain, bukan untuk mengkloning situs pemasaran atau identitas merek Mastercard.

## 2. Design principles

1. **Clarity over decoration.** Task title, description, status, dan action harus menjadi fokus utama.
2. **Neutral-first palette.** Gunakan warm cream, off-white, dan warm near-black sebagai warna dasar. Warna accent harus dipakai secukupnya dan memiliki fungsi.
3. **Consistent tokens.** Semua warna, typography, spacing, border, radius, shadow, dan focus treatment harus menggunakan CSS custom properties/design tokens. Hindari nilai warna atau spacing yang tersebar sebagai magic numbers.
4. **Functional density.** Ini adalah task management UI, bukan marketing landing page. Adaptasi gaya Mastercard dengan lebih ringkas; jangan menyalin hero 64px, dekorasi orbital, atau layout marketing yang tidak membantu workflow task.
5. **Responsive by default.** Prioritaskan keterbacaan dan kelancaran CRUD pada mobile maupun desktop.
6. **Accessible interaction.** Setiap input memiliki label; semua action dapat dijalankan dengan keyboard; focus state terlihat; status tidak dibedakan dengan warna saja.
7. **Honest states.** Loading, empty, error, validation, disabled, dan success state harus dibedakan secara visual dan jelas kepada pengguna.

## 3. Apply the GetDesign preset

Setelah `npx getdesign@latest add mastercard` selesai:

1. Periksa `DESIGN.md` yang dihasilkan di root project.
2. Jangan menimpa atau mengganti token dari `DESIGN.md` secara diam-diam. Bila perlu adaptasi untuk task management app, lakukan secara konsisten dan jelaskan alasan adaptasinya.
3. Implementasikan token yang dibutuhkan di `frontend/src/index.css` menggunakan CSS custom properties pada `:root`.
4. Komponen harus merujuk token seperti `var(--color-canvas)`, bukan meng-hardcode nilai di masing-masing file.
5. Jika CLI gagal, jangan mengklaim preset telah terpasang. Laporkan error-nya, periksa instruksi CLI yang tersedia, dan gunakan panduan desain di dokumen ini sebagai fallback.
6. Review perubahan CLI sebelum menerima perubahan package/config apa pun. Jangan menambahkan dependency yang tidak dibutuhkan untuk styling.

### Palette reference

Nilai berikut terlihat pada preview preset Mastercard di GetDesign. **Jika `DESIGN.md` yang dihasilkan memuat nilai atau role berbeda, gunakan file hasil generator sebagai source of truth dan perbarui implementasi secara konsisten.**

| Role | Color | Usage guidance |
|---|---|---|
| Ink Black | `#141413` | Heading, body text utama, primary button, border berkontras tinggi. |
| Charcoal | `#262627` | Teks alternatif yang tetap kuat kontrasnya. |
| Canvas Cream | `#F3F0EE` | Background utama aplikasi. |
| Lifted Cream | `#FCFBFA` | Surface untuk area konten/form di atas canvas. |
| White | `#FFFFFF` | Surface modal atau elemen yang perlu pemisahan jelas. |
| Soft Bone | `#F4F4F4` | Surface netral alternatif, misalnya state ringan. |
| Slate Gray | `#696969` | Teks sekunder dan metadata; verifikasi kontras dengan background yang dipakai. |
| Granite | `#555555` | Teks pendukung yang membutuhkan kontras lebih kuat. |
| Dust Taupe | `#D1CDC7` | Border halus atau elemen disabled; jangan gunakan untuk teks normal yang perlu terbaca. |
| Signal Orange | `#CF4500` | Accent yang sangat terbatas; jangan jadikan warna dominan. |
| Light Signal Orange | `#F37338` | Indicator atau accent dekoratif kecil bila dibutuhkan. |
| Clay Brown | `#9A3A0A` | Link/action sekunder bila sesuai dengan contrast check. |
| Link Blue | `#3860BE` | Link atau informasi yang perlu dibedakan dari teks biasa. |

Preset menjelaskan Mastercard Red (`#EB001B`) dan Mastercard Yellow (`#F79E1B`) sebagai warna brand mark, **bukan warna UI umum**. Jangan menggunakan dua warna ini sebagai primary CTA atau dekorasi aplikasi hanya karena project memakai reference `mastercard`.

### Rules for color usage

- Primary action seperti `Add task` gunakan tombol ink/near-black dengan teks yang memiliki kontras memadai.
- Gunakan orange hanya sebagai accent kecil bila sesuai dengan role pada `DESIGN.md`; jangan mewarnai semua button, badge, border, dan icon dengan orange.
- Status `Todo`, `In Progress`, dan `Done` harus selalu memiliki label teks. Jangan mengandalkan warna saja.
- Jangan memakai `Dust Taupe` untuk body text, placeholder penting, atau informasi status yang wajib terbaca.
- Verifikasi kontras: target minimal WCAG 2.2 AA, yaitu 4.5:1 untuk teks normal dan 3:1 untuk teks besar serta komponen visual yang relevan.
- Bila perlu menambahkan semantic color baru untuk error/success, definisikan token eksplisit, pilih nilai yang accessible, dan jangan menyebarkan arbitrary hex ke komponen.

## 4. Typography

Gunakan font family dan type scale dari `DESIGN.md` hasil GetDesign. Preview preset menyebut Mark for MC dengan Sofia Sans sebagai alternatif open-source; jangan mengasumsikan font proprietary tersedia secara lokal.

- Pilih font yang benar-benar dapat dimuat oleh project dan sertakan fallback system font yang masuk akal.
- Jangan download atau commit font berlisensi/proprietary tanpa izin yang jelas.
- Gunakan weight yang cukup untuk readability; jangan memakai font terlalu tipis pada task title, form label, button, atau metadata penting.
- Body text utama sebaiknya sekitar 16px dengan line-height yang nyaman.
- Label/helper text dapat lebih kecil, tetapi hindari teks penting yang terlalu kecil atau berkontras rendah.
- Untuk task-management UI, adaptasi skala heading supaya kompak; jangan memakai ukuran hero marketing besar secara literal.
- Jaga hierarchy tetap jelas: page title, section heading, task title, body/description, metadata, form label, dan helper/error text.

## 5. Layout and component guidance

### Page structure

Gunakan struktur halaman yang sederhana dan berorientasi pada tugas:

1. Header ringan dengan nama aplikasi **Task Tracker**; jangan menggunakan logo/wordmark Mastercard.
2. Page title dan deskripsi singkat yang menjelaskan konteks halaman.
3. Form create task yang mudah ditemukan, dengan title wajib dan description opsional.
4. Task list dengan status yang tampak jelas dan action yang mudah dijangkau.
5. Empty/error/loading feedback pada area konten yang sama agar pengguna memahami keadaan aplikasi.

Jangan menambahkan statistik, chart, kalender, team/project navigation, login, filter kompleks, atau feature lain yang tidak diminta hanya untuk membuat UI tampak lebih penuh. Fitur tambahan bukan pengganti pemenuhan requirement utama.

### Task item/card

- Title harus menjadi teks paling menonjol di dalam item.
- Description tampil sebagai secondary content dan boleh wrapping; jangan memotongnya tanpa indikasi jika content penting.
- Status gunakan label/chip yang konsisten.
- Letakkan action `Edit`, status selector, dan `Delete` di lokasi konsisten.
- Hindari layout yang terlalu padat dan hindari card bersarang tanpa alasan.
- Untuk delete, gunakan konfirmasi yang proporsional atau pattern undo hanya jika implementasinya tetap sederhana dan jelas.

### Forms and buttons

- Setiap input memiliki label yang terlihat; jangan hanya mengandalkan placeholder.
- Tampilkan validasi dekat dengan field terkait dan jelaskan apa yang perlu diperbaiki.
- Gunakan loading/disabled state saat mutation sedang diproses agar pengguna tidak melakukan submit berkali-kali.
- Gunakan semantic `<button>` dengan action yang jelas; icon-only button harus punya accessible name.
- Pastikan enter/keyboard behavior masuk akal dan tidak menyebabkan form tidak sengaja terkirim.

### Surfaces, radii, and elevation

- Gunakan spacing dan radius dari preset `DESIGN.md`; jangan mencampur banyak gaya radius yang tidak konsisten.
- Tombol pill boleh dipakai sesuai reference, tetapi input dan task cards tetap harus praktis untuk penggunaan berulang.
- Gunakan shadow seperlunya. Separation melalui surface, spacing, dan border halus biasanya cukup untuk aplikasi kecil ini.
- Jangan memakai efek glassmorphism, gradient dekoratif, animasi mencolok, atau shadow berat kecuali ada kebutuhan UX yang jelas.

## 6. Responsive behavior

Implementasikan pendekatan mobile-first dan cek setidaknya ukuran berikut secara manual di browser:

- `360px` lebar: smartphone kecil.
- `390px` lebar: smartphone umum.
- `768px` lebar: tablet / viewport sempit.
- `1024px` lebar: laptop kecil.
- `1440px` lebar: desktop.

Expected behavior:

- Tidak ada horizontal overflow pada viewport yang didukung.
- Form dan task item berubah ke layout satu kolom pada layar kecil.
- Task actions tidak terpotong atau bergantung pada hover.
- Tap target nyaman digunakan, dengan target sekitar 44×44 CSS px untuk kontrol utama bila ruang memungkinkan.
- Spacing mengecil secara proporsional pada layar sempit, tetapi konten tidak saling menempel.
- Text panjang dan error messages wrapping dengan benar.
- Desktop tidak menggunakan full-width content yang terlalu lebar; gunakan max-width yang nyaman dibaca.

## 7. Interaction states

Implementasikan dan review state berikut:

- **Initial loading:** pengguna tahu data sedang dimuat.
- **Loaded:** task list menampilkan data yang diterima dari API.
- **Empty:** jelaskan bahwa belum ada task dan arahkan pengguna ke create form.
- **Create/update/delete pending:** cegah duplicate action dan tunjukkan feedback bila request cukup lama.
- **Validation error:** tampilkan pesan spesifik dekat input yang bermasalah.
- **API/network error:** tampilkan pesan yang dapat dipahami; pertahankan input/data agar pengguna tidak kehilangan pekerjaan.
- **Success:** UI diperbarui setelah server mengonfirmasi mutation berhasil.
- **Keyboard focus:** indikator focus terlihat untuk setiap kontrol interaktif.
- **Disabled:** bedakan secara visual dan jangan hanya mengandalkan perubahan warna yang terlalu samar.

Gunakan `prefers-reduced-motion` jika ada transition/animation yang tidak esensial. Animasi harus singkat dan membantu feedback, bukan memperlambat workflow.

## 8. Implementation rules

- Tetap gunakan React + JavaScript dan CSS biasa sesuai keputusan arsitektur project.
- Tidak perlu menambahkan Tailwind, component library, icon package, chart library, atau design-system package tanpa kebutuhan nyata.
- Simpan global design tokens dan base styles di `frontend/src/index.css`; component-specific rules berada dekat dengan komponen atau dalam CSS yang terstruktur jelas.
- Gunakan CSS custom properties untuk palette, typography, spacing, radius, shadow, border, dan focus ring.
- Hindari inline style untuk styling statis; gunakan class names yang deskriptif.
- Jangan menduplikasi nilai desain yang sama pada banyak komponen.
- Gunakan semantic HTML dan accessible names; cek heading hierarchy dan form labels.
- Jangan menambahkan logo Mastercard, brand mark dua lingkaran, wordmark, atau klaim afiliasi. Nama dan identitas aplikasi tetap Task Tracker.
- Hindari lorem ipsum dan dummy interactions. Tombol yang terlihat harus berfungsi atau tidak ditampilkan.

## 9. Design acceptance checklist

- [ ] Command GetDesign telah dijalankan di root repository atau kegagalannya dilaporkan secara jujur.
- [ ] `DESIGN.md` tersedia dan telah dibaca sebelum frontend styling dibuat.
- [ ] Semua warna/type/spacing/radius/shadow utama memakai design tokens.
- [ ] UI mengutamakan task workflow, bukan dekorasi marketing.
- [ ] Form create, task list, status editor, edit, dan delete memiliki affordance yang jelas sesuai implementasi.
- [ ] Loading, empty, error, validation, pending, disabled, dan focus states ditangani.
- [ ] Status memiliki label teks dan tidak hanya dibedakan dengan warna.
- [ ] Tidak ada horizontal overflow pada ukuran viewport target.
- [ ] Keyboard interaction, label form, focus-visible, dan contrast telah diperiksa.
- [ ] Tidak ada logo/wordmark Mastercard atau elemen yang menimbulkan kesan produk berafiliasi dengan Mastercard.
- [ ] Tidak ada dependency styling baru yang tidak diperlukan.
- [ ] Screenshot desktop dan mobile dapat ditambahkan ke README jika membantu reviewer memahami hasil.

## 10. References

- GetDesign — Mastercard design analysis: <https://getdesign.md/mastercard/design-md>
- GetDesign — Mastercard design preview: <https://getdesign.md/design-md/mastercard/preview>
- Mastercard official digital design foundation (reference only): <https://stage.perf.mastercard.us/content/designcenter/design-foundation.html>
- WCAG 2.2: <https://www.w3.org/TR/WCAG22/>
