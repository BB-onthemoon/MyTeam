---
name: Create-infinite-Carousel
description: Build a multi-item, infinite circular carousel in Angular 21 + Bootstrap 5 without Bootstrap JS or jQuery, using the clone-buffer technique. Trigger when implementing a carousel / slider that shows several cards at once and must loop seamlessly (e.g. pinned cities, product cards). Full copy-paste code in reference.md.
---

# Create Infinite Carousel

Multi-item visible + infinite circular loop. Bootstrap 5 classes as base, pure CSS transform — no Bootstrap JS, no jQuery.

## Critical gotchas — fix these first

1. `.carousel-inner` default `overflow: hidden` clips off-screen cards → set `overflow: visible`; clip with a parent wrapper instead.
2. `.carousel-item` default `display: none` → set `display: block !important` so all cards show at once.
3. `@for` over the cloned list **must `track $index`**, not `track item.id` — clones duplicate ids.

## Steps

1. **Override Bootstrap defaults** — wrapper `overflow:hidden`, `.carousel-inner` `overflow:visible` + `display:flex`, `.carousel-item` `display:block !important` + `min-width: calc(100%/VISIBLE)`.
2. **Build the clone buffer** — `displayItems = [...last CLONE, ...real, ...first CLONE]` (CLONE ≥ VISIBLE). Skip cloning when `items.length <= VISIBLE`.
3. **Drive position with `trackIndex`** — real items start at offset `CLONE`; `translateX(-(trackIndex + CLONE) * (100/VISIBLE)%)`.
4. **Seamless jump on `transitionend`** — when `trackIndex >= n` or `< 0`, set `skipTransition`, reset index by ±n, then clear `skipTransition` on next tick. User never sees the jump.
5. **Guard rapid clicks** with `isTransitioning`; gate nav on `canNavigate = items.length > VISIBLE`.
6. **Dots** — render over real `items`; active = `((trackIndex % n) + n) % n`. Place dots outside the clipped wrapper.

→ Full TS / HTML / CSS: see [reference.md](reference.md)

## Ship checklist

- [ ] `overflow: visible` on `.carousel-inner`
- [ ] `display: block !important` on `.carousel-item`
- [ ] `track $index` (not `item.id`)
- [ ] Edge cases tested: 0 / 1 / 2 / 3 / 4+ items
- [ ] Rapid click guarded (`isTransitioning`)
- [ ] Dots highlight the correct active item

## When to use / not

- **Use:** Bootstrap is the base, team knows Bootstrap, simple slide animation.
- **Skip:** complex effects (fade/zoom), ≤3 items (infinite unneeded), or touch/swipe required → use a library (Swiper.js).
