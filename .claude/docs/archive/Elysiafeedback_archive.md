# Archive - Elysiafeedback_log.md

> Entries older than the 3 most recent sessions - moved here in S024 (2-tier restructure).
> Distilled rules from these entries live in the main log section 'kot-thi-klan-laew'.

### Session 022 — 2026-06-09 — ปรับ UX/UI 4 จุด (StoreSalesReturnDoc) [backfill]
**ทำได้ดี:** grill 5 คำถามก่อนเริ่ม, ซอย A-D checkpoint, แก้เพิ่มตามที่ Sakura จับ bug นอก brief (step1 searchbox), ขอโทษ + ถอนคำกล่าวหาทันทีเมื่อรู้ความจริง
**ทำพลาด:** **ด่วนสรุปว่า Mobius ทำเกิน scope + รายงานผิด** จาก diff ที่ไม่อยู่ใน task-context — ทั้งที่ Owner แก้ไฟล์เองระหว่าง session (บทเรียนใหญ่สุดของ session)
**แนวทางปรับปรุง:** เจอ discrepancy ให้ surface กลางๆ + ถามก่อนฟันธงว่าใครผิด (Owner/มืออื่นแก้ working tree ได้เสมอ); ไม่ต้อง re-Read ทุก step — เชื่อ QA จับ (ประหยัด token)

### Session 021 — 2026-06-08 — Font scale 4 ระดับ (StoreSalesReturnDoc) [backfill]
**ทำได้ดี:** grill 9 ข้อจน design ชัดก่อน code, ใช้ task-context รอบ 2 สำเร็จ (Mobius cold spawn 4 รอบต่องานได้ไม่ต้อง re-pass), จับ ironic a11y (rem หดต่ำกว่า 12px ที่ scale เล็กสุด) แล้วกลั่นเป็นกฎ floor 0.75rem
**ทำพลาด:** ไม่เจอ mistake เด่นใน process
**แนวทางปรับปรุง:** ฟีเจอร์ scaling ทุกชนิดต้องคิด "ค่าที่ extreme ต่ำสุดเหลือเท่าไร" ตั้งแต่ grill

### Session 020 — 2026-06-07 — learn.html SalesDoc + skill learn-html-builder [backfill]
**ทำได้ดี:** grill 8 ข้อก่อนเริ่ม, อ่านโค้ดจริงทุก section ก่อนเขียนสื่อ (ไม่เดา), กลั่น pattern เป็น skill ใหม่เพื่อ reuse
**ทำพลาด:** design สื่อยังมี AI-tell จน Owner ทัก (ยอมรับได้แต่ควรเบากว่านี้แต่แรก)
**แนวทางปรับปรุง:** งาน doc ภายในก็ใช้มือเบาตั้งแต่ first draft — Owner ตาไวเรื่อง generic AI look ทุกบริบท

### Session 019 — 2026-06-06 — SalesDoc QA + Polish [backfill]
**ทำได้ดี:** เปิดใช้ระบบ task-context.md ครั้งแรกแก้ subagent cold-start ได้จริง, QA Aponia+Sakura parallel เจอ 14 จุด → จัด fix list ให้ Mobius แก้รวดเดียว, Owner verify เครื่องจริงก่อนปิด
**ทำพลาด:** ไม่บันทึก Elysiafeedback_log ตัวเอง
**แนวทางปรับปรุง:** dead comment ("ทำแล้ว" แต่ไม่ได้ทำ) เป็น signal ที่ QA ต้องจับ — เพิ่มความระวังตอน review รายงาน subagent

