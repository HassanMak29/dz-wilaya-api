// Build the canonical dz-wilaya-api dataset.
//
// Output: src/data/wilayas.json — 58 official Algerian wilayas (2021 division),
// 1541 communes, trilingual names (AR/FR/EN), per-commune postal codes + GPS,
// daira (district), and wilaya-level region + centroid.
//
// Sources (administrative facts, regenerated into a clean schema):
//   - ihahachi/Algeria-Cities  -> commune identity: AR + FR names, daira, official
//     commune code, correct lat/long. Authoritative 1541-commune list.
//   - Kenandarabeh/algeria-wilayas-communes-2026 -> postal codes (joined by
//     normalized name + coordinate proximity). NOTE: its lat/long are swapped.
//
// The two community datasets number the 10 new southern wilayas plus 11
// "wilayas deleguees" (delegated districts) as codes 49-69. The official 2021
// scheme is 58 wilayas: 49-58 are real wilayas, 59-69 are delegated districts
// whose communes legally belong to a parent wilaya. We fold 59-69 back into the
// official parent below.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CACHE = join(__dirname, ".cache");
const OUT_DIR = join(__dirname, "..", "src", "data");

// ---------------------------------------------------------------------------
// Delegated district -> official parent wilaya (official 2021 division).
// ---------------------------------------------------------------------------
const DELEGATED_PARENT = {
  59: 3, // Aflou               -> Laghouat
  60: 5, // Barika              -> Batna
  61: 7, // El Kantara          -> Biskra
  62: 12, // Bir El Ater         -> Tebessa
  63: 13, // El Aricha           -> Tlemcen
  64: 14, // Ksar Chellala       -> Tiaret
  65: 17, // Ain Oussera         -> Djelfa
  66: 17, // Messaad             -> Djelfa
  67: 26, // Ksar El Boukhari    -> Medea
  68: 28, // Boussaada           -> M'Sila
  69: 32, // El Abiodh Sidi Cheikh -> El Bayadh
};

// ---------------------------------------------------------------------------
// English names + macro-region for the 58 official wilayas.
// ---------------------------------------------------------------------------
const WILAYA_META = {
  1: { en: "Adrar", region: "South" },
  2: { en: "Chlef", region: "North-West" },
  3: { en: "Laghouat", region: "Highlands" },
  4: { en: "Oum El Bouaghi", region: "North-East" },
  5: { en: "Batna", region: "North-East" },
  6: { en: "Bejaia", region: "North-East" },
  7: { en: "Biskra", region: "South" },
  8: { en: "Bechar", region: "South" },
  9: { en: "Blida", region: "North-Center" },
  10: { en: "Bouira", region: "North-Center" },
  11: { en: "Tamanrasset", region: "South" },
  12: { en: "Tebessa", region: "North-East" },
  13: { en: "Tlemcen", region: "North-West" },
  14: { en: "Tiaret", region: "Highlands" },
  15: { en: "Tizi Ouzou", region: "North-Center" },
  16: { en: "Algiers", region: "North-Center" },
  17: { en: "Djelfa", region: "Highlands" },
  18: { en: "Jijel", region: "North-East" },
  19: { en: "Setif", region: "North-East" },
  20: { en: "Saida", region: "Highlands" },
  21: { en: "Skikda", region: "North-East" },
  22: { en: "Sidi Bel Abbes", region: "North-West" },
  23: { en: "Annaba", region: "North-East" },
  24: { en: "Guelma", region: "North-East" },
  25: { en: "Constantine", region: "North-East" },
  26: { en: "Medea", region: "North-Center" },
  27: { en: "Mostaganem", region: "North-West" },
  28: { en: "M'Sila", region: "Highlands" },
  29: { en: "Mascara", region: "North-West" },
  30: { en: "Ouargla", region: "South" },
  31: { en: "Oran", region: "North-West" },
  32: { en: "El Bayadh", region: "Highlands" },
  33: { en: "Illizi", region: "South" },
  34: { en: "Bordj Bou Arreridj", region: "North-East" },
  35: { en: "Boumerdes", region: "North-Center" },
  36: { en: "El Tarf", region: "North-East" },
  37: { en: "Tindouf", region: "South" },
  38: { en: "Tissemsilt", region: "Highlands" },
  39: { en: "El Oued", region: "South" },
  40: { en: "Khenchela", region: "North-East" },
  41: { en: "Souk Ahras", region: "North-East" },
  42: { en: "Tipaza", region: "North-Center" },
  43: { en: "Mila", region: "North-East" },
  44: { en: "Ain Defla", region: "North-Center" },
  45: { en: "Naama", region: "Highlands" },
  46: { en: "Ain Temouchent", region: "North-West" },
  47: { en: "Ghardaia", region: "South" },
  48: { en: "Relizane", region: "North-West" },
  49: { en: "Timimoun", region: "South" },
  50: { en: "Bordj Badji Mokhtar", region: "South" },
  51: { en: "Ouled Djellal", region: "South" },
  52: { en: "Beni Abbes", region: "South" },
  53: { en: "In Salah", region: "South" },
  54: { en: "In Guezzam", region: "South" },
  55: { en: "Touggourt", region: "South" },
  56: { en: "Djanet", region: "South" },
  57: { en: "El M'Ghair", region: "South" },
  58: { en: "El Menia", region: "South" },
};

