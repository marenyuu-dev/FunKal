# FunKal (Function Kalkulator)

Aplikasi kalkulator berbasis web dengan dua mode, **Biasa** dan **Ilmiah**. Mendukung operasi berantai, tanda kurung, dan fungsi ilmiah. Berjalan di laptop dan HP, tanpa instalasi tambahan.

Dibuat oleh: **Fakhri Riyadi** — Kelas **XII RPL 1** — Projek PAS 2026

## Fitur
- **Mode Biasa:** empat operasi (`+`, `−`, `×`, `÷`), persen, tanda kurung, titik desimal (koma), hapus satu karakter (⌫), dan hapus semua (C)
- **Mode Ilmiah:** semua fitur mode Biasa ditambah `sin`, `cos`, `tan`, `√`, `ln`, `exp`, `x²`, `xʸ`, dan konstanta `π`
- **Pilihan satuan sudut DEG/RAD** untuk fungsi `sin`, `cos`, dan `tan`
- **Operasi berantai** dengan prioritas operator, misalnya `10 + 12 × 2 = 34`
- **Hasil sementara** tampil di bawah ekspresi saat mengetik, sebelum menekan `=`
- **Format angka Indonesia:** titik untuk pemisah ribuan dan koma untuk desimal
- **Penanganan kesalahan**, misalnya pembagian dengan nol
- Tampilan responsif untuk laptop dan HP, dengan tema biru dan **tema terang/gelap otomatis** mengikuti pengaturan perangkat (`prefers-color-scheme`)
- **Batas hasil maksimal `999.999.999.999`** (lebih kecil dari `1e12`) dan dukungan **keyboard fisik** (`Enter` untuk `=`, `Backspace` untuk `⌫`, `Escape`/`Delete` untuk `C`)

## Cara menjalankan
**Online:** buka tautan GitHub Pages: https://marenyuu-dev.github.io/FunKal/

**Offline:**
1. Unduh atau salin seluruh folder proyek
2. Buka `index.html` di browser (Chrome, Edge, Firefox, Safari)

## Struktur folder
```
FunKal/
├── index.html             Struktur halaman
├── style.css              Tampilan dan tema terang/gelap otomatis
├── logic.js               Otak kalkulator (tokenisasi, parser ekspresi, dan format angka)
├── script.js              Penghubung tampilan HTML, event tombol/keyboard, dan logic.js
├── README.md              Ringkasan proyek
├── CATATAN_PERUBAHAN.md   Ringkasan pembaruan laporan
└── docs/
    ├── DOKUMENTASI.md                              Dokumentasi teknis lengkap
    ├── LAPORAN_PjBL_FunKal_Fakhri_Riyadi_v2.docx   Laporan PjBL versi 2
    ├── LAPORAN_PjBL_FunKal_Fakhri_Riyadi_v3.docx   Laporan PjBL versi 3 (final)
    └── gambar/                                     Tangkapan layar pengujian aplikasi
```

## Dokumentasi
- [Dokumentasi lengkap](docs/DOKUMENTASI.md)

## Referensi dan alat bantu
Rancangan tampilan, struktur kode, dan kerangka pengujian disusun dengan bantuan AI (Claude, Anthropic), lalu dipelajari, diuji, dan disesuaikan oleh penulis. Rincian ada di [dokumentasi](docs/DOKUMENTASI.md#12-referensi-dan-alat-bantu).
