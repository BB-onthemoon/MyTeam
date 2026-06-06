# Mobius — Feedback Log

---

## Format การบันทึก

```
### Session [วันที่] — [ชื่องาน]
**ทำได้ดี:** ...
**ทำพลาด:** ...
**แนวทางปรับปรุง:** ...
```

---

## Log

### Session 019 — 2026-06-06 — SalesDoc Polish (แก้ 14 จุดจาก QA)
**ทำได้ดี:** แก้ครบ 14 จุดรวดเดียวตาม fix list ใน `task-context.md` — **อ่าน context ต่อได้เลยไม่ต้องให้ Elysia re-pass** (ระบบ task-context ใช้จริงรอบแรกได้ผล แก้ pain cold-start S018); build เขียว + ลด step3-confirm.css ใต้ budget ด้วยการ **extract shared styles ไป global** (`.section-*`/`.field-*`/`.btn-48`) ไม่ใช่แค่ขยาย budget มักง่าย; A1 Status gate (step3) + A2 `mapHttpError` แยกตาม status ทำถูก; รายงาน deviation ชัด (RD-5 เขียน responsive ใหม่แทนลบ override เฉยๆ, RD-8 คง wrapper gap ของปุ่ม)
**ทำพลาด:** (ตกค้างจาก S018 ที่ QA เพิ่งจับ) (1) ใช้ CSS var `--surface-new`/`--border-new` ใน step3 โดย**ไม่ declare ใน styles.css** → token fail เงียบ green tint หาย; (2) header เขียน comment ว่า "layout ใช้ d-flex ใน HTML" แต่**ไม่ได้ใส่ class จริง** = dead comment → layout พัง username ตกล่าง; (3) ไม่เช็ค record-level `Status` (SPEC 6.4) → เสี่ยง success ปลอม; (4) `.main-content` มี max-width แต่ไม่ centered ใน flex context
**แนวทางปรับปรุง:** (1) ใช้ CSS var ตัวไหน **ต้อง declare ใน `:root` ก่อน** (grep ยืนยัน) — undefined var ไม่มี error เตือน; (2) **ห้ามเขียน comment ว่า "ทำผ่าน X" โดยไม่ได้ทำจริง** — comment ต้องตรง code; (3) response ที่มี field `Status` ราย record ต้องเช็คทุก record ตาม SPEC ไม่ใช่แค่ envelope `error`

### Session 018 — 2026-06-06 — ระบบรับคืนเอกสารการขาย (Coding ครบ A-F + รื้อ Bootstrap)
**ทำได้ดี:** ซอยงานเป็น step ย่อยตาม brief ครบ (A รากฐาน → B data layer → C wizard shell → D step1 → D.5 Bootstrap → E step2 → F step3), build เขียวทุก step + verify ด้วย `ng build` จริง (ไม่ใช่แค่ tsc — จับ template error ได้); สถาปัตยกรรมสะอาด: Service = HTTP ล้วน / `ReturnDocStore` signal-based เป็นที่เดียวที่ subscribe (computed `jobWinfeedIDs`/`plantCode`, guard double-submit + error/empty ครบ) / component dumb-vs-container ชัด (`JobCardVM` view-model ให้ job-card reuse step1+step2 ผ่าน mapping field ตรง vs New*); ใช้บทเรียนเก่าครบ — states นอก `@for` (S006), `[(ngModel)]` ไม่ใช่ `[value]` (S016), localStorage try/catch (S015), ตรวจ Bootstrap default ก่อน override (S008); รื้อ Bootstrap จริง (28 จุด card/input-group/btn/row-col/alert/spinner-border) + theme Sakura ผ่าน override `--bs-*` ลบ custom CSS ที่ซ้ำ (แก้ warning budget ได้หลาย component); ปุ่มบันทึก disabled ตาม SPEC 6.5 เป๊ะ, UserName edit ครบ Enter/blur/Esc + focus via ViewChild
**ทำพลาด:** (เล็ก) แต่ละ spawn เป็น cold start (ไม่มี SendMessage) → รอบ Step C **false-alarm รายงานว่า `proxy.conf.json` ยังไม่ได้สร้าง** ทั้งที่ Step A ทำไว้แล้ว (มองไม่เห็นงาน step ก่อน) — Elysia ต้อง verify เองทุกครั้ง; step3-confirm.css เกิน budget 4kB (5.61kB, ยังต่ำกว่า error 8kB) เข้า polish backlog
**แนวทางปรับปรุง:** เมื่อ cold start อย่า "ประกาศว่าสิ่งที่ step ก่อนทำยังไม่เสร็จ" ถ้าไม่ได้ตรวจไฟล์จริงก่อน — ให้ Read/Grep ยืนยันสถานะ repo ปัจจุบันก่อนรายงานว่า "ค้าง"; เมื่อมี design-system token เดิม (Sakura) แล้วต้องรื้อ framework ให้ map token เป็น CSS variable ของ framework (`--bs-*`) ไม่ override รายจุด

