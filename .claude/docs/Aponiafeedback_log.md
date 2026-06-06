# Aponia — Feedback Log

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

### Session 019 — 2026-06-06 — SalesDoc QA (source review)
**ทำได้ดี:** จับ should-fix สำคัญ — **ไม่เช็ค record `Status != "SUCCESS"` (SPEC 6.4)** = silent success-on-fail ที่ build/static ทั่วไปมองไม่เห็น, ชี้ชัดว่าอย่างน้อย step3 (บันทึกถาวร) ต้อง gate ก่อนโชว์ success; respect invariant ที่ตั้งใจครบ (ไม่ flag invoice user-input/field สะกดเพี้ยน/Bootstrap override ผิด); ทำ simpler-alternative pass + verify no XSS/no leak/strict no-`any` ด้วยการ **grep จริง**; verdict fix-then-ship พร้อมเหตุผลข้อใหญ่; ซื่อสัตย์ว่าเป็น source review ยังไม่ verify runtime (ไม่ false confidence); nit มีประโยชน์ (extend type lies number-as-string, dead AppRoutingModule, a11y space key)
**ทำพลาด:** ไม่มีข้อพลาดหลัก
**แนวทางปรับปรุง:** รักษา pattern **อ้างเลขข้อ SPEC เป็นหลักฐาน** (6.4) ตอน flag — ทำให้ should-fix หนักแน่น แยกจากความเห็นส่วนตัว; ของ runtime (encoding/hover/responsive) ยังต้องพึ่ง Owner test ต่อ

### Session 016 — 2026-06-05 — WeatherAPI Chart QA (runtime, 2 rounds)
**ทำได้ดี:** **จับ critical dropdown desync ด้วย runtime จริง** ที่ build ผ่าน + static review มองไม่เห็น — reproduce flow pin→Humidity→unpin→pin วัด `dropdown.value` vs footer vs bars เห็น control โกหก state (เขียน Temperature แต่กราฟ Humidity), อธิบาย root cause ชัด (`[value]` ยึด DOM ตอน `@if` re-create select) + เสนอ fix (ngModel) ตรงจุด ไม่คลุมเครือ; re-QA เข้าถึง `pinnedCities` ผ่าน `window.ng` set data deterministic (ไม่พึ่ง network/API key) — เสถียร+ทำซ้ำได้, verify triple-consistency dropdown==footer==chart 25/25, regression ครบ (memory/orphan canvas/XSS `<img onerror>`/a11y/NG0203=0), จับ stale comment; ประเมิน budget 2MB ว่ากว้างไปตามจริง (เสนอ 1.5MB)
**ทำพลาด:** QA headless ทั้ง 2 รอบไม่ครอบ **hover** → tooltip clip bug (จาก `overflow:hidden`) หลุดไปให้ Owner เจอเครื่องจริง — คล้าย S011 false confidence แต่คนละ vector (รอบนี้คือ interactive hover ไม่ใช่ data env)
**แนวทางปรับปรุง:** เพิ่ม **hover/tooltip** ใน QA runtime ของ component ที่มี chart/overlay — trigger `mouseover` บน data point แล้วเช็คว่า tooltip แสดงครบ ไม่ถูก clip ด้วย bounding box; รักษาจุดแข็ง "verify ด้วยตัวเลข runtime + reproduce flow จริง" ต่อไป

