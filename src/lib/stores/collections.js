import { writable } from "svelte/store";

/* -----------------------------
   MIGRATION LOCALSTORAGE
----------------------------- */

function migrate(oldData) {
  if (!Array.isArray(oldData)) return [];

  return oldData.map((col) => ({
    ...col,
    items: (col.items || []).map((item) => {
      let location = null;

      // caso 1: già valido
      if (
        item?.location &&
        typeof item.location.lat === "number" &&
        typeof item.location.lng === "number"
      ) {
        location = item.location;
      }

      // caso 2: location vecchia (string o array)
      else if (Array.isArray(item.location)) {
        location = {
          lat: Number(item.location[0]),
          lng: Number(item.location[1]),
        };
      }

      // caso 3: Kobo raw salvato
      else if (Array.isArray(item._geolocation)) {
        location = {
          lat: Number(item._geolocation[0]),
          lng: Number(item._geolocation[1]),
        };
      }

      // fallback sicuro
      return {
        ...item,
        location:
          location &&
            Number.isFinite(location.lat) &&
            Number.isFinite(location.lng)
            ? location
            : null,
      };
    }),
  }));
}

/* -----------------------------
   INIT STORE (con migration)
----------------------------- */

const saved =
  typeof localStorage !== "undefined"
    ? localStorage.getItem("collections")
    : null;

let initial = [];

if (saved) {
  try {
    const parsed = JSON.parse(saved);
    initial = migrate(parsed);

    console.log("🔥 MIGRATION DONE:", initial);
  } catch (e) {
    console.error("❌ MIGRATION ERROR:", e);
    initial = [];
  }
}

export const collections = writable(initial);

/* -----------------------------
   SAVE
----------------------------- */

collections.subscribe((value) => {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("collections", JSON.stringify(value));
  }
});

/* -----------------------------
   CREATE
----------------------------- */

export function createCollection(title) {
  const id = crypto.randomUUID();

  collections.update((list) => [
    ...list,
    {
      id,
      title,
      description: "",
      items: [],
      settings: {
        color: "#000000",
        showPath: true,
        showNumbers: true,
      },
    },
  ]);

  return id;
}

/* -----------------------------
   ADD ITEM (pulito)
----------------------------- */

export function addToCollection(collectionId, item) {
  collections.update((list) =>
    list.map((col) => {
      if (col.id !== collectionId) return col;

      const exists = col.items.some((i) => i.id === item.id);
      if (exists) return col;

      let location = null;

      if (item?.location?.lat != null && item?.location?.lng != null) {
        location = {
          lat: Number(item.location.lat),
          lng: Number(item.location.lng),
        };
      } else if (Array.isArray(item._geolocation)) {
        location = {
          lat: Number(item._geolocation[0]),
          lng: Number(item._geolocation[1]),
        };
      }

      console.log("➕ ADD ITEM:", location);

      return {
        ...col,
        items: [
          ...col.items,
          {
            id: item.id,
            title: item.title,
            description: item.description,
            media: item.media,
            location,
            date: item.date || null,
            mediaType: item.mediaType || null,
          },
        ],
      };
    })
  );
}

/* -----------------------------
   UPDATE ITEM
----------------------------- */

export function updateItem(collectionId, itemId, data) {
  collections.update((list) =>
    list.map((col) => {
      if (col.id !== collectionId) return col;

      return {
        ...col,
        items: col.items.map((item) =>
          item.id === itemId ? { ...item, ...data } : item
        ),
      };
    })
  );
}

/* -----------------------------
    UPDATE COLLECTION
----------------------------- */


export function updateCollection(collectionId, data) {
  collections.update((list) =>
    list.map((col) =>
      col.id === collectionId
        ? {
          ...col,
          ...data,
        }
        : col
    )
  );
}

/* -----------------------------
    REMOVE ITEM
----------------------------- */

export function removeFromCollection(collectionId, itemId) {
  collections.update((list) =>
    list.map((col) => {
      if (col.id !== collectionId) return col;

      return {
        ...col,
        items: col.items.filter((item) => item.id !== itemId),
      };
    })
  );
}


/* -----------------------------
    MOVE ITEM
----------------------------- */
export function moveItem(collectionId, fromIndex, toIndex) {
  collections.update((list) =>
    list.map((col) => {
      if (col.id !== collectionId) return col;

      // 🔥 PROTEZIONI
      if (
        fromIndex == null ||
        toIndex == null ||
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= col.items.length ||
        toIndex >= col.items.length
      ) {
        return col;
      }

      const items = [...col.items];
      const [moved] = items.splice(fromIndex, 1);

      if (!moved) return col;

      items.splice(toIndex, 0, moved);

      return {
        ...col,
        items,
      };
    })
  );
}

/* -----------------------------
    REMOVE COLLECTION
----------------------------- */

export function deleteCollection(id) {
  collections.update((cols) => cols.filter((c) => c.id !== id));
}