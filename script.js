/* ==========================================================
   script.js  =  "penyambung" antara tampilan (HTML) dan logic.js
   Menyimpan ekspresi yang sedang diketik, lalu menampilkannya.
   ========================================================== */

const $ = (id) => document.getElementById(id);
const OPERATOR = "+−×÷^";

let ekspr = "";     // ekspresi yang sedang diketik, contoh "12+3×4" (desimal pakai titik)
let hasil = null;   // angka hasil setelah menekan =  (null = belum menghitung)
let galat = "";     // pesan error, kosong kalau aman
let derajat = true; // sudut sin/cos/tan: true = DEG, false = RAD

const akhir = () => ekspr.slice(-1);
const angkaTerakhir = () => /[\d.]*$/.exec(ekspr)[0];
// Kurung yang belum ditutup ditutup otomatis: sin(30  ->  sin(30)
const tutupOtomatis = (s) =>
  s + ")".repeat(Math.max(0, (s.match(/\(/g) || []).length - (s.match(/\)/g) || []).length));

/* ---------- Aksi tombol ---------- */
function tekan(k) {
  galat = "";

  if (/^\d$/.test(k)) {                               // angka 0-9
    if (hasil !== null) { ekspr = ""; hasil = null; }
    if (angkaTerakhir() === "0") ekspr = ekspr.slice(0, -1);   // cegah "007"
    ekspr += k;
    return;
  }

  switch (k) {
    case ",":                                         // desimal
      if (hasil !== null) { ekspr = ""; hasil = null; }
      if (angkaTerakhir().includes(".")) return;
      ekspr += angkaTerakhir() === "" ? "0." : ".";
      return;

    case "+": case "−": case "×": case "÷": case "^":
      if (hasil !== null) { ekspr = angkaKeTeks(hasil); hasil = null; }   // lanjut dari hasil
      if (ekspr === "") { if (k === "−") ekspr = "−"; return; }
      if (ekspr === "−") return;
      if (akhir() === "(") { if (k === "−") ekspr += k; return; }
      if (OPERATOR.includes(akhir())) {
        if (k === "−" && "×÷".includes(akhir())) ekspr += k;            // 5×−3
        else ekspr = ekspr.replace(/[+−×÷^]+$/, "") + k;                // ganti operator
      } else ekspr += k;
      return;

    case "%":
      if (hasil !== null) { ekspr = angkaKeTeks(hasil); hasil = null; }
      if (/[\dπ)%]$/.test(ekspr)) ekspr += "%";
      return;

    case "(": case "π":
      if (hasil !== null) { ekspr = ""; hasil = null; }
      ekspr += k;
      return;

    case "sin": case "cos": case "tan": case "ln": case "exp": case "√":
      if (hasil !== null) { ekspr = ""; hasil = null; }
      ekspr += k + "(";
      return;

    case "x²":
      if (hasil !== null) { ekspr = angkaKeTeks(hasil); hasil = null; }
      if (/[\dπ)%]$/.test(ekspr)) ekspr += "^2";
      return;

    case "MODE":                                      // ganti DEG <-> RAD
      derajat = !derajat;
      if (hasil !== null) {
        try { hasil = hitungEkspresi(ekspr, derajat); }
        catch (e) { galat = e.message; hasil = null; }
      }
      return;

    case ")": {
      const buka = (ekspr.match(/\(/g) || []).length;
      const tutup = (ekspr.match(/\)/g) || []).length;
      if (buka > tutup && !OPERATOR.includes(akhir()) && akhir() !== "(") ekspr += ")";
      return;
    }

    case "DEL":
      if (hasil !== null) { ekspr = ""; hasil = null; }
      else ekspr = ekspr.replace(/(?:sin|cos|tan|ln|exp|√)\($|[\s\S]$/, "");   // fungsi dihapus utuh
      return;

    case "C":
      ekspr = ""; hasil = null;
      return;

    case "=":
      if (ekspr === "" || hasil !== null) return;
      ekspr = tutupOtomatis(ekspr);
      try { hasil = hitungEkspresi(ekspr, derajat); }
      catch (e) { galat = e.message; }
      return;
  }
}

/* ---------- Tampilan ---------- */
const tampil = (s) => s.replace(/\./g, ",");          // titik -> koma untuk dilihat

// Hasil sementara saat mengetik (hanya kalau ekspresinya sudah berupa hitungan)
function pratinjau() {
  if (!/[+−×÷%^()π]/.test(ekspr.replace(/^−/, ""))) return "";
  try { return "= " + formatAngka(hitungEkspresi(tutupOtomatis(ekspr), derajat)); }
  catch (e) { return ""; }
}

function render() {
  $("mode").textContent = derajat ? "DEG" : "RAD";
  const kotak = $("res");
  kotak.className = "result";
  kotak.textContent = "";
  const tambah = (kelas, teks) => {                   // textContent: aman dari HTML injection
    const el = document.createElement("span");
    el.className = kelas;
    el.textContent = teks;
    kotak.appendChild(el);
  };

  if (galat) {
    kotak.classList.add("err");
    tambah("e", tampil(ekspr));
    tambah("v", galat);
  } else if (hasil !== null) {
    tambah("e", tampil(ekspr) + " =");
    tambah("v", formatAngka(hasil));
  } else {
    kotak.classList.add("typing");
    tambah("e", ekspr ? tampil(ekspr) : "0");
    tambah("v", pratinjau());
  }
}

/* ---------- Pasang event ---------- */
function klik(e) {
  const tombol = e.target.closest("button");
  if (!tombol) return;
  tekan(tombol.dataset.k);
  render();
}
$("pad").addEventListener("click", klik);
$("sci").addEventListener("click", klik);

// Tab mode: Biasa / Ilmiah (nanti ditambah Graphwar). Sekali ketuk langsung pindah.
$("tabs").addEventListener("click", (e) => {
  const tab = e.target.closest("button");
  if (!tab) return;
  $("sci").hidden = tab.dataset.mode !== "ilmiah";
  document.querySelectorAll("#tabs button").forEach((t) => {
    t.setAttribute("aria-selected", String(t === tab));
  });
});

// Keyboard
const PETA = { "*": "×", x: "×", X: "×", "/": "÷", "-": "−", ".": ",", ",": ",",
  "+": "+", "%": "%", "^": "^", "(": "(", ")": ")",
  Enter: "=", "=": "=", Backspace: "DEL", Escape: "C", Delete: "C" };

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const k = /^\d$/.test(e.key) ? e.key : PETA[e.key];
  if (!k) return;
  e.preventDefault();                                 // cegah Enter menekan tombol yang sedang fokus
  tekan(k);
  render();
});

render();
