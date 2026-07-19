import { normalizeMediaUrl } from "./normalizeMediaUrl";

export const demoCollection = {
    id: "mixoac",
    title: "MIXCOAC",
    description: "Mixcoac es uno de esos lugares que habitan con claridad en mi memoria. Ahí nació mi abuelo, y fue también donde conoció a mi abuela, quien venía de Guerrero. A lo largo de mi niñez y juventud, me compartió innumerables anécdotas sobre su vida en este sitio, su relación con el río del mismo nombre, con las plantas y con la topografía que daba forma al paisaje.\nGracias a esto, en mi mente se ha construido un mapa que reconstruye lo que fue este lugar y se enlaza con lo que es hoy en día. A través del registro fotográfico y mapeando lo cotidiano de estas colonias es posible leer las distintas capas históricas, culturales y perceptuales que conforman un sitio con una identidad tan profunda como Mixcoac.\n\n'el lugar de las serpientes de nubes'.",
    readonly: true,

    items: [
        {
            id: "mixoac-1",

            title: "Gaudí falso",
            description: "Es divertido cuando la ciudad te ofrece ciertas excentricidades que no te esperas. Son estos lugares los que después se convierten en un hito, porque son memorizables. Esta casa para mí fue eso, algo inesperado... Ahora no dejo de pensar en el Gaudí de Mixcoac.",

            customTitle: "Gaudí falso",
            customDescription: "Es divertido cuando la ciudad te ofrece ciertas excentricidades que no te esperas. Son estos lugares los que después se convierten en un hito, porque son memorizables. Esta casa para mí fue eso, algo inesperado... Ahora no dejo de pensar en el Gaudí de Mixcoac.",

            location: { lat: 19.37532, lng: -99.1833 },

            media: {
                type: "image",
                url: normalizeMediaUrl("https://archivo-vivo-kobo.musetta-alessandro.workers.dev/api/media?url=https%3A%2F%2Feu.kobotoolbox.org%2Fapi%2Fv2%2Fassets%2Fa5iWLemmhk3UXJjctWsLgr%2Fdata%2F795989564%2Fattachments%2Fattt8cHLCQniv7Z8GMtaUN6A%2F")
            }
        },
        {
            id: "mixoac-2",
            title: "Secundaria Leopoldo Ayala",
            description: "Mientras uno va caminando va descubriendo. El caso de la secundaria es que es uno de los edificios más bellos de la zona. Todo toma sentido cuando ves las puertas de gran escala, el despiece de los ladrillos, los detalles en sus cornisas.",

            customTitle: "Secundaria Leopoldo Ayala",
            customDescription: "Mientras uno va caminando va descubriendo. El caso de la secundaria es que es uno de los edificios más bellos de la zona. Todo toma sentido cuando ves las puertas de gran escala, el despiece de los ladrillos, los detalles en sus cornisas.",

            location: { lat: 19.37386, lng: -99.18591 },

            media: {
                type: "image",
                url: normalizeMediaUrl("https://archivo-vivo-kobo.musetta-alessandro.workers.dev/api/media?url=https%3A%2F%2Feu.kobotoolbox.org%2Fapi%2Fv2%2Fassets%2Fa5iWLemmhk3UXJjctWsLgr%2Fdata%2F796308750%2Fattachments%2FattSh3Ko3H8nwxQ3CySJ5uEt%2F")
            }
        },
        {
            id: "mixoac-3",
            title: "Poste nomenclador antiguo",
            description: "Son pocas las colonias que conservan señalética antigua. Encontrar estos postes en Plaza Sevilla es una sorpresa; remiten a los que aún sobreviven en colonias como la Narvarte o la Condesa.",

            customTitle: "Poste nomenclador antiguo",
            customDescription: "Son pocas las colonias que conservan señalética antigua. Encontrar estos postes en Plaza Sevilla es una sorpresa; remiten a los que aún sobreviven en colonias como la Narvarte o la Condesa.",

            location: { lat: 19.37286, lng: -99.18047 },

            media: {
                type: "image",
                url: normalizeMediaUrl("https://archivo-vivo-kobo.musetta-alessandro.workers.dev/api/media?url=https%3A%2F%2Feu.kobotoolbox.org%2Fapi%2Fv2%2Fassets%2Fa5iWLemmhk3UXJjctWsLgr%2Fdata%2F795463703%2Fattachments%2FattuhEAMTmceCd7SMaivC7xT%2F")
            }
        },
        {
            id: "mixoac-4",
            title: "Letrero Baños Reforma",
            description: "Su nombre proviene de que, frente a estos baños, se encontraba el Cine Reforma, demolido no hace mucho tiempo. Recuerdo que hace unos quince años entré con mi abuelo a tomar fotografías: ya solo quedaban ruinas.",

            customTitle: "Letrero Baños Reforma",
            customDescription: "Su nombre proviene de que, frente a estos baños, se encontraba el Cine Reforma, demolido no hace mucho tiempo. Recuerdo que hace unos quince años entré con mi abuelo a tomar fotografías: ya solo quedaban ruinas.",

            location: { lat: 19.37415, lng: -99.18828 },

            media: {
                type: "image",
                url: normalizeMediaUrl("https://archivo-vivo-kobo.musetta-alessandro.workers.dev/api/media?url=https%3A%2F%2Feu.kobotoolbox.org%2Fapi%2Fv2%2Fassets%2Fa5iWLemmhk3UXJjctWsLgr%2Fdata%2F795503251%2Fattachments%2FattaCJnf5XjH2MgbnLrWUYLZ%2F")
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