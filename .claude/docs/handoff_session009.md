# Handoff — Session 009 — Team Upgrade (Impeccable + Structure Review)

> ใช้ไฟล์นี้เมื่อ session จบแต่งานยังไม่เสร็จ ให้ Elysia เป็นคนเขียน

---

## สถานะปัจจุบัน

**งานที่ทำใน Session 009:** อัปเกรดโครงสร้างทีม — ผสาน Impeccable + review จุดอ่อนทีม + แก้ 🔴 ครบ
**อยู่ที่ Step:** งาน Session 009 เสร็จสมบูรณ์ — เหลือเฉพาะ improvement 🟡/🔵 ที่ defer ไว้ (ไม่ใช่งานค้าง แต่เป็น backlog ปรับปรุงทีม)
**Agent ที่รับผิดชอบอยู่:** — (ไม่มีงานค้างเร่งด่วน)

---

## สิ่งที่ทำเสร็จแล้ว (Session 009)

- ✅ ศึกษา Impeccable (pbakaus) ถึง source จริง — SKILL.md, reference files, anti-pattern registry
- ✅ สร้าง `.claude/skills_folder/design-quality-guide.md` — ดัดแปลงให้เข้ากับ Angular + Bootstrap + minimal
- ✅ ฝัง snippet "AI Tells (advisory)" เข้า 3 agent: Sakura (ดีไซน์) / Mobius (โค้ด) / Aponia (QA)
- ✅ **แก้ 🔴 #1** — Aponia model ID `claude-Opus-4-7` → `claude-opus-4-8` (root cause ที่ทำให้ QA spawn ไม่ได้ S006/S008)
- ✅ **แก้ 🔴 #2** — institutionalize Bootstrap CSS Override + vendor prefix checklist เข้า Aponia.md + Mobius.md (เคยค้างใน retrospective)
- ✅ **แก้ 🔴 #3** — รวม checklist เป็น single source ที่ `checklist.md`, CLAUDE.md ชี้มาแทน, ลบ section เละซ้ำใน Aponia.md
- ✅ บันทึก memory `feedback_impeccable_advisory.md` (หลัก "ที่ปรึกษา ไม่ใช่กฎ")

---

## สิ่งที่ยังค้างอยู่ (Todo Next Session) — Backlog ปรับปรุงทีม

### 🟡 ควรพัฒนา
- [ ] **Fallback protocol เมื่อ agent ล่ม** — กำหนดว่าเมื่อ spawn agent ไม่ได้ ต้องแจ้ง Owner + หยุด ไม่ใช่ให้ Elysia แก้เอง/เขียนแทนจน mask ปัญหา (เกิดใน S008)
- [ ] **Workflow "lightweight track"** — workflow.md ปัจจุบันรองรับเฉพาะงาน "สร้าง dashboard component" งานเล็ก/ไม่ใช่ UI (เช่น แก้ config, review โครงสร้าง อย่าง S009) ไม่มี flow รองรับ + ควรกำหนดเพดานรอบ loop "ไม่ผ่าน → วนซ้ำ" + escalation
- [ ] **กลไกย้าย feedback ขึ้นที่ถาวร** — feedback_log โตไม่จำกัด ทุก agent อ่านทุกครั้ง ควรมี process: feedback ที่เกิดซ้ำ → ย้ายขึ้น agent.md → archive log เก่า
- [ ] **Build/test gate ใน workflow** — เพิ่ม step "build ผ่าน" เป็นทางการใน workflow.md (ตอนนี้กระจายอยู่ใน DoD ของ Mobius)

### 🔵 บันทึกความเสี่ยง
- [ ] **Memory 2 ระบบทับซ้อน** — harness memory (`MEMORY.md`) กับ project docs (`user_profile.md`, feedback logs) เก็บข้อมูลซ้ำ เสี่ยง drift — ควรกำหนดว่าอะไรเป็น source of truth ของอะไร
- [ ] **Playwright ยังไม่ verify** — Sakura screenshot self-review เป็นขั้นบังคับ แต่ยังไม่ยืนยันว่า Playwright ติดตั้งใน environment
- [ ] **Mobius ไม่มี WebSearch/WebFetch** — หา doc Angular/Bootstrap เองไม่ได้ ต้องผ่าน Elysia (พิจารณาว่าควรเพิ่ม tool ไหม)

---

## ข้อมูลสำคัญที่ต้องรู้ก่อนเริ่ม session ถัดไป

- **หลักสำคัญ (Session 009):** Impeccable + design tool = "ที่ปรึกษา ไม่ใช่กฎตายตัว" Owner เน้นยืดหยุ่นกว่าเป๊ะ เป้าหมายคือดีไซน์ไม่ดู generic AI (ดู memory `feedback_impeccable_advisory.md`)
- **weatherAPI = grandfathered** — pastel lofi + card carousel เป็น design ที่ตั้งใจ ไม่ต้องแก้ตาม guide
- **Aponia กลับมา spawn ได้แล้ว** — model ID แก้เป็น `claude-opus-4-8` ควรทดสอบ spawn จริงใน session หน้าเพื่อยืนยัน
- **Checklist อยู่ที่เดียว:** `.claude/docs/checklist.md` (อย่า duplicate)
- **งาน weatherAPI ที่ยังค้างจาก S008:** Chart จริง (ApexCharts), localStorage persist pinnedCities, header, mobile responsive carousel — ดู `handoff_session008.md`

---

## ไฟล์ที่เกี่ยวข้อง

- `.claude/skills_folder/design-quality-guide.md` — guide ใหม่ (AI Tells + กฎตัวเลข)
- `.claude/agents/Aponia.md` — model fix + QA DoD ใหม่ (Design Quality + Bootstrap Override)
- `.claude/agents/Mobius.md` — Code DoD ใหม่ (Design Quality + Bootstrap & Responsive เพิ่มข้อ)
- `.claude/agents/Sakura.md` — Design Constraints เพิ่ม "Avoid AI Tells"
- `.claude/docs/checklist.md` — single source of truth ใหม่
- `.claude/docs/workflow.md` — ยังเป็น flow เดียว (รอปรับ lightweight track — ดู Todo 🟡)
