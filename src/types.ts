export interface LocalizedName {
  ar: string;
  fr: string;
  en: string;
}

export interface Daira {
  ar: string;
  fr: string;
}

export interface Commune {
  /** Trilingual commune name. */
  name: LocalizedName;
  /** Daira (administrative district) the commune belongs to. */
  daira: Daira;
  /** Official commune code. */
  code: string;
  /** 5-digit Algerian postal code, or null when unknown. */
  postCode: string | null;
  /** Latitude of the commune centroid (WGS84). */
  lat: number;
  /** Longitude of the commune centroid (WGS84). */
  lng: number;
}

export interface Wilaya {
  /** Zero-padded official wilaya code, "01"–"58". */
  code: string;
  /** Trilingual wilaya name. */
  name: LocalizedName;
  /** Macro-region: North-Center, North-East, North-West, Highlands, South. */
  region: string;
  /** Latitude of the wilaya centroid (mean of its communes). */
  lat: number;
  /** Longitude of the wilaya centroid (mean of its communes). */
  lng: number;
  /** Communes belonging to the wilaya. */
  communes: Commune[];
}

/** Cloudflare Worker bindings. */
export interface Env {
  /** Optional KV namespace holding the dataset. Falls back to bundled data. */
  WILAYA_KV?: KVNamespace;
}
