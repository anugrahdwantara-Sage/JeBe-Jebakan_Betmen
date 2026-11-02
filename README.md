# MIT WEEK 2026 — JeBe-Jebakan_Betmen

JeBe membantu anak muda Indonesia menilai pesan, tautan, atau postingan yang meragukan. Analisis dilakukan dengan aturan lokal untuk mengenali pola permintaan informasi rahasia, pembayaran, tekanan waktu, tawaran mencurigakan, dan tautan.

## Fitur

- Analisis berbasis aturan tanpa API Gemini, API key, atau layanan AI eksternal.
- Penjelasan tanda yang terdeteksi dengan kutipan bukti dari pesan dan saran langkah aman.
- Analisis contoh interaktif untuk mencoba alur tanpa memakai pesan pribadi.
- Validasi input, batas panjang pesan, dan pembatasan permintaan sementara.

## Menjalankan secara lokal

Perlu Node.js 20 atau lebih baru. Jalankan:

```powershell
npm.cmd start
```

Kemudian buka `http://localhost:3000`. Jika diperlukan, atur `PORT` melalui environment variable.

## Privasi dan batasan

Analisis dilakukan di server JeBe menggunakan pola teks yang telah ditentukan; isi pesan tidak dikirim ke Google Gemini atau layanan AI eksternal. Server tidak menyimpan isi pesan atau respons analisis ke database dan tidak mencatat isi request. Server menyimpan penghitung pembatasan permintaan berdasarkan alamat IP di memori sementara; datanya hilang ketika server dimulai ulang.

Pemeriksaan berbasis aturan sederhana dapat melewatkan tanda bahaya atau salah menandai pesan. Tautan tidak dibuka atau diverifikasi. Tingkat risiko rendah bukan bukti bahwa pesan aman, dan hasilnya bukan kepastian bahwa pesan adalah penipuan. Verifikasi tetap melalui kanal resmi.

## Deployment

Deploy aplikasi Node.js ini pada layanan yang mendukung Node.js 20+, gunakan perintah `npm start`, dan gunakan HTTPS untuk deployment publik.
