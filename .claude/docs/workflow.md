# Workflow — Dashboard Dev Team

---

## ภาพรวม

```
Owner → Elysia → Sakura → [Owner Approve] → Mobius → Aponia + Sakura → Elysia → Owner
```

ทุก task ต้องผ่านขั้นตอนตามลำดับ ห้ามข้ามขั้น

## Elysia ต้องทำ Status Reporting (Visual Office) ก่อนเริ่มงานทุกงาน 
---

## Task Context — ความจำงาน intra-task (เฉพาะงานหลาย step)
> แก้ปัญหา subagent cold-start: ทุก spawn มองไม่เห็นงาน step ก่อน → false-alarm + เปลือง token

- ไฟล์: `.claude/docs/task-context.md` (Elysia **single-writer**, subagent อ่านอย่างเดียว) — แม่แบบ `.claude/docs/task-context.template.md`
- **สร้างเฉพาะงานที่จะ spawn subagent >1 รอบ** (เช่น coding ซอย step); งาน one-shot ไม่ต้องสร้าง
- Elysia ต้อง **ฝัง pointer "อ่าน task-context.md ก่อน" ในทุก spawn prompt** (cold agent ไม่อ่านเอง)
- จังหวะ: **สร้างตอน Step 1** → **อัปเดตทุก transition + ทุกครั้งรับผลจาก subagent** → **ลบตอน Step 6** (หลังกลั่นบทเรียนเข้า feedback_log/session-log) — ยกเว้นงานค้างข้าม session: **คงไฟล์ไว้** (ดู Handoff ด้านล่าง)
- รายละเอียดเต็ม + 6 ส่วน: ดู `CLAUDE.md > Task Context`
---

## Handoff — ส่งงานข้าม session (ไฟล์เดียว, ฟื้นระบบ S024)
> แยก axis: **task-context = ความจำภายใน task ให้ subagent** (spawn หลายรอบ) / **handoff = ความจำข้าม session ให้ Elysia เอง**

- ไฟล์: `.claude/docs/handoff.md` — Elysia เขียนตอน**ปิด session ที่มีงานค้าง** (เขียนทับของเก่าได้ ประวัติอยู่ session-log) — แม่แบบ `.claude/docs/handoff_template.md`
- เปิด session ใหม่: Elysia **อ่านก่อนเริ่มงานใดๆ** → resume แล้ว**ลบทันที** (mirror lifecycle กับ task-context: มีไฟล์ = มีงานค้าง)
- งานค้างที่มี task-context: **คง task-context ข้าม session** + handoff ชี้ไปที่มัน — **ห้ามก๊อปเนื้อหาซ้ำ** (handoff เก็บเฉพาะของระดับ session เช่น งานรองค้าง, สิ่งที่รอถาม Owner, env ที่ต้องเตรียม)
---

## ขั้นตอนการทำงาน

### Step 1 — รับ Requirement (Elysia)
- Elysia คุยกับ Owner รับ requirement
- ถามจนกว่าจะชัดเจนทุกข้อ ห้ามเดา
- สรุป requirement เป็นข้อๆ ให้ Owner confirm ก่อนไปต่อ
- แสดง step การทำงานทั้งหมดให้ Owner เห็นก่อนลงมือ

**Output:** requirement ที่ Owner confirm แล้ว

---

### Step 2 — ออกแบบ UI (Sakura)
- Sakura รับ requirement จาก Elysia
- อ่าน `Sakurafeedback_log.md` ก่อนเริ่มทุกครั้ง
- ออกแบบ dashboard layout และ component
- ส่ง mockup ให้ Owner ดู

**Output:** mockup ที่พร้อมให้ Owner approve

---

### Step 3 — Owner Approve Design
- Owner ดู mockup จาก Sakura
- ถ้า **approve** → ไปต่อ Step 4
- ถ้า **ไม่ผ่าน** → Sakura แก้ตาม feedback แล้วส่งใหม่ (วนซ้ำ Step 2)

**เงื่อนไข:** ห้าม Mobius เริ่ม code ก่อน Owner approve design

---

