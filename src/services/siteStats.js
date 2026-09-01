import { stats as fallbackStats } from "../data/stats";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "../lib/firebase";

export const FALLBACK_SITE_STATS = fallbackStats.map((stat, index) => ({
  id: `stat-${index + 1}`,
  ...stat,
  sort_order: index + 1,
}));

const statsDocument = () => doc(db, "site_content", "stats");

export async function getSiteStats({ useFallback = true } = {}) {
  if (!isFirebaseConfigured) {
    return useFallback ? FALLBACK_SITE_STATS : [];
  }

  try {
    const snapshot = await getDoc(statsDocument());
    const items = snapshot.exists() ? snapshot.data().items : [];

    if (!Array.isArray(items) || !items.length) {
      return useFallback ? FALLBACK_SITE_STATS : [];
    }

    return [...items].sort((a, b) => a.sort_order - b.sort_order);
  } catch (error) {
    if (useFallback) {
      console.warn("Unable to load live site statistics; using defaults.", error);
      return FALLBACK_SITE_STATS;
    }

    throw error;
  }
}

export async function updateSiteStats(stats) {
  if (!isFirebaseConfigured) {
    throw new Error("Firebase is not configured.");
  }

  const items = stats.map(({ id, value, label, sort_order }) => ({
    id,
    value: value.trim(),
    label: label.trim(),
    sort_order,
  }));

  await setDoc(statsDocument(), {
    items,
    updatedAt: serverTimestamp(),
  });

  return getSiteStats({ useFallback: false });
}
