const rules = [
  {
    category: "Rahasia akun",
    weight: 10,
    pattern: /\b(?:kirim|mengirim|berikan|memberikan|bagikan|membagikan|minta|meminta|sebutkan|menyebutkan|masukkan|memasukkan|input|unggah|upload|isi|mengisi|foto(?:kan)?)\b.{0,55}\b(?:o[\s._-]*t[\s._-]*p|kode[\s-]*(?:otp|verifikasi)|kata[\s-]*sandi|password|pin)\b|\b(?:o[\s._-]*t[\s._-]*p|kode[\s-]*(?:otp|verifikasi)|kata[\s-]*sandi|password|pin)\b.{0,55}\b(?:kirim|mengirim|berikan|memberikan|bagikan|membagikan|minta|meminta|sebutkan|menyebutkan|masukkan|memasukkan|input|unggah|upload|isi|mengisi|foto(?:kan)?)\b/i,
    explanation: "Pesan meminta kode verifikasi atau rahasia akun. Kode OTP, PIN, dan kata sandi sebaiknya tidak dibagikan kepada siapa pun."
  },
  {
    category: "Data pribadi",
    weight: 7,
    pattern: /\b(?:kirim|mengirim|berikan|memberikan|bagikan|membagikan|minta|meminta|isi|mengisi|masukkan|memasukkan|unggah|upload|foto(?:kan)?)\b.{0,55}\b(?:nik|nomor induk kependudukan|nomor ktp|nomor kartu keluarga|foto ktp|tanggal lahir|data pribadi)\b|\b(?:nik|nomor induk kependudukan|nomor ktp|nomor kartu keluarga|foto ktp|tanggal lahir|data pribadi)\b.{0,55}\b(?:kirim|mengirim|berikan|memberikan|bagikan|membagikan|minta|meminta|isi|mengisi|masukkan|memasukkan|unggah|upload|foto(?:kan)?)\b/i,
    explanation: "Permintaan data identitas perlu diverifikasi lewat kanal resmi sebelum kamu memberikannya."
  },
  {
    category: "Pembayaran",
    weight: 8,
    pattern: /\b(?:transfer|bayar|setor|kirim uang|top up|isi saldo)\b.{0,60}\b(?:sekarang|dulu|biaya|admin|administrasi|pajak|deposit|jaminan|rekening|ke)\b|\b(?:biaya admin(?:istrasi)?|uang muka|deposit|biaya pendaftaran|biaya pencairan|biaya pajak)\b/i,
    explanation: "Ada permintaan pembayaran atau biaya di muka. Pastikan alasan dan penerimanya melalui kanal resmi sebelum membayar."
  },
  {
    category: "Tekanan waktu",
    weight: 3,
    pattern: /\b(?:segera|sekarang juga|hari ini saja|dalam \d+ menit|sebelum (?:hangus|ditutup|diblokir|kedaluwarsa)|kesempatan terakhir|jangan sampai terlambat|waktu terbatas)\b/i,
    explanation: "Desakan untuk bertindak cepat dapat membuat orang melewatkan proses verifikasi."
  },
  {
    category: "Ancaman akun",
    weight: 5,
    pattern: /\b(?:akun|rekening|kartu|nomor)\b.{0,45}\b(?:akan|bakal|terancam)?\s*(?:diblokir|ditutup|dibekukan|dinonaktifkan|dihapus|ditangguhkan)\b|\b(?:diblokir|dibekukan|dinonaktifkan|ditangguhkan)\b.{0,45}\b(?:verifikasi|klik|tautan|link)\b/i,
    explanation: "Ancaman pemblokiran yang disertai dorongan untuk bertindak perlu diperiksa secara terpisah melalui kanal resmi."
  },
  {
    category: "Hadiah",
    weight: 2,
    pattern: /\b(?:selamat|kamu|anda)\b.{0,35}\b(?:menang|pemenang|terpilih|mendapatkan hadiah|mendapat hadiah|memenangkan)\b|\b(?:hadiah|giveaway|undian)\b.{0,40}\b(?:gratis|menang|klaim|pemenang|terpilih)\b/i,
    explanation: "Klaim hadiah atau kemenangan yang tidak kamu ikuti perlu diverifikasi dari penyelenggara resmi."
  },
  {
    category: "Tawaran kerja",
    weight: 4,
    pattern: /\b(?:kerja|pekerjaan|lowongan|rekrutmen|diterima kerja)\b.{0,80}\b(?:gaji besar|gaji tinggi|tanpa pengalaman|mudah|fleksibel|dari rumah)\b|\b(?:gaji besar|gaji tinggi)\b.{0,60}\b(?:kerja|pekerjaan|lowongan|tanpa pengalaman)\b/i,
    explanation: "Tawaran kerja dengan janji yang terlalu mudah atau gaji besar patut diperiksa, terutama jika kemudian meminta biaya atau data."
  },
  {
    category: "Identitas pengirim",
    weight: 2,
    pattern: /\b(?:kami dari|saya dari|mengaku dari|pihak)\b.{0,35}\b(?:bank|polisi|bea cukai|kurir|cs|customer service|dukcapil|pajak|rekrutmen|admin)\b|\b(?:petugas|admin|customer service|cs)\b.{0,40}\b(?:resmi|bank|kurir|pajak|dukcapil)\b/i,
    explanation: "Penyebutan institusi atau petugas tidak membuktikan identitas pengirim. Hubungi institusi melalui kontak yang kamu cari sendiri."
  },
  {
    category: "Tautan",
    weight: 3,
    pattern: /\b(?:https?:\/\/|www\.)\S+|\b(?:bit\.ly|tinyurl\.com|t\.co|cutt\.ly|s\.id|is\.gd)\/\S*/i,
    explanation: "Pesan memuat tautan yang belum diverifikasi. JeBe tidak membuka atau memeriksa tujuan maupun reputasi tautan."
  },
  {
    category: "Investasi",
    weight: 5,
    pattern: /\b(?:untung|profit|imbal hasil|return)\b.{0,45}\b(?:pasti|dijamin|tanpa risiko|setiap hari|tetap)\b|\b(?:pasti untung|keuntungan dijamin|tanpa risiko|modal kembali)\b/i,
    explanation: "Janji keuntungan pasti atau tanpa risiko adalah klaim yang perlu dicermati dan diverifikasi."
  },
  {
    category: "Aplikasi atau akses perangkat",
    weight: 8,
    pattern: /\b(?:instal|install|unduh|download)\b.{0,45}\b(?:apk|aplikasi|file|berkas)\b|\b(?:aktifkan|berikan|izinkan)\b.{0,45}\b(?:akses jarak jauh|remote access|akses layar|screen sharing)\b/i,
    explanation: "Memasang file atau memberi akses perangkat dari pesan yang belum terverifikasi dapat membahayakan akun dan perangkat."
  },
  {
    category: "Kerahasiaan",
    weight: 4,
    pattern: /\b(?:jangan beri tahu|jangan bilang|rahasia(?:kan)? dari|jangan ceritakan kepada)\b.{0,45}\b(?:siapa|keluarga|teman|orang lain|bank|polisi)\b/i,
    explanation: "Permintaan untuk merahasiakan sesuatu dari orang tepercaya dapat menjadi taktik agar kamu tidak sempat meminta pendapat."
  }
];

