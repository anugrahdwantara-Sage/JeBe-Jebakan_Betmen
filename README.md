# JeBe — Jebakan Betmen

JeBe adalah aplikasi web untuk membantu anak muda Indonesia mengenali tanda-tanda pesan digital yang mencurigakan dan memilih langkah yang lebih aman. JeBe berfokus pada pendekatan **Recognize (Mengenali)** dan **Act (Bertindak)** dalam studi kasus MIT-WEEK 2026: pengguna dapat memeriksa pesan, melihat frasa yang memicu tanda bahaya, memahami alasannya, lalu mendapat saran tindakan.

JeBe adalah alat bantu edukasi, bukan layanan verifikasi atau penentu pasti bahwa pesan merupakan penipuan.

## Tautan submission

Lengkapi tautan berikut sebelum mengirim submission:

- **Live deployment:** `ISI DENGAN URL NETLIFY`
- **Repositori GitHub publik milik Ketua Tim:** `ISI DENGAN URL REPOSITORY`
- **Video demonstrasi (maksimal 5 menit):** `ISI DENGAN URL VIDEO`

Video demo sesuai juknis perlu memuat pengenalan singkat tim dan demonstrasi fitur utama. Pastikan repository dapat diakses publik dan deployment dapat dibuka tanpa akun.

## Fitur utama

- Menganalisis pesan berdasarkan aturan kata dan frasa; hasil berubah sesuai teks yang dimasukkan pengguna.
- Menampilkan kategori sinyal, contoh frasa yang terdeteksi, dan alasan kewaspadaan.
- Memberikan langkah aman yang sesuai dengan sinyal yang ditemukan.
- Memeriksa 12 kategori: rahasia akun, data pribadi, pembayaran, tekanan waktu, ancaman akun, hadiah, tawaran kerja, identitas pengirim, tautan, investasi, aplikasi atau akses perangkat, dan permintaan merahasiakan sesuatu.
- Menghitung skor dari bobot kategori yang terdeteksi. Satu kategori hanya dihitung sekali walaupun frasanya muncul berulang: **0–3 rendah, 4–7 sedang, dan 8 atau lebih tinggi**.
- Menyediakan contoh pesan fiktif untuk mencoba alur tanpa memakai pesan pribadi.

## Cara menggunakan

1. Buka live deployment JeBe.
2. Tulis pesan yang membuatmu ragu, atau pilih salah satu tombol contoh.
3. Tekan **Cek dengan rule JeBe**.
4. Baca tingkat risiko, kategori dan frasa yang ditemukan, serta langkah aman yang disarankan.
5. Jika pesan mengatasnamakan organisasi, konfirmasi melalui aplikasi atau kontak resmi yang kamu cari sendiri—jangan melalui tautan atau nomor yang disertakan dalam pesan mencurigakan.

Untuk mencoba fitur utama, gunakan contoh fiktif berikut:

| Input | Hasil yang diharapkan |
|---|---|
| `Selamat, Anda menang hadiah undian. Kirim uang Rp2.000.000 sebagai konfirmasi.` | Risiko tinggi; sinyal hadiah dan pembayaran, serta saran untuk tidak mentransfer sebelum verifikasi |
| `Akun Anda akan diblokir. Kirim kode OTP sekarang.` | Risiko tinggi; sinyal ancaman akun dan rahasia akun |
| `Hai, jadi ketemu sore ini di perpustakaan seperti biasa?` | Risiko rendah; tidak ada frasa berisiko yang dikenali |

Hasil dapat berbeda jika kata atau susunan kalimat diubah karena pemeriksaan berbasis aturan, bukan pemahaman bahasa seperti manusia.

## Teknologi dan struktur

- **Frontend:** HTML, CSS, dan JavaScript tanpa framework.
- **Backend lokal:** server HTTP bawaan Node.js.
- **Backend Netlify:** Netlify Function pada `netlify/functions/analyze.js`.
- **Mesin aturan:** `analyzer.js`, digunakan bersama oleh server lokal dan Netlify Function.
- **Routing Netlify:** `netlify.toml` menerbitkan file web dari root repository dan meneruskan `POST /api/analyze` ke Function analisis.
- Tidak ada database, API key, atau layanan AI pihak ketiga yang diperlukan.

