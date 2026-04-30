export function getBounds(items) {
    const coords = items
        .map(i => i.location)
        .filter(l => l?.lat != null && l?.lng != null);

    const lats = coords.map(c => c.lat);
    const lngs = coords.map(c => c.lng);

    return {
        minLat: Math.min(...lats) - 0.01,
        maxLat: Math.max(...lats) + 0.01,
        minLng: Math.min(...lngs) - 0.01,
        maxLng: Math.max(...lngs) + 0.01,
    };
}

export function project(lat, lng, bounds, width, height) {
    const lngRange = bounds.maxLng - bounds.minLng || 1;
    const latRange = bounds.maxLat - bounds.minLat || 1;

    const x = (lng - bounds.minLng) / lngRange;
    const y = (lat - bounds.minLat) / latRange;

    return {
        x: Math.max(0, Math.min(width, x * width)),
        y: Math.max(0, Math.min(height, (1 - y) * height))
    };
}