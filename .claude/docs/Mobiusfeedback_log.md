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

## กฎที่กลั่นแล้ว ⭐ (อ่านทุก spawn — กลั่นจากทุก session)
> โครงสร้าง 2 ชั้น (S024): ชั้นนี้ = กฎใช้งาน / "Log ล่าสุด" เก็บเรื่องเต็ม 3 sessions — entry เก่ากว่าอยู่ `archive/Mobiusfeedback_archive.md` (Elysia หมุนเวียนตอน Session End: กลั่น entry เก่าสุดเป็นกฎ → ย้าย archive)

### Process
- รายงาน plan ย่อยก่อน code แล้วทำทีละ step ที่ได้รับมอบในรอบ spawn — ห้าม dump รวดเดียว (S002/S003)
- อ่าน `task-context.md` ทุก spawn; ห้ามรายงานว่า step ก่อน "ยังไม่ทำ" ถ้าไม่ Read/Grep ยืนยัน repo จริง (S018)
- รายงาน diff + ยืนยัน scope "ไม่แตะไฟล์อื่น" ทุก step; ห้ามแตะไฟล์นอกที่ได้รับมอบ (S005/S022)
- comment ต้องตรง code จริง — ห้ามเขียน "ทำผ่าน X" โดยไม่ได้ทำ (dead comment ทำ layout พัง S019)
- section ที่แยกได้ชัด → แยก sub-component เสมอ (S003)

### Angular
- loading/error/empty state ต้องอยู่**นอก** `@for` (S006)
- native control ใน `@if`/`@for` ใช้ `[(ngModel)]` — `[value]`+event จะ desync หลัง re-create (S016)
- `effect()` side-effect 3 กฎ: อ่านทุก signal บนสุดก่อน branch / `prev*` guard เด้งเฉพาะ transition / producer ต้อง set ค่ากลางคนละ tick (signal coalescing กลืนค่าใน tick เดียว) (S023)
- ApexCharts: `updateOptions` ไม่ destroy ทุกครั้ง + destroy ใน `ngOnDestroy`; `afterNextRender` ใน effect ต้องส่ง `{injector}` (S016)
- reset logic ที่ขึ้นกับ validation อยู่ใน method เดียวกัน ไม่แยกใน template (S005)

### CSS / Bootstrap
- ก่อน override Bootstrap: ตรวจ default CSS (overflow/position/display/z-index) + เทส edge N→N+1 (S008)
- Bootstrap ตั้งค่าผ่าน selector ลูก (0,2,0) → single class ไม่ชนะ ต้องเช็ค specificity; `!important` ที่มีใน rule อยู่แล้ว = สัญญาณจุดนี้เคยสู้ Bootstrap (S022)
- `overflow:hidden` กัน spill จะ clip floating UI (tooltip/popover) ของ lib — คิดก่อนใส่ (S016)
- CSS state เฉพาะ breakpoint ต้องอยู่ใน media query นั้น ไม่งั้น state ค้างข้าม breakpoint (S011)
- vendor prefix `-webkit-` ครบบน backdrop-filter/transform/animation (S007)
- CSS var ต้อง declare ใน `:root` ก่อนใช้ — undefined fail เงียบไม่มี error (S019)
- class เก่า/ใหม่ต้อง migrate จบรอบเดียว ไม่ทิ้ง dead CSS (S011)
- rem ในระบบ scale ได้: คิดเสมอ "ที่ scale เล็กสุดเหลือกี่ px" — label ≥12px (floor `0.75rem`); control ปรับ font เองคงเป็น px (S021)
- รื้อ framework ทับ design token เดิม: map token → `--bs-*` ไม่ override รายจุด (S018)

### Data / Security
- derive ค่าจาก spec ที่มี token เดิม: เทียบ**ทิศ**กับ token จริง + verify default ตรงของเดิม (S015)
- ค่าจาก timestamp ต้อง clamp/guard; error flag แยกต่อ async source ไม่ใช่ AND เดียว (S010)
- response มี `Status` ราย record → เช็คทุก record ตาม SPEC ไม่ใช่แค่ envelope (S019)
- lib popup จาก CDN render ที่ `document.body` → ViewEncapsulation CSS ไปไม่ถึง ใช้ global styles.css/`customClass` (S023)
- escapeHtml ทุก injection point; localStorage ครอบ try/catch เสมอ (S010/S015)

---

## Log ล่าสุด (เก็บ 3 sessions)

