# Checklists — Dashboard Dev Team

> **นี่คือ single source of truth ของทุก checklist ในทีม** — ห้าม duplicate ไปไว้ที่อื่น (CLAUDE.md ให้ชี้มาที่นี่)

---

## Task Complete Checklist
> ใช้ก่อนบอก Owner ว่า task เสร็จ
- [ ] กำหนด scope งานทั้งหมดชัดเจนตั้งแต่ต้น ก่อนเริ่มทำ
- [ ] deliverable ทุกอย่างที่วางแผนไว้ถูกสร้าง / แก้ไขครบแล้ว
- [ ] ตรวจไขว้กับ requirement ว่าไม่มีอะไรตกหล่น (QA crosscheck)
- [ ] Owner approve ก่อน finalize

---

## Session End Checklist
> ใช้ก่อนปิด session
- [ ] ไฟล์ทุกไฟล์ที่ตกลงจะทำใน session นี้ครบหรือยัง?
- [ ] อัปเดต memory (`MEMORY.md` + memory files) แล้วหรือยัง?
- [ ] feedback_log ของทุก agent ที่ทำงานใน session นี้อัปเดตแล้วหรือยัง? — **รวม `Elysiafeedback_log.md` ของ Elysia เองด้วย** (เคยค้าง 7 sessions เพราะลืมตัวเอง)
- [ ] feedback_log หมุนเวียน 2 ชั้นแล้วหรือยัง? — "Log ล่าสุด" เกิน 3 sessions → กลั่น entry เก่าสุดเป็นกฎเข้า "กฎที่กลั่นแล้ว" แล้วย้าย entry ไป `archive/{ชื่อ}feedback_archive.md` (กัน log บวมกิน context ต่อ spawn)
- [ ] `session-log.md` เพิ่มแถว session นี้แล้วหรือยัง? + ถ้ามีบทเรียนถาวร กลั่นเข้า `CLAUDE.md > บทเรียนสำคัญ`
- [ ] `CLAUDE.md > Session Log > ล่าสุด` อัปเดตเป็น session นี้แล้วหรือยัง?
- [ ] `user_profile.md` มี insight ใหม่เกี่ยวกับ Owner ให้เพิ่มไหม? (ไม่ต้องเพิ่ม session log ที่นั่น — ชี้ `session-log.md` ที่เดียว)
- [ ] **งานจบครบ:** ลบ `task-context.md` + `handoff.md` แล้วหรือยัง?
- [ ] **งานค้างข้าม session:** เขียน `.claude/docs/handoff.md` (ไฟล์เดียว เขียนทับได้ — ตาม `handoff_template.md`) แล้วหรือยัง? + คง `task-context.md` ไว้ (ถ้ามี) โดยให้ handoff **ชี้**ไปที่มัน ไม่ก๊อปซ้ำ

> 🗄️ `session-comments.md` retire ตั้งแต่ S024 / ระบบ handoff ปรับเป็น**ไฟล์เดียว `handoff.md`** ตั้งแต่ S024 (handoff = ข้าม session สำหรับ Elysia / task-context = ใน task สำหรับ subagent) — ไฟล์ราย session เก่า (handoff_session009-013) อยู่ `.claude/docs/archive/`

---

## Session Start Checklist
> ใช้ตอนเปิด session ใหม่ ก่อนเริ่มงานใดๆ
- [ ] มี `.claude/docs/handoff.md` ไหม? → ถ้ามี: อ่าน + resume งานตามนั้น → เมื่อเริ่มงานต่อแล้ว**ลบไฟล์ทันที**
- [ ] มี `.claude/docs/task-context.md` ไหม? → ถ้ามี = task หลาย step ค้างอยู่ — ใช้ต่อ อย่าสร้างใหม่ทับ
