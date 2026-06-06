---
name: design-quality-guide
description: Advisory checklist to keep dashboards from looking like generic AI output and to enforce hard numeric design rules (contrast, type scale, motion). Trigger when Sakura designs a mockup, Mobius writes CSS, or Aponia QAs UI. Advisory only — flag and propose to Owner, never auto-rewrite. The full "AI Tells" catalogue lives in reference.md.
---

# Design Quality Guide

Advisory, not a gate. Flag → propose to Owner with a reason → Owner decides. Intentional designs (e.g. weatherAPI pastel/lofi) are grandfathered, not bugs.

## Hard numeric rules (enforce these)

- **Contrast:** body ≥ 4.5:1, large text ≥ 3:1, placeholder ≥ 4.5:1 (no over-faint gray).
- **Font size:** body ≥ 16px recommended (14px floor allowed if the design calls for it); use `rem`, not `px`.
- **Line length:** 45–75 chars per line (`max-width: 65ch`).
- **Hierarchy:** heading sizes clearly distinct (ratio ≥ 1.25); don't mix 14/15/16px.
- **Font family:** ≤ 3 (display / body / mono).
- **Motion:** ease-out (no bounce/elastic) + always honor `prefers-reduced-motion`.
- **Animation:** never animate layout props (width/height/padding/margin) → use `transform`/`opacity`.
- **Heading order:** don't skip levels (h1 → h3) — screen readers.
- **Padding in bordered/colored containers:** ≥ 8px, ideally 12–16px.

## How to apply

1. Use as a **thinking checklist**, not a blocking gate.
2. Spot a tell → **propose to Owner with the reason**; never fix silently.
3. Conflicts with Bootstrap or Owner's minimal taste → **choose per context**.
4. An intentional, approved design is not a defect.

## Agent roles

| Agent | When | Focus |
|---|---|---|
| **Sakura** | designing mockup | AI Tells (design) — reference.md §1 |
| **Mobius** | writing CSS | numeric rules above |
| **Aponia** | QA | both, advisory — flag to Owner |

→ Full "AI Tells" catalogue (what to avoid + why): see [reference.md](reference.md)
