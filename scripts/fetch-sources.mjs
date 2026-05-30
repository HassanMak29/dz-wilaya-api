// Download the upstream source datasets into scripts/.cache so the dataset can
// be regenerated with `npm run build-data`. The raw third-party dumps are not
// committed (only the regenerated src/data/wilayas.json is).

import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CACHE = join(__dirname, ".cache");
mkdirSync(CACHE, { recursive: true });

const SOURCES = [
  {
    name: "ihahachi.communes.json",
    url: "https://raw.githubusercontent.com/ihahachi/Algeria-Cities/master/json/algeria_cities.json",
  },
  {
    name: "communes.raw.json",
    url: "https://raw.githubusercontent.com/Kenandarabeh/algeria-wilayas-communes-2026/main/src/data/Communes.json",
  },
  {
    name: "wilayas.raw.json",
    url: "https://raw.githubusercontent.com/Kenandarabeh/algeria-wilayas-communes-2026/main/src/data/Wilaya.json",
  },
];

for (const s of SOURCES) {
  process.stdout.write(`Fetching ${s.name} ... `);
  const res = await fetch(s.url);
  if (!res.ok) {
    console.log(`FAILED (${res.status})`);
    process.exitCode = 1;
    continue;
  }
  writeFileSync(join(CACHE, s.name), await res.text());
  console.log("ok");
}
