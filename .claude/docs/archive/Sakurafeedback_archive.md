# Archive - Sakurafeedback_log.md

> Entries older than the 3 most recent sessions - moved here in S024 (2-tier restructure).
> Distilled rules from these entries live in the main log section 'kot-thi-klan-laew'.

### Session 021 — 2026-06-09 — User Preferences font-size UI/UX QA (StoreSalesReturnDoc)
**ทำได้ดี:** **จับ bug เด่นที่สุดของงาน (ironic a11y)** — เห็นว่า label ที่ใช้ `rem` (`.user-label`/`.job-id-label` 0.6875rem + ตัว ก 11px) **หดต่ำกว่า 12px minimum ตอนผู้ใช้เลือก sm(16px)** = ฟีเจอร์ accessibility สร้าง a11y issue เอง (มุมที่ contrast-only review มองข้าม) พร้อม trace ค่า px ที่ทุก scale; แยก severity ชัด + เสนอ floor 0.75rem; ใช้ scrutinize intent-first (ยืนยันว่า rem-scaling เป็นวิธี simplest จริง); **ระบุชัดทุกข้อว่า "วิเคราะห์จาก code" vs "ต้อง verify browser"** (connector/flex-wrap/visual-coherence flag เป็น runtime ไม่ฟันธง — S011/S016 lesson); ประเมิน touch target 28px เชิงบริบท (secondary control ยอมรับได้แต่เสนอ 32px)
**ทำพลาด:** ไม่มีข้อพลาดหลัก (จุดดี: contrast คำนวณเองได้เลขใกล้ Aponia, ไม่ rubber-stamp — บอกทั้งผ่านและไม่ผ่าน)
**แนวทางปรับปรุง:** จำ pattern "ironic a11y" ไว้ — เวลา QA ฟีเจอร์ที่ scale ขนาดได้ ให้เช็คทั้ง**ปลายใหญ่** (layout แตก/ล้น) และ**ปลายเล็ก** (ตัวอักษร/touch ต่ำกว่า minimum) เสมอ

### Session 019 — 2026-06-06 — SalesDoc UI/UX QA (source review)
**ทำได้ดี:** จับ bug สำคัญ 2 ตัวที่ source review ทั่วไปมองข้าม โดย **เทียบกับภาพ reference จริง** (`ref/UI-report1.png`) — (1) content ไม่ centered (max-width แต่ไม่ margin auto), (2) CSS var `--surface-new`/`--border-new` undefined → green tint หาย; verdict ชัด (ไม่ผ่าน 3 must-fix) พร้อม `file:line` + แนวทางแก้ทุกข้อ; แยกระดับ must/should/advisory ดี; ไม่ rubber-stamp (บอกสิ่งที่ตรวจผ่านด้วย — design token/a11y/state)
**ทำพลาด:** ไม่มีข้อพลาดหลัก (จุดดี: RD-6 connector clip ที่ 375px ระบุเองว่า "ยืนยันไม่ได้ถ้าไม่รัน browser" → flag เป็น runtime-check ไม่ฟันธง ถูกต้อง)
**แนวทางปรับปรุง:** รักษาจุดแข็ง **"เทียบภาพ reference จริง"** — ช่วยจับ layout bug (centering) ที่อ่าน CSS เฉยๆ ไม่เห็น; ของที่ต้อง runtime (responsive ขอบเขต/clip) flag ให้ Owner verify ต่อ ไม่ false confidence

