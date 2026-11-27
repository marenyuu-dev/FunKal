# Dokumentasi FunKal (Function Kalkulator)

**Penulis:** Fakhri Riyadi · **Kelas:** XII RPL 1 · **Projek:** PAS Kelas XII RPL 2026

## 1. Deskripsi
FunKal adalah aplikasi kalkulator berbasis web dengan dua mode: **Biasa** untuk perhitungan sehari-hari, dan **Ilmiah** yang menambahkan fungsi trigonometri, akar, logaritma natural, eksponensial, dan pangkat. Pengguna mengetik ekspresi dengan tombol di layar, dan aplikasi menghitungnya dengan prioritas operator serta menampilkan hasil sementara sebelum tombol `=` ditekan.

## 2. Fitur
| No | Fitur | Keterangan |
|---|---|---|
| 1 | Empat operasi dasar | `+`, `−`, `×`, `÷` |
| 2 | Operasi berantai | `10 + 12 × 2` menghasilkan 34 (perkalian lebih dulu) |
| 3 | Tanda kurung | Mengubah urutan perhitungan, misalnya `(2 + 3) × 4` |
| 4 | Persen (`%`) | Membagi angka dengan 100 (misalnya `50%` menjadi `0,5`); pada `+`/`−` dihitung relatif terhadap angka sebelumnya (misalnya `100 − 10%` menjadi `90`) |
| 5 | Desimal dan angka negatif | Memakai tombol koma |
| 6 | Hapus | `⌫` menghapus satu karakter, `C` menghapus semua |
| 7 | Hasil sementara | Hasil tampil di bawah ekspresi saat mengetik |
| 8 | Format angka Indonesia | Contoh: `2.993,7161893604` |
| 9 | Fungsi ilmiah | `sin`, `cos`, `tan`, `√`, `ln`, `exp`, `x²`, `xʸ`, `π` |
| 10 | DEG/RAD | Memilih satuan sudut untuk `sin`, `cos`, `tan` |
| 11 | Penanganan kesalahan | Misalnya pembagian dengan nol |
| 12 | Responsif | Nyaman di laptop dan HP |

## 3. Teknologi
HTML, CSS, dan JavaScript murni, tanpa library atau framework pihak ketiga.

## 4. Struktur folder
```
FunKal/
├── index.html
├── style.css
├── logic.js
├── script.js
├── README.md
├── CATATAN_PERUBAHAN.md
└── docs/
    ├── DOKUMENTASI.md
    ├── LAPORAN_PjBL_FunKal_Fakhri_Riyadi_v2.docx
    ├── LAPORAN_PjBL_FunKal_Fakhri_Riyadi_v3.docx
    └── gambar/
```

| File | Peran |
|---|---|
| `index.html` | Kerangka halaman: judul, pilihan mode, layar, dan tombol |
| `style.css` | Warna (termasuk tema terang/gelap otomatis), tata letak, tombol, dan tampilan responsif |
| `logic.js` | Otak kalkulator: `tokenisasi()`, parser *recursive descent* `evaluasi()`, `hitungEkspresi()`, dan pemformatan angka (tanpa `eval()`) |
| `script.js` | Menangani penekanan tombol & keyboard (`tekan()`), menyusun ekspresi, memanggil `hitungEkspresi()`, dan merender layar (`render()`) |
| `README.md` | Ringkasan proyek |
| `docs/` | Dokumentasi, laporan PjBL, dan tangkapan layar pengujian |

## 5. Cara menjalankan
1. Simpan semua file dalam satu folder
2. Buka `index.html` di browser

Atau buka tautan GitHub Pages pada bagian 11.

## 6. Cara penggunaan
1. Pilih mode **Biasa** atau **Ilmiah** di bagian atas
2. Tekan tombol angka dan operator untuk menyusun ekspresi. Ekspresi tampil di layar, dan hasil sementara tampil di bawahnya
3. Tekan `=` untuk menampilkan hasil akhir
4. `⌫` menghapus satu karakter terakhir, `C` menghapus semuanya
5. Pada mode Ilmiah, tekan tombol fungsi (misalnya `sin`, `√`, `ln`) lalu isi angkanya. Kurung dipakai untuk membatasi isi fungsi

**DEG dan RAD**
- **DEG** (derajat): satu putaran penuh = 360°
- **RAD** (radian): satu putaran penuh = 2π
- Tombol `DEG` menampilkan mode yang aktif, dan menekannya berpindah ke `RAD`

| Ekspresi | Mode DEG | Mode RAD |
|---|---|---|
| `sin(30)` | 0,5 | −0,988 |
| `sin(90)` | 1 | 0,894 |
| `sin(π÷2)` | 0,0274 | 1 |

**Contoh**
| Ketik | Hasil |
|---|---|
| `2+3×4` | 14 |
| `(2+3)×4` | 20 |
| `√(16)` | 4 |
| `2^10` (dengan `xʸ`) | 1.024 |
| `(1+1÷365)^365` | ±2,7146 (mendekati bilangan e) |

## 7. Penjelasan kode

