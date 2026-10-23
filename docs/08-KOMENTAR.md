# Panduan Komentar Kode

Panduan ini berlaku untuk frontend React/JavaScript dan backend Python/FastAPI di project Task Tracker.

## Prinsip utama

Tulis kode yang mudah dipahami dari nama variabel, fungsi, komponen, dan alurnya. Tambahkan komentar hanya jika ada alasan atau konteks penting yang tidak terlihat langsung dari kode.

- Gunakan Bahasa Indonesia yang singkat, jelas, dan natural.
- Pertahankan istilah teknis, nama library, identifier, dan nama API sesuai bentuk aslinya.
- Jelaskan **mengapa** keputusan atau penanganan tertentu diperlukan, bukan sekadar **apa** yang dilakukan kode.
- Jangan menambahkan komentar pada setiap baris atau fungsi.
- Jangan mengulang informasi yang sudah jelas dari nama dan isi kode.
- Perbarui atau hapus komentar saat implementasi berubah. Komentar yang tidak lagi benar lebih buruk daripada tidak ada komentar.
- Untuk project ini, gunakan komentar biasa saja. **Jangan menambahkan docstring atau JSDoc.** Gunakan nama yang jelas, type hints, dan struktur kode untuk membantu menjelaskan kontrak.

## Kapan komentar diperlukan?

Tambahkan komentar jika reviewer mungkin perlu tahu:

- Alasan suatu pendekatan dipilih.
- Aturan bisnis atau batasan dari library/API yang tidak terlihat langsung.
- Mengapa urutan operasi tertentu penting.
- Alasan sebuah kondisi, validasi, atau penanganan error diperlukan.
- Tujuan workaround yang tidak bisa dipahami dari kode saja.

Contoh komentar yang baik di Python:

```python
# Impor model ini sebelum create_all agar tabelnya terdaftar di metadata.
SQLModel.metadata.create_all(engine)
```

Komentar tersebut menjelaskan alasan yang mungkin tidak langsung terlihat oleh reviewer.

Contoh yang tidak perlu:

```python
# Membuat tabel di database.
SQLModel.metadata.create_all(engine)
```

Baris kodenya sudah cukup menjelaskan operasi yang dilakukan. Hapus komentarnya.

Contoh komentar yang baik di JavaScript:

```javascript
// Perbarui daftar setelah server mengembalikan data terbaru.
const updatedTask = await updateTask(taskId, payload);
setTasks((currentTasks) =>
  currentTasks.map((task) =>
    task.id === updatedTask.id ? updatedTask : task
  )
);
```

Contoh yang tidak perlu:

```javascript
// Mengatur status loading menjadi true.
setIsLoading(true);
```

Nama fungsi sudah menjelaskan operasinya. Komentar itu tidak menambah informasi.

## Gaya penulisan

- Letakkan komentar dekat dengan kode yang dijelaskan.
- Usahakan satu komentar cukup satu atau dua kalimat.
- Gunakan kalimat langsung; hindari paragraf panjang di dalam source code.
- Hindari komentar untuk sesuatu yang lebih baik diperbaiki lewat nama atau struktur kode.
- Hindari komentar sementara seperti `TODO` sebagai pengganti implementasi. Jika TODO benar-benar diperlukan selama development, pastikan sudah diselesaikan atau dijelaskan sebelum submission.
- Jangan menuliskan klaim yang belum diverifikasi sebagai fakta.
- Jangan menyebut penggunaan AI di komentar. Pastikan kode bisa dipahami, diuji, dan dipertanggungjawabkan saat interview.
- Simpan penjelasan setup atau penggunaan yang panjang di `README.md` atau folder `docs/`, bukan sebagai komentar di source code.

## Checklist sebelum commit atau submission

- [ ] Komentar menggunakan Bahasa Indonesia yang singkat dan jelas.
- [ ] Setiap komentar menjelaskan alasan atau konteks yang memang dibutuhkan.
- [ ] Tidak ada komentar yang hanya mengulang apa yang dilakukan kode.
- [ ] Tidak ada docstring atau JSDoc; gunakan komentar biasa saja.
- [ ] Komentar masih sesuai dengan implementasi terbaru.
- [ ] Tidak ada TODO sementara, debug print, atau komentar yang menutupi kode yang membingungkan.