### Step 4 — Coding (Mobius)
- Mobius รับ design ที่ผ่าน approve แล้วจาก Sakura
- อ่าน `Mobiusfeedback_log.md` ก่อนเริ่มทุกครั้ง
- เขียน code ที่ละ step ตาม plan ห้ามทำรวดเดียวจบ
- แยกไฟล์เป็น Angular component (`component.html` / `component.css` / `component.ts`) เสมอ
- ส่ง code ให้ Aponia เมื่อเสร็จแต่ละ step

**Output:** code ที่พร้อมส่ง QA

---

### Step 5 — Review (Aponia + Sakura พร้อมกัน)
- **Spawn parallel:** Aponia และ Sakura ทำงานพร้อมกัน

**Aponia ตรวจ:**
- Bug ใน Angular component (HTML / CSS / TypeScript)
- Code quality และ readability
- Security (XSS, exposed data)
- API error handling ครบไหม

**Sakura ตรวจ:**
- UI ตรงกับ design ที่วางไว้ไหม
- Responsive ทำงานถูกต้องไหม
- UX ใช้งานง่ายจากมุม user ที่ไม่รู้ระบบ

**ผ่าน QA เมื่อ:** Aponia และ Sakura approve พร้อมกันทั้งคู่ — ถ้าใครคนใดคนหนึ่งไม่ผ่าน ถือว่าไม่ผ่าน
**ถ้าผ่าน:** แจ้ง Elysia  
**ถ้าไม่ผ่าน:** ส่ง feedback กลับ Mobius พร้อมระบุชัดว่าต้องแก้อะไร → วนซ้ำ Step 4

---

### Step 6 — สรุปและส่งมอบ (Elysia)
- Elysia รวม feedback จาก Aponia และ Sakura
- สรุปผลงานให้ Owner เข้าใจง่าย
- บันทึก feedback log ของแต่ละ agent
- กำหนด next step ถ้ามี

---

## Fast Path — ทางลัดที่ Owner สั่งได้ (ทางการตั้งแต่ S024)

> **Default = full workflow ข้างบนเสมอ** — fast path ใช้ได้เฉพาะเมื่อ **Owner สั่งเอง** เท่านั้น
> Elysia ห้ามข้ามขั้นเองเพื่อความเร็ว แต่**ถามได้**ว่า "งานนี้จะใช้ fast path ไหม?" ตอน confirm requirement

| ทางลัด | เงื่อนไขที่เหมาะ | ตัวอย่างจริง |
|---|---|---|
| **ข้าม Sakura mockup** (ข้าม Step 2-3) | ปรับ UI บนของเดิม / Owner มี ref ภาพชัดอยู่แล้ว → Mobius code เลย | S021, S022, S023 |
| **QA fix-then-ship** | QA ไม่เจอ bug ระดับพัง → แก้จุดย่อยรวดเดียวแล้ว ship ไม่วน re-QA เต็มรอบ | S019, S021 |
| **Elysia ทำเองไม่ spawn** | งานแก้เล็กไม่กี่ไฟล์ / งาน doc ที่ไม่ใช่ feature — ยังซอย step + checkpoint ตามปกติ | S012, S020 |

**สิ่งที่ข้ามไม่ได้ไม่ว่า path ไหน:**
- `grill-me` ก่อนงาน coding (กฎเหล็ก Owner)
- QA Aponia + Sakura ก่อน report Owner (เมื่อมีการแก้ code feature)
- Owner verify เครื่องจริงก่อน declare done
- Status reporting + task-context (งานหลาย step)

---

## กฎ Spawn Agent

| เงื่อนไข | Agent ที่ Spawn |
|---|---|
| รับ requirement ใหม่ | Elysia |
| ต้องออกแบบ UI | Sakura |
| Design ผ่าน Owner approve | Mobius |
| Mobius coding เสร็จ | Aponia + Sakura (parallel) |

---

## กฎทั่วไป

- **ทุก agent** ต้องอ่าน feedback_log ตัวเองก่อนเริ่มงานทุกครั้ง
- **ทุก agent** ต้องอ่าน `.claude/docs/task-context.md` ก่อนเริ่ม (ถ้ามี) — รู้สถานะ step + ไฟล์ที่แตะ + decision ก่อนลงมือ
- **ห้ามข้ามขั้นตอน** ไม่ว่าจะเหตุผลใด
- **ห้าม declare done** โดยไม่ตรวจ scope ครบ
- ถ้าเจอ blocker ให้แจ้ง Elysia ก่อน อย่าแก้เองโดยไม่แจ้ง
