---
name: M1c Storage and TTL Detection
overview: Implement storage reading with TTL check. Landing page conditionally shows "Continue Session" and "Start New Session" if an active session exists. No wipe functionality yet - just detection.
todos:
  - id: storage-constants
    content: Create lib/storage/constants.ts with storage keys, TTL config, and SessionSnapshot type
    status: completed
  - id: storage-loader
    content: Create lib/storage/loader.ts with loadSession and hasActiveSession functions
    status: completed
  - id: landing-conditional-ui
    content: Update landing-page.tsx to conditionally show Continue/Start New buttons based on session state
    status: completed
isProject: false
---

# M1c - Read Storage + TTL Presence Check

## Overview

Implement storage reading with TTL (Time-To-Live) detection. The landing page will conditionally show additional buttons if a valid, non-expired session exists in localStorage. No destructive actions yet - just detection and conditional UI.

## Current State After M1b

- ✅ Landing page at `[components/landing-page.tsx](components/landing-page.tsx)`
- ✅ Dashboard page at `[app/dashboard/page.tsx](app/dashboard/page.tsx)`
- ✅ "Start Session" button navigates to `/dashboard`
- ❌ No storage detection
- ❌ No conditional rendering based on session state
- ❌ No TTL logic

## Implementation Steps

### 1. Define Storage Schema and Keys

Create `lib/storage/constants.ts`:

```typescript
// Storage keys
export const STORAGE_KEYS = {
  PRIMARY: 'nexturno_session_primary',
  BACKUP: 'nexturno_session_backup',
} as const;

// TTL configuration
export const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// Session snapshot type
export interface SessionSnapshot {
  version: number;
  lastActiveAt: number; // timestamp in milliseconds
  // Future fields will go here (teams, onField, queue, etc.)
  // For M1c, just need version + lastActiveAt for TTL check
}
```

**Design notes:**

- Keep minimal for M1c - just what's needed for TTL check
- `version` field for future schema migrations
- `lastActiveAt` is the timestamp used for TTL calculation
- Full session data structure will be added in M2/M3

### 2. Create Storage Loader Utility

Create `lib/storage/loader.ts`:

```typescript
import { STORAGE_KEYS, SESSION_TTL_MS, SessionSnapshot } from './constants';

/**
 * Loads and validates session from localStorage.
 * Tries PRIMARY first, falls back to BACKUP if PRIMARY is invalid.
 * Returns null if no valid session exists or if session is expired.
 */
export function loadSession(): SessionSnapshot | null {
  // Try PRIMARY first
  const primarySnapshot = loadAndValidate(STORAGE_KEYS.PRIMARY);
  if (primarySnapshot) return primarySnapshot;
  
  // Fall back to BACKUP
  const backupSnapshot = loadAndValidate(STORAGE_KEYS.BACKUP);
  return backupSnapshot;
}

/**
 * Loads and validates a single snapshot from localStorage.
 * Checks for TTL expiration and clears expired sessions.
 */
function loadAndValidate(key: string): SessionSnapshot | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    
    const snapshot = JSON.parse(raw) as SessionSnapshot;
    
    // Validate required fields
    if (typeof snapshot.version !== 'number' || 
        typeof snapshot.lastActiveAt !== 'number') {
      console.warn(\`Invalid snapshot at \${key}\`);
      localStorage.removeItem(key);
      return null;
    }
    
    // Check TTL
    const now = Date.now();
    const age = now - snapshot.lastActiveAt;
    
    if (age > SESSION_TTL_MS) {
      console.log(\`Session expired at \${key}\`);
      // Clear expired session
      localStorage.removeItem(key);
      return null;
    }
    
    return snapshot;
    
  } catch (error) {
    console.error(\`Error loading session from \${key}:\`, error);
    localStorage.removeItem(key);
    return null;
  }
}

/**
 * Checks if an active (non-expired) session exists.
 */
export function hasActiveSession(): boolean {
  return loadSession() !== null;
}
```

**Key behaviors:**

- Tries PRIMARY, falls back to BACKUP
- Auto-clears expired or invalid sessions
- Returns null if no valid session exists
- TTL based on `lastActiveAt` timestamp

### 3. Update Landing Page with Conditional UI

Update `[components/landing-page.tsx](components/landing-page.tsx)`:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { hasActiveSession } from '@/lib/storage/loader';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
// ... other imports