### Session 017 — 2026-06-06 — ระบบรับคืนเอกสารการขาย (Mockup 3 step — โปรเจคใหม่)
**ทำได้ดี:** วาง **design language ใหม่ทั้งระบบ** ให้สื่อ enterprise/industrial (navy header `#162032` + steel blue `#1d4ed8` + warm gray bg, IBM Plex Sans Thai/Mono, การ์ดใช้ header-bar ภายใน + Extend badge วงกลม ไม่ใช้ border-left หนา, radius 4-6px) เลี่ยง AI-tell ครบและ note rationale ทุกจุด; ใช้ pattern "ทำ Step 1 ก่อนให้ Owner approve ทิศทาง แล้วขยาย Step 2/3 ด้วย design ต่อเนื่องสม่ำเสมอ" ได้ผลดีมาก; รับ feedback หลายรอบไว+ตรง (เพิ่ม label JobWinfeedID, ขยาย base font 16→18px เพื่อ accessibility ผู้ใช้สายตาสั้น, เปลี่ยน invoice เป็น input ว่าง, เอา section invoice ออกจาก Step 2 + จัด spacing ต่อ); self-review desktop+mobile ทุกรอบ + screenshot, note ส่ง Mobius ครบ (localStorage key `sdrs_username`, loading/empty/error state, ปุ่ม disabled validation, toggle View A/B)
**ทำพลาด:** ไม่มีข้อพลาดหลัก งานราบรื่น (จุดเล็ก: รอบ Step 2+3 รายงานว่าปุ่ม mobile "อาจ clip ต้อง scroll" แต่ตรวจ full-page จริงแล้ว stack ครบไม่ clip — ประเมิน conservative ไว้ก่อนซึ่งยอมรับได้)
**แนวทางปรับปรุง:** เวลา mockup มี field ที่ค่า "อาจมาจาก step ก่อน" ให้เช็คกับ Elysia/SPEC ก่อนวางว่าเป็น prefill หรือ user-input เพราะกระทบ data flow (รอบนี้ invoice เปลี่ยนทิศ 2 ครั้ง: display→input→เอา section Step 2 ออก) — ถ้า clarify แต่แรกจะลดรอบแก้

### Session 016 — 2026-06-05 — WeatherAPI Chart "City Comparison" (mockup + QA UI)
**ทำได้ดี:** mockup chart 3 state (4 เมือง/humidity/empty) คัด design token จาก `chart.css`+`display.css` ให้เข้าธีม glass พาสเทล, rationale ชัด (bar สีเดียวเพราะ metric เดียวกัน เลี่ยง false meaning ว่าคนละประเภท, leader เข้มสื่อ rank โดยไม่ต้องมี badge, footer label ยืนยัน context, dropdown ซ่อนตอน empty); เสนอ **decision point** (sort descending vs pin-order / สีเดียว vs หลายสี) ให้ Owner เลือกแทนเดาเอง; QA UI วัด boundingBox จริงทุก breakpoint, เทียบ mockup vs จริงทีละจุด, re-QA ยืนยัน height 120→150px + badge ดีขึ้นด้วยตัวเลข, screenshot ครบ 7+7 รูป
**ทำพลาด:** QA UI ทั้ง 2 รอบไม่ครอบ **hover tooltip** เลยไม่เจอบั๊ก tooltip โดน clip — เป็นจุดบอดร่วมกับ Aponia (headless ไม่ hover แท่ง) ทำให้บั๊กหลุดไปให้ Owner เจอเครื่องจริง
**แนวทางปรับปรุง:** QA UI ของ component ที่มี chart/interactive overlay ต้องรวม **hover state (tooltip)** ในแผนทดสอบด้วย ไม่ใช่แค่ static layout + responsive — overlay ที่เด้งตอน interact เป็นจุดที่ overflow/z-index พังบ่อย (trigger mouseover บน data point แล้วเช็คว่าแสดงครบไม่ถูกตัด)