### Session 018 — 2026-06-06 — SalesDoc Coding ครบระบบ [backfill]
**ทำได้ดี:** ซอย Mobius 7 step (A-F + D.5 รื้อ Bootstrap) ทุก step build เขียว + checkpoint, ปรับแผนกลางทางตามคำถาม Owner (รื้อ custom CSS → Bootstrap จริง) โดยไม่เสีย momentum
**ทำพลาด:** spawn Mobius cold ทุกรอบแล้ว re-pass context เปลือง token + เกิด false-alarm (proxy.conf.json "ยังไม่ทำ" ทั้งที่ทำแล้ว) — ตอนนั้นยังไม่มีเครื่องมือแก้
**แนวทางปรับปรุง:** เป็นที่มาของระบบ task-context.md (สร้างใช้จริง S019) — งานหลาย spawn ต้องมี digest กลางเสมอ

### Session 017 — 2026-06-05 — SalesDoc วางแผน + ออกแบบ (SPEC + Mockup 3 step) [backfill]
**ทำได้ดี:** เขียน SPEC.md จาก 3 API จริงก่อนออกแบบ, ตัดสินใจ design สำคัญร่วม Owner ชัด (invoice = user input Step 3, ตัด section ซ้ำซ้อน), Sakura verify ทุก mockup ด้วย Read screenshot ก่อน report
**ทำพลาด:** ไม่เจอ mistake เด่น (workflow design-first ราบรื่น)
**แนวทางปรับปรุง:** โปรเจคใหม่ที่มี API จริง — เขียน SPEC ก่อน mockup ช่วยให้ทุก step หลังอ้างที่เดียว ใช้ pattern นี้ต่อ

### Session 016 — 2026-06-05 — WeatherAPI Chart "City Comparison" (workflow เต็ม + spawn ทีม)
**ทำได้ดี:** (1) **ถาม requirement ครบก่อนลงมือ** ด้วย AskUserQuestion หลายชั้น (งานต่อ / chart type / metrics / integration / ใครทำ / sort / สี) ไม่เดา; (2) ทำตาม **workflow เต็ม** ตามที่ Owner เลือก — spawn Sakura→Owner approve→Mobius (ซอย 4a/4b/4c รอ checkpoint ทุก step)→Aponia+Sakura QA parallel→rework→re-QA; (3) **start dev server เองครั้งเดียว** กัน QA 2 ตัวแย่ง port 4200 + เช็ค API key ก่อน spawn QA (กัน QA โดน block ตั้งแต่ต้น); (4) **ให้ Owner verify เครื่องจริงก่อน declare done → Owner เจอ tooltip clip ที่ QA headless ไม่เจอ** (บทเรียน S011 ได้ผลอีกครั้ง — verify จริงสำคัญกว่า QA ผ่าน); (5) แก้ stale comment + tooltip bug เอง (CSS บรรทัดเดียว เข้าใจ flow ครบ) ไม่ over-spawn; (6) relay QA หา decision (fix scope) ให้ Owner เลือก, update office_status/activity ทุก transition
**ทำพลาด:** (1) รอบแรกเรียก **Bash tool ด้วย PowerShell syntax** (`Select-Object`) → exit 127 สลับ shell ผิด; (2) **ไม่ได้กำชับ QA ให้เทส hover tooltip ตั้งแต่ brief แรก** → ปล่อยให้ tooltip clip bug หลุดถึง Owner (ทั้ง Aponia+Sakura headless ไม่ hover); (3) brief Mobius เรื่อง dropdown ใช้ `[ngModel]` ตั้งแต่แรกได้ แต่ไม่ระบุ — ปล่อยให้ Mobius ใช้ `[value]` จน desync (แม้สุดท้าย QA จับได้)
**แนวทางปรับปรุง:** (1) **Bash tool = bash, PowerShell tool = PS** — อย่าปน cmdlet ใน Bash (dedicated helper `.ps1` เรียกผ่าน `powershell -File` ใน Bash ได้ แต่ inline ต้องใช้ PowerShell tool); (2) เวลา brief QA ของ component ที่มี **chart/overlay** ต้องสั่งเทส **hover/tooltip** ด้วย ไม่ใช่แค่ layout+responsive — interactive overlay เป็นจุด overflow/z-index พังบ่อย; (3) งานที่มี native form control ใน `@if`/`@for` ควร brief Mobius ใช้ `ngModel` แต่ต้น (เลี่ยง [value] desync); (4) **SendMessage ไม่มีใน env นี้** — continue agent ต้อง spawn ใหม่ (ไฟล์ใน disk เป็น context ต่อเนื่องได้ดีพอ)

