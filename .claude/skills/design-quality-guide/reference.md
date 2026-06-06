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
