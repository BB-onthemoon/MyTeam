# Handoff — Session 011 (ต่อจาก Visual Office S010)

> Elysia เขียน — Session 010 จบ Phase 1+2 ของ Visual Office แต่ยังมีงานค้าง

---

## สถานะปัจจุบัน

**งานที่กำลังทำ:** Visual Office — หน้าจอ top-down แสดงสถานะทีม realtime
**อยู่ที่ Step:** Phase 1 + 2 เสร็จ (Step 6 — ส่งมอบแล้ว) — `office.html` ใช้งานได้จริง
**Agent ที่รับผิดชอบอยู่:** ทุกคน idle (session จบ)

---

## สิ่งที่ทำเสร็จแล้ว (S010)

- **Phase 1 — data layer**: `office_status.json` + `activity_log.jsonl` + กฎ single-writer (Elysia เขียนคนเดียว) ใน `CLAUDE.md` หัวข้อ "Status Reporting (Visual Office)"
- **Sprite pixel 8-bit**: `pixelate.py` แปลงรูป `character_pic_ref/` → `character_pixel/` (80px, 24 สี, flood-fill ลบพื้นขาว Mobius)
- **Phase 2 — office.html**: ห้อง **top-down (Stardew style)** ขอบ pixel chunky, CSS Grid 2×2, อ่าน fetch realtime (status dot + task bubble + feed 10 ล่าสุด + "updated X ago" + auto-refresh 5 วิ + error handling), XSS-safe, responsive
- ผ่าน QA (Aponia runtime Puppeteer + Sakura UI) — แก้ 2 critical + cosmetic ครบ
- ตัดสินใจ: Elysia สี `#FF4081`, serve ผ่าน Live Server, scope "ห้องก่อน ขยายทีหลัง"

---

## สิ่งที่ยังค้างอยู่ (Todo Next Session)

- [ ] 🐛 **แก้เวลาใน Last Activity feed ให้ตรง** (Owner สังเกต S010) — root cause: Elysia hardcode timestamp สมมติ (15:05...19:00) ตอนเขียน log/status ไม่ใช่เวลาจริง
  - แก้: ตอน append `activity_log.jsonl` และเขียน `office_status.json` `updated_at` ให้ใช้เวลาจริง `Get-Date -Format "yyyy-MM-ddTHH:mm:sszzz"` (PowerShell)
  - ฝั่ง display แก้แล้ว: `formatHHMM` pin `Asia/Bangkok`, `formatTimeAgo` clamp ค่าลบ — ตรวจซ้ำได้
- [ ] ขยายเป็น dashboard เต็มแบบ `preview.webp` (sidebar mission-control + focus list + status panels) — ถ้า Owner อยากทำต่อ
- [ ] (optional) เก็บกวาดไฟล์ dev: `pixelate.py`, `_preview.py`, `office-mockup-sakura.html`, screenshots (`mockup_*`, `office_qa_*`, `office_final_*`)

---

## ข้อมูลสำคัญที่ต้องรู้ก่อนเริ่ม session ถัดไป

- **เปิด office.html ต้องผ่าน server** (fetch file:// ไม่ได้) — Live Server หรือ `python -m http.server` ใน `.claude/visual-office/`
- **verify ด้วยภาพได้**: เครื่องมี Chrome (`C:\Program Files (x86)\Google\Chrome\Application\chrome.exe`) + puppeteer cache → `chrome --headless=new --screenshot=<abs path> http://localhost:<port>/office.html` (ต้อง start server ก่อน + `--virtual-time-budget` ให้ JS fetch ทัน)
- **กฎ single-writer ยังใช้อยู่**: Elysia เป็นคนเดียวที่เขียน office_status/activity_log — sub-agent ไม่เขียนเอง
- palette: Elysia #FF4081, Sakura #FFB7C5, Mobius #3f9b00, Aponia #eee100

---

## ไฟล์ที่เกี่ยวข้อง

- `.claude/visual-office/office.html` — ของจริง (ใช้งาน)
- `.claude/visual-office/office_status.json` + `activity_log.jsonl` — data
- `.claude/visual-office/office-mockup-sakura.html` — mockup ที่ approve
- `.claude/visual-office/pixelate.py` + `character_pixel/` — sprite
- `.claude/visual-office/{brief,prompt}.md` — โจทย์เดิมจาก Claude.ai
- memory: `project_visual_office.md`
