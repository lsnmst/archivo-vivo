<script>
    import { onMount } from "svelte";
    import { createEventDispatcher } from "svelte";
    import { addToCollection } from "../stores/collections.js";
    import { collections } from "../stores/collections.js";

    export let item;
    export let activeCollectionId;

    const dispatch = createEventDispatcher();

    function handleAdd() {
        dispatch("add", { item });
    }

    function handleOpenCollection(colId) {
        dispatch("openCollection", { colId });
    }

    function formatDate(date) {
        if (!date) return "";

        return new Date(date).toLocaleDateString("es-ES", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    }

    $: usedInCollections = $collections.filter((col) =>
        col.items.some((i) => i.id === item.id),
    );
</script>

<div class="card" on:click={handleAdd}>
    <div class="badges">
        {#each usedInCollections.slice(0, 2) as col}
            <span
                class="badge"
                on:click|stopPropagation={() => handleOpenCollection(col.id)}
            >
                {col.title}
            </span>
        {/each}

        {#if usedInCollections.length > 2}
            <span class="badge more">
                +{usedInCollections.length - 2}
            </span>
        {/if}
    </div>

    <div class="head">
        <span class="type"
            >{#if item.mediaType === "image"}
                🖼
            {/if}
            {#if item.mediaType === "video"}
                🎥
            {/if}
            {#if item.mediaType === "audio"}
                🎧
            {/if}
            {#if item.mediaType === "pdf"}
                📄
            {/if}</span
        >
        <button class="addColl" on:click={handleAdd}>+</button>
    </div>

    <!-- MEDIA -->
    {#if item.media?.type === "image"}
        <img src={item.media.url} alt={item.title} loading="lazy" />
    {:else if item.media?.type === "video"}
        <p>🎥 video</p>
    {:else if item.media?.type === "audio"}
        <p>🎧 audio</p>
    {:else if item.media?.type === "pdf"}
        <p>📄 pdf</p>
    {:else}
        <p>📍 no media</p>
    {/if}

    <!-- TEXT -->
    <div class="content">
        <div class="head">
            <span class="date"><i>{formatDate(item.date)}</i>, {item.title}</span>
        </div>
        <!-- <h3>{item.title}</h3> -->
    </div>
    <!-- ACTION -->
    <!--     
    <button
        on:click={() => {
            if (!activeCollectionId) {
                alert("Seleziona prima una collezione");
                return;
            }

            addToCollection(activeCollectionId, item);
        }}
    >
        +
    </button>-->
</div>

<style>
    h3 {
        font-size: 0.8em;
        line-height: 1.05;
    }
    .card {
        padding: 0.25em;
        display: flex;
        flex-direction: column;
        height: auto;
        -webkit-box-shadow: 2px 2px 5px rgba(86, 93, 190, 0.7);
        box-shadow: 2px 2px 5px rgba(86, 93, 190, 0.7);
        border: 1px solid rgba(86, 93, 190, 0.1);
    }
    .card img {
        width: 100%;
        height: auto;
        display: block;
        cursor: pointer;
    }
    .card img:hover {
        filter: grayscale(50%);
    }

    .date {
        display: block;
        margin-top: 4px;
        font-size: 0.65rem;
        line-height: 0.75rem;
    }
    .badges {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        margin-top: 2px;
    }
    .badge {
        text-decoration: none;
        padding: 3px 5px 3px 5px;
        border-radius: 3px;
        display: block;
        color: rgb(86, 93, 190);
        font-size: 0.65rem;
        line-height: 1.2;
        letter-spacing: 0.015em;
        -webkit-hyphens: auto;
        -ms-hyphens: auto;
        hyphens: auto;
        border: 1px solid rgb(86, 93, 190);
        cursor: pointer;
    }
    .head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.25em;
    }
    .addColl {
        background-color: rgb(86, 93, 190);
        border: none;
        border-radius: 5px;
    }
    .addColl:hover {
        background-color: rgb(204, 79, 138);
        cursor: pointer;
    }

    @media (max-width: 768px) {
        .card img {
            aspect-ratio: 4 / 5;
            object-fit: cover;
        }
    }
</style>
