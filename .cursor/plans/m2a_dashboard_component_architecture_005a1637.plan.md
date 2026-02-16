---
name: M2a Dashboard Component Architecture
overview: Refactor dashboard into smaller, focused UI components. Extract setup form and live session views. Dashboard becomes a smart router that picks UI based on localStorage state.
todos:
  - id: create-setup-form
    content: Create components/dashboard/setup-form.tsx with setup UI
    status: completed
  - id: create-live-session
    content: Create components/dashboard/live-session.tsx with match/queue/buttons UI
    status: completed
  - id: refactor-dashboard
    content: Refactor app/dashboard/page.tsx to be a smart router using the new components
    status: completed
isProject: false
---

# M2a - Dashboard Component Architecture (Refactoring)

## Overview

Refactor the monolithic dashboard page into a clean component-based architecture. Extract the setup form and live session UI into separate components. Dashboard becomes a smart router that picks which UI to show based on session state.

**Goal:** Prevent dashboard from bloating. Each UI state gets its own focused component.

---

## Current State (After M1d)

**Dashboard currently has:**

- Session detection logic
- Loading state
- New session UI (setup form placeholder) - **85 lines inline**
- Existing session UI (live dashboard) - **100 lines inline**
- "Start New Session" handler

**Problem:**

- Dashboard page is already ~200 lines
- Two completely different UIs in one file
- Will get much worse when we add M2 functionality
- Hard to maintain and test

---

## Target Architecture

```
app/dashboard/
└── page.tsx                    (Smart router - 30-40 lines)

components/dashboard/
├── setup-form.tsx              (Setup/settings UI)
└── live-session.tsx            (Match + queue + buttons UI)
```

**Dashboard responsibilities:**

- Check session state (new vs existing)
- Handle "Start New Session" logic
- Route to appropriate component
- Loading state

**Component responsibilities:**

- `SetupForm`: All setup/settings UI and (future) form logic
- `LiveSession`: All live dashboard UI (match, queue, buttons)

---

## Implementation Steps

### 1. Create SetupForm Component

Create `components/dashboard/setup-form.tsx`:

```typescript
'use client';

import { Button } from '@/components/ui/button';

export default function SetupForm() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-12 space-y-8">
      <header className="text-center space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">
          Set up your game
        </h1>
        <p className="text-sm text-muted-foreground">
          Configure settings for this session
        </p>
      </header>

      <section className="border border-border rounded-2xl p-6 bg-card space-y-6">
        <h2 className="text-lg font-semibold text-foreground">
          Game settings
        </h2>
        
        <div className="space-y-4">
          {/* Team count */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground block">
              Team count
            </label>
            <div className="h-10 rounded-lg border border-border bg-background" />
          </div>
          
          {/* Goal cap */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground block">
              Goal cap
            </label>
            <div className="h-10 rounded-lg border border-border bg-background" />
          </div>
          
          {/* Colors */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground block">
              Colors
            </label>
            <div className="h-10 rounded-lg border border-border bg-background" />
          </div>
        </div>
        
        <Button size="lg" className="rounded-xl w-full" disabled>
          Start game
        </Button>
      </section>
    </div>
  );
}
```

**Design notes:**

- Focused component for setup/settings UI only
- All placeholder form fields extracted here
- Will be enhanced in M2b+ with actual form logic
- Self-contained, easy to test

---

### 2. Create LiveSession Component

Create `components/dashboard/live-session.tsx`:

```typescript
'use client';

import { Button } from '@/components/ui/button';

interface LiveSessionProps {
  onStartNewSession: () => void;
}

export default function LiveSession({ onStartNewSession }: LiveSessionProps) {
  return (
    <div className="mx-auto max-w-2xl px-5 py-6 space-y-5">
      {/* Header */}
      <header className="text-center space-y-1">
        <h1 className="text-xl font-semibold text-foreground">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Session view (coming soon)
        </p>
        
        {/* Start New Session button */}
        <Button
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={onStartNewSession}
        >
          Start New Session
        </Button>
      </header>

      {/* Match Card */}
      <section className="bg-card border border-border rounded-2xl p-5">
        <div className="text-center text-xs font-medium text-muted-foreground mb-4 uppercase tracking-wider">
          Current Match
        </div>
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
              A
            </div>
            <div className="mt-2 text-sm font-semibold text-foreground">
              Team A
            </div>
          </div>
          <div className="text-2xl font-bold text-muted-foreground px-4">
            vs
          </div>
          <div className="text-center flex-1">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-xl">
              B
            </div>
            <div className="mt-2 text-sm font-semibold text-foreground">
              Team B
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-4">
          Match Card (Coming Soon)
        </p>
      </section>

      {/* Queue Section */}
      <section>
        <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
          Up Next
        </div>
        <div className="flex gap-2">
          {['C', 'D', 'E'].map((team, i) => (
            <div
              key={team}
              className={`flex-1 py-2 rounded-xl text-center text-sm font-semibold border ${
                i === 0
                  ? 'bg-primary/10 text-primary border-primary/30'
                  : 'bg-card text-muted-foreground border-border'
              }`}
            >
              {team}
            </div>
          ))}
        </div>
      </section>

      {/* Action Buttons */}
      <section className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Button variant="default" size="lg" className="rounded-xl" disabled>
            Winner A
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="rounded-xl"
            disabled
          >
            Winner B
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" size="lg" className="rounded-xl" disabled>
            Tie
          </Button>
          <Button variant="outline" size="lg" className="rounded-xl" disabled>
            Undo
          </Button>
        </div>
      </section>
    </div>
  );
}
```

