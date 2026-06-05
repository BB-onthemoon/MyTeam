# User Profile — Owner

> ไฟล์นี้บันทึกสิ่งที่ทีมรู้เกี่ยวกับ Owner สะสมไปเรื่อยๆ ทุก session
> Elysia เป็นคนอัปเดตหลัง session สิ้นสุด

---

## ข้อมูลพื้นฐาน

| | |
|---|---|
| Email | (redacted) |
| วันที่เริ่มโปรเจค | 2026-05-26 |

---

## ระดับความรู้ด้านเทคนิค

- **พื้นหลัง:** ไม่ได้เรียนสาย Tech มา — ต้องมาทำงานนี้กะทันหัน
- **HTML/CSS/JS:** เริ่มต้น — ยังอยู่ในช่วงเรียนรู้ แต่ **ลงมือ debug/refactor เองได้แล้ว** (S012: แยก inline `<script>`/`<style>` ใน office.html ออกเป็น `office.js`/`office.css` เอง → แก้บั๊ก data ที่ทีมยัง debug ไม่จบใน S011 ได้สำเร็จ)
- **Angular:** กำลังเรียนอยู่ — สามารถ setup โครงสร้าง component เองได้แล้ว (ขึ้น skeleton ของ landing-page-pj เองทุก component ก่อน session)
- **API / Fetch:** — (ยังไม่ทราบ)
- **Dashboard / Data Viz:** — (ยังไม่ทราบ)
- **Git / Version Control:** — (ยังไม่ทราบ)

> ทีมควรอธิบายการตัดสินใจ technical ให้ชัดเจน อย่าสมมติว่า Owner รู้ context อยู่แล้ว

---

## ความชอบในการทำงาน

- ชอบ **review และ approve** ก่อนทีมลงมือเสมอ — ไม่ข้ามขั้น
- ต้องการเห็น **step การทำงานชัดเจน** ก่อนเริ่ม
- เน้น **เรียนรู้ไปพร้อมกันกับทีม** ไม่ได้แค่รับผลงาน
- ชอบ **ปรึกษาก่อนตัดสินใจ** ไม่ให้ทีมทำเองแล้วค่อยบอก
- ชอบ **code ที่แบ่ง component ชัดเจน** อ่านง่ายกว่า component ใหญ่เดียว — ให้ Mobius แยก sub-component เสมอถ้า section แยกได้ชัดเจน
- **ตัดสินใจเร็วและชัดเจน** — approve/reject สั้น ไม่อธิบายยาว (เช่น "Approve", "A แบบนี้โอเค B ใส่กลับ") ทีมควรอ่านให้ขาดและลงมือได้เลย
- **ชอบ minimal design** มากกว่า warm/ornate — ใน Session 005 เลือก white-black-yellow แทน warm coffee tone ทันที
- **วาง skeleton ได้เอง** — Owner ขึ้นโครง component structure ก่อนแล้วค่อยให้ทีมเติม content/logic
- **เน้นความยืดหยุ่นมากกว่าความเป๊ะ** (Session 009) — design rule / tool ภายนอก (เช่น Impeccable) ใช้เป็น "ที่ปรึกษา" ไม่ใช่กฎตายตัว Owner ตัดสินใจสุดท้ายเสมอ เป้าหมายคือผลงานไม่ดูเหมือน generic AI ("พิมพ์เขียวจาก prompt เดียว") ไม่ใช่ตามกฎให้ครบ
- **เปิดดู/ทดสอบงานเองในเครื่องจริงเสมอ** (Session 010-011) — Owner สังเกตเห็นปัญหาที่ QA headless จับไม่ได้ (เวลา feed ไม่ตรง S010, "ไม่มีข้อมูล/feed ว่าง" S011) → ทีมต้องให้ Owner ยืนยันว่าเปิดได้จริงในเครื่อง Owner ก่อน declare done; อย่าเชื่อ QA runtime อย่างเดียว
- **ตัดสินใจ defer งานเป็น session ถัดไปได้** (Session 011) — เจอบั๊กแล้วเลือก "ไว้ค่อยแก้ session หน้า" + เตรียมปิด session ทันที ไม่ดันให้แก้ตอนดึก/ตอนนั้น
- **ตัดสินใจเชิงสถาปัตยกรรมได้ไว + มี sense** (Session 010) — เมื่อ isometric ไม่เวิร์ค Owner เสนอ pivot ไป top-down (Stardew) เองทันที; รับฟังเหตุผลทางเทคนิคแล้วเลือกได้เด็ดขาด
- **สังเกตรายละเอียดเก่ง** (Session 010) — จับได้ว่าเวลาใน activity feed ไม่ตรงเวลาจริง ทั้งที่งานส่วนใหญ่ผ่าน
- **เปิดรับสไตล์ playful/cozy retro game สำหรับเครื่องมือภายใน** (Session 010 Visual Office) — ไม่ขัดกับที่ชอบ minimal ใน data dashboard; เลือกสไตล์ตามบริบทของงาน
- **ลงมือแก้โค้ดเองระหว่าง session ได้** (Session 012) — ไม่รอทีมอย่างเดียว: แยกไฟล์ html/css/js เองจนแก้บั๊ก data ที่ค้างได้ แล้วค่อยกลับมาให้ทีมปรับ UI ต่อ. ชอบ **แยกไฟล์เพื่อ maintenance** (สอดคล้องกับชอบ component แยกชัด). ทีมควรมองว่า Owner เป็น collaborator ที่ลงมือได้ ไม่ใช่แค่ผู้รับงาน