### Session 016 — 2026-06-05 — WeatherAPI Chart "City Comparison" (ApexCharts)
**ทำได้ดี:** ซอย 4a/4b/4c ชัด รายงาน plan ทุก step รอ checkpoint; `metricList` data-driven (key/label/unit/accessor) ขยาย metric ที่ 5 ง่าย ไม่ต้องแตะ logic; ApexCharts lifecycle รอบคอบ — `effect()` watch signals + create/update(`updateOptions` ไม่ destroy ทุกครั้ง)/destroy + `ngOnDestroy` กัน memory leak (Aponia วัด ApexCanvas=1, orphan=0); รอบ rework แก้ desync ตรง root cause; ระหว่างทางเจอ+แก้ NG0203 เอง (ส่ง `{injector}` ให้ `afterNextRender` เพราะ effect callback async หลุด injection context); verify ด้วย Playwright วัด dropdown==footer==chart เอง; ลบ dead code `widthPercent`; reduced-motion SSR-safe (`typeof window` guard)
**ทำพลาด:** (1) **[CRITICAL]** ใช้ `[value]="signal()"` + `(change)` บน native `<select>` ที่อยู่ใน `@if` → หลัง element ถูก re-create (toggle empty→chart) native select reset เป็น option แรก แต่ signal ยังค่าเดิม → dropdown แสดง metric ไม่ตรงกราฟ/footer (control โกหก state) + user คลิกซ้ำออกไม่ได้ — Aponia จับด้วย runtime flow pin→Humidity→unpin→pin; (2) ใส่ `overflow: hidden` บน `.chart-apex-host` (กัน SVG spill จอแคบ) → **clip ApexCharts tooltip** ตอน hover แท่งบนสุด ดูเหมือน header กลืน popup — Owner verify เครื่องจริงเจอ (QA headless ไม่ hover), Elysia แก้เป็น `overflow: visible`
**แนวทางปรับปรุง:** (1) native form control (`<select>`/`<input>`) ที่อยู่ใน `@if`/`@for` ต้อง bind ด้วย `[ngModel]`/two-way ไม่ใช่ `[value]`+event — `[value]` ยึด DOM ตอน re-create ทำให้ desync กับ signal; signal ต้องเป็น source of truth เดียว; (2) เมื่อใส่ `overflow: hidden` กัน spill ต้องคิดถึง floating UI ของ lib (tooltip/popover/dropdown) ที่ต้องเด้งพ้นขอบ — ถ้า lib วาง overlay เป็น child ใน host จะถูก clip หาย; (3) ถ้า over-cautious ใส่ guard CSS ต้องระบุให้ชัดว่ากันอะไร แล้ว verify ว่าไม่ทับ behavior อื่น