**Design notes:**

- Focused component for live session UI only
- Match card, queue, action buttons extracted here
- Takes `onStartNewSession` handler as prop
- Will be enhanced in M3+ with real data
- Self-contained, easy to test

---

### 3. Refactor Dashboard to Smart Router

Update `[app/dashboard/page.tsx](app/dashboard/page.tsx)`:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { hasActiveSession } from '@/lib/storage/loader';
import { clearSessionStorage, createNewSession } from '@/lib/storage/writer';
import SetupForm from '@/components/dashboard/setup-form';
import LiveSession from '@/components/dashboard/live-session';

export default function DashboardPage() {
  const [isNewSession, setIsNewSession] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const active = hasActiveSession();
    if (!active) {
      createNewSession();
      setIsNewSession(true);
    } else {
      setIsNewSession(false);
    }
    setIsLoading(false);
  }, []);

  const handleStartNewSession = () => {
    const confirmed = window.confirm(
      'This will wipe the current session. Continue?'
    );

    if (confirmed) {
      clearSessionStorage();
      createNewSession();
      setIsNewSession(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {isNewSession ? (
        <SetupForm />
      ) : (
        <LiveSession onStartNewSession={handleStartNewSession} />
      )}
    </div>
  );
}
```

**Benefits:**

- Dashboard reduced from ~200 lines to ~40 lines
- Clear separation of concerns
- Easy to understand: "router" logic only
- Components can be tested independently
- Easy to add more states later

---

## Component Responsibility Matrix


| Component                | Responsibilities                                                                                                  | Does NOT Handle                                         |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| **Dashboard (page.tsx)** | • Session state detection • Auto-create session • Loading state • Route to correct UI • "Start New" confirm logic | • UI rendering • Form logic • Match display             |
| **SetupForm**            | • Setup form UI • Form validation (M2b+) • Team configuration (M2b+) • Create session (M2d+)                      | • Session detection • Navigation • Storage operations   |
| **LiveSession**          | • Match card display • Queue display • Action buttons • Live game UI (M3+)                                        | • Session creation • Form handling • Storage operations |


---

## File Structure After M2a

```
app/
├── page.tsx                           (Landing)
└── dashboard/
    └── page.tsx                       (Smart router - 40 lines)

components/
├── landing-page.tsx                   (Landing UI)
└── dashboard/
    ├── setup-form.tsx                 (Setup/settings UI - 60 lines)
    └── live-session.tsx               (Live session UI - 100 lines)

lib/storage/
├── constants.ts
├── loader.ts
└── writer.ts
```

---

## Testing After M2a

**Functionality should be identical** - this is just a refactoring:

1. **New user flow:**
  - Landing → Dashboard → Auto-creates session → Shows SetupForm
2. **Returning user flow:**
  - Landing → Dashboard → Shows LiveSession
3. **Start new session:**
  - Dashboard (live) → Click "Start New Session" → Confirm → Shows SetupForm

**Visual check:**

- Setup form looks identical
- Live session looks identical
- All buttons work the same
- No functionality broken

---

## Benefits of This Refactoring

1. **Maintainability**: Each component has single responsibility
2. **Scalability**: Easy to add M2b+ features without bloating dashboard
3. **Testability**: Components can be tested in isolation
4. **Readability**: Clear what each file does
5. **Reusability**: Components can be used elsewhere if needed
6. **Future-proof**: Adding more dashboard states (e.g., settings panel) is trivial

---

## Next Steps After M2a

Once refactoring is complete:

- **M2b**: Add actual form logic to SetupForm (team count selector, etc.)
- **M2c**: Add colors and goal cap configuration
- **M2d**: Wire "Start game" button to create full SessionState
- **M3**: Enhance LiveSession with real session data

---

## Design Philosophy

> "A component should do one thing and do it well. The dashboard's job is routing, not rendering."

This refactoring sets us up for clean, maintainable growth. Each component will stay focused as we add features in M2b-M3.

---

## Migration Notes

**This is a pure refactoring** - no new features:

- Extract existing UI into components
- Dashboard becomes simpler
- Same functionality, better structure
- Foundation for M2b+ work