Alur analisis: browser mengirim teks ke `POST /api/analyze`, backend memvalidasi format dan panjang pesan, lalu mesin aturan mengembalikan tingkat risiko, daftar sinyal, bukti frasa, dan langkah aman dalam JSON. Batas panjang pesan adalah 3.000 karakter. Isi pesan tidak disimpan oleh aplikasi.

## Menjalankan secara lokal

Persyaratan: Node.js 20 atau lebih baru. Tidak diperlukan instalasi dependency atau API key.

Di Windows PowerShell:

```powershell
npm.cmd start
```

Di macOS/Linux:

```sh
npm start
```

Buka `http://localhost:3000`. Perintah ini menjalankan server lokal dan endpoint analisis.

## Deployment ke Netlify

Repository ini sudah menyertakan konfigurasi Netlify di `netlify.toml` dan endpoint Function di `netlify/functions/analyze.js`.

1. Push seluruh source code ke repository GitHub publik milik Ketua Tim.
2. Di Netlify, impor repository tersebut sebagai situs baru.
3. Biarkan konfigurasi build membaca `netlify.toml`. Build command tidak diperlukan; publish directory harus `.` dan direktori Functions `netlify/functions`.
4. Deploy, lalu buka URL HTTPS yang diberikan Netlify.
5. Uji contoh hadiah dan pesan biasa langsung pada URL publik. Pastikan halaman terbuka dan hasil analisis muncul, bukan hanya berhasil di komputer lokal.
6. Setelah setiap perubahan, push ke branch yang terhubung dan tunggu deployment terbaru berstatus berhasil.

Pastikan pengaturan build manual di dashboard Netlify tidak menimpa nilai pada `netlify.toml`. Untuk penilaian, tautan live deployment adalah jalur utama; siapkan rekaman demonstrasi sebagai materi pendukung sesuai juknis.

## Privasi, keamanan, dan batasan

- Teks yang dimasukkan dikirim ke server JeBe untuk dicocokkan dengan aturan, tetapi aplikasi tidak meneruskannya ke layanan AI pihak ketiga dan tidak menyimpan isi pesan.
- Jangan memasukkan kata sandi, OTP, informasi pembayaran, atau data pribadi. Hindari menyalin pesan yang memuat informasi sensitif.
- Gunakan contoh fiktif untuk demo. JeBe tidak menghosting atau mengirimkan konten penipuan nyata.
- Pemeriksaan menggunakan pencocokan kata dan frasa. JeBe dapat melewatkan variasi bahasa, konteks, atau ejaan, dan dapat menandai frasa yang sebenarnya tidak berbahaya.
- Risiko rendah bukan bukti pesan aman; risiko tinggi juga bukan kepastian bahwa pesan adalah penipuan.
- JeBe tidak membuka tautan, memeriksa reputasi domain, atau memverifikasi identitas pengirim. Verifikasi informasi melalui kanal resmi.
- Server lokal membatasi jumlah permintaan per alamat IP dalam memori sementara. Batas tersebut hilang saat server dimulai ulang dan tidak digunakan oleh Netlify Function pada konfigurasi saat ini.

## Lisensi dan sumber daya

- Google Fonts menyediakan font **DM Sans** dan **Space Grotesk** yang digunakan pada antarmuka. Browser dapat meminta file font ke Google Fonts; teks pesan yang diperiksa tidak dikirim ke layanan font tersebut.
- JeBe tidak membutuhkan dependency npm eksternal untuk menjalankan aplikasi.
- Cantumkan lisensi untuk aset, template, library, atau kode pihak ketiga tambahan apabila ada. Juknis mewajibkan penggunaan sumber daya pihak ketiga yang signifikan dicantumkan dalam dokumentasi proyek.
