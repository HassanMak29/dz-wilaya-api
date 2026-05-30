// Seed the dataset into a Cloudflare KV namespace bound as WILAYA_KV.
//
// Usage:
//   1. Create the namespace and add the binding to wrangler.toml:
//        wrangler kv namespace create WILAYA_KV
//   2. Run this script (it shells out to wrangler):
//        npm run seed-kv
//
// The Worker reads KV first and falls back to bundled data, so this step is an
// optional optimisation, not a requirement.

import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA = join(__dirname, "..", "src", "data", "wilayas.json");
const KEY = "wilayas:v1";

try {
  execFileSync(
    "npx",
    [
      "wrangler",
      "kv",
      "key",
      "put",
      "--binding",
      "WILAYA_KV",
      KEY,
      "--path",
      DATA,
      "--remote",
    ],
    { stdio: "inherit" },
  );
  console.log(`Seeded ${KEY} into WILAYA_KV.`);
} catch (err) {
  console.error(
    "Failed to seed KV. Is the WILAYA_KV binding configured in wrangler.toml?",
  );
  process.exit(1);
}
