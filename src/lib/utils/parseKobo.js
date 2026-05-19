import { F } from "./koboFields";
import { normalizeMediaUrl, normalizeMediaType } from "./normalizeMediaUrl";


function clean(v) {
    return v && v !== "" ? v : null;
}

function toNumber(v) {
    const n = parseFloat(v);
    return isNaN(n) ? null : n;
}

/**
 * MEDIA KOBO (CORRETTO)
 * usa SOLO download_url originale
 */
function getMedia(item) {
    const att = item._attachments;

    if (!Array.isArray(att) || att.length === 0) {
        return { type: "none", url: null };
    }

    const file = att[0];

    if (!file.download_url) {
        return { type: "none", url: null };
    }

    // 🔥 QUI IL FIX VERO
    const url =
        "https://archivo-vivo-kobo.musetta-alessandro.workers.dev/api/media?url=" +
        encodeURIComponent(file.download_url);

    const mime = file.mimetype || "";

    if (mime.includes("image")) {
        return { type: "image", url };
    }

    if (mime.includes("video")) {
        return { type: "video", url };
    }

    if (mime.includes("audio")) {
        return { type: "audio", url };
    }

    return { type: "file", url };
}

/**
 * LOCATION ROBUSTA
 */
function getLocation(item) {
    // 1. Kobo standard (più comune)
    if (Array.isArray(item._geolocation) && item._geolocation.length >= 2) {
        const lat = Number(item._geolocation[0]);
        const lng = Number(item._geolocation[1]);

        if (Number.isFinite(lat) && Number.isFinite(lng)) {
            return { lat, lng };
        }
    }

    // 2. string fallback
    if (typeof item._geolocation === "string") {
        const parts = item._geolocation.trim().split(" ");

        const lat = Number(parts[0]);
        const lng = Number(parts[1]);

        if (Number.isFinite(lat) && Number.isFinite(lng)) {
            return { lat, lng };
        }
    }

    return { lat: null, lng: null };
}

function parseDate(item) {
    console.log("DATE FIELD RAW:", item[F.date], item);

    const key = Object.keys(item).find((k) =>
        k.toLowerCase().includes("fecha") ||
        k.toLowerCase().includes("data") ||
        k.toLowerCase().includes("date")
    );

    if (!key) return null;

    const raw = item[key];

    console.log("FOUND DATE FIELD:", key, raw);

    const d = new Date(raw);

    return isNaN(d.getTime()) ? null : d.toISOString();
}

function parseMediaType(item) {
    const raw = item[F.mediaType];

    if (raw) return normalizeMediaType(raw.toLowerCase());

    // fallback da mime
    const att = item._attachments?.[0];
    if (!att) return null;

    const mime = att.mimetype || "";

    if (mime.includes("image")) return "image";
    if (mime.includes("video")) return "video";
    if (mime.includes("audio")) return "audio";
    if (mime.includes("pdf")) return "pdf";

    return "other";
}

function normalizeCategory(v) {
    if (!v) return null;

    if (typeof v === "string") {
        return v.split(",")[0].trim();
    }

    if (typeof v === "object") {
        return v.name || v.value || v.label || null;
    }

    return null;
}

/**
 * PARSER FINALE
 */
export function parseItem(item) {
    console.log("GEOLocation RAW:", item._geolocation);

    return {
        id: item._uuid,

        title: clean(item[F.title]) || "Sin título",
        description: clean(item[F.description]) || "",

        location: getLocation(item),

        media: getMedia(item),

        date: parseDate(item),

        mediaType: parseMediaType(item),

        category: normalizeCategory(item[F.category]),

    };
}