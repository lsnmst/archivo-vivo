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
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            })
            .from(el)
            .save();
    }

    function handleKey(e) {
        if (e.key === "Escape") onClose();
    }

    onMount(() => {
        window.addEventListener("keydown", handleKey);
        document.body.style.overflow = "hidden";
    });

    onDestroy(() => {
        window.removeEventListener("keydown", handleKey);
        document.body.style.overflow = "";
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

        <div id="book" class="book">
            <!-- COVER -->
            <section class="page cover">
                <h1>{collection.title}</h1>
                <p>{collection.description}</p>
            </section>

            <!-- MAPPA + LEGENDA -->
            <section class="page">
                <!--                 
                <h2>Mappa della collezione</h2>
                <PdfMap items={collection.items} /> -->

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

                    <p>{item.customDescription || item.description}</p>

                    {#if item.media?.type === "image"}
                        <img src={item.media.url} />
                    {/if}

                    <!-- mini mappa singolo punto -->
                    <PdfMap items={[item]} />
                </section>
            {/each}
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
        overflow: auto;
        border-radius: 12px;
        position: relative;
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
        width: 210mm;
        margin: auto;
    }

    .page {
        page-break-after: always;
        padding: 20mm;
        background: white;
    }

    .cover {
        text-align: center;
    }

    .item-header {
        display: flex;
        align-items: center;
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

    img {
        width: 100%;
        margin-top: 10px;
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
</style>