### Session 015 — 2026-06-04 — Visual Office: Color Panel QA (runtime)
**ทำได้ดี:** QA runtime จริงผ่าน **http server** (ไม่ใช่ file://) ตามบทเรียน S011 — 50 assertions ครอบ edge case ที่เสี่ยงจริง: invalid hex (null/number/3-digit/bad-char), corrupt localStorage (`{bad json`), partial object (missing keys), clamp ขอบ (#ffffff+lighten / #000000+darken ไม่ wrap), reset-on-empty; ประเมิน security ตามจริง (setProperty CSS custom property ไม่เปิด XSS เพราะใช้เป็น color value ไม่เข้า url()/markup) ไม่ตีโพยตีพาย; ตรวจ a11y + no-regression (updateWindowTint แยกอิสระ); **ซื่อสัตย์** — 2/50 fail บอกตรง ๆ ว่าเป็น assertion ที่ตัวเองคำนวณ rounding ผิด ไม่ใช่ bug code, ยืนยันด้วย math ซ้ำ; housekeeping ลบ test script เอง
**ทำพลาด:** ไม่มี miss สำคัญ — จับ floor-b derive ทิศกลับได้ (แม้เป็น advisory) แล้วฝาก Sakura verify ตาต่อ ถือว่า cross-check ดี
**แนวทางปรับปรุง:** รักษามาตรฐาน "ตรวจ default state ที่ derive ออก เทียบกับค่าเดิม" ต่อไป — การจับ floor-b ได้มาจากการ"เทียบค่าที่ออกจริงกับ token เดิม" ไม่ใช่แค่เช็คว่าโค้ดรันผ่าน ซึ่งเป็นจุดแข็งที่ควรทำต่อ

### Session 011 — 2026-06-03 — Visual Office sidebar QA (2 rounds, runtime)
**ทำได้ดี:** QA runtime จริง (35 tests + deep XSS/overlap/keyboard + 8 scenario), จับ **MAJOR collapse leak ข้าม breakpoint** ที่ static review มองข้าม (วัด getBoundingClientRect หลัง resize mobile→desktop เห็น sidebar หายถาวร), จับ dead CSS, re-verify 23/23 ยืนยันทุก fix + regression, housekeeping (ลบ test script ชั่วคราว + ปิด http server เอง)
**ทำพลาด:** ให้ PASS/APPROVE จาก runtime headless (Puppeteer + http server ที่ตัวเอง spin up) แต่ **Owner เปิดจริงแล้วไม่มีข้อมูล/feed ว่าง** → QA environment ไม่ตรงกับวิธี Owner เปิด ทำให้เกิด false confidence (บอกว่าพร้อมส่งมอบ แต่จริง ๆ ใช้ไม่ได้ในเครื่อง Owner)
**แนวทางปรับปรุง:** QA ต้องครอบคลุม "วิธีที่ Owner เปิดจริง" ด้วย — ทดสอบทั้ง served ผ่าน Live Server (root จริงของ Owner) **และ** เคส `file://` (ต้องเช็คว่าโชว์ error ชัดบอกให้เปิดผ่าน server ไม่ใช่จอว่างเงียบ); ระบุใน report เสมอว่าทดสอบใน environment ไหน เพื่อไม่ให้ "ผ่านบนเครื่องฉัน" = "ผ่านบนเครื่อง Owner"

### Session 010 — 2026-06-03 — Visual Office office.html QA (2 rounds, runtime)
**ทำได้ดี:** QA **runtime จริงด้วย Puppeteer** (mock 404 แยกไฟล์, payload XSS, timestamp อนาคต, 8 scenario), จับ 2 critical (เวลาติดลบ, partial-failure ขัดแย้ง) + verify XSS สะอาด, re-verify รอบ 2 จับ bookshelf **ยังทับ clock** (วัด bounding box overlap ~22px) ที่ Mobius คิดว่าแก้แล้ว, priority tier + file:line ชัดเจน
**ทำพลาด:** ไม่มี — กลับมา run ได้เต็มที่หลังแก้ model ID (S009)
**แนวทางปรับปรุง:** การ verify ด้วย runtime + bounding box measurement ดีมาก รักษาไว้ — โดยเฉพาะหลัก "อย่าเชื่อว่าแก้แล้วจนกว่าจะวัดเอง"

### Session 009 — 2026-06-01 — Team Upgrade (แก้ root cause ที่ทำให้ Aponia spawn ไม่ได้)
**แก้ critical:** model ID ใน `Aponia.md` `claude-Opus-4-7` (สะกดผิด + version ไม่มีจริง) → `claude-opus-4-8` — นี่คือ root cause ที่ทำให้ Aponia spawn ไม่ได้จริงใน S006/S008 ตอนนี้กลับมา run ได้แล้ว
**อัปเดตโครงสร้าง:** QA DoD เพิ่ม (1) **Design Quality / AI Tells** (advisory — flag เสนอ Owner ไม่ใช่ bug) (2) **Bootstrap CSS Override Checklist** (ตรวจ default CSS, edge case N→N+1, specificity, vendor prefix) + ลบ section ที่ก๊อปซ้ำเละออกแล้ว
**แนวทางปรับปรุง:** AI tells = advisory เท่านั้น; weatherAPI grandfathered ไม่ flag; รักษา pattern file:line + priority tier ที่ทำได้ดีไว้

### Session 008 — 2026-05-30 — (Aponia ไม่ได้ run — model issue)
**ทำได้ดี:** —
**ทำพลาด:** Aponia ไม่ได้ทำ QA หลัง Mobius implement Carousel — bug `overflow:hidden` จึงผ่านไปถึง Owner โดยไม่ถูกจับ
**แนวทางปรับปรุง:** Bootstrap CSS override ต้องอยู่ใน QA checklist — เมื่อ component ใช้ Bootstrap class เป็น base ให้ตรวจ default CSS ของ class นั้นทั้งหมด โดยเฉพาะ overflow, position, display และทดสอบ edge case ที่ data เพิ่มข้ามขีดจำกัด (เช่น N → N+1 items)

### Session 007 — 2026-05-30 — WeatherAPI Search+Pin+Display QA
**ทำได้ดี:** ตรวจ signal calls ครบทุกจุด, จับ concurrent subscription risk ใน searchCity() พร้อม note ว่า disabled input ช่วยบรรเทาได้, จับ duplicate helper methods ใน 2 components พร้อม refactor recommendation, ตรวจ security (API key plain text → .gitignore), accessibility (input ขาด label), ไม่มี false positive — ทุกข้อเป็น observation ที่มีเหตุผลชัดเจน
**ทำพลาด:** ไม่มี
**แนวทางปรับปรุง:** pattern ดีมาก — รักษา concurrent subscription check และ duplicate code detection ไว้เป็น standard checklist item สำหรับ feature ที่มี shared service

### Session 006 — 2026-05-30 — WeatherAPI Card QA (2 rounds)
**ทำได้ดี:** round 1 จับ blocker 3 ข้อครบ (API key hardcode, ไม่มี HTTP error handler, HttpClientModule deprecated), round 2 verify แก้ครบและ APPROVE with conditions ได้ถูกต้อง, edge case analysis ละเอียด (deg=360, rain/drizzle range overlap), แยก priority 🔴/🟡/🔵 ชัดเจนทุกรอบ
**ทำพลาด:** spawn รอบแรกมี model config error ทำให้ต้อง spawn ใหม่ (ไม่ใช่ความผิด Aponia — เป็น config issue ของระบบ)
**แนวทางปรับปรุง:** pattern การ verify blocker list จาก round ก่อนเป็นอันดับแรกก่อน review ของใหม่ — ทำได้ดีมาก ควรทำแบบนี้ทุกครั้งที่มี multi-round review

### Session 005 — 2026-05-29 — Landing Page Review Component
**ทำได้ดี:** จับ bug ครบ 5 จุดพร้อม priority tier ชัดเจน (🔴/🟡/🟢), ตรวจ XSS, accessibility (aria-label), CSS variable scoping ได้ครบ, อธิบาย fix แนะนำชัดเจนและ actionable ทุกข้อ
**ทำพลาด:** BUG-01 เรื่อง `imports: []` อาจ overcautious เล็กน้อย — Angular 17+ ไม่บังคับสำหรับ built-in control flow แต่ก็เป็น best practice ที่ดีอยู่ดี
**แนวทางปรับปรุง:** ดีแล้วในรอบนี้ — รักษา pattern file:line reference, priority tier และ actionable fix recommendation ไว้

### Session 004 — 2026-05-27 — Team Dashboard
**ทำได้ดี:** จับ 4 blocking bugs ได้ครบพร้อม file:line reference ทุกจุด (skill-chip class, modal CSS conflict, relation-badge class, legend missing dots), รายงาน priority ชัดเจนแบ่ง 🔴/🟡, จับ keyboard accessibility ที่ขาดด้วย
**ทำพลาด:** ไม่มี
**แนวทางปรับปรุง:** ดีแล้วในรอบนี้ — รักษา pattern file:line reference และ priority tier ไว้

### Session 002 — 2026-05-26 — Plant Status Rework
**ทำได้ดี:** จับ bug ได้ครบทั้ง 2 critical bugs (null crash ใน toFixed และ search filter), รายงาน priority ชัดเจนแบ่ง "บล็อก deliver" vs "แนะนำ", verify fix รอบสองรวดเร็ว, จับ localeCompare null guard เพิ่มเองโดยไม่ได้ขอ
**ทำพลาด:** ไม่มี mistake ใน session นี้
**แนวทางปรับปรุง:** ดีแล้วในรอบนี้ — รักษา pattern การรายงาน priority และ file:line reference ไว้

<!-- ตัวอย่าง (ลบออกได้เมื่อมี log จริง)
### Session 2026-05-26 — Plant Status Dashboard
**ทำได้ดี:** จับ bug XSS ได้ก่อน Owner เห็น, รายงานแบ่ง priority ชัดเจน
**ทำพลาด:** approve code ที่ยัง missing error handling บาง edge case
**แนวทางปรับปรุง:** ใช้ scrutinize skill ทุกครั้ง อย่า skip step แม้งานดูเล็ก
-->

