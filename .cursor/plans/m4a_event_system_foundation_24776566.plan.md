---
name: M4a Event System Foundation
overview: "Create the event system foundation: define Event types, implement applyEvent reducer function, and add invariant validation for rotation logic."
todos:
  - id: m4a-event-types
    content: Create lib/events/types.ts with Event type definitions
    status: completed
  - id: m4a-invariants
    content: Create lib/events/invariants.ts with validateInvariants function
    status: completed
  - id: m4a-reducer
    content: Create lib/events/reducer.ts with applyEvent and DECLARE_WINNER logic
    status: completed
isProject: false
---

# M4a — Event System Foundation

## Goal

Set up the core event system architecture:

1. Define Event types (DECLARE_WINNER for now, others later)
2. Create `applyEvent()` pure reducer function
3. Add invariant validation (dev-only assertions)
4. Implement DECLARE_WINNER rotation logic

This creates the foundation for wiring up buttons in M4b.

## Architecture

**Pure state transitions:**

```
Current State + Event → Next State
```

**Flow:**

```
User clicks "Winner: Team 1" 
  → Create event { type: 'DECLARE_WINNER', winnerTeamId: 't1' }
  → applyEvent(currentState, event)
  → Returns new SessionState with rotation applied
  → Dashboard persists new state
  → React re-renders with new state
```

## Current Types (Already Defined)

From `[lib/storage/constants.ts](lib/storage/constants.ts)`:

```typescript
export interface SessionState {
  version: 1;
  teams: Team[];
  onField: OnField;
  queue: string[];
  phase: Phase;
  tieDecision?: TieDecision;
  rules: { goalCap: number | null };
  undo: SessionSnapshot[];
}
```

## Implementation

**New file:** `lib/events/types.ts` (event type definitions)

```typescript
export type Event =
  | { type: 'DECLARE_WINNER'; winnerTeamId: string };
  // | { type: 'DECLARE_TIE' }  // M5
  // | { type: 'RESOLVE_TIE_STAY'; staysTeamId: string }  // M5
  // | { type: 'UNDO' }  // M6
```

**New file:** `lib/events/reducer.ts` (applyEvent function)

```typescript
import { SessionState } from '@/lib/storage/constants';
import { Event } from './types';

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
```

**New file:** `lib/events/invariants.ts` (validation)

```typescript
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
```

## DECLARE_WINNER Logic

**Rotation algorithm:**

Given: `onField: A vs B`, `queue: [C, D, E, ...]`

**If A wins:**

- New onField: `A vs C`
- New queue: `[D, E, ..., B]`
- Winner (A) stays, loser (B) goes to back, next queued (C) comes up

**If B wins:**

- New onField: `B vs C`
- New queue: `[D, E, ..., A]`
- Winner (B) stays, loser (A) goes to back, next queued (C) comes up

## Testing Checklist

After implementation:

- Event types defined in `lib/events/types.ts`
- `applyEvent()` function in `lib/events/reducer.ts`
- `validateInvariants()` function in `lib/events/invariants.ts`
- DECLARE_WINNER rotates winner vs next queued team
- Loser goes to back of queue
- Invariants validate in dev mode
- Invalid events return state unchanged
- No side effects (pure functions)

## Files Created

- `lib/events/types.ts` - Event type definitions
- `lib/events/reducer.ts` - applyEvent function and DECLARE_WINNER logic
- `lib/events/invariants.ts` - Invariant validation

## Next Steps

**M4b:** Wire Winner buttons in LiveSession to dispatch events via callback to Dashboard, which calls applyEvent, persists, and updates state.