### Session 015 — 2026-06-04 — Visual Office: ระบบ Custom สี (panel ปรับสี 4 element)
**ทำได้ดี:** ปรับ mindset ถูกว่างานนี้เป็น static HTML/CSS/JS (ไม่ใช่ Angular) — ข้าม DoD ส่วน Angular/API แต่คงส่วน responsive/a11y/code-quality ไว้; ซอย 4 step ชัด (HTML → CSS → JS toggle → JS logic) รายงานทุก step รอ approve; รับคำเตือน Elysia เรื่อง token ชนแล้วตั้ง `--cp-*` ใหม่ ไม่ override `--panel-bg` เดิม + ไม่เพิ่ม reduced-motion block ซ้ำ (ใช้ block รวมศูนย์เดิม); ใช้ `COLOR_VAR_MAP` data-driven แทน if-else (ขยาย element ที่ 5 ง่าย); `shadeHex` defensive (regex `^#[0-9a-fA-F]{6}$` guard + clamp 0-255 + padStart) — Aponia ทดสอบ 9 edge case ผ่านหมด; try/catch ครบทุกจุด localStorage (save/load/remove); ไม่แตะ `--window-glass` (ไม่ชน updateWindowTint); ไม่มี inline style (swatch ใช้ `id` ให้ JS เซ็ต ไม่ hardcode สีใน HTML); a11y ครบ (aria-expanded/controls, role=dialog, Esc)
**ทำพลาด:** derive `--floor-b` ตาม "ตัวอักษร" ใน NOTE ของ Sakura (เขียนว่า lighten +8%) → ตั้ง shade `+8` ทำให้ floor-b **สว่างขึ้น** แต่ค่า token เดิม `#ccc494` จริง ๆ **เข้มกว่า** base `#ddd5a8` → ห้อง default floor texture เพี้ยนทิศ (Aponia + Sakura จับ, Elysia แก้เป็น `-7`)
**แนวทางปรับปรุง:** เมื่อ derive ค่าจาก spec ที่ "มี token ค่าเดิมอยู่แล้ว" ต้องเทียบ**ทิศ**กับค่า token จริง (วัด RGB delta) ไม่ยึดข้อความ spec อย่างเดียว — แล้ว verify ว่าค่าที่ derive ออกตอน default ตรงกับของเดิม (โดยเฉพาะค่าที่กระทบ "หน้าตาเริ่มต้น" ก่อน user แตะ)

### Session 011 — 2026-06-03 — Visual Office ขยาย Dashboard (sidebar ซ้าย)
**ทำได้ดี:** วาง plan 6 step ละเอียด + ระบุจุดเสี่ยง cross-step ก่อน code, ซอยทำตาม checkpoint กลุ่ม (1-2 layout / 3-4 UI / 5-6 JS+responsive) รอ Owner ทุกกลุ่ม, ไม่แตะห้อง office ตามสั่ง, แยก id ชัด (`js-dot-X` ห้อง vs `js-sb-dot-X` sidebar), ใส่ `min-height:0` ให้ feed scroll, null guard + escapeHtml ครบ, ใช้ `<button aria-expanded/aria-controls>` แทน checkbox hack, self-screenshot ตรวจเอง
**ทำพลาด:** (1) **[MAJOR]** วาง `.sb-body--collapsed { display:none }` ไว้นอก media query → desktop ที่ไม่มีปุ่ม toggle จะ sidebar หายถาวรหลัง user ยุบบน mobile แล้วขยายจอ (Aponia จับด้วย runtime resize); (2) ทิ้ง dead CSS `.sb-feed-item*` ที่นิยามไว้ตาม mockup แต่ไม่ได้ migrate JS render ให้ใช้ (JS ยัง render ด้วย class เก่า `feed-item`) → feed ไม่ตรง mockup + class ค้างสับสน
**แนวทางปรับปรุง:** (1) CSS rule ที่เป็น state เฉพาะ breakpoint (เช่น collapse ที่มีปุ่มควบคุมเฉพาะ mobile) **ต้องอยู่ใน media query นั้นเสมอ** — ไม่งั้น state ค้างข้าม breakpoint ที่ไม่มีทาง undo; (2) ถ้ามี class 2 ชุด (เก่า/ใหม่จาก mockup) ต้อง migrate ให้จบในรอบเดียว — ก่อนใส่ CSS class ใหม่ตาม mockup ต้อง wire JS ให้ render ด้วย class นั้นด้วย ไม่ทิ้งไว้เป็น dead CSS

### Session 010 — 2026-06-03 — Visual Office office.html (wire fetch + bugfix)
**ทำได้ดี:** implement mockup top-down เป็น office.html จริง wire fetch ครบ (status/feed/timestamp/auto-refresh/error handling), escapeHtml กัน XSS ครบทุก injection point (Aponia ยืนยัน runtime), JSONL parsing ทนทาน (ข้าม blank/malformed), แก้ bug ตาม QA ครบทุกรอบ, ใช้ Puppeteer วัด bounding box ยืนยันเอง
**ทำพลาด:** (1) `formatTimeAgo` ไม่ clamp ค่าลบ → "-2051 seconds ago"; (2) partial-failure ใช้ AND flag เดียว ทำ state ขัดแย้ง (banner เด้งทั้งที่ข้อมูลสด); (3) แก้ bookshelf รอบแรกย้ายไป `left:50%` ซึ่งทับ clock (กึ่งกลางเดียวกัน) แก้ไม่ตรงจุด ต้องรอบ 2
**แนวทางปรับปรุง:** (1) ค่าที่คำนวณจาก timestamp ต้อง clamp/guard ค่าผิดปกติ (อนาคต/ลบ) เสมอ; (2) error handling ของหลาย async source ต้องแยก flag ต่อ source ไม่ใช่ AND เดียว; (3) เวลาแก้ "ไม่ให้ทับ" ต้องตรวจตำแหน่ง element อื่นที่อยู่ตรงนั้นก่อน + วัดจริง (bounding box) ก่อนบอกว่าแก้แล้ว

