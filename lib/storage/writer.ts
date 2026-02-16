// lib/storage/writer.ts

import { STORAGE_KEYS, SessionSnapshot } from './constants';

/**
 * Creates and persists a new minimal session to localStorage.
 * Used when the user has no existing session (start fresh).
 */
export function createNewSession(): void {
  const snapshot: SessionSnapshot = {
    version: 1,
    lastActiveAt: Date.now(),
  };
  const json = JSON.stringify(snapshot);
  try {
    localStorage.setItem(STORAGE_KEYS.PRIMARY, json);
    localStorage.setItem(STORAGE_KEYS.BACKUP, json);
    console.log('New session created');
  } catch (error) {
    console.error('Error creating session:', error);
  }
}

/**
 * Clears all session-related data from localStorage.
 * Removes PRIMARY, BACKUP, and any envelope/meta keys.
 */
export function clearSessionStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.PRIMARY);
    localStorage.removeItem(STORAGE_KEYS.BACKUP);

    // Clear any envelope or meta keys if they exist
    // (Future: envelope key if we add one)

    console.log('Session storage cleared');
  } catch (error) {
    console.error('Error clearing session storage:', error);
  }
}
