---
name: M1b Wire Navigation
overview: Wire the "Start Session" button to navigate to /dashboard page. Create dashboard page with structured placeholder content. No localStorage or logic yet - just navigation.
todos:
  - id: dashboard-page
    content: Create app/dashboard/page.tsx with structured placeholder content
    status: completed
  - id: wire-navigation
    content: Add onClick/Link to Start Session button in landing-page.tsx
    status: completed
  - id: test-navigation
    content: Test navigation flow from landing to dashboard page
    status: completed
isProject: false
---

# M1b - Wire Basic Navigation

## Overview

Connect the "Start Session" button to navigate to `/dashboard`. Create a dashboard page with structured placeholder content that hints at the future UI structure. Keep it simple - just navigation and visual scaffolding for now, no storage or session logic.

## Current State

- ✅ Landing page complete at `[components/landing-page.tsx](components/landing-page.tsx)`
- ✅ "Start Session" button exists but is non-functional
- ✅ UI reference: `[johnny/components/landing/Hero.jsx](johnny/components/landing/Hero.jsx)` shows phone mockup with dashboard structure
- ❌ No `/dashboard` route exists yet
- ❌ No navigation wired up

## Implementation Steps

### 1. Create Dashboard Page (`app/dashboard/page.tsx`)

Create a structured dashboard placeholder that hints at the future UI layout. Reference the phone mockup in `[johnny/components/landing/Hero.jsx](johnny/components/landing/Hero.jsx)` (lines 83-142) for visual inspiration.

**Structure** (all placeholder/skeleton for now):

```typescript
// Layout sections to include:
1. Page header/title area
2. Match card area (placeholder box)
   - "Current Match" label
   - Team A vs Team B placeholders
3. Queue section (placeholder)
   - "Up Next" label
   - Team chips/slots
4. Action buttons area (placeholder)
   - Winner A / Winner B buttons
   - Tie / Undo buttons
```

**Styling using CSS variables from `[app/globals.css](app/globals.css)`:**

- Background: `bg-background`
- Card containers: `bg-card border-border rounded-2xl`
- Text: `text-foreground`, `text-muted-foreground`
- Buttons: `bg-primary`, `bg-secondary`, etc.
- Layout: Mobile-first, centered with max-width container

**Visual reference from Hero.jsx mockup:**

- Match card: Rounded card with "CURRENT MATCH" header, Team A vs Team B display
- Queue chips: Horizontal flex layout with rounded team indicators
- Action buttons: 2x2 grid of action buttons

**Content for M1b:**

- Use placeholder text like "Match Card (Coming Soon)"
- Empty state boxes with borders to show structure
- Button labels visible but non-functional
- Clean spacing following mockup patterns

**Example Structure** (simplified pseudo-code):

```
Dashboard Page Layout:
├── Header (title + subtitle)
├── Match Card
│   ├── "CURRENT MATCH" label
│   ├── Team A box (letter, name)
│   ├── "vs" text
│   └── Team B box (letter, name)
├── Queue Section
│   ├── "UP NEXT" label
│   └── Team chips (C, D, E placeholders)
└── Action Buttons (2x2 grid)
    ├── Winner A | Winner B
    └── Tie | Undo
```

All elements styled with CSS variables, proper spacing, disabled buttons for M1b.

**Future vision** (not in M1b):

- Settings modal will overlay this page when no session exists
- Real team data will populate the cards from localStorage
- Buttons will trigger rotation logic and update state

### 2. Wire Navigation in Landing Page

Update `[components/landing-page.tsx](components/landing-page.tsx)`:

Add navigation to "Start Session" button:

```typescript
// Option 1: Using Next.js Link (cleaner for buttons that only navigate)
import Link from 'next/link';

<Link href="/dashboard">
  <Button variant="hero" size="hero" className="group">
    Start Session
    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
  </Button>
</Link>

// OR Option 2: Using useRouter (if you need additional logic)
'use client';
import { useRouter } from 'next/navigation';

const router = useRouter();
<Button onClick={() => router.push('/dashboard')} variant="hero" size="hero">
  Start Session
  <ArrowRight />
</Button>
```

**Recommendation**: Use Link approach (Option 1) for better accessibility and Next.js optimizations unless you need to run logic before navigation.

## Design Notes

**Visual Structure:**

- Dashboard should have clear visual sections (match, queue, buttons) even if non-functional
- Use the Hero.jsx phone mockup as visual reference for spacing and layout
- Empty state styling: borders, rounded corners, placeholder text
- Keep everything using CSS variables (no hardcoded hex colors)

**Keep Simple:**

- Wire navigation: landing → dashboard
- Dashboard is structured placeholder (shows layout but no functionality)
- No "back" button needed (browser back works, or add a simple text link)
- No localStorage, no session detection, no modals yet

**Philosophy:** Build structure first, add behavior later. The dashboard skeleton shows what's coming without implementing the full logic yet.

## Testing Checklist

After implementation:

1. `npm run dev`
2. Visit `/` - landing page loads
3. Click "Start Session" button → navigates to `/dashboard`
4. Dashboard page shows:
  - Clear visual sections (match card area, queue area, buttons area)
  - Placeholder text/empty states
  - Proper spacing and layout structure
  - All colors using CSS variables
5. Use browser back → returns to landing page
6. Verify responsive layout works on mobile view

## Hard Constraints (Must NOT Include)

- ❌ No localStorage code
- ❌ No TTL logic
- ❌ No session state/model
- ❌ No settings modal/dialog yet
- ❌ No "Continue Session" or "Start New Session" buttons on landing
- ❌ No conditional rendering based on session state

## Files to Create/Modify

1. Create: `app/dashboard/page.tsx` - Structured dashboard placeholder with visual sections
2. Modify: `[components/landing-page.tsx](components/landing-page.tsx)` - Add navigation to "Start Session" button

## UI Reference

- `[johnny/components/landing/Hero.jsx](johnny/components/landing/Hero.jsx)` lines 83-142 - Phone mockup showing dashboard structure
  - Match card layout (lines 85-102)
  - Queue chips layout (lines 105-121)
  - Action buttons grid (lines 124-141)

## Architecture After M1b

```
app/
├── page.tsx              (renders <LandingPage />)
└── dashboard/
    └── page.tsx         (structured placeholder - will add logic in M2/M3)

components/
└── landing-page.tsx      (Start Session button navigates to /dashboard)

johnny/components/        (reference only, gitignored)
└── landing/Hero.jsx     (dashboard UI mockup reference)
```

---

## Next Steps After M1b

Once M1b is complete and verified:

- **M1c**: Add storage reading + TTL detection (show "Continue Session" on landing if exists)
- **M1d**: Add session wipe with confirmation
- **M2**: Build settings modal/dialog for dashboard (team setup, colors, etc.)
- **M3**: Replace dashboard placeholders with live session UI (real match tracking, rotation logic)

