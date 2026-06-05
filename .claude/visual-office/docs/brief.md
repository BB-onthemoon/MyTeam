# ส่วนที่ 1 — ไฟล์ที่ต้องสร้าง
.claude/visual-office/office_status.json
{
  "updated_at": "",
  "current_session": "",
  "current_step": 0,
  "agents": {
    "Elysia": { "status": "idle", "task": "" },
    "Sakura": { "status": "idle", "task": "" },
    "Mobius": { "status": "idle", "task": "" },
    "Aponia": { "status": "idle", "task": "" }
  }
}

.claude/visual-office/activity_log.json — ไฟล์เปล่า append-only

# ส่วนที่ 2 — Instruction Snippet ใส่ใน Agent แต่ละตัว
📌 CLAUDE.md (Elysia) — เพิ่มใน Coding Rules
markdown## Status Reporting (Visual Office)

ทุกครั้งที่เปลี่ยน step หรือ spawn agent ให้ update 2 ไฟล์นี้:

### office_status.json
path: `.claude/visual-office/office_status.json`
- อัปเดต `updated_at` เป็น timestamp ปัจจุบัน
- อัปเดต `current_step` และ `current_session`
- อัปเดต status ของ agent ที่เกี่ยวข้อง

status ที่ใช้ได้: `idle` | `working` | `waiting` | `done` | `reviewing`

### activity_log.jsonl
path: `.claude/visual-office/activity_log.json`
- append 1 บรรทัด JSON ต่อ 1 action สำคัญ
- format: `{"time":"HH:MM","agent":"Elysia","action":"ข้อความสั้นๆ"}`
- ไม่ต้องลบ log เก่า — append อย่างเดียว

📌 Sakura.md — เพิ่มใน workflow
markdown## Status Reporting (Visual Office)

ก่อนเริ่มงาน:
- เขียน office_status.json: Sakura → `working`, task = งานที่กำลังทำ
- append activity_log.jsonl: `{"time":"HH:MM","agent":"Sakura","action":"เริ่ม [งาน]"}`

เมื่อส่ง mockup ให้ Owner:
- เขียน office_status.json: Sakura → `waiting`, task = "รอ Owner approve"
- append activity_log.jsonl: `{"time":"HH:MM","agent":"Sakura","action":"ส่ง mockup ให้ Owner แล้ว"}`

เมื่องานเสร็จ:
- เขียน office_status.json: Sakura → `idle`, task = ""
- append activity_log.jsonl: `{"time":"HH:MM","agent":"Sakura","action":"เสร็จแล้ว"}`

📌 Mobius.md — เพิ่มใน workflow
markdown## Status Reporting (Visual Office)

ก่อนเริ่ม code แต่ละ step:
- เขียน office_status.json: Mobius → `working`, task = "Step N: [ชื่อ step]"
- append activity_log.jsonl: `{"time":"HH:MM","agent":"Mobius","action":"เริ่ม Step N: [ชื่อ step]"}`

เมื่อรอ Owner approve:
- เขียน office_status.json: Mobius → `waiting`, task = "รอ approve Step N"

เมื่องานเสร็จทั้งหมด:
- เขียน office_status.json: Mobius → `idle`, task = ""

📌 Aponia.md — เพิ่มใน workflow
markdown## Status Reporting (Visual Office)

เมื่อเริ่ม review:
- เขียน office_status.json: Aponia → `reviewing`, task = "ตรวจ [component ที่ตรวจ]"
- append activity_log.jsonl: `{"time":"HH:MM","agent":"Aponia","action":"เริ่ม review [component]"}`

เมื่อ review เสร็จ:
- เขียน office_status.json: Aponia → `idle`, task = ""
- append activity_log.jsonl: `{"time":"HH:MM","agent":"Aponia","action":"review เสร็จ — [pass/fail]"}`