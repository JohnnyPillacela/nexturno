// lib/events/reducer.ts

import { SessionState, SessionSnapshot } from '@/lib/storage/constants';
import { Event } from './types';
import { validateInvariants } from './invariants';

/**
 * Push the current state to the undo stack, capped at 3 snapshots.
 * Returns a new undo array with the current state prepended.
 */
function pushSnapshot(state: SessionState): SessionSnapshot[] {
  const snapshot: SessionSnapshot = {
    version: state.version,
    teams: state.teams,
    onField: state.onField,
    queue: state.queue,
    phase: state.phase,
    tieDecision: state.tieDecision,
    rules: state.rules,
    // undo is omitted (SessionSnapshot type)
  };

  const newUndo = [snapshot, ...state.undo];
  return newUndo.slice(0, 3); // Cap at 3
}

/**
 * Apply an event to the current session state and return the next state.
 * This is a pure function with no side effects.
 */
export function applyEvent(state: SessionState, event: Event): SessionState {
  switch (event.type) {
    case 'DECLARE_WINNER':
      return applyDeclareWinner(state, event.winnerTeamId);
    case 'DECLARE_TIE':
      return applyDeclareTie(state);
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
    undo: pushSnapshot(state), // Push before transition
  };

  // Validate invariants in dev mode
  if (process.env.NODE_ENV === 'development') {
    validateInvariants(nextState);
  }

  return nextState;
}

function applyDeclareTie(state: SessionState): SessionState {
  // Validate: need at least 2 teams in queue
  if (state.queue.length < 2) {
    console.error('Cannot declare tie: need at least 2 teams in queue');
    return state; // No change
  }

  // Get next 2 queued teams
  const [nextATeamId, nextBTeamId, ...remainingQueue] = state.queue;

  // Both current teams go to back of queue
  const nextState: SessionState = {
    ...state,
    onField: {
      aTeamId: nextATeamId,
      bTeamId: nextBTeamId,
    },
    queue: [
      ...remainingQueue,
      state.onField.aTeamId,
      state.onField.bTeamId,
    ],
    undo: pushSnapshot(state), // Push before transition
  };

  // Validate invariants in dev mode
  if (process.env.NODE_ENV === 'development') {
    validateInvariants(nextState);
  }

  return nextState;
}
