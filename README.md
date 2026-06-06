# 🌸 MyTeam — Dashboard Dev Team

> ทีม AI จำลองสำหรับสร้าง **Dashboard** แสดงข้อมูลจาก public API
> ทำงานกันเป็น "ทีม" จริงๆ — มี PM, Designer, Developer, QA แยกหน้าที่กันชัดเจน
> repo นี้เก็บ **"ระบบทีม"** (ตัวตน + กฎ + workflow + เครื่องมือ) ไม่รวมโค้ด Dashboard จริง

---

## 👀 repo นี้คืออะไร?

ปกติเวลาใช้ AI ช่วยเขียนโค้ด เราคุยกับ AI ตัวเดียว แต่โปรเจคนี้ลองทำให้ AI ทำงานเป็น **ทีม 4 คน** ที่มีบุคลิก หน้าที่ และความจำของตัวเอง ส่งงานต่อกันตาม workflow เหมือนออฟฟิศจริง

ทุกอย่างในโฟลเดอร์ `.claude/` คือ "สมอง + ความทรงจำ + กฎ" ของทีมนี้ค่ะ

---

## 👥 สมาชิกในทีม

| ตำแหน่ง | ชื่อ | หน้าที่ |
|---|---|---|
| 🩷 **PM / Orchestrator** | **Elysia** | คุยกับเจ้าของงาน (Owner), ยืนยัน requirement, สั่งงาน + ประสานทีม |
| 🌷 **UX/UI Designer** | **Sakura** | ออกแบบ mockup ให้ approve ก่อน แล้วตรวจ UI หลัง code เสร็จ |
| 🔧 **Developer** | **Mobius** | เขียน Angular component (HTML / CSS / TS) ตาม design |
| 🔍 **QA / Reviewer** | **Aponia** | ตรวจ bug, security, code quality, accessibility |

> **flow คร่าวๆ:** Owner สั่ง → Elysia ยืนยัน → Sakura ออกแบบ → Owner approve → Mobius เขียนโค้ด → Aponia + Sakura ตรวจพร้อมกัน → แก้ → ส่งมอบ

---

## 📁 มีโฟลเดอร์อะไรบ้าง

```
MyTeam/
├── CLAUDE.md              ← กฎหลัก + ตัวตนทีม (ไฟล์สำคัญที่สุด อ่านก่อนเลย)
├── package.json           ← เครื่องมือ QA (Playwright / Puppeteer)
└── .claude/
    ├── agents/            ← โปรไฟล์ของสมาชิกแต่ละคน
    ├── docs/              ← เอกสารทีม: workflow, feedback, ความจำ
    ├── skills/            ← คลังทักษะ (แต่ละ skill = โฟลเดอร์ย่อย)
    └── visual-office/     ← "ออฟฟิศจำลอง" แสดงสถานะทีมแบบเรียลไทม์
```

### 📄 `CLAUDE.md` — หัวใจของทีม
ไฟล์ instruction หลัก บอกว่าทีมเป็นใคร, tech stack อะไร (Angular 21 + TypeScript + Bootstrap + ApexCharts), กฎการเขียนโค้ด, และบทเรียนความผิดพลาดจากแต่ละ session **แนะนำให้อ่านไฟล์นี้ก่อนเพื่อน**

### 🧑‍🤝‍🧑 `.claude/agents/`
โปรไฟล์ของสมาชิก 3 คน (`Sakura.md`, `Mobius.md`, `Aponia.md`) — แต่ละไฟล์บอกหน้าที่, เครื่องมือที่ใช้ได้, AI model ที่รัน, และมาตรฐานการทำงานของคนนั้น
*(Elysia ตัวหลักไม่ต้องมีไฟล์ในนี้ เพราะคือ AI ที่คุยกับเราโดยตรง)*

### 📚 `.claude/docs/`
เอกสารและ **"ความทรงจำ"** ของทีม:
- `workflow.md` — ขั้นตอนการทำงานละเอียด
- `checklist.md` — เช็คลิสต์ก่อนบอกว่างานเสร็จ
- `user_profile.md` — สิ่งที่ทีมเรียนรู้เกี่ยวกับเจ้าของงาน
- `{ชื่อ}feedback_log.md` — บันทึก feedback ของสมาชิกแต่ละคน (ทำดี/พลาดอะไร) เพื่อพัฒนาตัวเอง
- `handoff_*.md` — บันทึกส่งต่องานระหว่าง session

### 🎒 `.claude/skills/`
คลังทักษะที่ทีมหยิบมาเสริมได้ — แต่ละ skill เป็นโฟลเดอร์ย่อยที่มี `SKILL.md` (frontmatter + process steps กระชับ) และ `reference.md` เมื่อเนื้อ reference หนัก เช่น `design-quality-guide/` (เลี่ยง AI Tells), `Create-infinite-Carousel/` (สูตร carousel), และชุดทักษะ engineering/productivity (debug-mantra, scrutinize, post-mortem, ฯลฯ)

### 🏢 `.claude/visual-office/`
ของเล่นชิ้นโปรด~ เป็น **ออฟฟิศมุมมอง top-down สไตล์เกม** (`office.html`) ที่โชว์ว่าตอนนี้สมาชิกแต่ละคนกำลังทำอะไร อัปเดตแบบเรียลไทม์ผ่าน `office_status.json` + `activity_log.jsonl` พร้อม sprite pixel art ของทุกคน

---

## 🛠️ Tech Stack ของงาน Dashboard
Angular 21 · TypeScript · Bootstrap · ApexCharts — ดึงข้อมูลจาก public API ตรงๆ (ไม่มี backend)

---

## 💡 หมายเหตุ
- repo นี้เก็บ **ระบบทีม** เท่านั้น — โค้ด Dashboard จริง (weatherAPI, landing page ฯลฯ) แยกเก็บที่อื่น
- เป็นโปรเจคเรียนรู้ที่ทั้ง "ทีม AI" และเจ้าของงานค่อยๆ เก่งขึ้นไปด้วยกัน 🌱

*สร้างด้วย 💕 โดยทีม Dashboard Dev Team*