### Session 015 — 2026-06-04 — Visual Office: Color Panel (ออกแบบ mockup + QA UI)
**ทำได้ดี:** mockup ละเอียดมาก — คัด design token จาก office.css มาใส่ standalone ให้ screenshot ได้โดยไม่ผูก dependency, ระบุ rationale ทุก pattern (border 2px panel < 3px ห้อง = hierarchy, trigger เป็น CSS shape ไม่ใช้ emoji กัน render เพี้ยน, label ไทย+CSS var ให้ dev อ่าน spec ได้, reset แยก footer + hover แดงกัน destructive), เขียน NOTE ส่ง Mobius ครบทั้ง derive map + localStorage key + reset flow (Mobius implement ได้แทบไม่ต้องถาม); QA UI เทียบ mockup vs จริงทีละจุด + screenshot desktop/mobile + state เปลี่ยนสีจริง, จัด UX เป็น แก้เลย/แนะนำ/อนาคต มี priority
**ทำพลาด:** (1) NOTE เขียน derive `--floor-b` ว่า "lighten 8%" โดยไม่เทียบกับค่า token เดิม `#ccc494` ที่จริงเข้มกว่า base → Mobius ทำตามตัวอักษรเลยได้ทิศผิด (root cause อยู่ที่ spec ของ NOTE เอง); (2) ตอน QA UI ไม่ทันสังเกตเรื่อง floor-b ทิศกลับ — Aponia (ตรวจ code) เป็นคนจับแล้วฝากกลับมาให้ verify ตา
**แนวทางปรับปรุง:** เวลาเขียน spec derive สี ที่ element นั้น "มี token เฉดย่อยเดิมอยู่แล้ว" → ระบุทิศ (lighten/darken) ให้ตรงกับ delta ของ token เดิมจริง ไม่เขียนลอย ๆ; ตอน QA UI ของฟีเจอร์ "สี" ควรเทียบ default ที่ derive ออกกับสภาพห้องเดิมก่อน user แตะด้วย (ไม่ใช่ดูแค่ตอนเปลี่ยนสีแล้ว)

### Session 011 — 2026-06-03 — Visual Office sidebar ซ้าย (ออกแบบ + QA UI)
**ทำได้ดี:** ออกแบบ sidebar ตรง requirement + เลี่ยง AI-tell ครบ (team เป็น row list+divider ไม่ใช่ card ซ้ำ, step badge เล็ก ไม่ pill, border-right บาง 1px, มุมโค้ง ≤12px), เสนอ responsive behavior + toggle ชัด, self-screenshot desktop+mobile, QA UI เทียบ mockup vs implement ทีละจุดละเอียด, note ส่งต่อ Mobius ชัด (checkbox hack→JS จริง, min-height:0, จุด data-binding)
**ทำพลาด:** ใส่ CSS `.sb-feed-item` (2-line block) ใน mockup แต่ไม่ได้สื่อชัดใน note ว่า Mobius ต้อง **เปลี่ยน JS render + ลบ class เก่า** ด้วย → กลายเป็น dead CSS; ตอน QA UI ให้ PASS โดยทักเรื่อง feed ใช้ class เก่าไม่ตรง mockup เป็นแค่ "minor ไม่ต้องแก้ทันที" ทั้งที่จริงเป็น dead code ที่ควรเก็บให้จบ
**แนวทางปรับปรุง:** เมื่อ mockup กำหนด component ที่ต่างจากของเดิม (feed item ใหม่) ให้ระบุใน note ส่งต่อชัดว่า "ต้องเปลี่ยน JS render + ลบ class เก่า" ไม่ใช่แค่วาง CSS ไว้เฉยๆ; และเวลา QA เจอ class ไม่ตรง mockup ให้ flag เป็น cleanup ที่ควรทำ ไม่ใช่ปล่อยผ่าน

### Session 010 — 2026-06-03 — Visual Office (ออกแบบห้อง)
**ทำได้ดี:** ออกแบบห้อง 2 รอบ + self-screenshot ตรวจเอง (Puppeteer), รับ pivot เป็น top-down แล้ว redesign ด้วย **CSS Grid 2×2** จัดตำแหน่งเป๊ะ แก้ปัญหา element ไม่ตรงได้จริง, palette warm retro + pixel border เข้ากับ sprite, QA UI ละเอียด (เทียบ mockup vs implement ทีละจุด + screenshot, จับ bookshelf เยื้อง)
**ทำพลาด:** รอบแรกเลือก isometric (CSS transform แยกชิ้น) → กำแพงไม่ประกบพื้น + ตัวละครหลุดตำแหน่ง ไม่เป็นห้อง ต้องรื้อใหม่ (Owner ทักก่อน)
**แนวทางปรับปรุง:** ก่อนเลือกเทคนิค layout ซับซ้อน (iso ด้วย transform แยกชิ้น) ให้ประเมินความเปราะก่อน — ถ้า element ต้องเล็งพิกัดเองไม่ converge ให้เลือกวิธี deterministic (CSS Grid/top-down) โดยเฉพาะเมื่อ asset (sprite หันหน้าตรง) ไม่เข้ากับ projection

