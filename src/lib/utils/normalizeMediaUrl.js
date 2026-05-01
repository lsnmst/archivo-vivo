const KOBO_BASE = "https://eu.kobotoolbox.org";

export function normalizeMediaUrl(url) {
    if (!url) return null;

    if (url.startsWith("http")) return url;

    return KOBO_BASE + url;
}

export function normalizeMediaType(type) {
    if (!type) return "other";

    if (type.includes("foto")) return "image";
    if (type.includes("video")) return "video";
    if (type.includes("audio")) return "audio";
    if (type.includes("pdf")) return "pdf";
    if (type.includes("texto")) return "text";

    return "other";
}