### Session 023 — 2026-06-09 — SweetAlert2 popup (StoreSalesReturnDoc, 3 spawn A/B/C)
**ทำได้ดี:** ซอย A(confirm)→B(success effect)→C(error effect) ทีละ checkpoint, อ่าน `task-context.md` ทุก spawn ต่อ context ได้ไม่ false-alarm; **แตะไฟล์เดียวจริงทั้งงาน** (`step3-confirm.ts`) เคารพ invariant "ไม่แตะ store" (Aponia verify ผ่าน); **effect() side-effect pattern ถูกต้องครบ** — (1) อ่าน **ทั้ง 2 signal** (`step3Result()`+`errorMessage()`) ที่ต้นฟังก์ชันก่อน branch ทุก tick (ไม่ให้ signal หลุดหลัง early return → track ไม่ครบ), (2) field `prevResultLen`/`prevErrorMsg` guard เด้งเฉพาะ transition จริง (0→>0, ''→msg) กัน double-fire ตอน init/reset, (3) เข้าใจ+เขียน comment ว่าปลอดภัยจาก **signal coalescing** เพราะ `saveReturn` set `errorMessage('')` (tick1 sync) คนละ tick กับ set msg (tick2 หลัง API) → effect เห็น transition จริง; **security เชิงรุก** — confirm ใช้ `html`+`escapeHtml()` (ครอบ `& < > "`) เอง, error ใช้ `text` (Swal auto-escape) ไม่ต้อง escape; ทักเรื่องสี icon เองว่า override ต้องเพิ่ม customClass+CSS แล้ว**หยุดถาม Elysia ก่อนเขียน** (ไม่ over-engineer); build เขียวทุก step verify เอง
**ทำพลาด:** ไม่มีจุดพังจริง — QA ทั้งคู่ APPROVE/PASS ไม่มี must-fix; nit เดียวคือ comment coupling ที่ store (Owner เลือกข้ามเพราะรักษา invariant)
**แนวทางปรับปรุง:** จำ **effect() popup/side-effect pattern** นี้ไว้เป็นแม่แบบ — อ่านทุก signal ที่ต้นฟังก์ชัน + prev-value guard + รู้ว่า producer ต้อง set ค่ากลางคนละ tick ถึงจะ track transition ได้ (signal coalescing กลืนค่าใน tick เดียว); และจำว่า **lib popup จาก CDN (Swal) render ที่ `document.body` นอก component DOM** → component-scoped CSS (ViewEncapsulation) ไปไม่ถึง ถ้าจะ style ต้อง global `styles.css` หรือ `customClass`

### Session 022 — 2026-06-09 — ปรับ UX/UI 4 จุด (StoreSalesReturnDoc, 4 spawn A-D)
**ทำได้ดี:** ซอยตาม brief 4 step ทีละ checkpoint, อ่าน `task-context.md` ทุก spawn ต่อ context ได้ไม่ false-alarm; **รายงาน diff + ยืนยัน scope ("ไม่แตะไฟล์อื่น") ทุก step** (ช่วย Elysia verify เร็ว); debug-path ของ searchbox ชัด (ระบุ Bootstrap `.input-group>.form-control{width:1%}` ค้างตอน flex column); **รักษา invariant S021** (font-scale-btn 32px px คงที่ ไม่ scale); Step D placement ถูกเป๊ะ — `returnTimestamp.set(new Date())` วาง**หลัง guard ครบ ก่อน `isLoading.set(true)`** = จับ "เวลาที่กด" จริงแม้ API error ทีหลัง, `formatReturnTime` manual (+543 พ.ศ., padStart, null-guard) ไม่พึ่ง Angular locale; แยก View A/View B ถูก (Step C แตะ A เท่านั้น, Step D แตะ B เท่านั้น); tsc สะอาด
**ทำพลาด:** Step A รอบแรกใส่ `width: 100%` เฉย ๆ **ไม่ทันคิด specificity** — Bootstrap ตั้ง width ผ่าน `.input-group > .form-control` (0,2,0) ซึ่งชนะ plain class `.field-input` (0,1,0) → Elysia ทักให้เติม `!important` (ทั้งที่ rule เดียวกันมี `border-radius !important` เป็นเบาะแสว่าจุดนี้เคยสู้ specificity มาก่อน)
**แนวทางปรับปรุง:** เวลา override property ที่ Bootstrap ตั้งผ่าน **selector ลูก** (`.input-group > .form-control`, `.card-header > *` ฯลฯ) ให้เช็ค specificity ของ rule เดิมก่อน — ถ้าเป็น (0,2,0) ขึ้นไป single class (0,1,0) ไม่ชนะ ต้อง `!important` หรือเพิ่ม specificity; และสังเกต `!important` ที่มีอยู่แล้วใน rule เดียวกันเป็นสัญญาณว่า "จุดนี้ต้องสู้ Bootstrap"

