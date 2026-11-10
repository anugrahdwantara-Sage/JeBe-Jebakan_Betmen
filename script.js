const examples = {
  win: "Selamat! Kamu memenangkan hadiah Rp10.000.000. Klaim sekarang sebelum hangus! Verifikasi akun dan kirim kode OTP kamu melalui bit.ly/hadiah-kamu",
  job: "Halo, kami dari tim rekrutmen. Kamu diterima kerja dengan gaji besar tanpa pengalaman. Segera bayar biaya administrasi hari ini agar slot tidak diberikan ke orang lain.",
  normal: "Hai! Jadi ketemu sore ini di perpustakaan seperti biasa? Kabari ya kalau sudah sampai."
};

const input = document.querySelector("#message-input");
const form = document.querySelector("#check-form");
const result = document.querySelector("#result");
const findings = document.querySelector("#findings");
const charCount = document.querySelector("#char-count");
const status = document.querySelector("#form-status");
const checkButton = document.querySelector("#check-button");

function renderResult(analysis) {
  const level = { HIGH: "high", MEDIUM: "medium", LOW: "low" }[analysis.riskLevel];
  result.dataset.level = level;
  document.querySelector("#result-kicker").textContent = "ANALISIS BERBASIS ATURAN";
  document.querySelector("#result-icon").textContent = level === "high" ? "!" : level === "medium" ? "?" : "✓";
  document.querySelector("#result-title").textContent = analysis.title;
  document.querySelector("#result-badge").textContent = {
    HIGH: "RISIKO LEBIH TINGGI",
    MEDIUM: "TETAP WASPADA",
    LOW: "TETAP PERIKSA"
  }[analysis.riskLevel];
  document.querySelector("#result-summary").textContent = analysis.summary;

  findings.replaceChildren();
  for (const item of analysis.signals) {
    const row = document.createElement("div");
    row.className = "finding";
    const marker = document.createElement("span");
    marker.textContent = "✳";
    const description = document.createElement("span");
    const name = document.createElement("strong");
    name.textContent = `${item.name}: `;
    description.append(name, document.createTextNode(item.explanation));
    if (item.evidence) {
      description.append(document.createTextNode(` Contoh pada pesan: “${item.evidence}”`));
    }
    row.append(marker, description);
    findings.append(row);
  }

  const nextSteps = document.querySelector("#next-step-text");
  nextSteps.textContent = analysis.nextSteps.join(" ");
  result.hidden = false;
  result.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

input.addEventListener("input", () => {
  charCount.textContent = `${input.value.length} / 3000`;
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) {
    input.focus();
    return;
  }

  result.hidden = true;
  status.textContent = "JeBe sedang memeriksa kata dan frasa dalam pesan…";
  status.dataset.state = "loading";
  checkButton.disabled = true;

  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.error || "Analisis belum berhasil. Coba lagi sebentar.");
    }
    renderResult(payload);
    status.textContent = "";
    delete status.dataset.state;
  } catch (error) {
    status.textContent = error instanceof TypeError
      ? "Tidak dapat menghubungi server analisis. Pastikan aplikasi dijalankan melalui server JeBe."
      : error.message;
    status.dataset.state = "error";
  } finally {
    checkButton.disabled = false;
  }
});

form.addEventListener("reset", () => {
  result.hidden = true;
  status.textContent = "";
  delete status.dataset.state;
  charCount.textContent = "0 / 3000";
});

document.querySelectorAll(".example-chip").forEach((button) => {
  button.addEventListener("click", () => {
    input.value = examples[button.dataset.example];
    charCount.textContent = `${input.value.length} / 3000`;
    input.focus();
  });
});
