// lib/events/types.ts

export type Event =
  | { type: 'DECLARE_WINNER'; winnerTeamId: string }
  | { type: 'DECLARE_TIE' };
  // | { type: 'RESOLVE_TIE_STAY'; staysTeamId: string }  // M5b
  // | { type: 'UNDO' }  // M6
