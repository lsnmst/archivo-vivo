export function normalizeMediaUrl(url) {
    if (!url) return null;

    try {
        const parsed = new URL(url);

        // Kobo → passa sempre dal proxy
        if (parsed.hostname.includes("kobotoolbox")) {
            return "/kobo" + parsed.pathname;
        }

        return url;
    } catch {
        return url;
    }
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