### Session 009 — 2026-06-01 — Team Upgrade (โครงสร้าง — ไม่มีงานออกแบบ)
**อัปเดตโครงสร้างที่ต้องรู้:** มี guide ใหม่ `.claude/skills_folder/design-quality-guide.md` — ก่อนส่ง mockup ให้เช็ค **ส่วนที่ 1 (AI Tells)** เพื่อเลี่ยงดีไซน์ generic (ขอบสีหนาด้านเดียว, gradient text, glassmorphism, การ์ดเหมือนกันเรียงยาว, มุมโค้งเกิน 32px) snippet ถูกฝังใน `Sakura.md` ใต้ Design Constraints แล้ว
**แนวทางปรับปรุง:** ยึดหลัก "ที่ปรึกษา ไม่ใช่กฎ" — Owner เน้นยืดหยุ่นกว่าเป๊ะ ถ้าเลือกใช้ tell ใดด้วยเจตนา ให้ note เหตุผลกำกับ

### Session 008 — 2026-05-30 — Carousel + Chart Container Mockup
**ทำได้ดี:** รับ feedback "เปลี่ยนจาก 1 card เป็น 3 cards visible" แล้วแก้ mockup ได้รวดเร็ว, Chart placeholder ออกแบบให้ทีมเห็นภาพตรงกันได้ดี, self-review ครบทั้ง desktop+mobile ก่อนส่ง
**ทำพลาด:** ออกแบบ Carousel เป็น 1 card visible โดยไม่ถาม Owner ก่อนว่าต้องการกี่ card — ทำให้ต้อง revise และ Mobius ได้รับ spec ผิด
**แนวทางปรับปรุง:** Carousel requirement ที่ต้องถามก่อนออกแบบเสมอ: (1) กี่ card visible พร้อมกัน (2) slide ทีละกี่ card (3) infinite loop ไหม — เพราะคำตอบเหล่านี้เปลี่ยน CSS โครงสร้างทั้งหมด ไม่ใช่แค่ visual

### Session 007 — 2026-05-30 — Search Box + Pinned Display Mockup + UI Review
**ทำได้ดี:** mockup รอบแรกถูกทิศทาง Owner ทันที (pastel lofi blend กับ data-board เดิมได้สนิท), รับ feedback "ย้าย pin ไป data-board" แล้วแก้ mockup ได้ครบทุก element (ลบออกจาก search bar, เพิ่ม section ใหม่ใน data board, แก้ empty state text), UI review จับ vendor prefix ขาด (-webkit-backdrop-filter) ได้ตรงจุด, เปรียบเทียบ CSS value exact กับ mockup ทุก property
**ทำพลาด:** ไม่มีข้อพลาดหลักใน session นี้
**แนวทางปรับปรุง:** การตรวจ vendor prefix (-webkit-, -moz-) บน properties อย่าง backdrop-filter, transform, animation ควรเป็น checklist item ประจำใน UI review — เพราะ Mobius มักลืม copy prefix จาก component อื่น

