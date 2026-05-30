import bundled from "./data/wilayas.json";
import type { Commune, Env, Wilaya } from "./types";

const KV_KEY = "wilayas:v1";

let cache: Wilaya[] | null = null;

/**
 * Load the dataset. Reads from KV first (if a WILAYA_KV namespace is bound and
 * seeded) and falls back to the data bundled into the Worker. The result is
 * memoised at the module level for the lifetime of the isolate.
 */
export async function loadWilayas(env: Env): Promise<Wilaya[]> {
  if (cache) return cache;

  if (env.WILAYA_KV) {
    try {
      const fromKv = await env.WILAYA_KV.get<Wilaya[]>(KV_KEY, "json");
      if (fromKv && fromKv.length) {
        cache = fromKv;
        return cache;
      }
    } catch {
      // Ignore KV errors and fall back to bundled data.
    }
  }

  cache = bundled as unknown as Wilaya[];
  return cache;
}

/** A wilaya without its (potentially large) communes array. */
export type WilayaSummary = Omit<Wilaya, "communes"> & { communeCount: number };

export function toSummary(w: Wilaya): WilayaSummary {
  const { communes, ...rest } = w;
  return { ...rest, communeCount: communes.length };
}

export function findWilaya(list: Wilaya[], code: string): Wilaya | undefined {
  const norm = code.padStart(2, "0");
  return list.find((w) => w.code === norm);
}

export interface CommuneHit extends Commune {
  wilayaCode: string;
  wilayaName: Wilaya["name"];
}

export function allCommunes(list: Wilaya[]): CommuneHit[] {
  const out: CommuneHit[] = [];
  for (const w of list) {
    for (const c of w.communes) {
      out.push({ ...c, wilayaCode: w.code, wilayaName: w.name });
    }
  }
  return out;
}

function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function matchesName(
  name: { ar: string; fr: string; en: string },
  q: string,
): boolean {
  const nq = normalize(q);
  return (
    normalize(name.fr).includes(nq) ||
    normalize(name.en).includes(nq) ||
    name.ar.includes(q.trim())
  );
}

export interface SearchResult {
  wilayas: WilayaSummary[];
  communes: CommuneHit[];
}

/** Free-text search across wilaya and commune names (AR/FR/EN) + postal codes. */
export function search(list: Wilaya[], q: string, limit = 25): SearchResult {
  const query = q.trim();
  const wilayas = list.filter((w) => matchesName(w.name, query)).map(toSummary);

  const communes = allCommunes(list)
    .filter((c) => matchesName(c.name, query) || c.postCode === query)
    .slice(0, limit);

  return { wilayas, communes };
}
