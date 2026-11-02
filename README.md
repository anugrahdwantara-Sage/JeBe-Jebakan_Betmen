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

Kemudian buka `http://localhost:3000`. Opsional: atur `GEMINI_MODEL` atau `PORT` melalui environment variable. Server membaca hanya `GEMINI_API_KEY` dari `secret/.env`; file `.env.example` tidak dibaca otomatis.

## Privasi dan batasan

Pesan yang dikirim untuk dianalisis diteruskan ke Google Gemini API. Jangan masukkan kata sandi, OTP, informasi pembayaran, atau data pribadi. JeBe tidak menyimpan isi pesan atau respons analisis ke database dan tidak mencatat isi request. Server menyimpan penghitung pembatasan permintaan berdasarkan alamat IP di memori sementara; datanya hilang ketika server dimulai ulang.

Gemini hanya menganalisis teks yang dikirim dan tidak membuka atau memverifikasi reputasi tautan. Analisis AI dapat keliru: tingkat risiko rendah bukan bukti bahwa pesan aman, dan hasilnya bukan kepastian bahwa pesan adalah penipuan. Verifikasi tetap melalui kanal resmi. Kebijakan pemrosesan data Google Gemini juga berlaku pada pesan yang dikirim ke layanannya.

## Deployment

Deploy aplikasi Node.js ini pada layanan yang mendukung Node.js 20+, gunakan perintah `npm start`, dan masukkan `GEMINI_API_KEY` melalui pengaturan secret/environment variable hosting. Jangan menyajikan aplikasi ini sebagai file statis saja: endpoint backend dibutuhkan untuk menjaga API key tetap rahasia. Gunakan HTTPS untuk deployment publik.