const negatedRequestEnding = /\b(?:jangan|tidak|bukan|hindari)(?:\s+pernah)?\s*$/i;
const sentenceBoundaryPattern = /[.!?;]+(?!\w)|(?<!\w)[.!?;]+|\n+/;

function hasNegatedRequest(text, matchIndex) {
  return negatedRequestEnding.test(text.slice(0, matchIndex).trimEnd());
}

function getRiskLevel(score) {
  if (score >= 8) return "HIGH";
  if (score >= 4) return "MEDIUM";
  return "LOW";
}

function getNextSteps(categories, riskLevel) {
  const steps = [];
  if (categories.has("Rahasia akun")) {
    steps.push("Jangan bagikan OTP, PIN, atau kata sandi. Jika sudah terlanjur, segera amankan akun lewat aplikasi atau situs resmi.");
  }
  if (categories.has("Data pribadi")) {
    steps.push("Tunda mengirim data identitas sampai kamu mengonfirmasi permintaan lewat kontak resmi yang dicari sendiri.");
  }
  if (categories.has("Pembayaran")) {
    steps.push("Jangan transfer dulu. Periksa penerima dan alasan pembayaran melalui kanal resmi, bukan dari kontak di pesan.");
  }
  if (categories.has("Tautan")) {
    steps.push("Jangan membuka tautan dari pesan. Buka aplikasi atau situs resmi dengan mengetik alamatnya sendiri.");
  }
  if (categories.has("Aplikasi atau akses perangkat")) {
    steps.push("Jangan memasang file atau memberi akses perangkat sebelum memverifikasi permintaan tersebut.");
  }
  if (categories.has("Ancaman akun") || categories.has("Identitas pengirim")) {
    steps.push("Hubungi organisasi terkait melalui nomor atau aplikasi resmi yang sudah kamu ketahui.");
  }
  if (categories.has("Hadiah") || categories.has("Tawaran kerja") || categories.has("Investasi")) {
    steps.push("Cari pengumuman atau informasi tawaran dari sumber resmi secara mandiri; jangan membayar untuk mengklaim hadiah atau pekerjaan.");
  }
  if (categories.has("Tekanan waktu") || categories.has("Kerahasiaan")) {
    steps.push("Berhenti sejenak dan minta pendapat orang tepercaya sebelum bertindak.");
  }
  if (!steps.length) {
    steps.push(riskLevel === "LOW"
      ? "Belum terlihat frasa berisiko dari aturan JeBe. Tetap periksa pengirim dan konteks melalui kanal resmi."
      : "Jangan bertindak terburu-buru. Verifikasi informasi melalui kanal resmi.");
  }
  return steps.slice(0, 4);
}

