// lib/storage/session.ts

import { SessionState, Team } from './constants';

/**
 * Creates a new SessionState from setup form data.
 */
export function createSession(params: {
  teamCount: number;
  goalCap: number | null;
  teamColors: Record<number, string>;
}): SessionState {
  const { teamCount, goalCap, teamColors } = params;

  // Generate teams with stable IDs
  const teams: Team[] = Array.from({ length: teamCount }, (_, i) => ({
    id: crypto.randomUUID(),
    name: `Team ${i + 1}`,
    color: normalizeColor(teamColors[i]) ?? null,
  }));

  // Initial order: first 2 teams on field, rest in queue
  const [team1, team2, ...queueTeams] = teams;

  const sessionState: SessionState = {
    version: 1,
    teams,
    onField: {
      aTeamId: team1.id,
      bTeamId: team2.id,
    },
    queue: queueTeams.map((t) => t.id),
    phase: 'normal',
    rules: {
      goalCap,
    },
    undo: [], // empty initially
  };

  return sessionState;
}

/**
 * Normalizes color value from form to storage format.
 */
function normalizeColor(colorValue: string | undefined): string | null {
  if (!colorValue || colorValue === 'no-color') {
    return null;
  }
  return colorValue;
}
