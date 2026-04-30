<script>
    import CollectionItem from "./CollectionItem.svelte";
    import { moveItem } from "../stores/collections.js";

    export let items = [];
    export let collectionId;

    let draggingIndex = null;

    function onDragStart(index) {
        draggingIndex = index;
    }

    function onDrop(index) {
        if (draggingIndex === null) return;

        if (draggingIndex !== index) {
            moveItem(collectionId, draggingIndex, index);
        }

        draggingIndex = null;
    }
</script>

<div class="list">
    {#each items as item, i}
        <div
            class="draggable"
            draggable="true"
            on:dragstart={() => onDragStart(i)}
            on:dragover|preventDefault
            on:drop={() => onDrop(i)}
        >
            <CollectionItem {item} {collectionId} />
        </div>
    {/each}
</div>

<style>
    .draggable {
        cursor: grab;
    }

    .draggable:active {
        cursor: grabbing;
        opacity: 0.7;
    }
</style>