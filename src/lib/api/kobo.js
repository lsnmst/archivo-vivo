import { parseItem } from "../utils/parseKobo";

const KOBO_TOKEN = import.meta.env.VITE_KOBO_TOKEN;

const KOBO_URL =
    "/kobo/api/v2/assets/a5iWLemmhk3UXJjctWsLgr/data/?format=json&attachments=true";

export async function fetchKobo() {
  const res = await fetch(KOBO_URL, {
    headers: {
      Authorization: `Token ${import.meta.env.VITE_KOBO_TOKEN}`
    }
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Kobo error:", res.status, text);
    throw new Error("Errore fetch Kobo");
  }

  const data = await res.json();
  return data.results.map(parseItem);
}