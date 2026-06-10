# Elysia — Feedback Log

---

## Format การบันทึก

```
### Session [วันที่] — [ชื่องาน]
**ทำได้ดี:** ...
**ทำพลาด:** ...
**แนวทางปรับปรุง:** ...
```

---

## กฎที่กลั่นแล้ว ⭐ (อ่านก่อนเริ่มงานทุก session — กลั่นจากทุก session)
> โครงสร้าง 2 ชั้น (S024): ชั้นนี้ = กฎใช้งาน / "Log ล่าสุด" เก็บเรื่องเต็ม 3 sessions — entry เก่ากว่าอยู่ `archive/Elysiafeedback_archive.md` (หมุนเวียนตอน Session End)

### Requirement & Workflow
- ถาม requirement จนชัด + หยุดทุก transition รอ Owner — แม้ step ดูเล็ก (S002)
- ยืนยันชื่อโฟลเดอร์/โปรเจคก่อนเริ่ม อย่าเดาจาก context เดิม (S005)
- grill ก่อนงาน coding เสมอ; งานอื่นถาม Owner ว่าจะ grill ไหม (S019+)
- โปรเจคใหม่ที่มี API จริง: เขียน SPEC ก่อน mockup — ทุก step หลังอ้างที่เดียว (S017)
- spawn Aponia+Sakura QA ก่อน report Owner เสมอ ห้ามข้าม (S008)
- Owner verify เครื่องจริงก่อน declare done — QA headless ≠ เครื่อง Owner (hover/tooltip, encoding, empty-data) (S011/S016)

### Spawn & Brief
- งานหลาย spawn ต้องมี `task-context.md` + ฝัง pointer "อ่านก่อนเริ่ม" ในทุก spawn prompt (S018/S019)
- brief QA ของ component มี chart/overlay: สั่งเทส hover/tooltip ด้วย; brief Mobius เรื่อง native control ใน `@if`/`@for` ให้ใช้ `ngModel` แต่ต้น (S016)
- เจอ discrepancy ใน working tree: surface กลางๆ + **ถามก่อนกล่าวหา subagent** (Owner/มืออื่นแก้ได้); ไม่ re-Read ทุก step — เชื่อ QA ประหยัด token (S022)

### เครื่องมือ & สถานะ
- timestamp จริงจาก `Get-Date` ผ่าน `log-activity.ps1`/`set-status.ps1` — 2 ไฟล์สถานะต้อง sync ทุก transition (S010/S014)
- `.ps1` source ASCII ล้วน — ไทยใน source ทำ PS5.1 parser ข้าม code เงียบ; ไทยส่งผ่าน runtime arg (S014)
- Bash tool = bash / PowerShell tool = PS — ห้ามปน cmdlet (S016)
- console mojibake ไทยจาก powershell.exe ≠ ไฟล์เพี้ยน — ยืนยันด้วย Read tool ก่อนตกใจ (S012)

### ระบบทีม (meta)
- งาน doc ภายในก็ใช้มือเบา AI-tell ตั้งแต่ first draft — Owner ตาไวทุกบริบท (S020)
- ระบบ "ไม่ถูกใช้" ≠ "ไม่จำเป็น" — เช็คก่อนว่าเงื่อนไขที่มันออกแบบมารองรับเคยเกิดจริงไหม (S024 handoff)
- audit ไฟล์ระบบทุก ~10 sessions; กฎ "ทุก agent" นับ Elysia ด้วยเสมอ; เลิกระบบต้องประกาศ ไม่ปล่อยตายเงียบ (S024)

---

## Log ล่าสุด (เก็บ 3 sessions)

### Session 024 — 2026-06-10 — Audit ระบบทีม (.claude) + ปรับไฟล์ให้สอดคล้องทั้งระบบ
**ทำได้ดี:** มองภาพรวมก่อนแก้ (อ่านครบทุกไฟล์ → จัดกลุ่มจุดอ่อน 4 กลุ่ม → เสนอแผนเป็นชุด) ไม่แก้ทีละไฟล์ isolated, ถาม Owner 4 ข้อตัดสินใจก่อนลงมือ (fast path / retire / dedupe / cleanup), verify เนื้อหาไทยด้วย Read tool หลัง rewrite ด้วย script (บทเรียน S012), เขียนกลับ UTF-8 no BOM ตามมาตรฐาน
**ทำพลาด:** (1) จุดที่ audit เจอส่วนใหญ่เป็น mistake สะสมของ Elysia เอง — โดยเฉพาะ Elysiafeedback_log ค้าง 7 sessions เพราะ checklist เขียนว่า "ทุก agent" แล้วตีความไม่รวมตัวเอง; (2) **เหมารวม retire handoff จากสัญญาณ "ไม่ถูกใช้"** โดยไม่แยกว่ามันแก้คนละปัญหากับ task-context (ข้าม session vs ใน task) — ที่ไม่ถูกใช้เพราะช่วงนั้นงานจบใน session ตลอด ไม่ใช่เพราะไม่จำเป็น; Owner ทักจึงฟื้นเป็นระบบไฟล์เดียว
**แนวทางปรับปรุง:** (1) ไฟล์ระบบควร audit เป็นรอบๆ (ทุก ~10 sessions) กัน doc-practice drift สะสม; (2) กฎที่เขียนว่า "ทุก agent" ให้นับ Elysia ด้วยเสมอ; (3) เลิกระบบไหนต้องประกาศใน checklist/เอกสารทันที อย่าปล่อยตายเงียบ; (4) ก่อนตัดสินว่าระบบ "ตาย" ให้ถามก่อนว่า **เงื่อนไขที่มันออกแบบมารองรับเคยเกิดขึ้นจริงไหม** — ความถี่การใช้ ≠ ความจำเป็น

> ⚠️ S017-S023 เป็น backfill ย้อนหลังตอน S024 (log ตัวเองเคยค้างที่ S016) — สรุปย่อจาก `session-log.md`; entry S017-S021 อยู่ใน archive

### Session 023 — 2026-06-09 — SweetAlert2 popup step3 (StoreSalesReturnDoc) [backfill]
**ทำได้ดี:** grill scope/architecture/theme ครบก่อนเริ่ม, คุม invariant "ไม่แตะ store" ตลอดงานรวมถึงตอน Owner เลือกตัด nice-to-have, ซอย Mobius 3 step + QA parallel ครบ, กลั่น effect()-side-effect pattern เป็นบทเรียนถาวรเข้า CLAUDE.md
**ทำพลาด:** ไม่บันทึก Elysiafeedback_log ของตัวเอง (เพิ่งมา backfill S024)
**แนวทางปรับปรุง:** Session End Checklist ข้อ feedback_log ต้องรวมตัวเองเสมอ

