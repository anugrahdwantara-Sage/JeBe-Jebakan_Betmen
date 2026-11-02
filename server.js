const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const PORT = Number(process.env.PORT) || 3000;
const ROOT = __dirname;
const MAX_BODY_BYTES = 6000;
const MAX_MESSAGE_LENGTH = 3000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 12;
const requestsByAddress = new Map();

const analysisRules = [
  {
    name: "Permintaan informasi rahasia",
    pattern: /\b(?:kirim|bagikan|berikan|sebutkan|masukkan|input|balas dengan|minta|meminta)\b.{0,60}\b(?:otp|kode verifikasi|kata sandi|password|pin)\b|\b(?:otp|kode verifikasi|kata sandi|password|pin)\b.{0,60}\b(?:kirim|bagikan|berikan|sebutkan|masukkan|input|balas dengan|minta|meminta)\b/i,
    explanation: "Pesan meminta kode atau kredensial yang seharusnya dirahasiakan.",
    riskLevel: "HIGH",
    nextStep: "Jangan kirim kode OTP, PIN, atau kata sandi kepada siapa pun."
  },
  {
    name: "Permintaan pembayaran mencurigakan",
    pattern: /\b(?:bayar|transfer|kirim uang|biaya administrasi|biaya admin|uang muka|deposit|top up)\b.{0,70}\b(?:segera|sekarang|hari ini|sebelum|ke rekening|agar|untuk)\b|\b(?:segera|sekarang|hari ini)\b.{0,70}\b(?:bayar|transfer|kirim uang|biaya administrasi|biaya admin|uang muka|deposit|top up)\b/i,
    explanation: "Pesan mendesak pembayaran atau transfer yang perlu diverifikasi secara independen.",
    riskLevel: "HIGH",
    nextStep: "Jangan transfer dulu. Verifikasi tawaran dan penerima melalui kanal resmi."
  },
  {
    name: "Tekanan untuk bertindak cepat",
    pattern: /\b(?:segera|sekarang juga|hari ini|sebelum hangus|sebelum diblokir|terakhir|slot terbatas|jangan sampai terlambat|dalam \d+ menit|dalam \d+ jam)\b/i,
    explanation: "Tekanan waktu dapat membuat penerima bertindak tanpa sempat memeriksa kebenaran pesan.",
    riskLevel: "MEDIUM",
    nextStep: "Jangan terburu-buru; cek informasi melalui aplikasi, situs, atau nomor resmi."
  },
  {
    name: "Tawaran atau hadiah yang terlalu menggiurkan",
    pattern: /\b(?:memenangkan|menang|hadiah|hadiah besar|gaji besar|diterima kerja|tanpa pengalaman|keuntungan besar|bonus gratis)\b/i,
    explanation: "Tawaran atau hadiah yang sangat menggiurkan dapat dipakai untuk memancing data atau pembayaran.",
    riskLevel: "MEDIUM",
    nextStep: "Periksa tawaran melalui kanal resmi dan jangan membayar biaya untuk mengklaim hadiah atau pekerjaan."
  },
  {
    name: "Tautan perlu diperiksa",
    pattern: /\b(?:https?:\/\/|www\.)[^\s]+|\b(?:bit\.ly|tinyurl\.com|t\.co|cutt\.ly|goo\.gl)\/[^\s]*/i,
    explanation: "Tautan tidak dibuka atau diperiksa oleh aplikasi ini; pastikan alamatnya benar sebelum mengunjunginya.",
    riskLevel: "MEDIUM",
    nextStep: "Jangan buka tautan yang tidak dikenal; kunjungi situs resmi dengan mengetik alamatnya sendiri."
  }
];

function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
  });
  response.end(JSON.stringify(data));
}

function getClientAddress(request) {
  if (process.env.TRUST_PROXY === "true") {
    const forwarded = request.headers["x-forwarded-for"];
    if (typeof forwarded === "string" && forwarded.length < 500) {
      return forwarded.split(",")[0].trim();
    }
  }
  return request.socket.remoteAddress || "unknown";
}

function isRateLimited(address) {
  const now = Date.now();
  const record = requestsByAddress.get(address);
  if (!record || now - record.startedAt >= RATE_LIMIT_WINDOW_MS) {
    requestsByAddress.set(address, { startedAt: now, count: 1 });
    if (requestsByAddress.size > 1000) {
      for (const [key, value] of requestsByAddress) {
        if (now - value.startedAt >= RATE_LIMIT_WINDOW_MS) requestsByAddress.delete(key);
      }
    }
    return false;
  }
  record.count += 1;
  return record.count > RATE_LIMIT_MAX_REQUESTS;
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    let tooLarge = false;
    request.setEncoding("utf8");
    request.on("data", (chunk) => {
      if (tooLarge) return;
      body += chunk;
      if (Buffer.byteLength(body) > MAX_BODY_BYTES) {
        tooLarge = true;
        body = "";
        reject(Object.assign(new Error("Ukuran pesan terlalu besar."), { statusCode: 413 }));
      }
    });
    request.on("end", () => {
      if (tooLarge) return;
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(Object.assign(new Error("Format permintaan tidak valid."), { statusCode: 400 }));
      }
    });
    request.on("error", reject);
  });
}

