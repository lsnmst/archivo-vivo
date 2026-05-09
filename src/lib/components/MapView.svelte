<script>
    import { onMount } from "svelte";
    import mapboxgl from "mapbox-gl";
    import "mapbox-gl/dist/mapbox-gl.css";

    export let archive = [];
    export let activeCollectionId = null;

    let map;
    let mapContainer;
    let markers = [];

    const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

    $: itemsToShow = activeCollectionId
        ? archive.filter((i) => i.collectionId === activeCollectionId)
        : archive;

    function getCoords(item) {
        if (!item?.location) return null;

        const lat = Number(item.location.lat);
        const lng = Number(item.location.lng);

        if (Number.isFinite(lat) && Number.isFinite(lng)) {
            return [lng, lat]; // MAPBOX = [lng, lat]
        }

        return null;
    }

    function clearMarkers() {
        markers.forEach((m) => m.remove());
        markers = [];
    }

    function renderMarkers() {
        if (!map) return;

        clearMarkers();

        const bounds = new mapboxgl.LngLatBounds();

        for (const [i, item] of itemsToShow.entries()) {
            const coords = getCoords(item);

            if (!coords) continue;

            const el = document.createElement("div");

            el.className = "custom-marker";
            el.innerHTML = `<div class="marker">${i + 1}</div>`;

            const popup = new mapboxgl.Popup({
                offset: 20,
            }).setHTML(`
                <strong>${i + 1}.</strong>
                ${item.title}
            `);

            const marker = new mapboxgl.Marker(el)
                .setLngLat(coords)
                .setPopup(popup)
                .addTo(map);

            markers.push(marker);

            bounds.extend(coords);
        }

        if (!bounds.isEmpty()) {
            map.fitBounds(bounds, {
                padding: 60,
                maxZoom: 15,
            });
        }
    }

    onMount(() => {
        mapboxgl.accessToken = MAPBOX_TOKEN;

        map = new mapboxgl.Map({
            container: mapContainer,

            style: "mapbox://styles/comuni-dados/cmox5u8cn000w01s7dxs91dxi",

            center: [-99.13, 19.43],
            zoom: 12,
        });

        map.addControl(new mapboxgl.NavigationControl());

        map.on("load", () => {
            renderMarkers();
        });
    });

    $: if (map && itemsToShow) {
        renderMarkers();
    }
</script>

<div bind:this={mapContainer} class="map"></div>

<style>
    .map {
        width: 100%;
        height: 100%;
        min-height: 400px;
    }

    :global(.custom-marker) {
        cursor: pointer;
    }

    :global(.custom-marker .marker) {
        width: 18px;
        height: 18px;
        background:white;
        color: var(--text);
        border-radius: 20%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        font-weight: 900;
        border: 5px solid var(--text);
        font-family: "Source Code Pro", monospace;
    }

    :global(.mapboxgl-popup-content) {
        box-shadow: none;
        border: 1px solid var(--text);
        background-color: var(--text);
        color: white;
        font-family: "Source Code Pro", monospace;
        font-size: 12px;
    }

    :global(.mapboxgl-popup-tip) {
        display: none;
    }

    :global(.mapboxgl-ctrl-logo) {
        display: none !important;
    }
</style>
