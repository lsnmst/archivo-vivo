<script>
    import { onMount } from "svelte";
    import { categoryColors } from "../utils/categoryColor";
    import { getCategory } from "../utils/categories";
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

            const color = categoryColors[item.category] || "#999";

            el.className = "custom-marker";
            el.innerHTML = `
                <div
                class="marker"
                style="
                    background-color:${color};
                "
                >
                •
                </div>
                `;

            const popup = new mapboxgl.Popup({
                offset: 20,
            }).setHTML(`
               <div class="category" style="
                border-bottom: 8px ${color} solid;
                ">
                 ${getCategory(item.category)?.label}
                </div>
             ${
                 item.media?.type === "image"
                     ? `<img src="${item.media.url}" class="popup-image" />`
                     : ""
             }
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
        width: 12px;
        height: 12px;
        background: white;
        color: rgb(203, 68, 62);
        border-radius: 20%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 900;
        border: 1px solid rgb(203, 68, 62);
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

    :global(.popup-image) {
        width: 100%;
        aspect-ratio: 4 / 3;
        object-fit: cover;
        border-radius: 4px;
    }

    :global(.category) {
        font-size: 0.62rem;
        line-height: 0.8rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        font-family: "alagard", monospace;
        margin-top: 0.35rem;
        margin-bottom: 0.35rem;
        padding: 0.3rem;
    }
</style>