function analyzeMessage(message) {
  const signals = analysisRules
    .map((rule) => {
      const match = message.match(rule.pattern);
      if (!match) return null;
      return {
        rule,
        signal: {
          name: rule.name,
          explanation: rule.explanation,
          evidence: match[0].slice(0, 180)
        }
      };
    })
    .filter(Boolean);

  const riskLevel = signals.some(({ rule }) => rule.riskLevel === "HIGH")
    ? "HIGH"
    : signals.length > 0
      ? "MEDIUM"
      : "LOW";
  const nextSteps = [...new Set(signals.map(({ rule }) => rule.nextStep))].slice(0, 3);

  if (nextSteps.length === 0) {
    nextSteps.push("Tetap waspada. Hasil rendah bukan bukti bahwa pesan atau tautan pasti aman.");
  }

  return {
    riskLevel,
    title: riskLevel === "HIGH"
      ? "Ada tanda yang perlu diwaspadai"
      : riskLevel === "MEDIUM"
        ? "Periksa pesan ini lebih lanjut"
        : "Belum terlihat tanda kuat",
    summary: riskLevel === "LOW"
      ? "Aturan sederhana kami tidak menemukan pola berisiko yang dikenal. Ini bukan jaminan bahwa pesan aman."
      : `Analisis berbasis aturan menemukan ${signals.length} tanda yang perlu diperiksa. Hasil ini bukan kepastian bahwa pesan adalah penipuan.`,
    signals: signals.slice(0, 4).map(({ signal }) => signal),
    nextSteps
  };
}

async function handleAnalysis(request, response) {
  if (!request.headers["content-type"]?.includes("application/json")) {
    sendJson(response, 415, { error: "Permintaan harus menggunakan format JSON." });
    return;
  }
  if (isRateLimited(getClientAddress(request))) {
    sendJson(response, 429, { error: "Terlalu banyak permintaan. Tunggu sebentar sebelum mencoba lagi." });
    return;
  }

  try {
    const body = await readJsonBody(request);
    if (!body || typeof body.message !== "string" || !body.message.trim()) {
      sendJson(response, 400, { error: "Masukkan pesan yang ingin dianalisis." });
      return;
    }
    if (body.message.length > MAX_MESSAGE_LENGTH) {
      sendJson(response, 413, { error: `Pesan maksimal ${MAX_MESSAGE_LENGTH} karakter.` });
      return;
    }
    const analysis = await analyzeMessage(body.message.trim());
    sendJson(response, 200, analysis);
  } catch (error) {
    if (response.destroyed || response.writableEnded) return;
    sendJson(response, error.statusCode || 500, {
      error: error.statusCode ? error.message : "Terjadi kesalahan pada server analisis."
    });
  }
}

function serveStatic(request, response) {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  } catch {
    response.writeHead(400).end("Bad request");
    return;
  }
  const requestedPath = pathname === "/" ? "/index.html" : pathname;
  if (!["/index.html", "/style.css", "/script.js"].includes(requestedPath)) {
    response.writeHead(404).end("Not found");
    return;
  }
  const filePath = path.resolve(ROOT, `.${requestedPath}`);
  if (!filePath.startsWith(`${ROOT}${path.sep}`)) {
    response.writeHead(403).end("Forbidden");
    return;
  }

  const contentTypes = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8"
  };
  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(error.code === "ENOENT" ? 404 : 500).end("Not found");
      return;
    }
    response.writeHead(200, {
      "Content-Type": contentTypes[path.extname(filePath)] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-cache"
    });
    response.end(content);
  });
}

const server = http.createServer((request, response) => {
  const pathname = new URL(request.url, "http://localhost").pathname;
  if (pathname === "/api/analyze" && request.method === "POST") {
    void handleAnalysis(request, response);
    return;
  }
  if (pathname.startsWith("/api/")) {
    sendJson(response, 404, { error: "Endpoint tidak ditemukan." });
    return;
  }
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" }).end("Method not allowed");
    return;
  }
  serveStatic(request, response);
});

server.listen(PORT, () => {
  console.log(`JeBe berjalan di http://localhost:${PORT}`);
});
