---
name: M4b Wire Winner Buttons
overview: Make Winner buttons functional by wiring them to dispatch DECLARE_WINNER events, updating session state, and persisting changes to localStorage.
todos:
  - id: m4b-live-session-props
    content: Add onDispatchEvent to LiveSession props interface and import Event type
    status: completed
  - id: m4b-wire-buttons
    content: Remove disabled from Winner buttons and dispatch DECLARE_WINNER events
    status: completed
  - id: m4b-dashboard-handler
    content: Implement handleEvent in Dashboard with applyEvent and saveSession
    status: completed
isProject: false
---

# M4b — Wire Winner Buttons to Events

## Goal

Make the Winner buttons functional:

1. Remove `disabled` from Winner buttons
2. Add onClick handlers that dispatch DECLARE_WINNER events
3. Dashboard handles events: calls applyEvent, persists to localStorage, updates state
4. LiveSession re-renders with new state showing rotation

## Current State

**Buttons are disabled:**

```183:193:components/dashboard/live-session.tsx
          <Button variant="default" size="lg" className="rounded-xl" disabled>
            Winner: {aTeam.name}
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="rounded-xl"
            disabled
          >
            Winner: {bTeam.name}
          </Button>
```

**Dashboard doesn't handle events yet** - just loads session and passes it down.

## Data Flow

```
User clicks "Winner: Team 1"
  ↓
LiveSession dispatches { type: 'DECLARE_WINNER', winnerTeamId: 't1' }
  ↓
Dashboard receives event via onDispatchEvent callback
  ↓
Dashboard calls applyEvent(currentState, event)
  ↓
Dashboard gets newState
  ↓
Dashboard calls saveSession(newState) → localStorage
  ↓
Dashboard calls setSession(newState) → React state
  ↓
React re-renders LiveSession with new props
  ↓
UI shows rotated teams
```

## Architecture Decision: Single Event Dispatcher

Instead of multiple callback props (`onDeclareWinner`, `onDeclareTie`, `onUndo`), we use a **single generic event dispatcher**:

```typescript
onDispatchEvent: (event: Event) => void
```

**Benefits:**

- Scales perfectly - add new events without touching props
- Type-safe - TypeScript validates Event union types
- Consistent - all events flow through same path
- Clean API - LiveSession just "dispatches events"

## Implementation

### 1. Update LiveSession Props Interface

**File:** `[components/dashboard/live-session.tsx](components/dashboard/live-session.tsx)`

Add event dispatcher to props:

```typescript
import { Event } from '@/lib/events/types';

interface LiveSessionProps {
  session: SessionState;
  onStartNewSession: () => void;
  onDispatchEvent: (event: Event) => void;
}
```

### 2. Wire Button Handlers

**File:** `[components/dashboard/live-session.tsx](components/dashboard/live-session.tsx)`

Remove `disabled` and add onClick handlers that dispatch events:

```typescript
<Button 
  variant="default" 
  size="lg" 
  className="rounded-xl"
  onClick={() => onDispatchEvent({ 
    type: 'DECLARE_WINNER', 
    winnerTeamId: aTeam.id 
  })}
>
  Winner: {aTeam.name}
</Button>
<Button
  variant="secondary"
  size="lg"
  className="rounded-xl"
  onClick={() => onDispatchEvent({ 
    type: 'DECLARE_WINNER', 
    winnerTeamId: bTeam.id 
  })}
>
  Winner: {bTeam.name}
</Button>
```

### 3. Implement Event Handler in Dashboard

**File:** `[app/dashboard/page.tsx](app/dashboard/page.tsx)`

Add imports:

```typescript
import { Event } from '@/lib/events/types';
import { applyEvent } from '@/lib/events/reducer';
import { saveSession } from '@/lib/storage/writer';
```

Add generic event handler:

```typescript
const handleEvent = (event: Event) => {
  if (!session) return;

  // Apply event to get next state
  const nextState = applyEvent(session, event);

  // Persist to localStorage
  saveSession(nextState);

  // Update React state
  setSession(nextState);
};
```

Pass handler to LiveSession:

```typescript
<LiveSession 
  session={session}
  onStartNewSession={handleStartNewSession}
  onDispatchEvent={handleEvent}
/>
```

## Future-Proof Design

When we add Tie (M5) and Undo (M6), the implementation will be trivial:

```typescript
// M5: Just add onClick, no prop changes needed
<Button onClick={() => onDispatchEvent({ type: 'DECLARE_TIE' })}>
  Tie
</Button>

// M6: Just add onClick, no prop changes needed
<Button onClick={() => onDispatchEvent({ type: 'UNDO' })}>
  Undo
</Button>
```

The `handleEvent` in Dashboard already handles ALL event types through `applyEvent()`.

## Testing Flow

Manual test:

1. Create session with 4 teams (Team 1, Team 2, Team 3, Team 4)
2. Initial state: Team 1 vs Team 2 on field, [Team 3, Team 4] in queue
3. Click "Winner: Team 1"
4. Verify rotation:
  - Team 1 vs Team 3 on field
  - [Team 4, Team 2] in queue
5. Click "Winner: Team 3"
6. Verify rotation:
  - Team 3 vs Team 4 on field
  - [Team 2, Team 1] in queue
7. Refresh page
8. Verify state persisted correctly

## Testing Checklist

After implementation:

- Winner buttons are enabled (not disabled)
- Clicking left button rotates correctly (winner stays, loser to back)
- Clicking right button rotates correctly
- UI updates immediately after click
- State persists to localStorage
- Refresh loads correct state
- Invariants validated (check console for errors in dev)
- Works with 3, 4, 6, 8 team counts
- Debug panel shows updated state after rotation

## Scope

**Changes:**

- `[components/dashboard/live-session.tsx](components/dashboard/live-session.tsx)` - Add onDeclareWinner prop, wire buttons
- `[app/dashboard/page.tsx](app/dashboard/page.tsx)` - Implement handleDeclareWinner, pass to LiveSession

**Unchanged:**

- Tie button (stays disabled for now)
- Undo button (stays disabled, M6)
- Event system files (already complete in M4a)

## Files Modified

- `[components/dashboard/live-session.tsx](components/dashboard/live-session.tsx)` - Import Event type, remove disabled, dispatch events
- `[app/dashboard/page.tsx](app/dashboard/page.tsx)` - Import Event type, implement generic event handler

