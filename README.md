# MIT WEEK 2026 — JeBe-Jebakan_Betmen

JeBe membantu anak muda Indonesia menilai pesan, tautan, atau tawaran yang meragukan. Pemeriksa menggunakan aturan berbasis kata dan frasa untuk menunjukkan sinyal, memberikan contoh bukti dari pesan, dan menyarankan langkah aman.

## Fitur

- Rule-based analyzer tanpa API AI atau layanan pihak ketiga.
- Pemeriksaan beberapa kategori: rahasia akun, data pribadi, pembayaran, tekanan waktu, ancaman akun, hadiah, tawaran kerja, identitas pengirim, tautan, investasi, akses perangkat, dan permintaan merahasiakan sesuatu.
- Skor risiko menggabungkan bobot tiap kategori (0–3 rendah, 4–7 sedang, 8+ tinggi); sinyal dalam kategori yang sama tidak dihitung berulang.
- Hasil menjelaskan frasa yang cocok dan langkah aman yang relevan.
- Contoh interaktif untuk mencoba alur tanpa memakai pesan pribadi.
- Validasi input, batas panjang pesan, dan pembatasan permintaan sementara.

Aturan dapat melewatkan variasi bahasa atau salah menandai frasa. Hasil berisiko rendah bukan bukti bahwa pesan aman dan hasil tinggi bukan kepastian bahwa pesan adalah penipuan.

## Menjalankan secara lokal

Perlu Node.js 20 atau lebih baru. Tidak diperlukan API key atau instalasi dependency.

```powershell
npm.cmd start
```

Kemudian buka `http://localhost:3000`.

## Privasi dan batasan

Teks pesan dikirim ke server JeBe untuk dicocokkan dengan aturan dan tidak diteruskan ke layanan AI pihak ketiga. JeBe tidak menyimpan isi pesan atau respons analisis. Server menyimpan penghitung pembatasan permintaan berdasarkan alamat IP di memori sementara; datanya hilang ketika server dimulai ulang. Hindari memasukkan kata sandi, OTP, informasi pembayaran, atau data pribadi.

JeBe tidak membuka tautan atau memverifikasi reputasi pengirim. Tautan yang terdeteksi hanya ditandai sebagai belum diverifikasi. Verifikasi tetap melalui kanal resmi.

## Deployment

Deploy aplikasi Node.js ini pada layanan yang mendukung Node.js 20+, gunakan perintah `npm start`, dan aktifkan HTTPS untuk deployment publik.

### Netlify

Konfigurasi [netlify.toml](./netlify.toml) mengatur root sebagai folder publik, mendaftarkan `netlify/functions` sebagai direktori Functions, dan meneruskan `/api/analyze` ke fungsi analisis. Hubungkan repository ke Netlify dan deploy ulang setelah perubahan ini; tidak perlu API key, build command, atau dependency tambahan. Pastikan pengaturan publish directory di Netlify tidak menimpa nilai `.` pada konfigurasi ini. Setelah deploy, coba alur analisis dari contoh hadiah dan pesan biasa.
