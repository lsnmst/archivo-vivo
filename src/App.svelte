<script>
  import { onMount, tick } from "svelte";
  import { fetchKobo } from "./lib/api/kobo";
  import {
    collections,
    createCollection,
    addToCollection,
    updateCollection,
    updateItem,
    removeFromCollection,
    moveItem,
    deleteCollection,
  } from "./lib/stores/collections.js";
  import { categories } from "./lib/utils/categories.js";
  import { categoryColors } from "./lib/utils/categoryColor";
  import ArchiveCard from "./lib/components/ArchiveCard.svelte";
  import CollectionItem from "./lib/components/CollectionItem.svelte";
  import MapView from "./lib/components/MapView.svelte";
  import MapViewArchive from "./lib/components/MapViewArchive.svelte";
  import { demoCollection } from "./lib/utils/demoCollection";
  import PrintA4 from "./lib/components/PrintA4.svelte";

  let mainEl;
  let archive = [];
  let showArchiveMap = false;

  let presentationCompact = false;
  let lastScroll = 0;

  let activeCategory = null;
  let sortOrder = "newest";

  let newCollectionTitle = "";
  let activeCollectionId = null;
  let showPrint = false;
  let printCollection = null;
  let fileInput;

  let showCollections = false;
  let mobileTab = "list";

  $: allCollections = [demoCollection, ...$collections];

  $: userCollections = $collections;

  $: collection = activeCollectionId
    ? allCollections.find((c) => c.id === activeCollectionId)
    : null;

  $: selectableCollections = $collections.filter((col) => {
    if (!selectedItem) return true;

    return !col.items.some((i) => i.id === selectedItem.id);
  });

  $: categoryFilteredArchive = activeCategory
    ? archive.filter((i) => i.category === activeCategory)
    : archive;

  $: filteredArchive = [...categoryFilteredArchive].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  function goBack() {
    activeCollectionId = null;
  }

  $: activeCategoryData = activeCategory ? categories[activeCategory] : null;

  function handleCreate() {
    if (!newCollectionTitle) return;

    const id = createCollection(newCollectionTitle);

    activeCollectionId = id;
    newCollectionTitle = "";
  }

  let showPicker = false;
  let selectedItem = null;
  let newTitle = "";

  function autoResize(el) {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }

  $: if (collection) {
    tick().then(() => {
      const els = document.querySelectorAll(".title-input, .description-input");
      els.forEach(autoResize);
    });
  }

  function openPicker(item) {
    selectedItem = item;
    showPicker = true;
    newTitle = "";
  }

  function closePicker() {
    showPicker = false;
    selectedItem = null;
    newTitle = "";
  }

  function handleSelectCollection(colId) {
    addToCollection(colId, selectedItem);
    closePicker();
  }

  function handleCreateAndAdd() {
    if (!newTitle.trim()) return;

    const id = createCollection(newTitle);
    addToCollection(id, selectedItem);

    closePicker();
  }

  function handleDeleteCollection(id) {
    const ok = confirm("Eliminar esta colección?");

    if (!ok) return;

    deleteCollection(id);

    if (activeCollectionId === id) {
      activeCollectionId = null;
    }
  }

  function exportCollection(collection) {
    const data = JSON.stringify(collection, null, 2);

    const blob = new Blob([data], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download =
      `${collection.title || "collection"}`.toLowerCase().replace(/\s+/g, "-") +
      ".json";

    a.click();

    URL.revokeObjectURL(url);
  }

  async function handleImport(event) {
    const file = event.target.files[0];

    if (!file) return;

    try {
      const text = await file.text();

      const data = JSON.parse(text);

      // sicurezza minima
      if (!data.title || !Array.isArray(data.items)) {
        throw new Error("Formato non valido");
      }

      collections.update((cols) => [
        ...cols,
        {
          ...data,
          id: crypto.randomUUID(),
        },
      ]);
    } catch (err) {
      alert("Archivo inválido");
      console.error(err);
    }
  }

  $: collectionsContainingItem = selectedItem
    ? $collections.filter((col) =>
        col.items.some((i) => i.id === selectedItem.id),
      )
    : [];

  $: if (!activeCollectionId && showPrint) {
    showPrint = false;
    printCollection = null;
  }

  onMount(async () => {
    archive = await fetchKobo();

    mainEl.addEventListener("scroll", handleScroll);

    return () => {
      mainEl.removeEventListener("scroll", handleScroll);
    };
  });

  function handleScroll() {
    if (mainEl.scrollTop > 80) {
      presentationCompact = true;
    } else {
      presentationCompact = false;
    }
  }

  let currentPage = 1;
  const pageSize = 30;

  $: totalPages = Math.ceil(filteredArchive.length / pageSize);

  $: paginatedArchive = filteredArchive.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  $: start =
    filteredArchive.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;

  $: end = Math.min(currentPage * pageSize, filteredArchive.length);
</script>

<!-- 
<svelte:body on:contextmenu|preventDefault on:dragstart|preventDefault />
 -->

{#if !activeCollectionId}
  <button class="floating-map-btn" on:click={() => (showArchiveMap = true)}>
    MAPA
  </button>
{/if}
{#if showArchiveMap}
  <div class="map-overlay">
    <button class="close-map" on:click={() => (showArchiveMap = false)}>
      ✕
    </button>

    <MapViewArchive archive={filteredArchive} />
  </div>
{/if}

<div class="layout">
  <!-- MAIN -->
  <section class="main" bind:this={mainEl}>
    {#if !activeCollectionId}
      <!-- ARCHIVE VIEW -->
      <h2>CARTOGRAFÍA DE LA COTIDIANIDAD</h2>

      <div class="presentation" class:compact={presentationCompact}>
        <p
          style="font-size:0.95em; padding: 1rem; line-height: 1.4em; font-weight: 300;"
        >
          Fotografiar lo cotidiano me abrió una ventana para mirar la ciudad de
          otra manera. Aquello que pisamos o vemos a diario esconde una
          historia, un autor y un contexto cultural, político y artístico.
          Aunque la Ciudad de México es un monstruo caótico, al recorrer sus
          colonias emergen detalles que le otorgan identidad y nos permiten leer
          el paso del tiempo. Esta selección es una pequeña muestra de esos
          gestos sencillos pero excepcionales que habitan las calles. Al estar
          ligada a mis recorridos habituales, sé que cada imagen relata también
          un fragmento de mi propia historia y mi forma de ver la vida. Este
          mapa interactivo nace para ayudarte a descubrir rincones invisibles,
          inspirar nuevos proyectos, motivarte a caminar tu barrio o reconectar
          con tus propias memorias. Esto es un "archivo vivo": un proyecto en
          constante movimiento, porque los encuadres de esta urbe son infinitos
          y jamás cabrán en un solo lugar.
        </p>
      </div>

      <div class="filters">
        <button
          class:active={activeCategory === null}
          style={`
    border-color: var(--text);
    background-color: ${activeCategory === null ? "var(--text)" : "transparent"};
    color: ${activeCategory === null ? "#fff" : "var(--text)"};
  `}
          on:click={() => (activeCategory = null)}
        >
          Todo
        </button>

        {#each Object.entries(categories) as [key, cat]}
          <button
            class:active={activeCategory === key}
            style={`
      border-color: ${categoryColors[key]};
      background-color: ${
        activeCategory === key ? categoryColors[key] : "transparent"
      };
    `}
            on:click={() => (activeCategory = key)}
          >
            {cat.label}
          </button>
        {/each}
      </div>

      <!-- 
        SORT NEWEST/OLDEST BUTTON
            <div class="sort-controls">
        <button
          class:active={sortOrder === "newest"}
          on:click={() => (sortOrder = "newest")}
        >
          Más recientes
        </button>

        <button
          class:active={sortOrder === "oldest"}
          on:click={() => (sortOrder = "oldest")}
        >
          Más antiguas
        </button>
      </div>
      -->
      <!-- <h2>CIUDAD DE MÉXICO</h2> -->

      <p class="range">
        {start}–{end} de {filteredArchive.length}
      </p>

      <div class="grid">
        {#each paginatedArchive as item}
          <ArchiveCard
            {item}
            on:add={(e) => openPicker(e.detail.item)}
            on:openCollection={(e) => (activeCollectionId = e.detail.colId)}
          />
        {/each}
      </div>
      {#if showPicker}
        <div class="overlay" on:click={closePicker}>
          <div class="modal" on:click|stopPropagation>
            <h3>Añadir a la colección</h3>

            <!-- LISTA -->
            <div class="list">
              {#each selectableCollections as col}
                <button
                  class="collection-btn"
                  disabled={col.isDemo}
                  on:click={() => handleSelectCollection(col.id)}
                >
                  <span>{col.title}</span>
                  <small>{col.items.length}</small>
                </button>
              {/each}
            </div>

            <!-- DIVIDER -->
            <div class="divider">o crea una nueva colección</div>

            <!-- CREATE -->
            <div class="create">
              <input
                bind:value={newTitle}
                placeholder="Nueva colección"
                on:keydown={(e) => e.key === "Enter" && handleCreateAndAdd()}
              />

              <button class="create-btn" on:click={handleCreateAndAdd}>
                + Crear y añadir
              </button>
            </div>
          </div>
        </div>
      {/if}
      <div class="pages">
        {#each Array(totalPages) as _, i}
          <button
            class:active={currentPage === i + 1}
            on:click={async () => {
              currentPage = i + 1;

              await tick();

              mainEl.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
          >
            {i + 1}
          </button>
        {/each}
      </div>
    {:else if collection}
      <!-- COLLECTION VIEW -->
      <div class="collection-header">
        <div
          class=""
          style="display: flex;flex-direction: column;padding: 0.1rem;"
        >
          <button class="volver" on:click={goBack}>← Volver al archivo</button>
          <button
            class="print-btn"
            on:click={() => {
              printCollection = collection;
              showPrint = true;
            }}
          >
            📄 Imprimir
          </button>
          {#if !collection.isDemo}
            <button
              class="delete-btn"
              on:click={() => handleDeleteCollection(collection.id)}
            >
              🗑 Eliminar
            </button>
          {/if}
          <button
            class="print-btn"
            on:click={() => exportCollection(collection)}
          >
            ↓ Exportar
          </button>
        </div>

        <div class="collection-meta">
          <textarea
            class="title-input"
            bind:value={collection.title}
            rows="1"
            on:input={(e) => {
              autoResize(e.target);
              updateCollection(activeCollectionId, {
                title: e.target.value,
              });
            }}
            on:focus={(e) => autoResize(e.target)}
            placeholder="Título de la colección"
          />

          <textarea
            class="description-input"
            bind:value={collection.description}
            rows="1"
            on:input={(e) => {
              autoResize(e.target);
              updateCollection(activeCollectionId, {
                description: e.target.value,
              });
            }}
            on:focus={(e) => autoResize(e.target)}
            placeholder="Descripción de la colección"
          />
        </div>
      </div>

      <div class="mobile-tabs">
        <button
          class:active={mobileTab === "list"}
          on:click={() => (mobileTab = "list")}
        >
          Ítems de la colección
        </button>

        <button
          class:active={mobileTab === "map"}
          on:click={() => (mobileTab = "map")}
        >
          Mapa
        </button>
      </div>

      <div class="collection-layout">
        <!-- ITEMS -->
        <div class="collection-items" class:hidden-mobile={mobileTab === "map"}>
          {#each collection.items as item, i}
            <CollectionItem
              {item}
              index={i}
              collectionId={activeCollectionId}
              readonly={collection.isDemo}
            />
          {/each}
        </div>

        <!-- MAP -->
        <div class="collection-map" class:hidden-mobile={mobileTab === "list"}>
          <MapView archive={collection.items} />
        </div>
      </div>
    {:else}
      <!-- SAFETY STATE -->
      <p>Caricamento collezione...</p>
    {/if}
    <div class="presentation" style="background-color: #dadada !important;">
      <p
        style="font-size:1em; padding: 1.1rem; line-height: 1.3em; font-weight: 500; color:var(--text); font-family: 'alagard'"
      >
        Cartografía de la Cotidianidad es un proyecto de Armando Maravilla.
        Todas las fotografías son obras originales protegidas por derechos de
        autor. Su reproducción, distribución, descarga o cualquier otro uso sin
        autorización expresa del autor está prohibido.
      </p>
    </div>
  </section>

  <div class:open={showCollections} class="bottom-sheet">
    <button
      class="sheet-handle"
      on:click={() => (showCollections = !showCollections)}
    >
      ABRIR LAS COLECCIONES
    </button>

    <div class="sheet-content">
      {#each allCollections as col}
        <div
          class="collection"
          on:click={() => {
            activeCollectionId = col.id;
            showCollections = false;
          }}
        >
          <strong>{col.title}</strong><br />
          <small>{col.items.length} elementos</small>
        </div>
      {/each}
      <button
        class="import-btn"
        style="color: var(--text);"
        on:click={() => fileInput.click()}
      >
        ↑ Importar colección
      </button>
    </div>
  </div>

  <!-- SIDEBAR -->
  <aside class="sidebar">
    {#if activeCategoryData}
      <div
        class="category-info"
        style={`background-color: ${categoryColors[activeCategory]}`}
      >
        <h3>{activeCategoryData.label}</h3>
        <p>{activeCategoryData.description}</p>
      </div>
    {/if}

    <h2 style="font-style: italic !important;">Colecciones</h2>

    <!-- <input bind:value={newCollectionTitle} placeholder="Nuova collezione" /> -->

    <!-- <button on:click={handleCreate}>Crea</button> -->

    <div class="collections">
      {#each allCollections as col}
        <div
          class="collection {activeCollectionId === col.id
            ? 'active'
            : ''} {col.isDemo ? 'demo' : ''}"
          on:click={() => (activeCollectionId = col.id)}
        >
          <strong>{col.title}</strong><br />

          <small>{col.items.length} elementos</small>
        </div>
      {/each}
    </div>

    <button class="import-btn" on:click={() => fileInput.click()}>
      ↑ Importar colección
    </button>

    <input
      type="file"
      accept=".json"
      bind:this={fileInput}
      style="display:none"
      on:change={handleImport}
    />
  </aside>
</div>

{#if showPrint && printCollection}
  <PrintA4
    collection={printCollection}
    onClose={() => {
      showPrint = false;
      printCollection = null;
    }}
  />
{/if}

<style>
  textarea {
    overflow: hidden;
    resize: none; /* importantissimo */
  }

  .layout {
    display: grid;
    grid-template-columns: 3fr 1fr;
    height: 100vh;
    font-family: system-ui;
    overflow: hidden;
  }

  .main {
    padding: 0.5rem 0.1rem;
    font-family: "Source Code Pro", monospace !important;
    font-optical-sizing: auto !important;
    font-style: normal !important;
    background: #dadada;
    overflow-y: auto;
    height: 100%;
  }

  .main h2 {
    font-family: "alagard", monospace !important;
    color: rgb(203, 68, 62);
  }

  .sidebar {
    border-left: 1px solid var(--text);
    padding: 1rem;
    height: 100%;
    overflow: auto;
    background-color: #dadada;
  }

  .sidebar h2 {
    font-family: "alagard", monospace !important;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 0.5rem;
  }

  .collection-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .collection-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    height: calc(100vh - 140px);
    min-height: 0;
    gap: 1rem;
  }

  .collection-items,
  .collection-map {
    min-height: 0;
    overflow: auto;
  }

  .collections {
    margin-top: 1rem;
    font-family: "Source Code Pro", monospace !important;
    font-optical-sizing: auto !important;
    font-style: normal !important;
    line-height: 1;
  }

  .collection {
    position: relative;
    padding: 0.6rem;
    border: 1px solid rgb(203, 68, 62);
    margin-bottom: 0.5rem;
    cursor: pointer;
    border-radius: 8px;
  }

  .collection strong {
    font-family: "alagard", monospace !important;
  }
  .collection:hover {
    border-style: dashed;
    border-color: rgb(203, 68, 62);
  }

  .collection.demo {
    background: var(--text);
    color: #f2f3f7;
  }
  .collection.demo:hover {
    background: rgb(203, 68, 62);
    color: #f2f3f7;
    border-color: var(--text);
  }

  .collection.active {
    background: rgb(203, 68, 62);
    color: white;
  }

  .delete-btn {
    cursor: pointer;
    font-family: "Source Code Pro", monospace !important;
    font-style: italic !important;
    color: #f2f3f7;
    font-size: 0.65rem;
    line-height: 0.85rem;
    background-color: var(--text);
    border-color: var(--text);
    font-weight: 200;
    margin: 0.1rem;
  }

  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(1px);
  }

  .modal {
    background: #f2f3f7;
    padding: 1.2rem;
    border-radius: 6px;
    width: 320px;
    max-height: 80vh;
    overflow: auto;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }

  .presentation {
    min-height: 20px;
    font-size: 0.7rem;
    font-weight: 200;
    line-height: 1.05rem;
    padding: 0.35rem;
    background-color: var(--text);
    color: #f2f3f7;

    opacity: 1;
    transform: translateY(0);
    transition:
      max-height 0.35s ease,
      opacity 0.25s ease,
      transform 0.35s ease;

    max-height: 400px;
    overflow: hidden;
  }

  .presentation.compact {
    max-height: 0;
    opacity: 0;
    padding-top: 0;
    padding-bottom: 0;
    margin: 0;
    transform: translateY(-20px);
  }

  h3 {
    margin-bottom: 0.8rem;
  }

  h2 {
    font-size: 1rem;
    font-weight: 500;
    letter-spacing: -0.02em;
    margin: 0.15rem;
    font-family: "Source Code Pro", monospace !important;
    font-optical-sizing: auto !important;
    font-style: normal !important;
    color: var(--text);
  }

  h1 {
    font-size: 1.8rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    margin: 1rem;
    font-family: "Source Code Pro", monospace !important;
    font-optical-sizing: auto !important;
    font-style: italic !important;
    color: var(--text);
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .collection-btn {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem;
    border: 1px solid var(--text);
    border-radius: 6px;
    cursor: pointer;
    color: var(--text);
    background: #f2f3f7;
    font-family: "Source Code Pro", monospace !important;
    font-optical-sizing: auto !important;
    font-style: italic !important;
  }

  .collection-btn:hover {
    background: #f5f5f5;
  }

  .collection-meta {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    flex: 1;
  }

  .title-input {
    font-size: 2.2rem;
    line-height: 1;
    font-weight: bold;
    border: none;
    width: 100%;
    outline: none;
    background: transparent;
    font-family: "alagard", monospace !important;
    font-optical-sizing: auto !important;
    font-style: italic !important;
    color: var(--text);
  }

  .volver {
    font-family: "Source Code Pro", monospace !important;
    font-optical-sizing: auto !important;
    font-style: italic !important;
    color: #f2f3f7;
    font-size: 0.65rem;
    line-height: 0.85rem;
    background-color: var(--text);
    border-color: var(--text);
    font-weight: 200;
    margin: 0.1rem;
  }

  .description-input {
    font-size: 0.8rem;
    border: none;
    outline: none;
    resize: none;
    color: var(--text) !important;
    background-color: #dadada;
    border: 1px solid var(--text);
    border-radius: 6px;
  }

  .divider {
    text-align: center;
    margin: 0.8rem 0;
    font-size: 0.8em;
    color: var(--text);
  }

  .create {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .create input {
    padding: 0.4rem;
    border: 1px solid var(--text);
    background-color: #eff0f5;
    color: var(--text) !important;
    border-radius: 6px;
    font-family: "Source Code Pro", monospace !important;
    font-optical-sizing: auto !important;
    font-style: italic !important;
    font-size: 0.75rem;
  }

  .create-btn {
    background: var(--text);
    color: #f2f3f7;
    border-color: var(--text);
    padding: 0.5rem;
    border-radius: 6px;
    cursor: pointer;
    font-family: "Source Code Pro", monospace !important;
    font-optical-sizing: auto !important;
    font-style: italic !important;
  }

  .import-btn {
    background: #dadada;
    color: var(--text);
    border: none;
    padding: 0.5rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.75rem;
    font-family: "Source Code Pro", monospace !important;
    font-optical-sizing: auto !important;
    font-style: italic !important;
    text-decoration: underline;
  }

  .print-btn {
    position: relative;
    z-index: 9999;
    cursor: pointer;
    font-family: "Source Code Pro", monospace !important;
    font-optical-sizing: auto !important;
    font-style: italic !important;
    color: #f2f3f7;
    font-size: 0.65rem;
    line-height: 0.85rem;
    background-color: var(--text);
    border-color: var(--text);
    font-weight: 200;
    margin: 0.1rem;
  }

  .range {
    font-size: 0.75rem;
    color: var(--text);
    margin-bottom: 0.5rem;
    letter-spacing: 0.02em;
  }

  .pages {
    /* display: flex; */
    align-items: center;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-top: 2rem;
    margin-bottom: 1rem;
    font-size: 0.85rem;
  }
  .pages button {
    all: unset;
    cursor: pointer;
    padding: 0.2rem 0.4rem;
    color: #888;
    transition: color 0.2s ease;
    font-family: "alagard";
  }
  .pages button:hover {
    color: black;
  }
  .pages button.active {
    color: var(--text);
    font-weight: 600;
    position: relative;
  }
  .pages button.active::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -2px;
    width: 100%;
    height: 1px;
    background: var(--text);
  }
  .bottom-sheet {
    display: none;
  }
  .collection-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  .mobile-tabs {
    display: none;
  }
  .floating-map-btn {
    position: fixed;
    right: 1rem;
    bottom: 1rem;
    z-index: 9999;
    border: 1px solid var(--text);
    background: var(--text);
    color: white;
    padding: 0.7rem 1rem;
    border-radius: 999px;
    font-family: "Source Code Pro", monospace;
    font-size: 0.75rem;
    letter-spacing: 0.08em;
    cursor: pointer;
  }

  .map-overlay {
    position: fixed;
    inset: 0;
    z-index: 99999;

    background: black;
  }

  .close-map {
    position: absolute;
    top: 1rem;
    right: 1rem;
    z-index: 100000;
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 999px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    cursor: pointer;
    font-size: 1rem;
  }

  .filters {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.35rem;
    margin-top: 2.5rem;
    margin-bottom: 1rem;
    font-family: "Source Code Pro", monospace;
  }

  .filters button {
    font-size: 0.65rem;
    line-height: 0.75rem;
    letter-spacing: 0.08em !important;
    font-weight: 200 900 !important;
    font-optical-sizing: auto !important;
    font-style: normal !important;
    padding: 0.3rem 0.55rem;
    border: 1px solid var(--text);
    background: transparent;
    color: rgb(203, 68, 62);
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    transition:
      background 0.15s ease,
      transform 0.1s ease,
      opacity 0.15s ease;
    border-radius: 5px;
    font-family: "alagard", monospace;
  }

  .filters button:hover {
    transform: translateY(-1px);
  }

  .filters button.active {
    color: var(--text);
    opacity: 1;
  }

  .category-info {
    margin-bottom: 1.5rem;
    padding: 0.8rem;
  }

  .category-info h3 {
    margin: 0 0 0.35rem 0;
    font-family: "alagard", monospace;
    font-size: 1rem;
    color: var(--text);
  }

  .category-info p {
    margin: 0;
    font-family: "Source Code Pro", monospace !important;
    font-size: 0.7rem;
    font-weight: 500;
    line-height: 1.12;
    color: var(--text);
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    .pages {
      margin-bottom: 5rem;
    }
    .collection-layout {
      margin-bottom: 5rem;
    }
    .collection-header {
      flex-direction: column;
      align-items: stretch;
      padding: 0.4rem;
    }
    .grid {
      grid-template-columns: 1fr 1fr;
      gap: 0.35rem;
    }
    .layout {
      display: block;
    }
    .sidebar {
      display: none;
    }
    .grid {
      grid-template-columns: 1fr 1fr;
      gap: 0.35rem;
    }
    .bottom-sheet {
      display: block;
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      height: 58px;
      background: var(--text);
      border-top: 5px solid #eff0f5;
      transition: height 0.25s ease;
      z-index: 99999;
      font-family: "Source Code Pro", monospace;
    }
    .bottom-sheet button {
      color: #eff0f5;
      font-weight: 600;
    }
    .bottom-sheet.open {
      height: 70vh;
    }
    .sheet-handle {
      width: 100%;
      height: 58px;
      border: none;
      background: transparent;
      font-family: "Source Code Pro", monospace;
      color: var(--text);
    }
    .sheet-content {
      overflow-y: auto;
      height: calc(70vh - 58px);
      padding: 0.5rem;
      background: white;
    }
    .collection-layout {
      display: block;
      height: auto;
    }
    .mobile-tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    .mobile-tabs button {
      flex: 1;
      border: 1px solid var(--text);
      background: #dadada;
      padding: 0.5rem;
      font-family: inherit;
      color: var(--text);
    }
    .mobile-tabs button.active {
      background: var(--text);
      color: white;
    }
    .hidden-mobile {
      display: none;
    }
    .collection-map {
      height: 70vh;
    }
    .collection-items {
      overflow: visible;
    }
  }
</style>