// English overrides for a few commune names where the source FR spelling is
// clearly off; kept tiny and high-confidence.
const POSTAL_OVERRIDES = {
  // commune key `${parentWilaya}|${normFr}` -> postal code
  "11|tamanrasset": "11000",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const readJson = (p) =>
  JSON.parse(readFileSync(p, "utf8").replace(/^\uFEFF/, ""));
const normFr = (s) =>
  (s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
const round = (n, d = 6) => {
  const f = 10 ** d;
  return Math.round(n * f) / f;
};

// ---------------------------------------------------------------------------
// Load sources
// ---------------------------------------------------------------------------
const ihahachi = readJson(join(CACHE, "ihahachi.communes.json"));
const kenRaw = readJson(join(CACHE, "communes.raw.json"));

// Kenandarabeh: coords are swapped (the `longitude` field holds the latitude).
const ken = kenRaw.map((k) => ({
  pc: String(k.post_code),
  fr: normFr(k.name),
  wid: Number(k.wilaya_id),
  lat: Number(k.longitude),
  lng: Number(k.latitude),
}));

const byWidName = new Map();
const byName = new Map();
const byWid = new Map();
for (const k of ken) {
  byWidName.set(`${k.wid}|${k.fr}`, k);
  if (!byName.has(k.fr)) byName.set(k.fr, k);
  if (!byWid.has(k.wid)) byWid.set(k.wid, []);
  byWid.get(k.wid).push(k);
}

function findPostal(srcWid, fr, lat, lng) {
  // 1) same source-wilaya + exact normalized name
  let hit = byWidName.get(`${srcWid}|${fr}`);
  if (hit) return hit.pc;
  // 2) same source-wilaya, nearest centroid (<= ~13 km)
  const pool = byWid.get(srcWid) || [];
  let best = null;
  let bd = Infinity;
  for (const k of pool) {
    const d = Math.hypot(k.lat - lat, k.lng - lng);
    if (d < bd) {
      bd = d;
      best = k;
    }
  }
  if (best && bd < 0.12) return best.pc;
  // 3) global exact normalized name
  hit = byName.get(fr);
  if (hit) return hit.pc;
  // 4) global nearest centroid (tight, <= ~6 km)
  best = null;
  bd = Infinity;
  for (const k of ken) {
    const d = Math.hypot(k.lat - lat, k.lng - lng);
    if (d < bd) {
      bd = d;
      best = k;
    }
  }
  if (best && bd < 0.06) return best.pc;
  return null;
}

// ---------------------------------------------------------------------------
// Build wilayas
// ---------------------------------------------------------------------------
const wilayas = new Map(); // code -> wilaya object

function ensureWilaya(code, arName, frName) {
  if (wilayas.has(code)) return wilayas.get(code);
  const meta = WILAYA_META[code];
  if (!meta) throw new Error(`No metadata for wilaya ${code}`);
  const w = {
    code: String(code).padStart(2, "0"),
    name: { ar: arName, fr: frName, en: meta.en },
    region: meta.region,
    lat: 0,
    lng: 0,
    communes: [],
  };
  wilayas.set(code, w);
  return w;
}

let matched = 0;
let missing = 0;

for (const c of ihahachi) {
  const srcWid = Number(c.wilaya_code);
  const officialCode = DELEGATED_PARENT[srcWid] ?? srcWid;
  const lat = round(Number(c.Lat));
  const lng = round(Number(c.Long));
  const fr = normFr(c.commune_name_fr);

  // Wilaya AR/FR name: take from a non-delegated row of the official wilaya.
  const w = ensureWilaya(
    officialCode,
    // placeholder; corrected below from an official-code row
    c.wilaya_name,
    c.wilaya_name_fr,
  );

  let postCode =
    POSTAL_OVERRIDES[`${officialCode}|${fr}`] ??
    findPostal(srcWid, fr, lat, lng);
  if (postCode) matched++;
  else missing++;

  w.communes.push({
    name: { ar: c.commune_name, fr: c.commune_name_fr, en: c.commune_name_fr },
    daira: { ar: c.daira_name, fr: c.daira_name_fr },
    code: String(c.code_commune),
    postCode,
    lat,
    lng,
  });
}

// Correct wilaya AR/FR names using an authoritative (non-delegated) row.
for (const c of ihahachi) {
  const code = Number(c.wilaya_code);
  if (DELEGATED_PARENT[code]) continue; // skip delegated rows for naming
  const w = wilayas.get(code);
  if (w) {
    w.name.ar = c.wilaya_name;
    w.name.fr = c.wilaya_name_fr;
  }
}

// Compute centroids + sort communes by name.
for (const w of wilayas.values()) {
  const n = w.communes.length;
  w.lat = round(w.communes.reduce((s, c) => s + c.lat, 0) / n);
  w.lng = round(w.communes.reduce((s, c) => s + c.lng, 0) / n);
  w.communes.sort((a, b) => a.name.fr.localeCompare(b.name.fr));
}

const out = [...wilayas.values()].sort(
  (a, b) => Number(a.code) - Number(b.code),
);

// ---------------------------------------------------------------------------
// Validate + write
// ---------------------------------------------------------------------------
const totalCommunes = out.reduce((s, w) => s + w.communes.length, 0);
if (out.length !== 58)
  throw new Error(`Expected 58 wilayas, got ${out.length}`);

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(join(OUT_DIR, "wilayas.json"), JSON.stringify(out) + "\n");

const coverage = ((matched / totalCommunes) * 100).toFixed(1);
console.log(`Wrote ${out.length} wilayas, ${totalCommunes} communes.`);
console.log(
  `Postal code coverage: ${coverage}% (${matched} matched, ${missing} null).`,
);
console.log(`Output: ${join(OUT_DIR, "wilayas.json")}`);