### Session 014 — 2026-06-04 — ปรับ layout ห้อง (1:3 + ประตู 2/3) + role sign + helper set-status + แก้บั๊ก PS5.1
**ทำได้ดี:** (1) **ถาม requirement กำกวมก่อนลงมือ** (AskUserQuestion: ปรับด้านไหน / คุมความสูงรวมหรือบีบพื้น) ไม่เดา; (2) **verify ด้วย Playwright วัด boundingBox เป็นตัวเลข** ก่อน report ทุกครั้ง (อัตราส่วน 1:3.2, ประตู 0.65, พรม center off=0.0px ทั้ง desktop/mobile) — แม่นกว่าตาเปล่า; (3) **ซื่อสัตย์ตอน Owner เจอ "status ค้าง Step 1"** — ไม่โทษโค้ด ยอมรับว่าตัวเองลืมเขียน office_status.json (office.js polling ถูกอยู่แล้ว) แล้วแก้ที่ต้นเหตุด้วย `set-status.ps1`; (4) **debug บั๊ก PS5.1 อย่างมีระบบ** — isolate (scriptblock vs file), bisect (minimal ascii → +Thai comment), จับ root cause Thai-in-source ได้ แล้วแก้ด้วย ASCII-only source; (5) ให้ Owner verify เครื่องจริงทุก checkpoint + dogfood helper ตัวเอง; (6) อัปเดต status realtime ด้วย set-status ทุก step (หลังแก้บทเรียน)
**ทำพลาด:** (1) **ช่วงแรกลืมเขียน office_status.json ใหม่แต่ละ step** (อัปเดตแต่ activity log) → status ค้างที่ "Step 1", Owner เป็นคนจับได้ — หลุดกฎ Status Reporting ใน CLAUDE.md เอง; (2) เขียน `set-status.ps1` รอบแรกมี **ภาษาไทยใน source** (comment-based help) ทำ PS5.1 parse เพี้ยน เสียเวลา debug หลายรอบกว่าจะจับได้
**แนวทางปรับปรุง:** (1) ทุก step transition ต้องเรียก **`set-status.ps1`** อัปเดต office_status.json คู่กับ `log-activity.ps1` เสมอ — 2 ไฟล์ต้อง sync (status จาก json, feed จาก jsonl); (2) เขียน **PowerShell `.ps1` source เป็น ASCII ล้วน** บน PS5.1 (ไทยใน source = parser เพี้ยนเงียบๆ) — ข้อมูลไทยส่งผ่าน runtime arg; ดู memory [[feedback_ps51_ascii_source]]; (3) สัญญาณ "logic ถูกแต่ไม่ทำงาน" + debug line ไม่ print แต่บรรทัดท้าย print = สงสัย encoding/parser ทันที

