<script>
    import { onMount, tick } from "svelte";
    import L from "leaflet";
    import { collections } from "../stores/collections.js";

    export let archive = [];
    export let activeCollectionId = null;

    let map;
    let mapContainer;
    let layerGroup;

    const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

    $: itemsToShow = activeCollectionId
        ? ($collections.find((c) => c.id === activeCollectionId)?.items ?? [])
        : archive;

    $: itemsWithIndex = itemsToShow.map((item, i) => ({
        ...item,
        index: i + 1,
    }));

    function getCoords(item) {
        if (!item?.location) return null;

        const lat = Number(item.location.lat);
        const lng = Number(item.location.lng);

        if (Number.isFinite(lat) && Number.isFinite(lng)) {
            return [lat, lng]; // Leaflet OK (lat, lng)
        }

        return null;
    }

    function render() {
        if (!map || !layerGroup) return;

        layerGroup.clearLayers();

        const bounds = [];

        for (const [i, item] of itemsToShow.entries()) {
            const coords = getCoords(item);
            if (!coords) continue;

            const icon = L.divIcon({
                className: "custom-marker",
                html: `<div class="marker">${i + 1}</div>`,
            });

            const marker = L.marker(coords, { icon }).bindPopup(
                `${i + 1}. ${item.title}`,
            );

            marker.addTo(layerGroup);

            bounds.push(coords);
        }

        if (bounds.length) {
            map.fitBounds(bounds, { padding: [40, 40] });
        }

        console.log("RENDER MARKERS:", bounds.length);
    }

    onMount(async () => {
        await tick();

        map = L.map(mapContainer).setView([19.43, -99.13], 12);

        L.tileLayer(
            `https://api.mapbox.com/styles/v1/mapbox/light-v11/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`,
            {
                tileSize: 512,
                zoomOffset: -1,
            },
        ).addTo(map);

        layerGroup = L.layerGroup().addTo(map);

        await tick();
        map.invalidateSize();
    });

    $: if (map && itemsToShow) {
        render();
    }
</script>

<div bind:this={mapContainer} class="map"></div>

<style>
    .map {
        width: 100%;
        height: 100%;
        min-height: 400px;
    }
    :global(.custom-marker .marker) {
        width: 16px;
        height: 16px;
        background: var(--text);
        color: white;
        border-radius: 20%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        border: 1px solid white;
        font-family: "Source Code Pro", monospace !important;
        font-optical-sizing: auto !important;
        font-style: normal !important;
    }

    :global(.leaflet-popup-tip) {
        display: none !important;
    }

    :global(.leaflet-popup-content-wrapper) {
        box-shadow: none;
        border: 1px solid var(--text);
        background-color: var(--text);
        font-family: "Source Code Pro", monospace !important;
        font-optical-sizing: auto !important;
        font-style: normal !important;
        color: #fff;
    }

    :global(.leaflet-control-attribution) {
        display: none;
    }
</style>
