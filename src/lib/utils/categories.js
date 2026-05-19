export const categories = {
    geometrias: {
        label: "Geometrías",
        description: "Mosaicos y pavimentos de la ciudad",
    },

    tiempo: {
        label: "Marcas del tiempo",
        description:
            "Registros antiguos, coladeras históricas y juntas constructivas",
    },

    herrero: {
        label: "El trazo del herrero",
        description: "Herrerías y formas excepcionales",
    },

    luz: {
        label: "Filtros de luz",
        description:
            "Celosías, muros texturizados, murales en edificios y vitrales",
    },

    umbrales: {
        label: "Umbrales",
        description: "Puertas, zaguanes y mirillas antiguas",
    },

    letras: {
        label: "Letras urbanas",
        description:
            "Tipografías (Art Déco, modernistas, latón)",
    },

    patina: {
        label: "Pátina",
        description:
            "Azulejos, ladrillo vidriado y muros envejecidos",
    },

    senales: {
        label: "Señales del pasado",
        description:
            "Nomenclaturas antiguas y vestigios gráficos",
    },

    metro: {
        label: "Transiciones del Metro",
        description:
            "Mosaicos venecianos, vitrales y muros interiores de estaciones",
    },

    naturaleza: {
        label: "Integración orgánica",
        description:
            "Naturaleza reclamando espacio",
    },

    popular: {
        label: "Gesto popular",
        description:
            "Improvisaciones y soluciones espontáneas del habitante",
    },

    nichos: {
        label: "Nichos cotidianos",
        description:
            "Altares y nichos de barrio",
    },
};


export function getCategory(categoryKey) {
    if (!categoryKey) return null;

    return categories[categoryKey] || {
        label: categoryKey,
        description: ""
    };
}