export default function LandingPage() {
  const [hasSession, setHasSession] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check for active session after client hydration
    setHasSession(hasActiveSession());
    setIsLoading(false);
  }, []);
  
  return (
    <section>
      {/* ... existing hero content ... */}
      
      <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
        {/* Always show Start Session */}
        <Link href="/dashboard">
          <Button variant="hero" size="hero" className="group">
            Start Session
            <ArrowRight />
          </Button>
        </Link>
        
        {/* Show additional buttons if session exists (after hydration) */}
        {!isLoading && hasSession && (
          <>
            <Link href="/dashboard">
              <Button variant="heroOutline" size="hero">
                Continue Session
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="hero"
              disabled  {/* No action in M1c - wired in M1d */}
            >
              Start New Session
            </Button>
          </>
        )}
        
        {/* Existing "See how it works" button can stay or be conditional */}
      </div>
    </section>
  );
}
```

**Important notes:**

- Mark component as `'use client'` for useState/useEffect
- Check session only after hydration (useEffect) to avoid SSR mismatch
- "Start Session" always visible
- "Continue Session" and "Start New Session" only show if `hasSession === true`
- "Start New Session" is visible but disabled (wired in M1d)
- Both "Start Session" and "Continue Session" navigate to `/dashboard`

### 4. Clear Expired Sessions on Check

The loader automatically clears expired sessions when detected. This ensures:

- If PRIMARY is expired → cleared automatically
- If BACKUP is expired → cleared automatically  
- If both expired → both cleared, `hasActiveSession()` returns false
- Landing page shows only "Start Session" button

## Design Decisions

**Storage Pattern:**

- PRIMARY/BACKUP redundancy for reliability
- Automatic fallback and cleanup
- TTL anchored to `lastActiveAt` (will be updated on interactions in M8)

**UI Pattern:**

- Always show "Start Session" (clear primary CTA)
- Conditionally show "Continue" + "Start New" when session exists
- Client-side detection after hydration (avoid SSR mismatch)

**No Destructive Actions Yet:**

- "Start New Session" is visible but disabled
- Wipe/confirm logic comes in M1d
- M1c is read-only

## Testing Checklist

After implementation:

1. **No session state:**
  - Visit `/`
  - Should see only "Start Session" button
2. **Valid session exists:**
  - Manually add to localStorage:
  - Refresh `/`
  - Should see: "Start Session", "Continue Session", "Start New Session" (disabled)
  - Click "Continue Session" → goes to `/dashboard`
3. **Expired session:**
  - Add expired session:
  - Refresh `/`
  - Should auto-clear and show only "Start Session"
  - Check console for "Session expired" log
4. **Invalid/corrupted session:**
  - Add invalid data:
  - Refresh `/`
  - Should auto-clear and show only "Start Session"
  - Check console for error log
5. **PRIMARY corrupted, BACKUP valid:**
  - Set corrupted PRIMARY and valid BACKUP
  - Should fall back to BACKUP successfully
  - "Continue Session" should appear

## Hard Constraints (Must NOT Include)

- ❌ No session wipe/reset functionality (that's M1d)
- ❌ No confirm dialogs
- ❌ No writing to localStorage (read-only for M1c)
- ❌ No session creation (that's M2)
- ❌ No actual session data (teams, queue, etc.) - just version + timestamp
- ❌ "Start New Session" button should be disabled/no-op

## Files to Create

1. Create: `lib/storage/constants.ts` - Storage keys, TTL config, SessionSnapshot type
2. Create: `lib/storage/loader.ts` - loadSession(), hasActiveSession() functions
3. Modify: `[components/landing-page.tsx](components/landing-page.tsx)` - Add conditional rendering

## Architecture After M1c

```
app/
├── page.tsx              (renders <LandingPage />)
└── dashboard/
    └── page.tsx         (placeholder dashboard)

components/
└── landing-page.tsx      (conditional buttons based on session state)

lib/
└── storage/
    ├── constants.ts     (storage keys, TTL, types)
    └── loader.ts        (read/validate session with TTL check)
```

## Flow Diagram

```mermaid
flowchart TD
    Start([User visits /]) --> Hydrate[Client hydrates]
    Hydrate --> Check{hasActiveSession?}
    
    Check -->|Read PRIMARY| TryPrimary{Valid & not expired?}
    TryPrimary -->|Yes| ShowContinue[Show Continue + Start New buttons]
    TryPrimary -->|No| ClearPrimary[Clear PRIMARY]
    
    ClearPrimary --> TryBackup{Check BACKUP}
    TryBackup -->|Valid| ShowContinue
    TryBackup -->|Invalid/Expired| ClearBackup[Clear BACKUP]
    
    ClearBackup --> ShowStartOnly[Show only Start Session button]
    Check -->|No session| ShowStartOnly
    
    ShowContinue --> UserClick{User clicks?}
    UserClick -->|Start Session| Dashboard[/dashboard]
    UserClick -->|Continue Session| Dashboard
    UserClick -->|Start New| Disabled[Button disabled in M1c]
    
    ShowStartOnly --> ClickStart[User clicks Start Session]
    ClickStart --> Dashboard
```



---

## Next Steps After M1c

Once M1c is complete:

- **M1d**: Wire "Start New Session" button with confirmation dialog + wipe functionality
- **M2**: Build settings/setup UI (team count, colors, initial order)
- **M3**: Build live session UI with real data

