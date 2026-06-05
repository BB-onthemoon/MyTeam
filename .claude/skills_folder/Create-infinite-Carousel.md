# Skill: Create-infinite-Carousel

> Bootstrap Carousel แบบ multi-item visible + infinite circular loop
> สำหรับ Angular 21 + Bootstrap 5 (ไม่ใช้ Bootstrap JS / jQuery)
> เรียนรู้จาก Session 008 — WeatherAPI Pinned Cities Carousel

---

## ปัญหาที่ต้องรู้ก่อน (Bootstrap Gotchas)

### ⚠️ Bootstrap `.carousel-inner` มี `overflow: hidden` เป็น default
ถ้าไม่ override จะทำให้ card ที่อยู่นอก viewport ถูก clip หาย
→ ต้อง override เป็น `overflow: visible` บน `.carousel-inner`
→ ใช้ parent wrapper `overflow: hidden` แทนเพื่อ clip viewport

### ⚠️ Bootstrap `.carousel-item` มี `display: none` เป็น default
ต้อง override ด้วย `display: block !important` เพื่อให้ทุก card visible พร้อมกัน

---

## Architecture — Clone Technique

```
displayList = [clone_lastN] + [real_cities] + [clone_firstN]
                ↑ left buffer    ↑ real data    ↑ right buffer

trackIndex = position ใน real array (0 = เมืองแรก)
actual position ใน displayList = trackIndex + CLONE_COUNT
```

**วิธีทำงาน:**
- Slide ปกติ → animate ผ่าน real cities
- ถึง right clone → transitionend fires → instant jump กลับ real position เดียวกัน
- ถึง left clone → transitionend fires → instant jump กลับ real position เดียวกัน
- User ไม่เห็นการ jump เพราะ clone มีข้อมูลเหมือนกันทุกอย่าง

---

## Implementation

### 1. Component TypeScript

```typescript
import { Component, inject, computed, signal } from '@angular/core';

export class YourCarouselComponent {
  // จำนวน card ที่แสดงพร้อมกัน
  private readonly VISIBLE = 3;
  // จำนวน clone card ที่ต่อหัว-ท้าย (ควร >= VISIBLE)
  private readonly CLONE = 3;

  readonly items = /* signal หรือ computed จาก service */;

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

  // transform: offset = (trackIndex + CLONE) เพราะ real items เริ่มที่ index CLONE
  readonly slideTransform = computed(() => {
    const list = this.items();
    if (list.length <= this.VISIBLE) return 'translateX(0)';
    const offset = (this.trackIndex() + this.CLONE) * (100 / this.VISIBLE);
    return `translateX(-${offset}%)`;
  });

  // dot active = normalize trackIndex กลับมาใน 0..n-1 เสมอ
  readonly activeDotIndex = computed(() => {
    const n = this.items().length;
    if (n === 0) return 0;
    return ((this.trackIndex() % n) + n) % n;
  });

  // navigation เปิดเมื่อมี items มากกว่า VISIBLE
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

  // เรียกจาก (transitionend) event บน track element
  onTransitionEnd(): void {
    const n = this.items().length;
    if (n <= this.VISIBLE) {
      this.isTransitioning.set(false);
      return;
    }
    const idx = this.trackIndex();
    if (idx >= n) {
      // เดินเข้า right clone → jump กลับ real
      this.skipTransition.set(true);
      this.trackIndex.set(idx - n);
      this.isTransitioning.set(false);
      setTimeout(() => this.skipTransition.set(false), 0);
    } else if (idx < 0) {
      // เดินเข้า left clone → jump กลับ real
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

### 2. Template HTML

```html
<div class="carousel slide your-carousel">

  <!-- Track: bind transform + transition ที่นี่ -->
  <div class="carousel-inner"
       [style.transform]="slideTransform()"
       [style.transition]="skipTransition() ? 'none' : 'transform 0.4s ease'"
       (transitionend)="onTransitionEnd()">

    <!-- ใช้ track $index เพราะ displayItems มี duplicate จาก clone -->
    @for (item of displayItems(); track $index) {
      <div class="carousel-item">
        <div class="carousel-card-inner">
          <!-- card content here -->
        </div>
      </div>
    }
  </div>

  <!-- Controls: ซ่อนเมื่อ items <= VISIBLE -->
  <button class="carousel-control-prev" type="button"
          (click)="prev()" [class.d-none]="!canNavigate()">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
  </button>
  <button class="carousel-control-next" type="button"
          (click)="next()" [class.d-none]="!canNavigate()">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
  </button>

</div>

<!-- Dots: อยู่นอก .your-carousel เพื่อไม่ถูก overflow:hidden ตัด -->
<div class="carousel-dots">
  @for (item of items(); track item.id; let i = $index) {
    <span class="carousel-dot" [class.carousel-dot--active]="i === activeDotIndex()"></span>
  }
</div>
```

### 3. CSS

```css
/* ============================================================
   WRAPPER — clip viewport
============================================================ */
.your-carousel {
  overflow: hidden;       /* clip card ที่อยู่นอก window */
  position: relative;
  border-radius: 20px;
}

/* ============================================================
   TRACK — Bootstrap override
   CRITICAL: overflow:visible ต้องมีเสมอ
   Bootstrap default คือ overflow:hidden ซึ่งจะ clip card ที่ translate ออกไป
============================================================ */
.your-carousel .carousel-inner {
  display: flex;
  overflow: visible;      /* ← สำคัญมาก อย่าลืม */
  will-change: transform;
}

/* ============================================================
   CARD SLOT — sizing + gap เท่านั้น
   VISIBLE = จำนวน card ที่ต้องการแสดงพร้อมกัน (เช่น 3)
============================================================ */
.your-carousel .carousel-item {
  display: block !important;          /* override Bootstrap display:none */
  min-width: calc(100% / 3);          /* ← เปลี่ยนเลขตาม VISIBLE */
  margin-right: 0;
  float: none;
  padding: 4px 6px;                   /* สร้าง gap ระหว่าง card */
  box-sizing: border-box;
}

/* ============================================================
   CARD INNER — visual card จริง (background อยู่ที่นี่ ไม่ใช่ slot)
   แยก slot กับ visual เพื่อให้ gap โปร่งใส
============================================================ */
.carousel-card-inner {
  border-radius: 20px;
  padding: 16px;
  height: 100%;
  /* background, box-shadow, etc. */
}

/* ============================================================
   CONTROLS — visible บน light background
============================================================ */
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

/* ============================================================
   DOT INDICATORS
============================================================ */
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

---

## Checklist ก่อน Ship

- [ ] `overflow: visible` บน `.carousel-inner` — ห้ามลืม
- [ ] `display: block !important` บน `.carousel-item` — override Bootstrap
- [ ] `track $index` (ไม่ใช่ track item.id) เพราะ clone มี duplicate id/name
- [ ] ทดสอบ edge case: 0 / 1 / 2 / 3 / 4+ items
- [ ] ทดสอบ rapid click (isTransitioning guard)
- [ ] dot indicators แสดงถูก item ที่ active

---

## เมื่อไหร่ควรใช้ vs ไม่ใช้

| ใช้เมื่อ | ไม่ใช้เมื่อ |
|---|---|
| ต้องการ Bootstrap class เป็น base | ต้องการ animation effect ซับซ้อน (fade, zoom) |
| ทีมรู้จัก Bootstrap อยู่แล้ว | items จำนวนน้อยมาก (≤3) ไม่จำเป็นต้อง infinite |
| | ต้องการ touch/swipe support (ควรใช้ library เช่น Swiper.js แทน) |

---

*บันทึกจาก Session 008 — 2026-05-30*
