// lib/storage/writer.ts

import { STORAGE_KEYS, SessionState } from './constants';

/**
 * Creates and persists a new minimal session to localStorage.
 * Used when the user has no existing session (start fresh).
 */
export function createNewSession(): void {
  const snapshot = {
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
 * Saves a full SessionState to localStorage.
 * Writes to both PRIMARY and BACKUP for redundancy.
 */
export function saveSession(sessionState: SessionState): void {
  try {
    const envelope = {
      ...sessionState,
      lastActiveAt: Date.now(),
    };

    const json = JSON.stringify(envelope);
    localStorage.setItem(STORAGE_KEYS.PRIMARY, json);
    localStorage.setItem(STORAGE_KEYS.BACKUP, json);

    console.log('Session saved', { teams: sessionState.teams.length });
  } catch (error) {
    console.error('Error saving session:', error);
    throw error;
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
