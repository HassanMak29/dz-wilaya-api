import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Env } from "./types";
import {
  allCommunes,
  findWilaya,
  loadWilayas,
  search,
  toSummary,
} from "./data";

const app = new Hono<{ Bindings: Env }>();

app.use("*", cors());

const ok = <T>(data: T, extra: Record<string, unknown> = {}) => ({
  success: true,
  ...extra,
  data,
});

// API index ----------------------------------------------------------------
app.get("/", (c) =>
  c.json({
    name: "dz-wilaya-api",
    description:
      "Free REST API for Algeria's 58 wilayas and 1541 communes (AR/FR/EN, postal codes, GPS).",
    version: "1.0.0",
    endpoints: {
      "GET /api/wilayas": "List all 58 wilayas (summaries).",
      "GET /api/wilayas/:code": "Get one wilaya with all its communes.",
      "GET /api/wilayas/:code/communes": "List communes of a wilaya.",
      "GET /api/communes": "List every commune (flat).",
      "GET /api/communes/:postCode": "Find communes by postal code.",
      "GET /api/regions": "List wilayas grouped by region.",
      "GET /api/search?q=":
        "Search wilayas and communes (AR/FR/EN, postal code).",
      "GET /health": "Health check.",
    },
    repository: "https://github.com/HassanMak29/dz-wilaya-api",
    license: "MIT",
  }),
);

app.get("/health", (c) => c.json({ success: true, status: "ok" }));

// Wilayas -------------------------------------------------------------------
app.get("/api/wilayas", async (c) => {
  const list = await loadWilayas(c.env);
  const data = list.map(toSummary);
  return c.json(ok(data, { count: data.length }));
});

app.get("/api/wilayas/:code", async (c) => {
  const list = await loadWilayas(c.env);
  const w = findWilaya(list, c.req.param("code"));
  if (!w) return c.json({ success: false, error: "Wilaya not found" }, 404);
  return c.json(ok(w));
});

app.get("/api/wilayas/:code/communes", async (c) => {
  const list = await loadWilayas(c.env);
  const w = findWilaya(list, c.req.param("code"));
  if (!w) return c.json({ success: false, error: "Wilaya not found" }, 404);
  return c.json(
    ok(w.communes, {
      count: w.communes.length,
      wilaya: toSummary(w),
    }),
  );
});

// Communes ------------------------------------------------------------------
app.get("/api/communes", async (c) => {
  const list = await loadWilayas(c.env);
  const data = allCommunes(list);
  return c.json(ok(data, { count: data.length }));
});

app.get("/api/communes/:postCode", async (c) => {
  const list = await loadWilayas(c.env);
  const postCode = c.req.param("postCode");
  const data = allCommunes(list).filter((cm) => cm.postCode === postCode);
  if (!data.length)
    return c.json(
      { success: false, error: "No commune with that postal code" },
      404,
    );
  return c.json(ok(data, { count: data.length }));
});

// Regions -------------------------------------------------------------------
app.get("/api/regions", async (c) => {
  const list = await loadWilayas(c.env);
  const groups: Record<string, ReturnType<typeof toSummary>[]> = {};
  for (const w of list) {
    (groups[w.region] ??= []).push(toSummary(w));
  }
  const data = Object.entries(groups).map(([region, wilayas]) => ({
    region,
    count: wilayas.length,
    wilayas,
  }));
  return c.json(ok(data, { count: data.length }));
});

// Search --------------------------------------------------------------------
app.get("/api/search", async (c) => {
  const q = c.req.query("q")?.trim();
  if (!q)
    return c.json(
      { success: false, error: 'Missing query parameter "q"' },
      400,
    );
  const list = await loadWilayas(c.env);
  const result = search(list, q);
  return c.json(
    ok(result, {
      query: q,
      count: result.wilayas.length + result.communes.length,
    }),
  );
});

// 404 -----------------------------------------------------------------------
app.notFound((c) => c.json({ success: false, error: "Not found" }, 404));

export default app;