### Session 012 — 2026-06-03 — ทดสอบ visual office + ปรับ UI (sidebar 30% + feed 5/drawer 10)
**ทำได้ดี:** (1) **ให้ Owner verify บนเครื่องจริงทุก step ก่อน declare done** — แก้บทเรียน S011 สำเร็จ (sidebar 30% / feed+drawer ผ่านตาเครื่อง Owner ก่อนปิด); (2) ถาม requirement ที่กำกวมด้วย AskUserQuestion ก่อนลงมือ (ทิศ slide / วิธีปิด modal / จะ design ก่อนไหม) — ไม่เดา; (3) ตัดสินใจ **ทำเองไม่ spawn agent** สำหรับงานแก้ 3 ไฟล์ขนาดเล็ก (ประหยัด context Owner + เร็วกว่า) แต่ยังซอย 3 step รอ checkpoint ตามกฎ; (4) `node --check` ยืนยัน JS syntax ก่อน report; (5) refactor DRY (`renderFeedItems` ใช้ร่วม sidebar+drawer) + a11y เกินที่ขอ (focus management, Esc, reduced-motion) แต่บอก Owner ชัดว่าเพิ่มอะไร
**ทำพลาด:** ตอน log activity ครั้งแรก (sidebar 30%) เห็น console แสดงภาษาไทยเป็น mojibake แล้ว **ตกใจคิดว่าไฟล์เสีย** เลยเสียจังหวะตรวจซ้ำ — ที่จริงไฟล์ UTF-8 ถูกต้อง (Read tool ยืนยัน) แค่ console rendering ของ `powershell.exe` ผ่าน Bash เพี้ยนเอง
**แนวทางปรับปรุง:** console output ภาษาไทยจาก `powershell.exe` (ผ่าน Bash, codepage ไม่ใช่ UTF-8) **mojibake เป็นปกติ ≠ ไฟล์เพี้ยน** — เวลาตรวจเนื้อหาไฟล์ JSONL/ไทย ให้ใช้ **Read tool** (decode UTF-8 ตรง) ไม่ใช่ `Get-Content` ใน console; helper `log-activity.ps1` เขียน UTF-8 no BOM ถูกอยู่แล้ว ไว้ใจได้