function analyzeMessage(message) {
  const normalized = message.normalize("NFKC").replace(/[\u200B-\u200D\uFEFF]/g, "").toLowerCase();
  const sentences = normalized.split(sentenceBoundaryPattern).filter(Boolean);
  const matchedByCategory = new Map();

  for (const sentence of sentences) {
    for (const rule of rules) {
      rule.pattern.lastIndex = 0;
      const match = rule.pattern.exec(sentence);
      if (!match || hasNegatedRequest(sentence, match.index)) continue;

      const existing = matchedByCategory.get(rule.category);
      if (!existing) {
        const evidence = match[0].trim();
        matchedByCategory.set(rule.category, {
          weight: rule.weight,
          name: rule.category,
          explanation: rule.explanation,
          evidence: evidence.length > 180 ? `${evidence.slice(0, 177)}...` : evidence
        });
      }
    }
  }

  const matchedRules = [...matchedByCategory.values()];
  const score = matchedRules.reduce((total, item) => total + item.weight, 0);
  const riskLevel = getRiskLevel(score);
  const signals = matchedRules.map(({ name, explanation, evidence }) => ({
    name,
    explanation,
    evidence
  }));
  const title = {
    HIGH: "Ada beberapa tanda bahaya yang perlu ditindaklanjuti",
    MEDIUM: "Ada hal yang sebaiknya kamu periksa",
    LOW: "Belum terlihat tanda kuat dari aturan JeBe"
  }[riskLevel];
  const summary = signals.length
    ? `JeBe menemukan ${signals.length} kategori sinyal berdasarkan kata atau frasa dalam pesan. Ini petunjuk untuk diperiksa, bukan kepastian bahwa pesan adalah penipuan.`
    : "Aturan JeBe belum menemukan frasa mencurigakan yang dikenali. Hasil ini bukan bukti bahwa pesan atau pengirimnya aman.";

  return {
    riskLevel,
    title,
    summary,
    signals,
    nextSteps: getNextSteps(new Set(matchedRules.map((item) => item.name)), riskLevel)
  };
}

module.exports = { analyzeMessage };
