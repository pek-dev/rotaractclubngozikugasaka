import { NewsArticle } from '../types';

export interface BookmarkedArticle extends NewsArticle {
  savedAt: string;
  offlineReady: boolean;
}

const DB_NAME = 'RotaractLibraryDB';
const DB_VERSION = 1;
const STORE_NAME = 'bookmarked_articles';

/**
 * Initialize IndexedDB instance
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB n\'est pas supporté par votre navigateur.'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('savedAt', 'savedAt', { unique: false });
        store.createIndex('category', 'category', { unique: false });
      }
    };
  });
}

/**
 * Get all saved articles from IndexedDB
 */
export async function getSavedArticles(): Promise<BookmarkedArticle[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const items = request.result as BookmarkedArticle[];
        // Sort newest saved first
        items.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
        resolve(items);
      };

      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Erreur lecture IndexedDB:', error);
    return [];
  }
}

/**
 * Save an article to IndexedDB and cache its cover image in SW Cache
 */
export async function saveArticleToLibrary(article: NewsArticle): Promise<BookmarkedArticle> {
  const db = await openDB();

  const itemToSave: BookmarkedArticle = {
    ...article,
    savedAt: new Date().toISOString(),
    offlineReady: true,
  };

  // Pre-cache image in SW cache if available
  const imgUrl = article.image || (article as any).imageUrl;
  if ('caches' in window && imgUrl) {
    try {
      const cache = await caches.open('rotaract-images-v2');
      await cache.add(new Request(imgUrl, { mode: 'cors' })).catch(() => {
        // Fallback fetch
        fetch(imgUrl).then((res) => cache.put(imgUrl, res)).catch(() => {});
      });
    } catch (e) {
      console.warn('Impossible de mettre en cache l\'image:', e);
    }
  }

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(itemToSave);

    request.onsuccess = () => {
      // Dispatch custom browser event for real-time reactivity in React components
      window.dispatchEvent(new CustomEvent('library_updated'));
      resolve(itemToSave);
    };

    request.onerror = () => reject(request.error);
  });
}

/**
 * Remove an article from IndexedDB
 */
export async function removeArticleFromLibrary(id: string): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => {
      window.dispatchEvent(new CustomEvent('library_updated'));
      resolve();
    };

    request.onerror = () => reject(request.error);
  });
}

/**
 * Check if an article is already bookmarked
 */
export async function isArticleBookmarked(id: string): Promise<boolean> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(!!request.result);
      };

      request.onerror = () => resolve(false);
    });
  } catch (error) {
    return false;
  }
}

/**
 * Clear all bookmarked items
 */
export async function clearLibrary(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.clear();

    request.onsuccess = () => {
      window.dispatchEvent(new CustomEvent('library_updated'));
      resolve();
    };

    request.onerror = () => reject(request.error);
  });
}
