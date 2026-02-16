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

## Acknowledgements (Locked-in Foundation)

The following is **aligned with the original requirements**:

- **Core model**: `teams`, `onField (A vs B)`, `queue`, `phase`, optional `tieDecision`, `rules`, `undo`
- **Rotation algorithm**: winner/loser rotation + tie handling + special 3-team tieDecision
- **Event-driven transitions**: `DECLARE_WINNER`, `DECLARE_TIE`, `RESOLVE_TIE_STAY`, `UNDO`
- **Invariants-first**: every transition preserves exactly 2 on field, no dupes, everyone accounted for
- **Persistence**: Primary + Backup + TTL metadata (24h), local-first

**Routes:** `/dashboard` is the canonical live session route (not `/session`). Landing never auto-enters; user must tap Continue.

**Envelope note:** M2 will standardize to an envelope schema with `lastActiveAt` at the envelope level as source of truth; M1c loader remains compatible until then.

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

## State Machine Foundation — Data Model + Events + Undo

**Purpose:** Lock in a bug-resistant rotation engine (pure state transitions + strict invariants) as the base for UI and persistence.

**Problem:** Pickup soccer rotation is confusing with 3+ teams — 2 on field, rest in queue. After each result we must rotate predictably so everyone knows who plays now and who is next. Single device, no accounts, local-first.

**Approach:** Each moment is a complete `SessionState` snapshot. User actions are events: `applyEvent(state, event) -> nextState`. Undo restores a prior snapshot. Cap undo at 3 for simplicity; architecture supports more if needed.

---

### Canonical Type Definitions

```ts
type Team = {
  id: string;           // stable identifier (uuid-like)
  name: string;         // editable
  color?: string | null;
};

type OnField = {
  aTeamId: string;
  bTeamId: string;
};

type Phase = "normal" | "tieDecision";

type TieDecision = {
  aTeamId: string;      // A on field when tie declared
  bTeamId: string;      // B on field when tie declared
  queuedTeamId: string; // the single queued team (C)
};

type SessionState = {
  version: 1;
  teams: Team[];
  onField: OnField;
  queue: string[];
  phase: Phase;
  tieDecision?: TieDecision;  // present iff phase === "tieDecision"
  rules: { goalCap: number | null };
  undo: SessionSnapshot[];
};

type SessionSnapshot = Omit<SessionState, "undo">;

type Event =
  | { type: "DECLARE_WINNER"; winnerTeamId: string }
  | { type: "DECLARE_TIE" }
  | { type: "RESOLVE_TIE_STAY"; staysTeamId: string }
  | { type: "UNDO" };
```

---

### Invariants (must ALWAYS hold after every transition)

1. Exactly **2** teams on field
2. `queue` has **no duplicates**
3. On-field teams are **not** in `queue`
4. Every team exists **exactly once** across `{onField.aTeamId, onField.bTeamId, ...queue}`
5. Total team count **≥ 3**
6. If `phase === "tieDecision"`: `tieDecision` exists; `queue.length === 1`; `tieDecision.queuedTeamId === queue[0]`

---

### Rotation Algorithm (Locked)

Let onField be `A vs B`, queue be `Q = [q1, q2, q3, ...]`.


| Event                | Result                                                                                                               |
| -------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **A wins**           | onField: `A vs q1`; queue: `[q2, q3, ..., B]`                                                                        |
| **B wins**           | onField: `B vs q1`; queue: `[q2, q3, ..., A]`                                                                        |
| **Tie, len(Q) ≥ 2**  | onField: `q1 vs q2`; queue: `[q3, q4, ..., A, B]`; no popup                                                          |
| **Tie, len(Q) == 1** | Enter `phase = "tieDecision"`; popup "Who stays?" — A stays → `A vs C`, queue `[B]`; B stays → `B vs C`, queue `[A]` |
| **Tie, len(Q) == 0** | Invalid (should never happen)                                                                                        |


---

### Undo Rules (Locked)

- For `DECLARE_WINNER`, `DECLARE_TIE`, `RESOLVE_TIE_STAY`: push **current snapshot** onto `undo`; cap to **3** (drop oldest)
- For `UNDO`: pop most recent snapshot and restore it
- For invalid events: no state change, do not push undo

---

### Persistence Envelope (Primary + Backup + TTL)

Outer wrapper in localStorage:

```json
{
  "schemaVersion": 1,
  "lastActiveAt": "2026-02-15T03:40:12.000Z",
  "primary": { "…SessionState…" },
  "backup": { "…previous-known-good SessionState…" }
}
```

- `primary` = latest snapshot; `backup` = previous known-good (corruption recovery)
- TTL: valid iff `now - lastActiveAt <= 24h`
- Rolling activity + throttling in M8

---

### Example JSON — Normal Play (4 teams)

