<script>
    export let items = [];

    const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

    function buildMapUrl(items) {
        const valid = items.filter((i) => i.location);

        if (!valid.length) return null;

        // MARKER STANDARD (questa è la parte PRO)
        const markers = valid
            .map((item, i) => {
                const { lat, lng } = item.location;
                //return `pin-s-${i + 1}+000(${lng},${lat})`;
                return `pin-s+000(${lng},${lat})`;
            })
            .join(",");

        // FIT semplice ma stabile (centro medio)
        const avgLat =
            valid.reduce((s, i) => s + +i.location.lat, 0) / valid.length;

        const avgLng =
            valid.reduce((s, i) => s + +i.location.lng, 0) / valid.length;

        const zoom = valid.length === 1 ? 15 : 11;

        return `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/${markers}/${avgLng},${avgLat},${zoom}/800x500?access_token=${MAPBOX_TOKEN}`;
    }

    $: mapUrl = buildMapUrl(items);
</script>

{#if mapUrl}
    <img src={mapUrl} class="map" />
{:else}
    <div class="empty">Nessuna coordinata</div>
{/if}

<style>
    .map {
        width: 100%;
        border: 1px solid #ddd;
    }
    .empty {
        padding: 20px;
        color: #888;
    }
</style>
