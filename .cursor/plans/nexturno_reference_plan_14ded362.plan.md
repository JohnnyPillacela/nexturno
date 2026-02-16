---
name: Nexturno Reference Plan
overview: Acknowledgment and reference plan for Nexturno — a single-device soccer rotation tracker with local persistence, built incrementally across 9 milestones.
todos: []
isProject: false
---

# Nexturno — Acknowledgment and Reference Plan

## Acknowledged: What We Are Building

**Nexturno** is a single-device pickup soccer rotation tracker. I will use this document and your requirements as the source of truth for all implementation decisions.

---

## Key Constraints (Locked)


| Area         | Rule                                                                                  |
| ------------ | ------------------------------------------------------------------------------------- |
| Teams        | Min 3, default 4, main use case 4+                                                    |
| 2 teams      | Not supported                                                                         |
| Auth/Storage | No login, no database, no accounts                                                    |
| Scope        | Single scorekeeper, one phone/tab                                                     |
| Undo         | Up to 3 snapshots                                                                     |
| Persistence  | Local only (Primary + Backup); optional Redis later                                   |
| TTL          | 24h rolling, anchored to `lastActiveAt`, extended on any interaction (throttled ~30s) |


---

## Core Session Model

```
teams: [{ id, name, color? }]
onField: exactly 2 teams (A vs B)
queue: ordered list of remaining teams
phase: normal | tie-decision (3-team case)
undo: up to 3 snapshots
```

Invariants: always 2 on field; queue no duplicates; on-field teams not in queue; team count ≥ 3.

---

## UI Flow Summary

1. **Landing** — Start Session; Continue (if valid session); Start New (confirm wipe)
2. **Setup** — Team count (3+), colors, goal cap, initial order preview → Start creates session
3. **Live Session** — Match A vs B, Winner A/B, Tie, Undo, queue display
4. **Settings** — Edit team name/color; Add Team (→ end of queue); Remove Team (queued only, never < 3); on-field remove disabled; Reset Session

---

## Rotation Algorithm (Locked)

- **A wins** → A stays, B to back, q1 steps in
- **B wins** → B stays, A to back, q1 steps in  
- **Tie + queue ≥ 2** → Both to back, q1 vs q2 step in
- **Tie + queue == 1** (3-team) → Popup: "A stays" or "B stays", rock-paper-scissors style

---

## Johnny/components Usage

- Use **only** as visual/template reference: layout, button styles, spacing
- Do **not** treat as architectural or code-quality guidance
- Path: `[johnny/components/](johnny/components/)` (note: currently gitignored)

---

## Progress — What’s Implemented

### M1 — Landing Page (M1a, M1b, M1c complete; M1d pending)

**M1a — Landing Page UI Skeleton**

- Landing page component `components/landing-page.tsx` with Hero, headline, tagline, buttons
- CSS variables only (no hardcoded hex)
- Feature badges: No account needed, Works offline

**M1b — Basic Navigation**

- Dashboard page at `/dashboard` with structured placeholder (match card, queue, action buttons — all disabled)
- "Start Session" navigates to dashboard via `Link`
- Layout based on johnny Hero mockup

**M1c — Storage + TTL Detection**

- `lib/storage/`: `constants.ts` (keys, TTL 24h, types), `loader.ts` (load, validate, hasActiveSession)
- PRIMARY/BACKUP fallback, auto-cleanup of expired sessions
- Landing page conditional UI: "Continue Session", "Start New Session" (disabled) when active session exists
- Client-side detection after hydration

**M1d — Not yet:** "Start New Session" confirm + wipe behavior

---

## Current Architecture

```
app/
├── page.tsx                 (renders <LandingPage />)
└── dashboard/
    └── page.tsx             (structured placeholder)

components/
└── landing-page.tsx         (conditional UI based on session)

lib/storage/
├── constants.ts             (storage keys, TTL, types)
└── loader.ts                (load/validate, TTL check)

johnny/                      (gitignored, reference only)
├── components/landing/       (UI mockups)
└── ui-mocks/
```

**Stack:** Next.js 16, React 19, Tailwind 4, TypeScript. Design tokens in `app/globals.css`.

---

## Status Snapshot

**Working:** Landing UI, landing → dashboard nav, TTL-based session detection, PRIMARY/BACKUP storage, conditional buttons, expired-session cleanup

**Not yet:** Start New Session confirm/wipe (M1d), Setup UI (M2), live session data (M3), rotation logic (M4), tie popup (M5), undo (M6), settings (M7), rolling TTL updates (M8)

---

## Milestone Map (Reference)


| #   | Milestone          | Key deliverables                                                                        | Status       |
| --- | ------------------ | --------------------------------------------------------------------------------------- | ------------ |
| 1   | Landing Page       | Buttons, storage envelope + TTL check, no reducer                                       | M1a–M1c done |
| 2   | Setup UI           | Team count, colors, goal cap, initial order, create session → localStorage → Live       | Pending      |
| 3   | Live Session       | Display match + queue; buttons visible (can be no-op)                                   | Pending      |
| 4   | Rules Engine       | `applyEvent(state, event)`; DECLARE_WINNER, DECLARE_TIE, RESOLVE_TIE_STAY; wire buttons | Pending      |
| 5   | Tie Decision Popup | 3-team popup when queue length == 1                                                     | Pending      |
| 6   | Undo               | 3 snapshots, persist undo stack                                                         | Pending      |
| 7   | Settings Panel     | Edit, Add, Remove (guards), Reset                                                       | Pending      |
| 8   | Rolling TTL        | Activity tracker, throttle 30s, update lastActiveAt                                     | Pending      |
| 9   | (Optional)         | Upstash Redis backup mirror — not now                                                   | Not required |


---

## Cursor Behavior

- Implement **one milestone at a time**
- Stop after each milestone and ask: *"Do you confirm this matches the requirements? What should we do next?"*
- Do not invent extra features without verifying
- Ask before implementing if anything is unclear