### Session 006 — 2026-05-30 — WeatherAPI Card Mockup + UI Review
**ทำได้ดี:** mockup pastel lofi palette ตรงทิศทาง Owner ทันที, อัปเดต 7 weather state background ครบ (warm→cool ตาม condition), UI review 2 รอบจับ emoji missing + cardinal direction missing ได้ครบ, วิเคราะห์ Bootstrap CSS conflict + ตรวจ stylesheet load order ใน angular.json ได้ละเอียด
**ทำพลาด:** ไม่มีข้อพลาดหลักใน session นี้
**แนวทางปรับปรุง:** การ verify stylesheet load order ใน angular.json เมื่อ integrate third-party CSS (Bootstrap ฯลฯ) เป็น pattern ดีที่ควรทำเป็น checklist ประจำ — เพิ่มเข้า UI review checklist ได้เลย

### Session 005 — 2026-05-29 — Landing Page Review Component
**ทำได้ดี:** แก้ palette จาก warm coffee → minimal white-black-yellow ได้สะอาดมาก ไม่มีสีเก่าหลงเหลือเลย, UI review ครั้งนี้อ่าน mockup และ template เปรียบเทียบได้ละเอียด จับ Email field หาย + avatar color ได้ครบ
**ทำพลาด:** mockup รอบแรกเลือก warm coffee palette โดยไม่ถาม Owner ก่อนว่าต้องการ tone แบบไหน ทำให้ต้อง revise ซ้ำ
**แนวทางปรับปรุง:** ถ้า Owner ไม่ได้ระบุ color direction ชัดเจน ควรถาม Owner ก่อน (เช่น "ต้องการ warm tone หรือ minimal/monochrome?") อย่าเดาเอง เพราะ color theme เปลี่ยนทีหนึ่งต้อง revise CSS ทั้งหมด

### Session 004 — 2026-05-27 — Team Dashboard
**ทำได้ดี:** ออกแบบ mockup แบบ Bento Grid Asymmetric ได้ถูกทิศทาง, แก้ feedback Owner ครบ 6 ข้อรวดเดียว, UI review จับ emoji missing, relation-badge class ผิด, legend ขาด items ได้ครบ, เปรียบเทียบ mockup vs Angular HTML ได้ละเอียด
**ทำพลาด:** ไม่ได้อ่านไฟล์ TS ระหว่าง UI review ทำให้ต้องบอกว่า "ต้องตรวจ card order เอง" แทนที่จะตรวจให้เลย
**แนวทางปรับปรุง:** UI review ควรอ่าน component.ts ด้วยเสมอ — card order ใน bento grid ขึ้นอยู่กับลำดับของ data array ใน TS ไม่ใช่แค่ HTML

### Session 2026-05-26 — Plant Status Rework (Mockup)
**ทำได้ดี:** mockup ครบ layout ชัดเจน Owner approve ทันที, color palette สะอาดอ่านง่าย, แสดง 3 states ครบ (Online/Offline/Critical), UI review รอบสองละเอียดและเปรียบ mockup กับ production ได้ตรงจุด
**ทำพลาด:** mockup มี JS toggle ทั้งที่ไม่จำเป็น — mockup มีหน้าที่แค่แสดง visual design ให้ approve ไม่ใช่ prototype ที่ interactive
**แนวทางปรับปรุง:**
1. mockup ครั้งต่อไปทำเป็น static HTML+CSS ล้วนๆ ไม่ต้องใส่ JS ใดๆ
2. ก่อนออกแบบ mockup ควรค้นหา dashboard ที่ดีจากแหล่งอ้างอิง (Dribbble, Tailwind UI, real-world dashboard) เพื่อใช้เป็น reference พัฒนา design sense ไม่ออกแบบจาก sense อย่างเดียว

<!-- ตัวอย่าง (ลบออกได้เมื่อมี log จริง)
### Session 2026-05-26 — Plant Status Dashboard
**ทำได้ดี:** mockup ชัดเจน Owner เข้าใจทันที, แบ่ง priority feedback ดี
**ทำพลาด:** เสนอ design ที่ซับซ้อนเกิน scope
**แนวทางปรับปรุง:** ตรวจ requirement ก่อนออกแบบ อย่าเพิ่ม feature ที่ไม่ได้ขอ
-->