```json
{
  "version": 1,
  "teams": [
    { "id": "t1", "name": "Team 1", "color": "#0EA5E9" },
    { "id": "t2", "name": "Team 2", "color": "#22C55E" },
    { "id": "t3", "name": "Team 3", "color": null },
    { "id": "t4", "name": "Team 4", "color": "#F97316" }
  ],
  "onField": { "aTeamId": "t1", "bTeamId": "t2" },
  "queue": ["t3", "t4"],
  "phase": "normal",
  "rules": { "goalCap": 5 },
  "undo": [
    {
      "version": 1,
      "teams": [
        { "id": "t1", "name": "Team 1", "color": "#0EA5E9" },
        { "id": "t2", "name": "Team 2", "color": "#22C55E" },
        { "id": "t3", "name": "Team 3", "color": null },
        { "id": "t4", "name": "Team 4", "color": "#F97316" }
      ],
      "onField": { "aTeamId": "t2", "bTeamId": "t3" },
      "queue": ["t4", "t1"],
      "phase": "normal",
      "rules": { "goalCap": 5 }
    }
  ]
}
```

---

### Example JSON — 3-Team TieDecision State

OnField `t1 vs t2`, queue `[t3]`, user declares Tie:

```json
{
  "version": 1,
  "teams": [
    { "id": "t1", "name": "Team 1", "color": null },
    { "id": "t2", "name": "Team 2", "color": null },
    { "id": "t3", "name": "Team 3", "color": null }
  ],
  "onField": { "aTeamId": "t1", "bTeamId": "t2" },
  "queue": ["t3"],
  "phase": "tieDecision",
  "tieDecision": {
    "aTeamId": "t1",
    "bTeamId": "t2",
    "queuedTeamId": "t3"
  },
  "rules": { "goalCap": 3 },
  "undo": [
    {
      "version": 1,
      "teams": [
        { "id": "t1", "name": "Team 1", "color": null },
        { "id": "t2", "name": "Team 2", "color": null },
        { "id": "t3", "name": "Team 3", "color": null }
      ],
      "onField": { "aTeamId": "t1", "bTeamId": "t2" },
      "queue": ["t3"],
      "phase": "normal",
      "rules": { "goalCap": 3 }
    }
  ]
}
```

---

### Sanity Checklist (Mental Verification)

- Winner rotation: removes `q1` from queue, appends loser to end
- Tie with 4+ teams: instantly rotates `q1 vs q2`, appends `A,B` to queue
- Tie with 3 teams: enters `tieDecision` with queue length 1
- Undo restores full prior snapshot, including tieDecision phase
- At all times: onField has 2; queue no dupes; every team accounted for

### How This Informs the Build Plan

1. Standardize types: Team / OnField / SessionState / Snapshot / Event
2. Write invariant validator (dev-only assertion)
3. Implement `applyEvent()` (pure reducer) in M4
4. Wire UI buttons to dispatch events in M4/M5
5. Undo stack behavior in M6
6. Keep persistence envelope stable; rolling TTL in M8

---

## UI Flow Summary

1. **Landing** — Start Session; Continue (if valid session); Start New (confirm wipe)
2. **Setup** — Team count (3+), colors, goal cap, initial order preview → Start creates session
3. **Live Session** — Match A vs B, Winner A/B, Tie, Undo, queue display
4. **Settings** — Edit team name/color; Add Team (→ end of queue); Remove Team (queued only, never < 3); on-field remove disabled; Reset Session

---

## Johnny/components Usage

- Use **only** as visual/template reference: layout, button styles, spacing
- Do **not** treat as architectural or code-quality guidance
- Path: `[johnny/components/](johnny/components/)` (note: currently gitignored)

---

## Progress — What’s Implemented

### M1 — Landing Page + Persistence Detection (Complete)

**Landing**

- Always shows "Start Session"; conditionally "Continue Session" and "Start New Session" when valid session exists
- Landing does not auto-enter (user must click)

**Persistence detection**

- PRIMARY → BACKUP fallback; TTL check (24h); cleanup of expired session

**Routing**

- `/dashboard` is the canonical live-session route

---

### M2 — Setup UI + Create Session + Persist (Complete)

**Setup route**

- `/setup` route renders setup form (clean separation; added as UX improvement)

**Setup form**

- Team count selector (min 3, default 4)
- Auto-generates Team 1..N (IDs via `crypto.randomUUID()`)
- Optional colors per team
- Goal cap selector
- Start Match: creates full `SessionState` (onField = Team1 vs Team2, queue = Team3..N, phase = normal, rules.goalCap), saves PRIMARY + BACKUP, `router.replace('/dashboard')`
- Cancel → landing

**Storage layer**

- `lib/storage/constants.ts` — canonical types (SessionState, etc.)
- `lib/storage/session.ts` — `createSession()`
- `lib/storage/writer.ts` — save session (PRIMARY + BACKUP)
- `lib/storage/loader.ts` — load full session + TTL logic

**Dashboard behavior**

- If session exists → show LiveSession component
- If no session → redirect to `/setup`
- Start New Session → confirm → clear storage → redirect to `/setup`

**Outcome:** Landing → Dashboard → Setup → Dashboard → LiveSession placeholder (end-to-end flow works)

