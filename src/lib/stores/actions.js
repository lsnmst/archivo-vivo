import { collections } from "./collections";

/**
 * @param {string} title
 */
export function createCollection(title) {
  collections.update((cols) => [
    ...cols,
    {
      id: crypto.randomUUID(),
      title,
      items: [],

      settings: {
        color: "#000000",
        showPath: true,
        showNumbers: true
      }
    }
  ]);
}

/**
 * @param {string} collectionId
 * @param {{id: string, title: string}} item
 */
export function addToCollection(collectionId, item) {
  collections.update((cols) =>
    cols.map((c) => {
      if (c.id !== collectionId) return c;

      if (c.items.find((i) => i.id === item.id)) return c;

      return {
        ...c,
        items: [...c.items, item]
      };
    })
  );
}