### Session 009 — 2026-06-01 — Team Upgrade (โครงสร้าง — ไม่มีงาน code)
**อัปเดตโครงสร้างที่ต้องรู้:** Code DoD ใน `Mobius.md` เพิ่ม 2 ส่วน — (1) **Design Quality — เลี่ยง AI Tells** (อ้างอิง `design-quality-guide.md` ส่วนที่ 2: ไม่รวม border+box-shadow ฟุ้งบน element เดียว, border-radius ≤ ~16px, easing เป็น ease-out + `prefers-reduced-motion`, ไม่ animate layout property) (2) Bootstrap & Responsive เพิ่มข้อ: ตรวจ default CSS ก่อน override + ทดสอบ edge case N→N+1 + vendor prefix ครบ
**แนวทางปรับปรุง:** บทเรียน Bootstrap overflow (S008) และ vendor prefix (S007) ตอนนี้เป็น checklist ถาวรแล้ว ไม่ต้องจำเอง — เปิด DoD เช็คทุกครั้ง

### Session 008 — 2026-05-30 — Bootstrap Carousel (Infinite Loop) + Chart Placeholder
**ทำได้ดี:** plan ย่อยก่อน code ชัดเจน 4 step, เลือก clone technique สำหรับ infinite loop ได้ถูกต้อง (ไม่พึ่ง plugin), ซอย step รายงานหลังทำเสร็จทุก step
**ทำพลาด:** ไม่ตรวจ Bootstrap default CSS ของ `.carousel-inner` ก่อน implement — `overflow: hidden` เป็น default ทำให้ carousel หายหลังเพิ่มเมืองที่ 4 ต้องให้ Owner ทดสอบก่อนถึงจะเจอ
**แนวทางปรับปรุง:** เมื่อ override Bootstrap class ให้ตรวจ default CSS ของ class นั้นทั้งหมดก่อน (overflow, position, display, z-index) และทดสอบ edge case ที่ data เพิ่มข้ามขีดจำกัด เช่น จาก N → N+1 items

### Session 007 — 2026-05-30 — WeatherAPI Search Box + Pin Feature + Display
**ทำได้ดี:** ซอย 4 step ได้ชัดเจน รายงานหลังแต่ละ step ครบ, สร้าง WeatherService ด้วย Angular Signals ถูกต้อง (inject(), readonly signals, takeUntilDestroyed), empty state อยู่นอก @for loop ถูกต้องทุก component (เรียนรู้จาก session 006), ไม่มี `any` type ไม่มี inline style/template, ตรวจ DoD checklist เองก่อนส่ง
**ทำพลาด:** search-box.css ขาด `-webkit-backdrop-filter` บน `.search-bar` ทั้งที่ data-board.css มี prefix นี้อยู่แล้ว — inconsistency ระหว่าง component
**แนวทางปรับปรุง:** เมื่อ copy CSS pattern จาก component อื่น ต้องตรวจ vendor prefix ให้ครบทุก property โดยเฉพาะ `backdrop-filter` / `transform` / `animation` — ตรวจ data-board.css เป็น reference เสมอ

