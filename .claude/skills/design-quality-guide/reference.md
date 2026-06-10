# Design Quality Guide — Reference

The "AI Tells" catalogue. See `SKILL.md` for the numeric rules and how to apply.
Adapted from Impeccable (pbakaus) for our stack: Angular 21 + Bootstrap 5 + minimal style.

**Status: advisory, not a hard rule** — flag to prompt thinking, never force a rewrite; Owner decides.
**Goal:** the dashboard must not look like "a factory blueprint generated from a single prompt."
weatherAPI = an intentional, approved design (grandfathered) — do not change it to fit this guide.

## §1 — AI Tells that make a design look generic (avoid when you can)

| Tell | Why it reads as AI | Note for Bootstrap |
|---|---|---|
| Thick one-side accent border on cards (heavy `border-left`) | the most recognizable tell | avoid the default left accent border |
| Gradient text (`background-clip: text`) | over-decorated | — |
| Glassmorphism (heavy blur) used everywhere | "the AI cool look" | only with a real reason |
| Identical cards in an endless row | no priority/hierarchy | Bootstrap cards are fine, but add hierarchy/variation |
| `border: 1px solid` + diffuse `box-shadow` on the same element | classic AI tell | pick one, not both |
| Over-rounded corners (`border-radius` > 32px) | — | recommended ceiling 12–16px |
| purple/violet gradient, cyan-on-dark | the AI palette | our minimal style already avoids it |
| Tiny uppercase eyebrow above every section ("ABOUT") | AI scaffold | use only when needed |
| Numbered section markers (01/02/03) for decoration | AI scaffold | use only when they carry real meaning |
| Warm cream `#F4F1EA` + serif display + terracotta accent | a default AI "editorial" palette | fine only if the brief asks for it |
| Near-black bg + acid-green / vermilion highlight | a default AI "techy dark" palette | fine only if the brief asks for it |

## §2 — Decision Trees (pick the right container / feedback)

> Source: szilu/ux-designer-skill. Advisory aids for choosing a pattern with a reason — supports the "every pattern must justify itself" rule. Trimmed to our stack (Angular 21 + Bootstrap 5 + SweetAlert2); collaborative/canvas branches removed.

### Modal vs. Side Panel vs. Full Page

```
What is the user doing?
├── Quick confirmation or simple input (1–3 fields)?
│   └── → Modal dialog (or SweetAlert2 for confirm/alert)
├── Viewing/editing detail while keeping main context visible?
│   ├── Content is narrow (form, properties)?  → Side panel
│   └── Content needs significant width?       → Full-page overlay (with back nav)
├── Multi-step workflow / complex form?
│   ├── Steps short (2–3 fields each)?         → Modal with stepper
│   └── Steps long / need reference content?   → Full page with stepper (e.g. SalesDoc wizard)
└── Creating a new complex entity (document)?  → Full page (dedicated flow)
```

### Notification type

```
What needs the user's attention?
├── Immediate action required?
│   ├── Blocking (must resolve first)?  → Modal dialog (confirm / error recovery — SweetAlert2)
│   └── Urgent but non-blocking?        → Banner (top of page, persists until dismissed)
├── Feedback on a completed action?
│   ├── Success / low-importance info?  → Toast, auto-dismiss 4–8s
│   └── Warning / error?                → Toast with action button (manual dismiss)
└── System status (connectivity, maintenance)?  → Persistent banner
```

