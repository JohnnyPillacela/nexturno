// lib/events/types.ts

export type Event =
  | { type: 'DECLARE_WINNER'; winnerTeamId: string };
  // | { type: 'DECLARE_TIE' }  // M5
  // | { type: 'RESOLVE_TIE_STAY'; staysTeamId: string }  // M5
  // | { type: 'UNDO' }  // M6