### Session 011 — 2026-06-03 — แก้บั๊กเวลา feed + ขยาย Dashboard sidebar
**ทำได้ดี:** แก้บทเรียน S010 สำเร็จ — สร้าง `log-activity.ps1` ใช้ `Get-Date` เวลาจริง แทน hardcode timestamp (ทุก log/status รอบนี้เป็นเวลาจริง), ถาม requirement ชัดทุก step + ซอย checkpoint กลุ่มตามที่ Owner เลือก, spawn Aponia+Sakura QA parallel ก่อน report, แก้ QA เล็กเองตรงจุด (MAJOR collapse + dead CSS + line-clamp) แล้วส่ง re-verify
**ทำพลาด:** (1) **declare "ส่งมอบ/เสร็จสมบูรณ์" โดยอิง QA headless อย่างเดียว แต่ Owner เปิดจริงเจอ "ไม่มีข้อมูล/feed ว่าง"** — ข้าม "Owner verify ก่อน finalize" ในสภาพจริง (Aponia ผ่านบน http server ตัวเอง ≠ เครื่อง Owner); (2) screenshot สุดท้ายเขียนไฟล์ไม่ได้ (permission/OneDrive lock) เลยอ้างภาพเก่าแทน — ไม่ได้ยืนยันภาพจริงหลังแก้ก่อนบอกเสร็จ
**แนวทางปรับปรุง:** งานที่ Owner ต้องเปิดดูเอง (เช่น office.html ที่ fetch ข้อมูล) **ต้องให้ Owner ยืนยันว่าเปิดได้จริงในเครื่อง/วิธีของ Owner ก่อน declare done เสมอ** — QA runtime เป็น necessary แต่ไม่ sufficient; และต้อง brief Owner ชัดว่าต้องเปิดผ่าน server (file:// = ไม่มีข้อมูล)

### Session 010 — 2026-06-03 — Visual Office (Phase 1+2)
**ทำได้ดี:** spawn Aponia+Sakura QA ก่อน report Owner ครบ (**แก้ pattern S008 สำเร็จ!**), หยุดถาม Owner ทุก transition, รวม QA findings + ตัดสินใจ fix list ชัดเจน, verify ภาพ final เอง (Chrome headless) ก่อนประกาศจบ, ออกแบบ data layer single-writer (ลด race/token), เขียน pixelate.py แปลง sprite 8-bit
**ทำพลาด:** เขียน timestamp ใน `activity_log`/`office_status` เป็น**เวลาสมมติ (hardcode 15:05...19:00)** ไม่ใช่เวลาจริง → เวลาใน Last Activity feed ไม่ตรงเวลาจริง (Owner สังเกตเห็น, ยกไป S011)
**แนวทางปรับปรุง:** เวลา log/update status ต้องใช้**เวลาจริงจากระบบเสมอ** (PowerShell `Get-Date -Format "yyyy-MM-ddTHH:mm:sszzz"`) ห้าม hardcode timestamp

### Session 001 — 2026-05-26 — Team Setup
**ทำได้ดี:** cross-check ไฟล์ทั้งหมดก่อน finalize, จับ typo และ path ผิดได้ครบ, ประสานการตัดสินใจจาก Owner ได้ชัดเจน (pptx → HTML, QA condition, Elysia identity)
**ทำพลาด:** ยังไม่มี mistake ใน session นี้ (เป็น setup session)
**แนวทางปรับปรุง:** session หน้าที่มี task จริง ต้องยืนยัน requirement ให้ครบก่อน spawn agent ใด

### Session 008 — 2026-05-30 — Carousel + Chart Placeholder
**ทำได้ดี:** แก้ overflow bug ได้เองทันทีหลังวิเคราะห์โดยไม่ต้องรอ QA, ระบุ root cause ชัดเจน (Bootstrap default CSS conflict), handoff + feedback log ครบทุก agent
**ทำพลาด:** ไม่ spawn QA ก่อน Owner ทดสอบจริง — Aponia ควรวิ่ง QA หลัง Mobius implement เสร็จตาม workflow แต่ session นี้ข้ามขั้นนั้นไป
**แนวทางปรับปรุง:** หลัง Mobius implement เสร็จต้อง spawn Aponia+Sakura ตรวจก่อน report Owner เสมอ โดยเฉพาะถ้า feature ซับซ้อน (carousel, custom animation)

### Session 005 — 2026-05-29 — Landing Page Review Component
**ทำได้ดี:** หยุดถาม Owner ก่อนทุก transition (mockup → approve → code → review) ครบทุกขั้น, ตรวจไฟล์จริงหลัง sub-agent ทุกตัวเสร็จ, รวม findings จาก Aponia+Sakura ก่อนนำเสนอ Owner ได้ชัดเจน, จับ Email field ที่หายเองได้ก่อน review agents รายงาน
**ทำพลาด:** อ่านผิดโฟลเดอร์ตอนเริ่ม (ไปที่ plant_status_rework แทน landing-page-pj) ต้องให้ Owner แก้ให้
**แนวทางปรับปรุง:** ก่อนเริ่ม session ให้ถามหรือตรวจยืนยันชื่อโฟลเดอร์ที่ต้องการทำงานให้ชัดเจนก่อน อย่าเดาจาก context เดิม

### Session 002 — 2026-05-26 — Plant Status Rework
**ทำได้ดี:** ยืนยัน requirement ครบก่อนเริ่ม, แสดง plan step ชัดเจน, spawn Sakura+Aponia parallel ถูกต้อง, บันทึก feedback ทันที
**ทำพลาด:** ข้ามขั้น — หลัง Owner approve mockup ควรถาม Owner ก่อนส่ง Mobius, หลัง Mobius เสร็จควรถาม Owner ก่อนส่ง review — แต่ทำเองทั้งหมดโดยไม่หยุด
**แนวทางปรับปรุง:** ทุก transition ระหว่าง step ต้องหยุดรายงาน Owner และรอ approve ก่อนเสมอ ไม่ว่า step จะดูเล็กแค่ไหน

<!-- ตัวอย่าง (ลบออกได้เมื่อมี log จริง)
### Session 2026-05-26 — Plant Status Dashboard
**ทำได้ดี:** ยืนยัน requirement ครบก่อนส่งทีม, แสดง step ชัดเจน
**ทำพลาด:** declare done ก่อนตรวจ scope ครบ
**แนวทางปรับปรุง:** ต้อง crosscheck deliverable กับ requirement ทุกครั้งก่อนบอก Owner ว่าเสร็จ
-->

