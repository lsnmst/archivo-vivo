<script>
    import { tick } from "svelte";
    import {
        updateItem,
        updateCollection,
        removeFromCollection,
        moveItem,
    } from "../stores/collections.js";

    export let index;
    export let item;
    export let collectionId;
    export let readonly = false;

    let titleEl;
    let descEl;

    function autoResize(el) {
        if (!el) return;
        el.style.height = "auto";
        el.style.height = el.scrollHeight + "px";
    }

    function updateTitle(e) {
        updateItem(collectionId, item.id, {
            customTitle: e.target.value,
        });
    }

    function updateDescription(e) {
        updateItem(collectionId, item.id, {
            customDescription: e.target.value,
        });
    }

    $: koboTitle = item.title;
    $: koboDescription = item.description;

    $: if (item) {
        tick().then(() => {
            if (titleEl) autoResize(titleEl);
            if (descEl) autoResize(descEl);
        });
    }
</script>

<div class="item">
    <div class="header">
        <span class="index">{index + 1}</span>
    </div>

    {#if item.media?.type === "image"}
        <img
            src={item.media.url}
            alt=""
            draggable="false"
            on:contextmenu|preventDefault
        />
    {/if}

    <input
        bind:this={titleEl}
        class="collitem"
        value={item.customTitle ?? ""}
        placeholder={koboTitle}
        on:input={(e) => {
            updateTitle(e);
        }}
    />

    <textarea
        bind:this={descEl}
        class="colldescr"
        value={item.customDescription ?? ""}
        placeholder={koboDescription || "Añade una descripción"}
        on:input={(e) => {
            updateDescription(e);
            autoResize(e.target);
        }}
    />

    {#if !readonly}
        <div class="controls">
            <button
                on:click={() => removeFromCollection(collectionId, item.id)}
            >
                🗑
            </button>

            <button on:click={() => moveItem(collectionId, index, index - 1)}>
                ↑
            </button>

            <button on:click={() => moveItem(collectionId, index, index + 1)}>
                ↓
            </button>
        </div>
    {/if}
</div>

<style>
    img {
        -webkit-user-drag: none;
        user-select: none;
        -webkit-user-select: none;
        -webkit-touch-callout: none;
    }
    
    .item {
        padding: 0.5rem;
        margin-bottom: 0.5rem;
        -webkit-box-shadow: 2px 2px 5px rgba(86, 93, 190, 0.7);
        box-shadow: 2px 2px 5px rgba(86, 93, 190, 0.7);
        border: 1px solid rgba(86, 93, 190, 0.1);
    }

    input {
        width: 100%;
        font-size: 0.9em;
        margin-top: 0.3rem;
    }

    textarea {
        width: 100%;
        font-size: 0.8em;
        margin-top: 0.3rem;
    }

    img {
        width: 60%;
        object-fit: cover;
    }

    .controls {
        display: flex;
        gap: 0.3rem;
        margin-top: 0.4rem;
    }

    .collitem {
        font-family: "Source Code Pro", monospace !important;
        font-optical-sizing: auto !important;
        font-style: normal !important;
        background: transparent;
        border: none;
        color: var(--text);
        line-height: 0.85rem;
        border: 1px solid var(--text);
        border-radius: 6px;
    }

    .colldescr {
        font-family: "Source Code Pro", monospace !important;
        font-optical-sizing: auto !important;
        font-style: normal !important;
        font-size: 0.75rem;
        background: transparent;
        border: none;
        color: var(--text);
        border: 1px solid var(--text);
        border-radius: 6px;
    }

    .controls button {
        padding: 0.3rem 0.5rem;
        cursor: pointer;
        background: transparent;
        border: none;
        background-color: var(--text);
        border: 1px solid var(--text);
    }
    .controls button:hover {
        background-color: #fff;
        color: var(--text);
        border: 1px solid var(--text);
    }
    .index {
        width: 22px;
        height: 22px;
        border-radius: 20%;
        background: rgb(203, 68, 62) !important;
        color: white;
        font-size: 12px;
        display: grid;
        place-items: center;
        font-weight: bold;
        margin-bottom: 6px;
    }
    .header span {
        background-color: var(--text);
        font-weight: 200;
        font-family: "Source Code Pro", monospace !important;
        font-optical-sizing: auto !important;
        font-style: normal !important;
    }
</style>
