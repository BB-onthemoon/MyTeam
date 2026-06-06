# Create-infinite-Carousel — Reference

Full implementation for the infinite multi-item carousel. See `SKILL.md` for the process.
Origin: Session 008 — WeatherAPI Pinned Cities Carousel (2026-05-30).

## Architecture — clone technique

```
displayList = [clone_lastN] + [real_items] + [clone_firstN]
                ^ left buffer    ^ real data    ^ right buffer

trackIndex = position in the real array (0 = first item)
actual position in displayList = trackIndex + CLONE_COUNT
```

How it works:
- Normal slide animates across the real items.
- Reaching a right/left clone fires `transitionend` → instant jump back to the matching real position.
- The user never sees the jump because the clone holds identical data.

## 1. Component TypeScript

```typescript
import { Component, inject, computed, signal } from '@angular/core';

export class YourCarouselComponent {
  // number of cards visible at once
  private readonly VISIBLE = 3;
  // clone cards appended head + tail (should be >= VISIBLE)
  private readonly CLONE = 3;

  readonly items = /* signal or computed from a service */;

  // Extended list: [clone_last, ...real, clone_first]
  readonly displayItems = computed(() => {
    const list = this.items();
    if (list.length === 0) return [];
    if (list.length <= this.VISIBLE) return list;
    return [
      ...list.slice(-this.CLONE),
      ...list,
      ...list.slice(0, this.CLONE),
    ];
  });

  readonly trackIndex = signal(0);
  readonly skipTransition = signal(false);
  readonly isTransitioning = signal(false);

  // transform: offset = (trackIndex + CLONE) because real items start at index CLONE
  readonly slideTransform = computed(() => {
    const list = this.items();
    if (list.length <= this.VISIBLE) return 'translateX(0)';
    const offset = (this.trackIndex() + this.CLONE) * (100 / this.VISIBLE);
    return `translateX(-${offset}%)`;
  });

  // dot active = normalize trackIndex back into 0..n-1
  readonly activeDotIndex = computed(() => {
    const n = this.items().length;
    if (n === 0) return 0;
    return ((this.trackIndex() % n) + n) % n;
  });

  // navigation enabled only when there are more items than VISIBLE
  readonly canNavigate = computed(() => this.items().length > this.VISIBLE);

  next(): void {
    if (!this.canNavigate() || this.isTransitioning()) return;
    this.isTransitioning.set(true);
    this.trackIndex.update(i => i + 1);
  }

  prev(): void {
    if (!this.canNavigate() || this.isTransitioning()) return;
    this.isTransitioning.set(true);
    this.trackIndex.update(i => i - 1);
  }

  // called from (transitionend) on the track element
  onTransitionEnd(): void {
    const n = this.items().length;
    if (n <= this.VISIBLE) {
      this.isTransitioning.set(false);
      return;
    }
    const idx = this.trackIndex();
    if (idx >= n) {
      // walked into the right clone -> jump back to real
      this.skipTransition.set(true);
      this.trackIndex.set(idx - n);
      this.isTransitioning.set(false);
      setTimeout(() => this.skipTransition.set(false), 0);
    } else if (idx < 0) {
      // walked into the left clone -> jump back to real
      this.skipTransition.set(true);
      this.trackIndex.set(idx + n);
      this.isTransitioning.set(false);
      setTimeout(() => this.skipTransition.set(false), 0);
    } else {
      this.isTransitioning.set(false);
    }
  }
}
```

## 2. Template HTML

```html
<div class="carousel slide your-carousel">

  <!-- Track: bind transform + transition here -->
  <div class="carousel-inner"
       [style.transform]="slideTransform()"
       [style.transition]="skipTransition() ? 'none' : 'transform 0.4s ease'"
       (transitionend)="onTransitionEnd()">

    <!-- track $index because displayItems has clone duplicates -->
    @for (item of displayItems(); track $index) {
      <div class="carousel-item">
        <div class="carousel-card-inner">
          <!-- card content here -->
        </div>
      </div>
    }
  </div>

  <!-- Controls: hidden when items <= VISIBLE -->
  <button class="carousel-control-prev" type="button"
          (click)="prev()" [class.d-none]="!canNavigate()">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
  </button>
  <button class="carousel-control-next" type="button"
          (click)="next()" [class.d-none]="!canNavigate()">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
  </button>

</div>

<!-- Dots: outside .your-carousel so overflow:hidden does not clip them -->
<div class="carousel-dots">
  @for (item of items(); track item.id; let i = $index) {
    <span class="carousel-dot" [class.carousel-dot--active]="i === activeDotIndex()"></span>
  }
</div>
```

## 3. CSS

```css
/* WRAPPER - clip viewport */
.your-carousel {
  overflow: hidden;       /* clip cards outside the window */
  position: relative;
  border-radius: 20px;
}

/* TRACK - Bootstrap override
   CRITICAL: overflow:visible is mandatory.
   Bootstrap default overflow:hidden clips translated cards. */
.your-carousel .carousel-inner {
  display: flex;
  overflow: visible;      /* <- critical, do not forget */
  will-change: transform;
}

/* CARD SLOT - sizing + gap only
   min-width = 100% / VISIBLE */
.your-carousel .carousel-item {
  display: block !important;          /* override Bootstrap display:none */
  min-width: calc(100% / 3);          /* <- change number per VISIBLE */
  margin-right: 0;
  float: none;
  padding: 4px 6px;                   /* creates the gap between cards */
  box-sizing: border-box;
}

/* CARD INNER - the real visual card (background lives here, not the slot)
   separating slot from visual keeps the gap transparent */
.carousel-card-inner {
  border-radius: 20px;
  padding: 16px;
  height: 100%;
  /* background, box-shadow, etc. */
}

/* CONTROLS - visible on light backgrounds */
.your-carousel .carousel-control-prev,
.your-carousel .carousel-control-next {
  width: 36px;
  height: 36px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(80, 60, 130, 0.72);
  border-radius: 50%;
  opacity: 1;
}

.your-carousel .carousel-control-prev { left: 6px; }
.your-carousel .carousel-control-next { right: 6px; }

.your-carousel .carousel-control-prev-icon,
.your-carousel .carousel-control-next-icon {
  width: 14px;
  height: 14px;
}

/* DOT INDICATORS */
.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 14px;
}

.carousel-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(160, 140, 200, 0.35);
  transition: all 0.25s ease;
}

.carousel-dot--active {
  width: 20px;
  border-radius: 4px;
  background: #a08cc8;
}
```
