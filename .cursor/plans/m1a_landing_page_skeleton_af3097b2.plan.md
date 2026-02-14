---
name: M1a Landing Page Skeleton
overview: Create a minimal Landing page UI with non-functional button. Keep it simple - just the landing page skeleton for now.
todos:
  - id: landing-component
    content: Create components/landing-page.tsx with Landing page UI (title, Start Session button)
    status: completed
  - id: home-page
    content: Update app/page.tsx to import and render LandingPage component
    status: completed
  - id: verify-m1a
    content: Test landing page displays correctly
    status: completed
isProject: false
---

# M1a - Landing Page UI Skeleton (NO functionality)

## Overview

Implement a minimal Landing page with a "Start Session" button. Keep it simple - just the UI skeleton. No navigation, no logic, no placeholders for other pages.

**Future flow** (not implemented in M1a): User clicks "Start Session" → goes to `/session` page which will conditionally show either a settings modal (if no session) or the live session dashboard (if session exists). We'll iterate on this in later milestones.

## Current State

- Default Next.js starter at `[app/page.tsx](app/page.tsx)`
- Design tokens in `[app/globals.css](app/globals.css)` 
- Reference UI components in `johnny/components/landing/` (Hero, Header) for visual patterns only
- Clean slate - iterate fast, refine later

## Implementation Steps

### 1. Create Landing Component (`components/landing-page.tsx`)

Create a simple, clean React component:

```typescript
// Structure:
- App title: "Nexturno" (large heading)
- Subtitle or tagline (optional, for visual balance)
- Primary button: "Start Session" (disabled/no onClick for now)
```

**Styling using CSS variables from `[app/globals.css](app/globals.css)`:**

- Background: `bg-background`
- Primary button: `bg-primary text-primary-foreground`
- Title text: `text-foreground`
- Muted text: `text-muted-foreground`
- Layout: Centered with `flex min-h-screen items-center justify-center`
- Button: `rounded-full shadow-lg h-14 px-8`

**IMPORTANT: Do NOT use bracket notation with hex colors**

- ❌ Bad: `bg-[#F7FAFF]`, `text-[#0EA8D8]`
- ✅ Good: `bg-background`, `bg-primary`, `text-foreground`

**Keep it minimal:**

- Just title + button for now
- No conditional logic, no session detection, no extra buttons
- Clean slate to iterate on

### 2. Update Home Page (`[app/page.tsx](app/page.tsx)`)

Import and render the `LandingPage` component:

```typescript
import LandingPage from '@/components/landing-page';

export default function Home() {
  return <LandingPage />;
}
```

## Design Patterns from Reference UI

From `[johnny/components/landing/Hero.jsx](johnny/components/landing/Hero.jsx)`:

- Button sizing: `h-14 px-8` 
- Button shape: `rounded-full shadow-lg`
- Spacing: `gap-6` for vertical stacking

**Color Mapping from globals.css:**


| Reference Color         | CSS Variable           | Tailwind Class            |
| ----------------------- | ---------------------- | ------------------------- |
| `#F7FAFF` (background)  | `--background`         | `bg-background`           |
| `#0B1220` (title text)  | `--foreground`         | `text-foreground`         |
| `#5B6B84` (subtitle)    | `--muted-foreground`   | `text-muted-foreground`   |
| `#0EA8D8` (primary)     | `--primary`            | `bg-primary`              |
| `#FFFFFF` (button text) | `--primary-foreground` | `text-primary-foreground` |


## Testing Checklist

After implementation:

1. `npm run dev`
2. Visit `/` - should see:
  - "Nexturno" title
  - "Start Session" button (no action when clicked)
  - Clean, centered layout
  - All colors using CSS variables (no hardcoded hex)
3. That's it - keep it simple!

## Hard Constraints (Must NOT Include)

- ❌ No localStorage code
- ❌ No TTL logic  
- ❌ No dialogs/modals
- ❌ No navigation
- ❌ No session logic
- ❌ No conditional rendering
- ❌ No extra buttons (just "Start Session")

**Philosophy**: Build the skeleton. Iterate fast. Add logic later.

## Files to Create/Modify

1. Create: `components/landing-page.tsx` - Landing page component
2. Modify: `[app/page.tsx](app/page.tsx)` - Imports and renders `<LandingPage />`

## Architecture

```
app/
└── page.tsx              (imports <LandingPage />)

components/
└── landing-page.tsx      (Landing page UI - title + button)
```

**That's it.** Session page, settings modal, routing - all coming in future milestones. M1a = landing skeleton only.