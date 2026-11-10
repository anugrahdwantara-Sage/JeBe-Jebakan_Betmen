const { analyzeMessage } = require("../../analyzer");

const MAX_BODY_BYTES = 6000;
const MAX_MESSAGE_LENGTH = 3000;

function jsonResponse(statusCode, payload) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff"
    },
    body: JSON.stringify(payload)
  };
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Metode permintaan tidak didukung." });
  }
  if (!event.headers?.["content-type"]?.includes("application/json")) {
    return jsonResponse(415, { error: "Permintaan harus menggunakan format JSON." });
  }

  let rawBody;
  try {
    rawBody = event.isBase64Encoded
      ? Buffer.from(event.body || "", "base64").toString("utf8")
      : event.body || "";
  } catch {
    return jsonResponse(400, { error: "Format permintaan tidak valid." });
  }

  if (Buffer.byteLength(rawBody) > MAX_BODY_BYTES) {
    return jsonResponse(413, { error: "Ukuran pesan terlalu besar." });
  }

  let body;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return jsonResponse(400, { error: "Format permintaan tidak valid." });
  }

  if (!body || typeof body.message !== "string" || !body.message.trim()) {
    return jsonResponse(400, { error: "Masukkan pesan yang ingin dianalisis." });
  }
  if (body.message.length > MAX_MESSAGE_LENGTH) {
    return jsonResponse(413, { error: `Pesan maksimal ${MAX_MESSAGE_LENGTH} karakter.` });
  }

  try {
    return jsonResponse(200, analyzeMessage(body.message.trim()));
  } catch (error) {
    console.error("Rule-based analysis failed:", error);
    return jsonResponse(500, { error: "Terjadi kesalahan saat menganalisis pesan." });
  }
};
