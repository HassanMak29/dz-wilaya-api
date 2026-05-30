import { describe, expect, it } from "vitest";
import app from "../src/index";

const env = {};

async function get(path: string) {
  const res = await app.request(path, {}, env);
  const body = await res.json();
  return { res, body } as { res: Response; body: any };
}

describe("dz-wilaya-api", () => {
  it("serves the API index", async () => {
    const { res, body } = await get("/");
    expect(res.status).toBe(200);
    expect(body.name).toBe("dz-wilaya-api");
    expect(body.endpoints).toBeDefined();
  });

  it("health check", async () => {
    const { res, body } = await get("/health");
    expect(res.status).toBe(200);
    expect(body.status).toBe("ok");
  });

  it("lists exactly 58 wilayas", async () => {
    const { res, body } = await get("/api/wilayas");
    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.count).toBe(58);
    expect(body.data).toHaveLength(58);
    expect(body.data[0]).toMatchObject({
      code: "01",
      communeCount: expect.any(Number),
    });
    expect(body.data[0].communes).toBeUndefined();
  });

  it("totals 1541 communes across all wilayas", async () => {
    const { body } = await get("/api/wilayas");
    const total = body.data.reduce(
      (s: number, w: any) => s + w.communeCount,
      0,
    );
    expect(total).toBe(1541);
  });

  it("gets a wilaya by code with trilingual names and communes", async () => {
    const { res, body } = await get("/api/wilayas/16");
    expect(res.status).toBe(200);
    expect(body.data.code).toBe("16");
    expect(body.data.name).toMatchObject({
      ar: "الجزائر",
      fr: "Alger",
      en: "Algiers",
    });
    expect(body.data.communes.length).toBeGreaterThan(0);
    expect(body.data.region).toBeTruthy();
  });

  it("normalizes unpadded wilaya codes", async () => {
    const { res, body } = await get("/api/wilayas/1");
    expect(res.status).toBe(200);
    expect(body.data.code).toBe("01");
  });

  it("404s for an unknown wilaya code", async () => {
    const { res, body } = await get("/api/wilayas/99");
    expect(res.status).toBe(404);
    expect(body.success).toBe(false);
  });

  it("lists communes of a wilaya", async () => {
    const { res, body } = await get("/api/wilayas/31/communes");
    expect(res.status).toBe(200);
    expect(body.count).toBe(body.data.length);
    expect(body.wilaya.code).toBe("31");
    expect(body.data[0]).toHaveProperty("postCode");
    expect(body.data[0]).toHaveProperty("lat");
  });

  it("lists all communes flat", async () => {
    const { body } = await get("/api/communes");
    expect(body.count).toBe(1541);
    expect(body.data[0]).toHaveProperty("wilayaCode");
  });

  it("finds communes by postal code", async () => {
    const { res, body } = await get("/api/communes/16001");
    expect(res.status).toBe(200);
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.data.every((c: any) => c.postCode === "16001")).toBe(true);
  });

  it("groups wilayas by region", async () => {
    const { body } = await get("/api/regions");
    const total = body.data.reduce((s: number, g: any) => s + g.count, 0);
    expect(total).toBe(58);
    expect(
      body.data.every((g: any) => g.region && Array.isArray(g.wilayas)),
    ).toBe(true);
  });

  it("searches by French name", async () => {
    const { res, body } = await get("/api/search?q=Oran");
    expect(res.status).toBe(200);
    expect(body.data.wilayas.length).toBeGreaterThan(0);
    expect(body.data.wilayas.some((w: any) => w.name.en === "Oran")).toBe(true);
  });

  it("searches by Arabic name", async () => {
    const { body } = await get(
      "/api/search?q=" + encodeURIComponent("قسنطينة"),
    );
    expect(
      body.data.wilayas.some((w: any) => w.name.en === "Constantine"),
    ).toBe(true);
  });

  it("requires a query for search", async () => {
    const { res, body } = await get("/api/search");
    expect(res.status).toBe(400);
    expect(body.success).toBe(false);
  });

  it("every commune has coordinates and the data is well-formed", async () => {
    const { body } = await get("/api/communes");
    for (const c of body.data) {
      expect(typeof c.lat).toBe("number");
      expect(typeof c.lng).toBe("number");
      expect(c.name).toMatchObject({
        ar: expect.any(String),
        fr: expect.any(String),
      });
    }
  });
});
