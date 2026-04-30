export async function loadImage(url) {
    const res = await fetch(url, {
        headers: {
            Authorization: `Token ${import.meta.env.VITE_KOBO_TOKEN}`
        }
    });

    const blob = await res.blob();
    return URL.createObjectURL(blob);
}