/* ==========================================================
   logic.js  =  "otak" kalkulator
   Parser ekspresi: teks -> token -> hitung (tanpa eval()).
   Tidak boleh menyentuh HTML. Parser yang sama nanti dipakai
   tab Graphwar (variabel x lewat parameter `vars`).
   ========================================================== */

// Batas hasil: harus lebih kecil dari 1 triliun (JavaScript hanya akurat ~15 digit)
const BATAS_MAKS = 1e12;
const TEKS_BATAS = "999.999.999.999";

// Fungsi dan konstanta yang dikenal. ASUMSI: sin/cos/tan memakai radian.
const FUNGSI = { abs: Math.abs, sqrt: Math.sqrt, sin: Math.sin, cos: Math.cos,
                 tan: Math.tan, exp: Math.exp,
                 ln: (v) => (v > 0 ? Math.log(v) : NaN) };   // ln angka <= 0 = tidak terdefinisi
const KONSTANTA = { pi: Math.PI, "π": Math.PI, e: Math.E };

/* ---------- 1. Teks -> token ---------- */
function tokenisasi(teks, vars) {
  const s = String(teks).replace(/,/g, ".").replace(/\s+/g, "").toLowerCase();
  const dikenal = [...Object.keys(FUNGSI), ...Object.keys(KONSTANTA), "√", ...Object.keys(vars)]
    .sort((a, b) => b.length - a.length);           // cocokkan nama terpanjang dulu
  const token = [];
  let i = 0;

  while (i < s.length) {
    const angka = /^(\d+\.?\d*|\.\d+)/.exec(s.slice(i));
    if (angka) {
      i += angka[0].length;
      if (s[i] === ".") throw new Error("Angka tidak valid");
      token.push({ t: "n", v: Number(angka[0]) });
    } else if ("+-−*×/÷^%()".includes(s[i])) {
      const peta = { "−": "-", "×": "*", "÷": "/" };
      token.push({ t: "o", v: peta[s[i]] || s[i] });
      i++;
    } else {
      const nama = dikenal.find((k) => s.startsWith(k, i));
      if (!nama) throw new Error("Karakter tidak dikenal: " + s[i]);
      token.push({ t: "i", v: nama === "√" ? "sqrt" : nama });
      i += nama.length;
    }
  }
  return token;
}

/* ---------- 2. Token -> nilai (recursive descent) ---------- */
// derajat = true: sin/cos/tan menerima sudut dalam derajat (untuk kalkulator ilmiah)
function evaluasi(teks, vars = {}, derajat = false) {
  const tok = tokenisasi(teks, vars);
  let p = 0;
  const lihat = () => tok[p];
  const op = (...o) => lihat() && lihat().t === "o" && o.includes(lihat().v);
  // perkalian tanpa tanda: 2(3), 5x, 2abs(x)
  const mulaiOperand = () => {
    const k = lihat();
    return k && (k.t === "n" || k.t === "i" || (k.t === "o" && k.v === "("));
  };

  // Persen ala kalkulator HP: "100 - 10%" berarti 100 - (10% dari 100) = 90.
  // Di depan * atau /, persen tetap dibagi 100 saja (50 x 10% = 5).
  let persenMurni = false;                            // true kalau suku terakhir hanya berbentuk "N%"

  function ekspr() {                                  // + dan -
    let a = suku();
    while (op("+", "-")) {
      const o = tok[p++].v, b = suku();
      const nilai = persenMurni ? a * b : b;          // b sudah dibagi 100
      a = o === "+" ? a + nilai : a - nilai;
    }
    return a;
  }
  function suku() {                                   // * dan /
    let a = unary(), n = 1;
    for (;;) {
      if (op("*", "/")) {
        const o = tok[p++].v, b = unary();
        if (o === "/") {
          if (b === 0) throw new Error("Tidak bisa dibagi nol");
          a /= b;
        } else a *= b;
        n++;
      } else if (mulaiOperand()) { a *= unary(); n++; }
      else break;
    }
    persenMurni = n === 1 && tok[p - 1].t === "o" && tok[p - 1].v === "%";
    return a;
  }
  function unary() {                                  // tanda +/- di depan
    if (op("-")) { p++; return -unary(); }
    if (op("+")) { p++; return unary(); }
    return pangkat();
  }
  function pangkat() {                                // ^ (kanan ke kiri)
    const a = pasca();
    if (op("^")) { p++; return Math.pow(a, unary()); }
    return a;
  }
  function pasca() {                                  // % = dibagi 100
    let a = utama();
    while (op("%")) { p++; a /= 100; }
    return a;
  }
  function tutup() {
    if (!op(")")) throw new Error("Kurung belum ditutup");
    p++;
  }
  function utama() {
    const k = tok[p++];
    if (!k) throw new Error("Ekspresi belum lengkap");
    if (k.t === "n") return k.v;
    if (k.t === "i") {
      if (k.v in FUNGSI) {
        if (!op("(")) throw new Error("Fungsi " + k.v + " butuh kurung");
        p++;
        const arg = ekspr();
        tutup();
        if (derajat && ["sin", "cos", "tan"].includes(k.v)) {
          if (k.v === "tan" && Math.abs(((arg % 180) + 180) % 180 - 90) < 1e-9) {
            throw new Error("tan tidak terdefinisi di sudut ini");
          }
          return FUNGSI[k.v]((arg * Math.PI) / 180);
        }
        return FUNGSI[k.v](arg);
      }
      if (k.v in KONSTANTA) return KONSTANTA[k.v];
      return vars[k.v];
    }
    if (k.v === "(") {
      const a = ekspr();
      tutup();
      return a;
    }
    throw new Error(k.v === ")" ? "Kurung tidak seimbang" : "Ekspresi belum lengkap");
  }

  const hasil = ekspr();
  if (p < tok.length) throw new Error(op(")") ? "Kurung tidak seimbang" : "Ekspresi tidak valid");
  return hasil;
}

/* ---------- 3. Hitung untuk kalkulator harian ---------- */
function hitungEkspresi(teks, derajat = false) {
  let nilai = evaluasi(teks, {}, derajat);
  if (Number.isNaN(nilai)) throw new Error("Hasil tidak terdefinisi");
  if (Math.abs(nilai) < 1e-12) nilai = 0;             // sin(180°) = 1,2e-16 dianggap 0
  const hasil = bulatkan(nilai);
  if (!Number.isFinite(hasil) || Math.abs(hasil) >= BATAS_MAKS) {
    throw new Error("Hasil melebihi batas (maksimal " + TEKS_BATAS + ")");
  }
  return hasil;
}

/* ---------- 4. Format ---------- */
// 0.1 + 0.2 = 0.30000000000000004  ->  0.3
function bulatkan(n) {
  return parseFloat(n.toPrecision(15));
}
// 1234567.5 -> "1.234.567,5"
function formatAngka(n) {
  return n.toLocaleString("id-ID", { maximumFractionDigits: 10 });
}
// Angka -> teks biasa (tanpa notasi ilmiah) supaya bisa dilanjutkan sebagai ekspresi
function angkaKeTeks(n) {
  return n.toFixed(10).replace(/\.?0+$/, "").replace("-", "−");
}

// Supaya bisa diuji lewat Node (tidak mengganggu browser)
if (typeof module !== "undefined") {
  module.exports = { evaluasi, hitungEkspresi, bulatkan, formatAngka, angkaKeTeks };
}