---

## Current Architecture

```
app/
├── page.tsx                 (renders <LandingPage />)
├── setup/
│   └── page.tsx             (setup form)
└── dashboard/
    └── page.tsx             (LiveSession if session; else redirect to /setup)

components/
├── landing-page.tsx         (conditional UI based on session)
└── dashboard/
    ├── live-session.tsx     (match card, queue, action buttons — placeholder)
    └── setup-form.tsx       (team count, colors, goal cap, Start/Cancel)

lib/storage/
├── constants.ts             (storage keys, TTL, types, canonical types)
├── session.ts               (createSession)
├── loader.ts                (load/validate, TTL check)
└── writer.ts                (save session, clearSessionStorage)

johnny/                      (gitignored, reference only)
├── components/landing/       (UI mockups)
└── ui-mocks/
```

**Stack:** Next.js 16, React 19, Tailwind 4, TypeScript. Design tokens in `app/globals.css`.

---

## Status Snapshot

**Status:** On track (ahead). Dedicated `/setup` route added as clean UX improvement; all locked requirements respected.

**Working:** M1 complete (landing, persistence, Continue/Start New); M2 complete (setup form, session creation, PRIMARY/BACKUP persist, redirect flow).

**Next:** M3 — LiveSession display real session data.

**Not yet:** M4–M8 per milestone map below.

---

## Requirements Check (Locked items still respected)

- Min 3 teams supported
- No login / no backend DB
- Single-device, local-first persistence
- PRIMARY + BACKUP snapshot redundancy
- TTL expiration behavior (rolling activity is M8)
- `/dashboard` canonical live session screen
- Setup creates initial order correctly (Team 1 vs Team 2, queue Team 3..N)

**Notes for later:** Undo cap 3 (M6); tie popup only for 3-team case (M5); rolling TTL is M8.

---

## What Is NOT Implemented Yet


| Area                                         | Milestone | Status  |
| -------------------------------------------- | --------- | ------- |
| LiveSession real data (names, colors, queue) | M3        | Next    |
| Rotation logic (Winner/Tie transitions)      | M4        | Pending |
| Tie decision popup (3-team only)             | M5        | Pending |
| Undo (cap 3)                                 | M6        | Pending |
| Settings panel (Edit/Add/Remove/Reset)       | M7        | Pending |
| Rolling TTL (activity-based)                 | M8        | Pending |


---

## Milestone Map (Reference) — Sub-milestones

**M1 — Landing Page** (complete)

- Landing UI, Start/Continue/Start New, persistence detection, TTL, PRIMARY/BACKUP

**M2 — Setup UI + Create Session** (complete)

- Team count (min 3, default 4), auto Team 1..N, optional colors, goal cap
- Start creates SessionState, persists envelope, routes to `/dashboard`
- Cancel returns to landing

**M3 — Live Session Screen (display only)** on `/dashboard` (next)

- M3a: Render onField (A vs B) from real SessionState — names, colors (no hardcoded placeholders)
- M3b: Render ordered queue list (real teams)
- M3c: Show goal cap summary (`rules.goalCap`)
- M3d: Support dynamic team counts (3, 4, 6, etc.)
- M3e: Action buttons visible but no-op (Winner A/B, Tie, Undo — disabled or "coming soon")
- M3f: Safe fallback if session invalid

**M3 recommended structure:** Dashboard loads session, passes as prop to LiveSession; LiveSession resolves IDs → teams via lookup map.

**M4 — Rules Engine + Wire Buttons**

- M4a: Events + invariant enforcement (dev assertion)
- M4b: DECLARE_WINNER transition
- M4c: DECLARE_TIE transition (immediate rotate or tieDecision)
- M4d: Wire dashboard buttons to dispatch events

**M5 — Tie Decision Popup (3-team only)**

- M5a: Popup when `phase === "tieDecision"` — A stays / B stays
- M5b: RESOLVE_TIE_STAY transition, persist

**M6 — Undo (up to 3)**

- M6a: Maintain undo stack on forward events, cap 3
- M6b: UNDO restores snapshot, persist
- M6c: Undo button enable/disable

**M7 — Settings Panel**

- M7a: Edit team name/color
- M7b: Add Team → append to end of queue
- M7c: Remove Team (queued only; on-field disabled)
- M7d: Reset session → clear storage → landing

**M8 — Rolling TTL**

- M8a: Global activity tracker (pointerdown, keydown, focus, visibility)
- M8b: Throttled saves (~30s), update `lastActiveAt` in envelope

**M9 — (Optional later)** Upstash Redis mirror — only if explicitly asked.

---

## Next Action

**M3** — LiveSession display real data: replace placeholder with session-driven rendering (names, colors, queue, goal cap); keep action buttons present but disabled/no-op.

---

## Cursor Behavior

- Implement **one milestone at a time**
- Stop after each milestone and ask: *"Do you confirm this matches the requirements? What should we do next?"*
- Do not invent extra features without verifying
- Ask before implementing if anything is unclear

