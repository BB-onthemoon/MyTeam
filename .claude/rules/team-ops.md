# Team Ops — Status Reporting + Task Context (กลไกละเอียด)

> แยกออกจาก CLAUDE.md (S038) เพื่อรีด CLAUDE.md ให้สั้น. Elysia อ่านไฟล์นี้เมื่อต้องการรายละเอียดกลไก; กฎ non-negotiable สรุปไว้ใน CLAUDE.md แล้ว

---

## Status Reporting (Visual Office)

Elysia เป็น **single writer** ของ 2 ไฟล์นี้ — sub-agent (Sakura/Mobius/Aponia/Bronya) **ไม่เขียนสถานะเอง**

### เมื่อไรต้องอัปเดต
- ก่อนเริ่มงานทุกงาน
- ทุกครั้งที่เปลี่ยน step ของ workflow
- ทุกครั้งที่ spawn agent หรือรับผลกลับจาก agent
- ทุกครั้งที่สถานะ agent เปลี่ยน

> ⚠️ **กฎเหล็ก (S011): ห้าม hardcode timestamp เด็ดขาด** — Elysia อ่านเวลาจริงจากระบบเองไม่ได้ ถ้าไม่สั่ง `Get-Date` ก่อน → เคยมั่วเลขกลมๆ ลง log ทำให้เวลาใน feed ไม่ตรง (Mistake S010). ทุก timestamp ต้องมาจาก `Get-Date` จริงเสมอ

### office_status.json — เขียนทับทั้งไฟล์ (เล็ก)
path: `.claude/visual-office/office_status.json`
- `updated_at` = ISO timestamp **เวลาจริง** — เอาจาก `Get-Date -Format "yyyy-MM-ddTHH:mm:sszzz"` (ห้ามพิมพ์เอง)
- `current_session`, `current_step`, `step_label`
- `agents.<name>.status` + `.task` (สี `color` คงที่ ไม่ต้องแก้)
- status ที่ใช้ได้: `idle` | `working` | `waiting` | `reviewing` | `done`

### activity_log.jsonl — append ด้วย helper script (append-only ห้ามลบของเก่า)
path: `.claude/visual-office/activity_log.jsonl`
- format ต่อบรรทัด: `{"time":"<ISO>","agent":"<name>","action":"<ข้อความสั้น>"}`
- **วิธีมาตรฐาน (S011+): เรียก `log-activity.ps1`** — ใส่เวลาจริงจาก `Get-Date` + escape + UTF-8 no BOM ให้อัตโนมัติ จึง hardcode ผิดอีกไม่ได้:
```powershell
.\.claude\visual-office\log-activity.ps1 -Agent Elysia -Action "ข้อความสั้น"
```
- กลไกภายใน script (เผื่อต้อง append เอง): .NET UTF-8 no BOM — **ห้ามใช้ `Add-Content -Encoding utf8`** (ใส่ BOM พัง JSON.parse บน PS5.1):
```powershell
$enc = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::AppendAllText($path, $line + "`r`n", $enc)
```

---

## Task Context (ความจำงาน intra-task) — แก้ subagent cold-start

ปัญหา: subagent **cold ทุก spawn** → มองไม่เห็นงาน step ก่อน → false-alarm + re-pass context เปลือง token (S018). แก้ด้วยไฟล์ digest กลางที่ subagent อ่านก่อนเริ่มทุก spawn

- **ไฟล์เดียว: `.claude/docs/task-context.md`** — Elysia เป็น **single writer** (subagent อ่านอย่างเดียว เหมือน feedback_log) — แม่แบบ: `.claude/docs/task-context.template.md`
- **สร้างเฉพาะงานหลาย step** (จะ spawn subagent >1 รอบ เช่น coding ซอย step) — งาน one-shot ไม่ต้องสร้าง
- 🔗 **Enforcement ตัวจริง: Elysia ต้องฝัง pointer `"อ่าน .claude/docs/task-context.md ก่อนเริ่ม"` ใน *ทุก spawn prompt*** — subagent cold ไม่อ่านเองนอกจากถูกสั่ง (กฎใน agent profile เป็น backup)
- **6 ส่วน** (digest ชี้ไป SPEC ไม่ก๊อปมาทั้งดุ้น): Task header / Plan+step status⭐ / Files touched⭐ / Decisions-invariants / Repo state / Next step
- **อัปเดตเมื่อ:** ทุก transition ของ step + ทุกครั้งที่รับผลกลับจาก subagent (timestamp ใช้ `Get-Date` จริงเหมือน office_status)
- **Lifecycle:** สร้างตอนเริ่มงาน → อัปเดตระหว่างทาง → **งานจบ: กลั่นบทเรียนถาวรเข้า feedback_log/session-log ก่อน แล้วลบ `task-context.md` ทันที** (เคลียร์พื้นที่งานใหม่) — **ยกเว้นงานค้างข้าม session: คงไฟล์ไว้** + เขียน `handoff.md` ชี้มาที่นี่
- ⚠️ **ไม่ทับ office_status:** office_status = สถานะ realtime (ใครทำอะไรตอนนี้) / task-context = ความจำงาน (plan/ไฟล์/decision) — คนละหน้าที่
- 🤝 **คู่กับ Handoff (ข้าม session):** `.claude/docs/handoff.md` ไฟล์เดียว — Elysia เขียนตอนปิด session ที่มีงานค้าง, อ่านตอนเปิด session ใหม่แล้ว**ลบ**; ชี้ task-context ไม่ก๊อปซ้ำ — รายละเอียด `workflow.md > Handoff` + แม่แบบ `handoff_template.md`
