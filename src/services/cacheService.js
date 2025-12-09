import fs from "fs";
import path from "path";

const CACHE_FILE = path.join(process.cwd(), "weather-cache.json");
const cache = new Map();
const DEFAULT_TTL_MS = 10 * 60 * 1000;

const initCache = () => {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, "utf-8");
      if (raw) {
        const plain = JSON.parse(raw);
        Object.entries(plain).forEach(([key, entry]) => {
          cache.set(key, entry);
        });
      }
    }
  } catch (err) {
    console.error("Failed to load cache file", err);
  }
};

initCache();

const persistCache = () => {
  const plain = {};
  for (const [key, entry] of cache.entries()) {
    plain[key] = entry;
  }
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(plain, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write cache file", err);
  }
};

export const getCached = (key) => {
  const entry = cache.get(key);
  if (!entry) return null;

  const { value, expiresAt } = entry;
  if (expiresAt && Date.now() > expiresAt) {
    cache.delete(key);
    persistCache();
    return null;
  }
  return value;
};

export const setCached = (key, value, ttlMs = DEFAULT_TTL_MS) => {
  const expiresAt = Date.now() + ttlMs;
  cache.set(key, { value, expiresAt });
  persistCache();
};

// Return all cache entries as an array for listing
export const listCachedEntries = () => {
  const items = [];
  for (const [key, entry] of cache.entries()) {
    items.push({ id: key, ...entry });
  }
  return items;
};

// Return a single cache entry by its key/id
export const getCachedEntryById = (id) => {
  const entry = cache.get(id);
  if (!entry) return null;
  const { value, expiresAt } = entry;
  if (expiresAt && Date.now() > expiresAt) {
    cache.delete(id);
    persistCache();
    return null;
  }
  return { id, ...entry };
};
