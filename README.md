# MIT WEEK 2026 — JeBe-Jebakan_Betmen

JeBe membantu anak muda Indonesia menilai pesan, tautan, atau postingan yang meragukan. Gemini menganalisis konteks pesan, menjelaskan tanda yang ditemukan dengan contoh dari teks, dan memberi saran langkah aman yang relevan.

## Fitur

- Analisis kontekstual melalui Gemini API dengan hasil Bahasa Indonesia.
- Penjelasan tanda bahaya dan bukti yang dikutip dari pesan, beserta langkah aman yang sesuai.
- Analisis contoh interaktif untuk mencoba alur tanpa memakai pesan pribadi.
- Persetujuan pengguna sebelum pesan dikirim ke Google Gemini.
- API key disimpan sebagai environment variable server, bukan di browser.
- Validasi input, batas panjang pesan, pembatasan permintaan sementara, dan penanganan kegagalan API.

## Menjalankan secara lokal

Perlu Node.js 20 atau lebih baru dan API key Gemini. Dapatkan API key melalui Google AI Studio. Jangan mengirim atau memasukkan API key ke source code atau chat.

Simpan key lokal pada `secret/.env`:

```text
GEMINI_API_KEY=API_KEY_MILIKMU
```

Folder `secret/` diabaikan Git sehingga file dan isinya tidak ikut di-push. File `.env.example` di root hanya contoh konfigurasi tanpa key sungguhan. Alternatifnya, atur environment variable `GEMINI_API_KEY`. Jika keduanya ada, environment variable lebih diutamakan.

Di PowerShell:

```powershell
$env:GEMINI_API_KEY = "API_KEY_MILIKMU"
npm.cmd start
```

Kemudian buka `http://localhost:3000`. Secara default, server memakai `gemini-3.8-flash`. Untuk memilih model lain, atur `GEMINI_MODEL` ke ID model yang tersedia dan mendukung `generateContent` untuk API key-mu; model Gemini 2.5 dapat dibatasi untuk pengguna yang pernah menggunakannya. Untuk mengganti model di PowerShell:

```powershell
$env:GEMINI_MODEL = "gemini-3.8-flash"
npm.cmd start
```

Jika server masih menampilkan model lama, cek dan perbarui atau hapus override `GEMINI_MODEL` pada environment tempat server dijalankan, lalu restart server. `PORT` juga dapat diatur melalui environment variable. Server membaca hanya `GEMINI_API_KEY` dari `secret/.env`; file `.env.example` tidak dibaca otomatis.

Jika analisis gagal, periksa pesan status di aplikasi: masalah API key atau akses ditandai terpisah dari kuota dan model yang tidak ditemukan. Pastikan API key aktif dan diizinkan memakai Gemini API, lalu pastikan nama model pada `GEMINI_MODEL` tersedia untuk key tersebut. Gangguan layanan Gemini dapat dicoba kembali beberapa saat kemudian.

## Privasi dan batasan

Pesan yang dikirim untuk dianalisis diteruskan ke Google Gemini API. Jangan masukkan kata sandi, OTP, informasi pembayaran, atau data pribadi. JeBe tidak menyimpan isi pesan atau respons analisis ke database dan tidak mencatat isi request. Server menyimpan penghitung pembatasan permintaan berdasarkan alamat IP di memori sementara; datanya hilang ketika server dimulai ulang.

Gemini hanya menganalisis teks yang dikirim dan tidak membuka atau memverifikasi reputasi tautan. Analisis AI dapat keliru: tingkat risiko rendah bukan bukti bahwa pesan aman, dan hasilnya bukan kepastian bahwa pesan adalah penipuan. Verifikasi tetap melalui kanal resmi. Kebijakan pemrosesan data Google Gemini juga berlaku pada pesan yang dikirim ke layanannya.

## Deployment

Deploy aplikasi Node.js ini pada layanan yang mendukung Node.js 20+, gunakan perintah `npm start`, dan masukkan `GEMINI_API_KEY` melalui pengaturan secret/environment variable hosting. Jangan menyajikan aplikasi ini sebagai file statis saja: endpoint backend dibutuhkan untuk menjaga API key tetap rahasia. Gunakan HTTPS untuk deployment publik.
