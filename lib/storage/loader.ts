// lib/storage/loader.ts

import { STORAGE_KEYS, SESSION_TTL_MS, SessionState } from './constants';

/**
 * Loads and validates session from localStorage.
 * Returns null if no valid session exists or if session is expired.
 * Handles both minimal sessions (M1c) and full SessionState (M2d+).
 */
export function loadSession(): SessionState | null {
  const primarySnapshot = loadAndValidate(STORAGE_KEYS.PRIMARY);
  if (primarySnapshot) return primarySnapshot;

  const backupSnapshot = loadAndValidate(STORAGE_KEYS.BACKUP);
  return backupSnapshot;
}

/**
 * Loads and validates a single snapshot from localStorage.
 * Handles both minimal sessions (M1c) and full SessionState (M2d+).
 */
function loadAndValidate(key: string): SessionState | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const snapshot = JSON.parse(raw) as Record<string, unknown>;

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
    const age = now - (snapshot.lastActiveAt as number);

    if (age > SESSION_TTL_MS) {
      console.log(`Session expired at ${key}`);
      localStorage.removeItem(key);
      return null;
    }

    // Check if this is a full SessionState (has teams)
    if (snapshot.teams && Array.isArray(snapshot.teams)) {
      return snapshot as unknown as SessionState;
    }

    // Minimal session (M1c) - return null so dashboard treats as new
    return null;
  } catch (error) {
    console.error(`Error loading session from ${key}:`, error);
    localStorage.removeItem(key);
    return null;
  }
}

/**
 * Checks if an active (non-expired) full session exists.
 */
export function hasActiveSession(): boolean {
  return loadSession() !== null;
}
