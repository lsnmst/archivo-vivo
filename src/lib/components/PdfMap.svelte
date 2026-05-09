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

                el.className = "marker";
                el.innerText = i;

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
        height: 320px;
        border: 1px solid #ddd;
    }

    :global(.marker) {
        width: 22px;
        height: 22px;
        background: black;
        color: black;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        border: 2px solid white;
        font-family: monospace;
    }

    :global(.mapboxgl-control-container) {
        display: none;
    }
</style>
