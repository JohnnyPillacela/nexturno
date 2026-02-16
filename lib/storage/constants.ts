// lib/storage/constants.ts

// Storage keys
export const STORAGE_KEYS = {
  PRIMARY: 'nexturno_session_primary',
  BACKUP: 'nexturno_session_backup',
} as const;

// TTL configuration
export const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// Team type
export interface Team {
  id: string;
  name: string;
  color?: string | null;
}

// OnField type
export interface OnField {
  aTeamId: string;
  bTeamId: string;
}

// Phase type
export type Phase = 'normal' | 'tieDecision';

// TieDecision type (for 3-team tie case - M5)
export interface TieDecision {
  aTeamId: string;
  bTeamId: string;
  queuedTeamId: string;
}

// SessionState type
export interface SessionState {
  version: 1;
  matchNumber: number;
  teams: Team[];
  onField: OnField;
  queue: string[]; // team IDs
  phase: Phase;
  tieDecision?: TieDecision;
  rules: {
    goalCap: number | null;
  };
  undo: SessionSnapshot[];
}

// SessionSnapshot type (for undo stack)
export type SessionSnapshot = Omit<SessionState, 'undo'>;
