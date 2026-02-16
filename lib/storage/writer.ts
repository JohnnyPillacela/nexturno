// lib/storage/writer.ts

import { STORAGE_KEYS } from './constants';

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
