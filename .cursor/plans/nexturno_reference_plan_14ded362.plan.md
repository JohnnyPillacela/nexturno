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

## Current Project State

- **Stack**: Next.js 16, React 19, Tailwind 4, TypeScript
- **App**: Default Next.js page at `[app/page.tsx](app/page.tsx)`; no session logic or routing yet
- **Design system**: `[app/globals.css](app/globals.css)` has design tokens (colors, fonts, radius)
- **Reference UI**: `johnny/components/landing/` — Hero (match card mockup, queue chips, action buttons), Header, Features, etc.

---

## Milestone Map (Reference)


| #   | Milestone          | Key deliverables                                                                        |
| --- | ------------------ | --------------------------------------------------------------------------------------- |
| 1   | Landing Page       | Buttons, storage envelope + TTL check, no reducer                                       |
| 2   | Setup UI           | Team count, colors, goal cap, initial order, create session → localStorage → Live       |
| 3   | Live Session       | Display match + queue; buttons visible (can be no-op)                                   |
| 4   | Rules Engine       | `applyEvent(state, event)`; DECLARE_WINNER, DECLARE_TIE, RESOLVE_TIE_STAY; wire buttons |
| 5   | Tie Decision Popup | 3-team popup when queue length == 1                                                     |
| 6   | Undo               | 3 snapshots, persist undo stack                                                         |
| 7   | Settings Panel     | Edit, Add, Remove (guards), Reset                                                       |
| 8   | Rolling TTL        | Activity tracker, throttle 30s, update lastActiveAt                                     |
| 9   | (Optional)         | Upstash Redis backup mirror — not now                                                   |


---

## Cursor Behavior

- Implement **one milestone at a time**
- Stop after each milestone and ask: *"Do you confirm this matches the requirements? What should we do next?"*
- Do not invent extra features without verifying
- Ask before implementing if anything is unclear

