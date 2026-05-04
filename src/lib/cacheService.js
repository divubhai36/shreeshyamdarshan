import { openDB } from 'idb';

const DB_NAME = 'ShreeShyamMediaCache';
const STORES = {
    IMAGES: 'images',
    VIDEOS: 'customer-review'
};
const DB_VERSION = 2; // Incremented version to add new store

/**
 * Initialize IndexedDB
 */
const initDB = async () => {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db, oldVersion, newVersion) {
            if (!db.objectStoreNames.contains(STORES.IMAGES)) {
                db.createObjectStore(STORES.IMAGES);
            }
            if (!db.objectStoreNames.contains(STORES.VIDEOS)) {
                db.createObjectStore(STORES.VIDEOS);
            }
        },
    });
};

/**
 * Get Blob from Cache
 */
export const getCachedBlob = async (key, storeName = STORES.IMAGES) => {
    if (typeof window === 'undefined') return null;
    try {
        const db = await initDB();
        return await db.get(storeName, key);
    } catch (error) {
        console.error(`Cache blob read failed [${storeName}]:`, error);
    }
    return null;
};

/**
 * Get Object URL from Cache
 */
export const getCachedImage = async (key, storeName = STORES.IMAGES) => {
    if (typeof window === 'undefined') return null;
    try {
        const blob = await getCachedBlob(key, storeName);
        if (blob) {
            return URL.createObjectURL(blob);
        }
    } catch (error) {
        console.error("Cache read failed:", error);
    }
    return null;
};

/**
 * Save to Cache
 */
export const saveToCache = async (key, blob, storeName = STORES.IMAGES) => {
    if (typeof window === 'undefined') return;
    try {
        const db = await initDB();
        await db.put(storeName, blob, key);
    } catch (error) {
        console.error(`Cache write failed [${storeName}]:`, error);
    }
};

/**
 * Clear Store Cache
 */
export const clearImageCache = async (storeName = STORES.IMAGES) => {
    const db = await initDB();
    await db.clear(storeName);
};