### Session 006 — 2026-05-30 — WeatherAPI Card (Bootstrap + design)
**ทำได้ดี:** implement CSS จาก mockup ครบทุก class รวมถึง 7 weather gradient states, แก้ bug HTML structure + H/L swap ถูกต้อง, เพิ่ม getWeatherClass/getWeatherEmoji/getCardinalDirection ครบ, ซอย step + รายงานหลังแต่ละ step ดีขึ้นชัดเจนกว่า session ก่อน, แก้ Aponia blockers 3 ข้อครบ (API key→environment.ts, error handler, provideHttpClient)
**ทำพลาด:** วาง loading/error state ไว้ *ใน* @for loop ทำให้ไม่แสดงตอน weatherData ว่างอยู่ — Elysia ต้องแก้เอง
**แนวทางปรับปรุง:** state ที่แสดงตอนข้อมูลยังไม่มา (loading, error, empty) ต้องอยู่ *นอก* @for loop เสมอ ตรวจ scope ของ loop ก่อน place state elements ทุกครั้ง

### Session 005 — 2026-05-29 — Landing Page Review Component
**ทำได้ดี:** code Angular component ครบ (interface, seed data, methods, template, CSS) ในรอบแรก, แก้ bug รอบสองครบทุกจุดตาม spec, ซอย fix เป็น 5 จุดได้ชัดเจน, ไม่แตะไฟล์อื่นที่ไม่ได้รับมอบหมาย
**ทำพลาด:** รอบแรก drop Email field ออกจาก form ทั้งที่ spec บอกว่า "คงไว้", hardcode `avatar-brown` ทุก card แทนที่จะ rotate, ลบ `submitReview` แล้วทำ reset ผิดจุด (reset เสมอแม้ validation fail)
**แนวทางปรับปรุง:**
1. ก่อน code ต้องอ่าน original form ให้ครบ — form มีกี่ field ต้องนับและคงไว้ทุกใบ ห้ามตัดออกถ้าไม่ได้รับคำสั่ง
2. reset logic ที่ขึ้นกับ validation ต้องอยู่ใน method เดียวกัน ห้ามแยก reset ไว้ใน template

### Session 003 — 2026-05-27 — Team Dashboard
**ทำได้ดี:** แก้ bug จาก QA ครบ ทั้ง class mismatch, modal CSS conflict, emoji, legend — build ผ่านสะอาด, แยกไฟล์ HTML/CSS/TS ถูกต้อง, ซอย Group A/B/C รอ checkpoint ดีขึ้นกว่า session ก่อน
**ทำพลาด:** เขียน CSS รวดเดียว 700 บรรทัดไม่ซอย, ออกแบบ component ใหญ่เดียว (team-dashboard) แทนที่จะแยกเป็น sub-component ตาม section (heading / team-members / workflow) ทำให้ไฟล์ใหญ่อ่านยากและไม่ใช้ Angular ให้คุ้ม
**แนวทางปรับปรุง:**
1. CSS ต้องซอยทีละ section รอ checkpoint เสมอ ห้าม dump ทีเดียว
2. ก่อน code ต้องวางแผน component structure ก่อน — แต่ละ section ที่แยกได้ชัดควรเป็น sub-component แยก (เช่น `<app-team-heading>`, `<app-team-members>`, `<app-team-workflow>`) แล้ว parent component ประกอบรวมกัน

### Session 002 — 2026-05-26 — Plant Status Rework
**ทำได้ดี:** แยกไฟล์ HTML/CSS/JS ถูกต้อง, แก้ bug ได้เร็วและตรงจุดทุกครั้ง, เพิ่ม null guard ครบ, ไม่มี magic number, มี error handling ครบ
**ทำพลาด:** code ทีเดียวรวดเดียวทั้ง 3 ไฟล์โดยไม่รายงาน Owner ก่อนว่าจะทำอะไร ทำให้ Owner ต้องรับ output 400+ บรรทัดโดยไม่มี context ว่าแต่ละ step ทำอะไร
**แนวทางปรับปรุง:** ก่อน code ต้องรายงาน plan ย่อยให้ Elysia เห็นก่อนเสมอ แล้ว code ทีละ step รอ checkpoint ก่อนไป step ถัดไป — Owner มี context window จำกัด ต้องซอยงานให้ย่อยได้

<!-- ตัวอย่าง (ลบออกได้เมื่อมี log จริง)
### Session 2026-05-26 — Plant Status Dashboard
**ทำได้ดี:** แยกไฟล์ Angular component ถูกต้อง, มี error handling ครบ
**ทำพลาด:** hardcode ค่าบางอย่างแทนที่จะดึงจาก API
**แนวทางปรับปรุง:** ตรวจ checklist ตัวเองก่อนส่ง Aponia ทุกครั้ง
-->