---

## สิ่งที่ควรระวัง

- อย่า declare done โดยไม่ตรวจ scope ครบ (Feedback #1)
- ไม่ชอบให้ทีมข้ามขั้นตอนแม้จะเร็วกว่า

---

## เป้าหมายของโปรเจค

- สร้าง Dashboard แสดงข้อมูลจาก public API
- ทีมและ Owner เก่งขึ้นไปพร้อมกัน

---

## Session Log

| Session | วันที่ | งานที่ทำ | สถานะ |
|---|---|---|---|
| 001 | 2026-05-26 | Setup ทีม — สร้าง agent profiles, feedback logs, workflow, user_profile, handoff_template, cross-check และแก้ไขทุกจุดที่ขัดแย้ง | ✅ เสร็จ |
| 002 | 2026-05-26 | Plant Status Rework — rework dashboard ใหม่จาก 0, ทดสอบระบบทีมครบ workflow (Elysia→Sakura→Mobius→Aponia+Sakura parallel), แก้ bug 3 จุด, บันทึก feedback ทุก agent | ✅ เสร็จ |
| 003 | 2026-05-27 | Tech Stack Migration — อัปเดต tech stack ทั้งโปรเจคจาก HTML/CSS/JS เป็น Angular 21 + TypeScript, cross-check และแก้ไขทุกไฟล์ใน .claude/ ให้สอดคล้อง | ✅ เสร็จ |
| 004 | 2026-05-27 | Team Dashboard — สร้าง our_team dashboard แบบ Bento Grid Asymmetric, Cute & Colorful, ผ่าน QA Aponia + Sakura, แก้ bug ครบ, build ผ่าน | ✅ เสร็จ (pending refactor) |
| 005 | 2026-05-29 | Landing Page Review Component — ออกแบบและ code Review section ใหม่ (minimal white-black-yellow, star rating, form submit, dynamic cards), ผ่าน QA ครบ | ✅ เสร็จ |
| 006 | 2026-05-30 | WeatherAPI Card — ยกเลิกงานค้าง focus weatherAPI, design pastel lofi card (7 weather states), Bootstrap 5 integration, fix bugs + QA 2 rounds, all blockers resolved | ✅ เสร็จ |
| 007 | 2026-05-30 | WeatherAPI Search + Pin + Display — SearchBox component, WeatherService (Angular Signals), Display pinned grid, QA+UI Review APPROVED | ✅ เสร็จ |
| 008 | 2026-05-30 | Carousel + Chart Placeholder — refactor utils, แก้ .gitignore, Bootstrap Carousel infinite loop (clone technique), Chart placeholder, layout 2-column, เปิดระบบ session-comments, สร้าง skill Create-infinite-Carousel | ✅ เสร็จ |
| 009 | 2026-06-01 | Team Upgrade — ศึกษา Impeccable, สร้าง `design-quality-guide.md` + ฝัง snippet เข้า 3 agent, review โครงสร้างทีมทั้งหมด, แก้ 🔴 3 ข้อ (Aponia model ID, Bootstrap checklist institutionalize, รวม checklist เป็นที่เดียว) | ✅ เสร็จ |
| 010 | 2026-06-03 | Visual Office — สร้าง Visual Office (top-down Stardew) แสดงสถานะทีม realtime: data layer single-writer (Phase 1) + `office.html` wired (Phase 2), แปลง sprite pixel 8-bit (pixelate.py), pivot iso→top-down, ผ่าน QA Puppeteer (2 critical fixed) | ✅ เสร็จ (ค้าง: เวลาใน feed + ขยาย dashboard) |
| 011 | 2026-06-03 | แก้บั๊กเวลา feed (`log-activity.ps1` เวลาจริง) + ขยาย Dashboard sidebar ซ้าย, QA ผ่าน — แต่ Owner เปิดจริงเจอ data หาย → defer S012 | ✅ เสร็จ (ค้าง: บั๊ก data) |
| 012 | 2026-06-03 | ทดสอบ visual office (data/feed + live update ผ่าน) + ปรับ UI: sidebar 30%, feed 5 รายการ + drawer slide-in 10 รายการ. **บั๊ก data S011 หาย — Owner แยกไฟล์ html/css/js เอง**. Elysia ทำ 3 step (HTML→CSS→JS) ไม่ spawn agent | ✅ เสร็จ |

---

## สิ่งที่ยังไม่รู้ / ต้องหาโอกาสถาม

- ระดับความรู้ด้าน API, Git ของ Owner
- Landing page ที่กำลังสร้างนี้ใช้งานจริงหรือเป็น practice project?
- components ที่จะวางโครงต่อใน session หน้า (hero / features / footer)
