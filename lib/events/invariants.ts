// lib/events/invariants.ts

import { SessionState } from '@/lib/storage/constants';

/**
 * Validates that session state meets all invariants.
 * Throws error in development if any invariant is violated.
 */
export function validateInvariants(state: SessionState): void {
  const { teams, onField, queue } = state;

  // Invariant 1: Exactly 2 teams on field
  if (!onField.aTeamId || !onField.bTeamId) {
    throw new Error('Invariant violation: Must have exactly 2 teams on field');
  }

  // Invariant 2: Queue has no duplicates
  const queueSet = new Set(queue);
  if (queueSet.size !== queue.length) {
    throw new Error('Invariant violation: Queue contains duplicates');
  }

  // Invariant 3: On-field teams are not in queue
  if (queue.includes(onField.aTeamId) || queue.includes(onField.bTeamId)) {
    throw new Error('Invariant violation: On-field team found in queue');
  }

  // Invariant 4: Every team accounted for exactly once
  const allTeamIds = new Set([onField.aTeamId, onField.bTeamId, ...queue]);
  if (allTeamIds.size !== teams.length) {
    throw new Error(
      `Invariant violation: Team count mismatch (${allTeamIds.size} vs ${teams.length})`
    );
  }

  // Invariant 5: Total team count >= 3
  if (teams.length < 3) {
    throw new Error('Invariant violation: Must have at least 3 teams');
  }

  // All invariants passed
}