### 7.1 Alur kerja
1. Pengguna menekan tombol di layar (`klik()`) atau tombol keyboard (`keydown`), lalu `tekan(k)` di `script.js` memperbarui string `ekspr` dengan validasi (misalnya mencegah dua operator berurutan atau dua koma dalam satu angka)
2. Saat mengetik, `pratinjau()` memanggil `tutupOtomatis(ekspr)` lalu `hitungEkspresi()` untuk menampilkan hasil sementara
3. Di `logic.js`, `tokenisasi()` memecah ekspresi menjadi token (angka, operator, kurung, fungsi, konstanta)
4. `evaluasi()` menghitung token memakai parser *recursive descent* sesuai prioritas operator dan tanda kurung
5. Pada mode `DEG` (`derajat = true`), `evaluasi()` mengonversi argumen `sin`, `cos`, `tan` ke radian
6. `bulatkan()` (presisi 15 digit signifikan) dan `formatAngka()` memformat hasil ke format Indonesia (`id-ID`)
7. Tombol `=` menutup kurung yang belum ditutup dengan `tutupOtomatis()`, menghitung hasil akhir lewat `hitungEkspresi()`, dan `render()` menampilkannya ke layar

### 7.2 Prioritas operator
Urutan dari yang paling dahulu dihitung: kurung, fungsi dan pangkat (`^`), perkalian dan pembagian (`×`, `÷`), lalu penjumlahan dan pengurangan (`+`, `−`). Karena itu `10 + 12 × 2` menghasilkan 34, bukan 44.

### 7.3 Satuan sudut
Pada mode DEG, sudut diubah ke radian sebelum dihitung, yaitu `radian = derajat × π ÷ 180`.

### 7.4 Teks dan tampilan
Di `script.js`, fungsi `render()` menggunakan `el.textContent` (bukan `innerHTML`) saat menampilkan ekspresi, hasil, dan pesan galat ke elemen layar, sehingga aman dari injeksi HTML.

## 8. Penanganan kesalahan

| Kondisi | Penanganan |
|---|---|
| Pembagian dengan nol (`5÷0`) | Menampilkan pesan `"Tidak bisa dibagi nol"` |
| Akar atau `ln` dari angka tidak valid (`√(-1)`, `ln(0)`) | Menampilkan pesan `"Hasil tidak terdefinisi"` |
| `tan(90)` pada mode DEG | Menampilkan pesan `"tan tidak terdefinisi di sudut ini"` |
| Kurung tidak seimbang | Kurung buka yang belum ditutup otomatis ditutup oleh `tutupOtomatis()` saat menekan `=`; tombol `)` ditolak jika tidak ada `(` yang terbuka. Jika tetap tidak valid, tampil `"Kurung tidak seimbang"` / `"Kurung belum ditutup"` |
| Ekspresi tidak lengkap (diakhiri operator) | Menampilkan pesan `"Ekspresi belum lengkap"` |
| Angka/hasil terlalu besar (`>= 1e12`) | Menampilkan pesan `"Hasil melebihi batas (maksimal 999.999.999.999)"` |

## 9. Pengujian
Skenario dan hasil lengkap (15 kasus uji, seluruhnya berstatus **Sesuai**) tercantum pada Tabel 4.1 di `docs/LAPORAN_PjBL_FunKal_Fakhri_Riyadi_v3.docx`.

## 10. Pemeliharaan
- **Mengganti warna:** ubah variabel warna di bagian atas `style.css`
- **Menambah fungsi ilmiah baru:** tambahkan tombol di `index.html`, tambahkan fungsi di `FUNGSI` pada `logic.js`, serta penanganannya di `tekan()` pada `script.js`

## 11. Distribusi
- Repository: https://github.com/marenyuu-dev/FunKal
- Aplikasi online: https://marenyuu-dev.github.io/FunKal/
- Cara memakai: buka tautan aplikasi online di browser, atau unduh repository lalu buka `index.html`

## 12. Referensi dan alat bantu
- **Pedoman desain:** Material Design (ukuran area sentuh, kontras warna) dan Apple Human Interface Guidelines
- **Alat bantu:** Claude (AI, Anthropic), digunakan pada November 2026 untuk merancang tata letak awal, menyusun struktur kode, dan membuat kerangka pengujian. Seluruh kode telah dipelajari, diuji, dan disesuaikan oleh penulis
- **Aset pihak ketiga:** tidak ada (tanpa library, font, gambar, atau ikon dari luar)

## 13. Batasan dan pengembangan lanjutan
**Batasan:** hasil perhitungan dibatasi kurang dari 1 triliun (maksimal `999.999.999.999`), ketelitian angka mengikuti floating-point JavaScript (dibulatkan ke 15 digit signifikan dengan maksimal 10 digit desimal pada tampilan), dan belum memiliki fitur riwayat perhitungan.

**Pengembangan lanjutan:**
- Tab **Graphwar** untuk memasukkan fungsi `y = f(x)`, melihat grafiknya, dan menghitung koordinat untuk nilai `x` tertentu
- Riwayat perhitungan
- PWA agar dapat dipasang dan dipakai tanpa koneksi internet
