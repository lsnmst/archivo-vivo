<script>
    import { onMount, onDestroy } from "svelte";
    import html2pdf from "html2pdf.js";
    import html2canvas from "html2canvas";
    import PdfMap from "./PdfMap.svelte";

    export let collection;
    export let onClose;

    html2pdf().set({
        margin: 10,
        filename: `${collection.title}.pdf`,
        html2canvas: {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            imageTimeout: 15000,
        },
    });

    async function waitImages() {
        const imgs = document.querySelectorAll("#book img");
        await Promise.all(
            Array.from(imgs).map((img) =>
                img.complete
                    ? Promise.resolve()
                    : new Promise((res) => {
                          img.onload = img.onerror = res;
                      }),
            ),
        );
    }

    async function captureMap(mapEl) {
        const canvas = await html2canvas(mapEl);
        return canvas.toDataURL();
    }

    async function exportPDF() {
        const el = document.querySelector("#book");

        await waitImages();

        await new Promise((r) => setTimeout(r, 1500)); // wait maps

        html2pdf()
            .set({
                margin: 10,
                filename: `${collection.title}.pdf`,
                image: { type: "jpeg", quality: 1 },
                html2canvas: { scale: 2, useCORS: true, allowTaint: true },
                jsPDF: {
                    unit: "mm",
                    format: [420, 1000],
                    orientation: "portrait",
                },
            })
            .from(el)
            .save();
    }

    function handleKey(e) {
        if (e.key === "Escape") onClose();
    }

    let previewScale = 1;

    function resizePreview() {
        const availableWidth = window.innerWidth * 0.85;
        const availableHeight = window.innerHeight * 0.85;

        const a0WidthPx = 420 * 3.7795;
        const a0HeightPx = 1000 * 3.7795;

        previewScale = Math.min(
            availableWidth / a0WidthPx,
            availableHeight / a0HeightPx,
        );
    }

    onMount(() => {
        window.addEventListener("keydown", handleKey);
        document.body.style.overflow = "hidden";
        resizePreview();
        window.addEventListener("resize", resizePreview);
    });

    onDestroy(() => {
        window.removeEventListener("keydown", handleKey);
        document.body.style.overflow = "";
        window.removeEventListener("resize", resizePreview);
    });
</script>

<div class="overlay" on:click={onClose}>
    <div class="modal" on:click|stopPropagation>
        <button class="close" on:click={onClose}>✕</button>

        <div class="toolbar">
            <button class="export" on:click={exportPDF}
                >📄 Exportar a PDF</button
            >
        </div>

        <div class="preview">
            <div
                class="preview-scale"
                style={`transform: scale(${previewScale})`}
            >
                <div id="book" class="book">
                    <!-- COVER -->
                    <section class="intro">
                        <h1 class="title">{collection.title}</h1>
                        <p class="descr">{collection.description}</p>
                    </section>

                    <!-- MAPPA + LEGENDA -->
                    <section class="page lista">
                        <p>Lista de destinos</p>

                        <div class="legend">
                            {#each collection.items as item, i}
                                <div class="legend-item">
                                    <div class="legend-number">{i + 1}</div>

                                    <div class="legend-text">
                                        <strong>
                                            {item.customTitle || item.title}
                                        </strong>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </section>

                    <!-- ITEMS -->
                    {#each collection.items as item, i}
                        <section class="page item">
                            <div class="item-header">
                                <div class="index">{i + 1}</div>
                                <h3>{item.customTitle || item.title}</h3>
                            </div>

                            <p
                                class="item-descr"
                                style="padding: 6px; margin-top: 2rem; margin-bottom:2rem"
                            >
                                {item.customDescription || item.description}
                            </p>

                            {#if item.media?.type === "image"}
                                <img
                                    src={item.media.url}
                                    crossorigin="anonymous"
                                />
                            {/if}

                            <!-- mini mappa singolo punto -->
                            <!-- <PdfMap items={[item]} /> -->
                        </section>
                    {/each}
                    <div class="full-map">
                        <PdfMap items={collection.items} />
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
    }

    .modal {
        width: 95%;
        height: 95%;
        background: #eaeaea;
        overflow: hidden;
        border-radius: 12px;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .preview {
        width: 100%;
        height: 100%;
        overflow: auto;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        padding-top: 60px;
    }

    .preview-scale {
        transform-origin: top center;
    }

    .close {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--text);
        border-radius: 20%;
        width: 24px;
        height: 24px;
        border: none;
        cursor: pointer;
        z-index: 100000;
    }

    .export {
        font-family: "Source Code Pro", monospace !important;
        font-optical-sizing: auto !important;
        font-weight: 200;
        background-color: var(--text);
        border: none;
        border-radius: 4px;
        padding: 4px;
        cursor: pointer;
    }

    .toolbar {
        position: fixed;
        top: 20px;
        right: 80px;
        z-index: 100000;
    }

    .book {
        width: 420mm;
        height: 1000mm;

        background: white;

        display: grid;
        grid-template-columns: repeat(5, 1fr);
        grid-auto-rows: minmax(120mm, auto);

        align-content: start;

        gap: 8mm;
        padding: 12mm;

        box-sizing: border-box;
    }

    .page {
        padding: 8mm;
        background: white;
        box-sizing: border-box;
    }

    .cover {
        grid-column: 1 / -1;
        text-align: center;
    }

    .legend-page {
        grid-column: 1 / -1;
    }

    .intro {
        border: 1px solid rgb(203, 68, 62);
        padding: 2rem;
    }

    .title {
        font-size: 2.5rem;
        line-height: 2.2rem;
        font-family: "alagard", monospace !important;
        font-optical-sizing: auto !important;
        font-style: italic !important;
        color: rgb(203, 68, 62);
        padding: 10px;
    }

    .descr {
        color: rgb(203, 68, 62);
        font-family: "Source Code Pro", monospace !important;
        font-optical-sizing: auto !important;
        font-size: 0.8rem;
        line-height: 0.9rem;
    }

    .lista {
        /* border: 1px solid var(--text); */
        padding: 2rem;
        font-family: "alagard", monospace !important;
        font-optical-sizing: auto !important;
    }

    .item-header {
        display: flex;
        align-items: center;
        font-family: "alagard", monospace !important;
        gap: 10px;
    }

    .index {
        background: black;
        color: white;
        border-radius: 20%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        min-width: 12px !important;
        min-height: 22px !important;
        background: var(--text);
        color: white;
    }

    .item {
        height: 250mm;
        overflow: hidden;

        display: flex;
        flex-direction: column;
    }

    .item-descr {
        font-size: 0.8rem;
        line-height: 0.9rem;
    }

    .item img {
        width: 100%;
        aspect-ratio: 3 / 4;
        height: auto;
        object-fit: cover;
    }

    .item :global(.map) {
        height: 50mm;
    }

    /* LEGENDA */
    .legend {
        margin-top: 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .legend-item {
        display: flex;
        gap: 10px;
    }

    .legend-number {
        min-width: 12px !important;
        min-height: 22px !important;
        background: var(--text);
        color: white;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
    }

    .legend-text p {
        margin: 2px 0 0;
        font-size: 12px;
        color: #555;
    }

    .page {
        font-family: "Source Code Pro", monospace !important;
        font-optical-sizing: auto !important;
    }

    .cover h1 {
        font-family: "Source Code Pro", monospace !important;
        font-optical-sizing: auto !important;
        font-size: 5rem;
        line-height: 1;
        color: var(--text);
        font-style: italic;
        font-weight: 200;
    }

    .full-map {
        grid-column: 1 / -1;
        height: 300mm;
        margin-top: 50mm;
    }
</style>
