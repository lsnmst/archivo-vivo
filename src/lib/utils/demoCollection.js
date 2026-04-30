import { normalizeMediaUrl } from "./normalizeMediaUrl";

export const demoCollection = {
    id: "demo",
    title: "Ejemplo de colección",
    description: "Esta es una colección demostrativa, este campo se puede editar",
    readonly: true,

    items: [
        {
            id: "demo-1",

            title: "Nayarit 5BIS, Roma Sur, Cuauhtémoc, 06760 Ciudad de México, CDMX, Mexico",
            description: "Escribir la historia de este lugar; este campo es editable",

            customTitle: "Nayarit 5BIS, Roma Sur, Cuauhtémoc, 06760 Ciudad de México, CDMX, Mexico",
            customDescription: "Escribir la historia de este lugar; este campo es editable",

            location: { lat: 19.41, lng: -99.16 },

            media: {
                type: "image",
                url: normalizeMediaUrl("http://www.alessandromusetta.com/geo/tiles/cdmx/coll/test1.jpg")
            }
        },
        {
            id: "demo-2",
            title: "Calz. de los Misterios 829, Villa Gustavo A. Madero, Gustavo A. Madero, 07050 Ciudad de México, CDMX, Mexico",
            description: "Escribir la historia de este lugar; este campo es editable",

            customTitle: "Calz. de los Misterios 829, Villa Gustavo A. Madero, Gustavo A. Madero, 07050 Ciudad de México, CDMX, Mexico",
            customDescription: "Escribir la historia de este lugar; este campo es editable",

            location: { lat: 19.42927, lng: -99.15442 },

            media: {
                type: "image",
                url: normalizeMediaUrl("http://www.alessandromusetta.com/geo/tiles/cdmx/coll/test2.jpg")
            }
        }
    ],

    isDemo: true,
    settings: {
        color: "#000000",
        showPath: true,
        showNumbers: true
    }
};