import { parseItem } from "../utils/parseKobo";

const KOBO_URL = "https://archivo-vivo-kobo.musetta-alessandro.workers.dev/";

export async function fetchKobo() {
  const res = await fetch(KOBO_URL);

  if (!res.ok) {
    const text = await res.text();
    console.error("Kobo error:", res.status, text);
    throw new Error("Errore fetch Kobo");
  }

  const data = await res.json();

  console.log("KOBO RESPONSE", data);
  console.log("count", data.count);
  console.log("results", data.results?.length);

  return data.results.map(parseItem);
}
