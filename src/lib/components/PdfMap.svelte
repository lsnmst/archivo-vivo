<script>
    import { onMount } from "svelte";
    import mapboxgl from "mapbox-gl";
    import "mapbox-gl/dist/mapbox-gl.css";

    export let items = [];

    let mapContainer;
    let map;

    const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

    function validItems() {
        return items.filter(
            (i) =>
                i.location &&
                Number.isFinite(Number(i.location.lat)) &&
                Number.isFinite(Number(i.location.lng)),
        );
    }

    onMount(() => {
        mapboxgl.accessToken = MAPBOX_TOKEN;

        map = new mapboxgl.Map({
            container: mapContainer,

            style: "mapbox://styles/comuni-dados/cmox5u8cn000w01s7dxs91dxi",

            center: [-99.13, 19.43],
            zoom: 10,

            interactive: false,
            attributionControl: false,

            preserveDrawingBuffer: true,
        });

        map.on("load", () => {
            const bounds = new mapboxgl.LngLatBounds();

            validItems().forEach((item, i) => {
                const lng = Number(item.location.lng);
                const lat = Number(item.location.lat);

                const el = document.createElement("div");

                el.className = "markerrr";
                el.innerText = i + 1;

                new mapboxgl.Marker(el).setLngLat([lng, lat]).addTo(map);

                bounds.extend([lng, lat]);
            });

            if (!bounds.isEmpty()) {
                map.fitBounds(bounds, {
                    padding: 40,
                    maxZoom: 14,
                });
            }
        });
    });
</script>

<div bind:this={mapContainer} class="map"></div>

<style>
    .map {
        width: 100%;
        height: 500px;
    }

    :global(.markerrr) {
        width: 22px;
        height: 22px;
        background: rgb(203, 68, 62);
        color: #dadada;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: 800;
        border: 5px solid rgb(203, 68, 62);
        font-family: "Source Code Pro", monospace !important;
    }

    :global(.mapboxgl-control-container) {
        display: none;
    }
</style>
