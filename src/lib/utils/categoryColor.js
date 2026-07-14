const base = [0, 0, 190];
const accent = [192, 132, 252];

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function toRgb(arr) {
    return `rgb(${arr[0]}, ${arr[1]}, ${arr[2]})`;
}

function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

export function getCategoryColor(category) {
    if (!category) return "rgb(150,150,150)";

    const t = (hashString(category) % 100) / 100;

    const color = [
        Math.round(lerp(base[0], accent[0], t)),
        Math.round(lerp(base[1], accent[1], t)),
        Math.round(lerp(base[2], accent[2], t)),
    ];

    return toRgb(color);
}

export const categoryColors = {
    geometrias: "#aabaff",
    tiempo: "#cfc5b3",
    herrero: "#8797d6",
    luz: "#c4aee8",
    umbrales: "#c6a48f",
    letras: "#b7a0d6",
    patina: "#aaa58a",
    senales: "#d9a8bc",
    metro: "#91a9d9",
    naturaleza: "#9fc4a8",
    popular: "#e7b995",
    nichos: "#c8addf",
};