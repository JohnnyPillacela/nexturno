// lib/events/reducer.ts

import { SessionState } from '@/lib/storage/constants';
import { Event } from './types';
import { validateInvariants } from './invariants';

/**
 * Apply an event to the current session state and return the next state.
 * This is a pure function with no side effects.
 */
export function applyEvent(state: SessionState, event: Event): SessionState {
  switch (event.type) {
    case 'DECLARE_WINNER':
      return applyDeclareWinner(state, event.winnerTeamId);
    default:
      // Unknown event type - return state unchanged
      return state;
  }
}

function applyDeclareWinner(state: SessionState, winnerTeamId: string): SessionState {
  // Validate winner is on field
  if (
    winnerTeamId !== state.onField.aTeamId &&
    winnerTeamId !== state.onField.bTeamId
  ) {
    console.error('Invalid winner: team not on field');
    return state; // No change
  }

  // Determine loser
  const loserId =
    winnerTeamId === state.onField.aTeamId
      ? state.onField.bTeamId
      : state.onField.aTeamId;

  // Winner stays, loser goes to back of queue
  // Next queued team comes onto field
  const [nextTeamId, ...remainingQueue] = state.queue;

  // Edge case: empty queue (2-team game, not supported but handle gracefully)
  if (!nextTeamId) {
    console.error('Cannot rotate: queue is empty');
    return state;
  }

  const nextState: SessionState = {
    ...state,
    onField: {
      aTeamId: winnerTeamId,
      bTeamId: nextTeamId,
    },
    queue: [...remainingQueue, loserId],
  };

  // Validate invariants in dev mode
  if (process.env.NODE_ENV === 'development') {
    validateInvariants(nextState);
  }

  return nextState;
}
