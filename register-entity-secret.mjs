import crypto from "node:crypto"
import fs from "node:fs"
import * as circle from "@circle-fin/developer-controlled-wallets"

const registerEntitySecretCiphertext =
  circle.registerEntitySecretCiphertext ??
  circle.default?.registerEntitySecretCiphertext

const apiKey = process.env.CIRCLE_API_KEY
if (!apiKey) {
  console.error("❌ CIRCLE_API_KEY belum keisi di .env.local")
  process.exit(1)
}
if (typeof registerEntitySecretCiphertext !== "function") {
  console.error("❌ SDK belum keinstall. Jalanin: npm install @circle-fin/developer-controlled-wallets")
  process.exit(1)
}

const entitySecret = crypto.randomBytes(32).toString("hex")

console.log("⏳ Lagi daftarin entity secret ke Circle...")
await registerEntitySecretCiphertext({ apiKey, entitySecret })

const path = ".env.local"
let env = fs.readFileSync(path, "utf8")
if (/^CIRCLE_ENTITY_SECRET=.*$/m.test(env)) {
  env = env.replace(/^CIRCLE_ENTITY_SECRET=.*$/m, `CIRCLE_ENTITY_SECRET=${entitySecret}`)
} else {
  env += `\nCIRCLE_ENTITY_SECRET=${entitySecret}\n`
}
fs.writeFileSync(path, env)

console.log("\n========================================")
console.log("✅ ENTITY SECRET BERHASIL DIBUAT & DIREGISTRASI")
console.log("✅ Otomatis kesimpen ke .env.local")
console.log("📁 Recovery file: recovery_file_*.dat — SIMPAN, JANGAN dihapus!")
console.log("========================================")
