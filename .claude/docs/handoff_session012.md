# Handoff — Session 012 (ต่อจาก S011)

> Elysia เขียน — S011 ขยาย Dashboard sidebar เสร็จ + QA ผ่าน แต่ Owner เปิดจริงเจอบั๊ก data → defer มา S012

---

## 🔴 งานด่วน #1 — office.html เปิดจริง "ไม่มีข้อมูล / feed ว่าง"

**อาการ (Owner ยืนยัน S011):** เปิด `office.html` แล้วหน้าขึ้น แต่ Session card / Team status / Activity feed **ไม่มีข้อมูล (ว่าง)** — เหมือนระบบล่ม ใช้ไม่ได้

**สำคัญ:** Aponia QA headless (Puppeteer + http server ที่ตัวเอง spin up) **ผ่าน 23/23** เห็น feed render 9 รายการ → แปลว่าโค้ด fetch ทำงานได้ "บนเครื่อง QA" แต่ไม่ทำงานในวิธีที่ Owner เปิด = **QA environment ≠ environment Owner**

**สมมติฐาน (เรียงน่าจะเป็นมากสุด):**
1. Owner เปิดแบบ `file://` (ดับเบิลคลิกไฟล์ตรงๆ) → `fetch()` ถูก browser block → ไม่มีข้อมูล + ควรเด้ง error banner
2. เปิดผ่าน Live Server แต่ serve คนละ root → relative path หา `office_status.json` / `activity_log.jsonl` ไม่เจอ (404)
3. (น้อย) JS error เฉพาะ browser Owner

**3 fix ของ S011 เป็น CSS-only** (line-clamp, ย้าย collapsed rule, ลบ dead CSS `.sb-feed-item*`) — **ไม่ควรเป็นต้นเหตุ data หาย** อย่าเสียเวลา revert ตรงนั้น

**วิธีตามแก้ (S012):**
1. ถาม Owner ก่อน: เปิด `office.html` ด้วยอะไร? (ดับเบิลคลิก / Live Server / อื่น) + กด F12 → ดู Console + Network tab มี fetch error/404 อะไร
2. ถ้า file:// → ทำให้ error banner ชัดเจน ("เปิดผ่าน Live Server เท่านั้น") + เขียนวิธีเปิดให้ Owner / หา fallback
3. ถ้า path 404 → ตรวจ relative path ใน fetch กับ root ที่ Live Server serve
4. **ทดสอบในวิธีที่ Owner เปิดจริง** ก่อนบอกว่าแก้แล้ว — ไม่ใช่แค่ http server ของ agent

---

## สิ่งที่ทำเสร็จแล้ว (S011)

- ✅ **แก้บั๊กเวลา feed (S010)** — สร้าง `.claude/visual-office/log-activity.ps1` (รับ `-Agent`/`-Action` → ใส่ `Get-Date` เวลาจริง + escape + UTF-8 no BOM อัตโนมัติ). ล้าง log ปลอม 16 บรรทัด. CLAUDE.md หัวข้อ Status Reporting อัปเดต: กฎเหล็กห้าม hardcode timestamp + วิธีมาตรฐานเรียก helper
- ✅ **Sidebar ซ้าย** ใน `office.html` — CSS Grid 2 คอลัมน์: Session card + Team status รายคน + Activity feed (ย้ายจากล่าง) + legend. ห้อง office คงเดิม. responsive ≤768px stack + JS toggle ยุบ sidebar
- ✅ QA fix: `.sb-body--collapsed` ย้ายเข้า media query, ลบ dead CSS, เพิ่ม `line-clamp:2` — Aponia re-verify PASS

---

## ข้อมูลสำคัญก่อนเริ่ม S012

- **เปิด office.html ต้องผ่าน server** (fetch file:// ไม่ได้) — Live Server หรือ `python -m http.server` ใน `.claude/visual-office/`
- **กฎ single-writer + เวลาจริง**: Elysia เขียน status/log คนเดียว ผ่าน `log-activity.ps1` (เวลาจริง Get-Date) — ห้าม hardcode timestamp อีก
- **ก่อน declare done ของงานที่ Owner เปิดเอง → ต้องให้ Owner verify จริงก่อน** (บทเรียน S011)
- palette: Elysia #FF4081, Sakura #FFB7C5, Mobius #3f9b00, Aponia #eee100

---

## งานค้างอื่น (ถ้า Owner อยากทำต่อ)

- [ ] ขยาย dashboard เต็มแบบ `preview.webp` — focus list + count chips (Ready/In Progress ฯลฯ) ที่ S011 ข้ามไว้
- [ ] (optional) เก็บกวาดไฟล์ dev: screenshots (`screenshot_*`, `sidebar_*`, `mockup_*`, `office_qa_*`, `final_*`), `pixelate.py`, `_preview.py`, mockup html

---

## ไฟล์ที่เกี่ยวข้อง

- `.claude/visual-office/office.html` — ของจริง (มีบั๊ก data รอแก้)
- `.claude/visual-office/office_status.json` + `activity_log.jsonl` — data (เวลาจริงแล้ว)
- `.claude/visual-office/log-activity.ps1` — helper เขียน log เวลาจริง (S011 ใหม่)
- `.claude/visual-office/sidebar-mockup-sakura.html` — mockup sidebar ที่ approve
- memory: `project_visual_office.md`
