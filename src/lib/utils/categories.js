export const categories = {
    geometrias: {
        label: "Pisos y pasos ",
        description: "Pocas veces nos detenemos a mirar lo que hay debajo de nuestros zapatos. En la Ciudad de México el pavimento en las banquetas suele ser placas de concreto con acabado escobillado, pero en casas antiguas aparecen baldosas hidráulicas con diseños que cuentan otra historia. Algunas banquetas tienen patrones únicos, decisiones de alguien que quiso dejar una marca. El piso también es un archivo, solo hay que bajar la mirada.",
    },

    tiempo: {
        label: "Ojos del subsuelo",
        description:
            "Imperceptibles en el día a día, los registros para instalaciones pluviales, hidráulicas, eléctricas y de gas existen para facilitar el mantenimiento de la ciudad. Pero si los miramos con atención en algunos encontramos más información: el nombre de la colonia, el año en que fueron fundidos, la empresa que los fabricó, patrones antiderrapantes y a veces hasta pequeños dibujos. Cada uno aporta a la identidad del lugar donde está.",
    },

    herrero: {
        label: "Umbrales forjados",
        description: "Las herrerías se han convertido en parte fundamental de nuestra arquitectura, transformándose a lo largo de las décadas sin perder su presencia en la fachada. Estos portales que atravesamos a diario (entre el interior y el exterior) aportan seguridad pero también identidad. Sus diseños son en su mayoría muy geométricos, y son aplicados en puertas, ventanas, barandales y respiraderos. Son líneas que alguien trazó con una intención y que hoy se pueden leer como un lenguaje propio.",
    },

    luz: {
        label: "Luz tamizada",
        description:
            "Las celosías son estas cortinas que filtran y juegan con la luz natural que se han convertido en elementos icónicos de casas y edificios. En esta ciudad casi nunca cubren por completo, pero crean franjas de sombra y luz que transforman una fachada. Sus diseños están influenciados por la época en que fueron concebidos y su vigencia va y viene con las modas, pero son tan distintivos que hacen reconocibles a las edificaciones que aún los conservan.",
    },

    umbrales: {
        label: "Luz teñida",
        description: "De mañana o de noche, los vitrales ofrecen una perspectiva distinta de cada espacio. Los encontramos en grandes templos convertidos en obras de arte, pero también en lugares más cotidianos: el metro, pequeñas casas donde fueron adaptados a puertas y ventanas. Durante el día los iluminan los rayos del sol, de noche se encienden desde adentro y cambian por completo la dinámica de la calle.",
    },

    letras: {
        label: "El muro como lienzo",
        description:
            "Cuando se mira la ciudad con otros ojos, los muros dejan de ser límites y se convierten en superficies de expresión. Arquitectos y artistas los han intervenido con murales de distintas temáticas y técnicas, algunos firmados por nombres reconocidos, otros de autores anónimos que le dieron identidad a un edificio o una calle. Los materiales cambian con cada época, pero todos terminan plasmando algo sobre el muro.",
    },

    patina: {
        label: "Patrones y ritmos",
        description:
            "Más allá de la pintura, existen materiales y técnicas que revisten los muros con una lógica propia: el mosaico veneciano, el concreto, el ladrillo vidriado, el azulejo. Lo que llama la atención no es solo el material sino la creatividad con que fue usado. Algunos ya no se fabrican, y sus reparaciones (pequeños parches visibles) se vuelven parte del patrón, una huella más del tiempo sobre la fachada.",
    },

    senales: {
        label: "Alfabeto de la calle",
        description:
            "A diferencia de los materiales o las formas, las letras y los números nos ayudan a leer la ciudad de forma literal. Han sido trazadas por distintas manos a lo largo de los años, algunas renovadas, muchas otras intactas. Lo que las hace resaltar no es solo lo que dicen sino cómo están hechas: los materiales, las técnicas, las tipografías que delatan el contexto en que surgieron y el carácter del lugar.",
    },

    metro: {
        label: "Geometrías escultóricas",
        description:
            "Nos hemos acostumbrado a las cajas y los volúmenes simples, pero hay edificios que se atrevieron a algo distinto. Ventanas que no son cuadradas, fachadas que se pliegan, formas que salen de lo convencional y convierten al edificio en una obra plástica en sí mismo. La influencia arquitectónica de cada década dejó ejemplos de quienes decidieron habitar algo verdaderamente distintivo.",
    },

    naturaleza: {
        label: "Ruinas y vacíos",
        description:
            "Los baldíos y las ruinas son difíciles de mirar, el ojo está acostumbrado a la formalidad. Aquí reina el caos y el tiempo se adhiere a los materiales transformándolos: las grietas se vuelven caminos para las plantas, los muros nidos para las aves, los rincones refugios para la fauna. Entre lo derruido aún se percibe las bases con la que fue construido, y eso crea espacios con una densidad que pocas cosas tienen.",
    },

    popular: {
        label: "Gestos populares",
        description:
            "Todos hacemos ciudad: colgando algo en la ventana, colocando un sticker, modificando la banqueta, improvisando una jardinera. En México nos caracteriza la adecuación a medida, la solución nacida de la necesidad y la carencia. Pero vista desde otra perspectiva, esa creatividad espontánea tiene un sello propio. Es la ciudad intervenida por sus habitantes, sin arquitectos ni permisos, y eso la hace tan particular como cualquier obra planeada.",
    },

    nichos: {
        label: "Nichos cotidianos",
        description:
            "No es raro encontrar en cada esquina un nicho de la Virgen de Guadalupe, lleno de flores y resuelto con creatividad. Pero no solo la Virgen habita las calles: la Santa Muerte, otros santos y creencias diversas también tienen su lugar en el espacio público. Los nichos son parte de la ciudad, alguien se encarga de mantenerlos vivos. Cada uno tiene una historia, y esa historia hace especial al lugar donde está.",
    },
};


export function getCategory(categoryKey) {
    if (!categoryKey) return null;

    return categories[categoryKey] || {
        label: categoryKey,
        description: ""
    };
}