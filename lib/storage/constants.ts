// lib/storage/constants.ts

// Storage keys
export const STORAGE_KEYS = {
  PRIMARY: 'nexturno_session_primary',
  BACKUP: 'nexturno_session_backup',
} as const;

// TTL configuration
export const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// Session snapshot type
export interface SessionSnapshot {
  version: number;
  lastActiveAt: number; // timestamp in milliseconds
  // Future fields will go here (teams, onField, queue, etc.)
  // For M1c, just need version + lastActiveAt for TTL check
}
