// lib/storage/loader.ts

import { STORAGE_KEYS, SESSION_TTL_MS, SessionSnapshot } from './constants';

/**
 * Loads and validates session from localStorage.
 * Tries PRIMARY first, falls back to BACKUP if PRIMARY is invalid.
 * Returns null if no valid session exists or if session is expired.
 */
export function loadSession(): SessionSnapshot | null {
  // Try PRIMARY first
  const primarySnapshot = loadAndValidate(STORAGE_KEYS.PRIMARY);
  if (primarySnapshot) return primarySnapshot;

  // Fall back to BACKUP
  const backupSnapshot = loadAndValidate(STORAGE_KEYS.BACKUP);
  return backupSnapshot;
}

/**
 * Loads and validates a single snapshot from localStorage.
 * Checks for TTL expiration and clears expired sessions.
 */
function loadAndValidate(key: string): SessionSnapshot | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const snapshot = JSON.parse(raw) as SessionSnapshot;

    // Validate required fields
    if (
      typeof snapshot.version !== 'number' ||
      typeof snapshot.lastActiveAt !== 'number'
    ) {
      console.warn(`Invalid snapshot at ${key}`);
      localStorage.removeItem(key);
      return null;
    }

    // Check TTL
    const now = Date.now();
    const age = now - snapshot.lastActiveAt;

    if (age > SESSION_TTL_MS) {
      console.log(`Session expired at ${key}`);
      // Clear expired session
      localStorage.removeItem(key);
      return null;
    }

    return snapshot;
  } catch (error) {
    console.error(`Error loading session from ${key}:`, error);
    localStorage.removeItem(key);
    return null;
  }
}

/**
 * Checks if an active (non-expired) session exists.
 */
export function hasActiveSession(): boolean {
  return loadSession() !== null;
}
