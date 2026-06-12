---
name: learn-html-builder
description: Build a single-file interactive learn.html that teaches how to READ and REBUILD an existing codebase (Angular-first, adaptable). Trigger when the user wants to create teaching material / a code-walkthrough doc to review recent work, says "สร้างสื่อการสอนอ่านโค้ด / learn.html / ทบทวนโค้ดงานล่าสุด", or invokes /learn-html-builder. Engine code is NOT inlined here — copy it from an existing learn.html. Grill the user first; build section-by-section with checkpoints.
---

# learn-html-builder

สร้าง **`learn.html`** — สื่อ HTML interactive ไฟล์เดียว เปิด browser ได้เลย สอน "อ่านโค้ด + สร้างใหม่เองจากศูนย์" ของระบบที่ทำไปแล้ว
ออกแบบสำหรับ Angular แต่หลักการ (ไล่ตาม build order, แยก concern, gotchas) ใช้กับ stack อื่นได้

> ทำมาแล้ว 2 ตัวเป็นต้นแบบ: `SalesDocumentReturnSystem/learn.html` (ครบ 5 engine) · `product-stock/learn.html` (3 engine)

## เมื่อไรใช้
- Owner อยากได้สื่อทบทวน/สอนอ่านโค้ดของงานที่เพิ่งทำ
- ต้องการ doc ที่ "อ่านจบแล้วสร้างใหม่ได้เอง" ไม่ใช่แค่ comment ในโค้ด

## ⚠️ Engine: อย่าเขียนใหม่ — copy จากไฟล์เดิม
syntax-highlighter / tab / collapse / quiz / scroll-spy + callout 4 สี **มีครบใน `SalesDocumentReturnSystem/learn.html` แล้ว** (เป็น source ที่ใหม่สุด)
- copy `<style>` + `<script>` engine จากไฟล์นั้นมาเป็นโครง Section 0 แล้วปรับ **theme token** ให้ echo โปรเจคเป้าหมาย
- ห้าม rebuild highlighter เอง — มันใช้ private-use marker กัน regex ทับ attribute (บทเรียน [[project-product-stock]]) พังง่ายถ้าเขียนใหม่
- รายละเอียด markup convention (tab/quiz/callout) + แม่แบบ section + ชุดคำถาม grill → ดู `reference.md`

## Workflow (ซอยทีละ section มี checkpoint เสมอ)

1. **Grill ก่อนเริ่ม** — ถาม 8 คำถามใน `reference.md` (เป้าหมายการเรียน / ลำดับ / ความลึก / interactive / ชั้นเสริม / CSS / ที่วาง / จังหวะ) พร้อมเสนอคำตอบแนะนำ จน scope ชัด
2. **อ่านโค้ดจริงก่อนเขียนทุก section** — ห้ามเดาเนื้อหา; อ่านไฟล์ที่ section นั้นพูดถึงก่อนเสมอ (บทเรียนหลักของทีม: verify จริงก่อน declare)
3. **Section 0 = โครง + engine** — copy engine, วาง theme, sidebar nav, hero, stub section ที่เหลือ + ส่วน "วิธีใช้สื่อนี้" ที่โชว์ element ทุกชนิดทำงานจริง → checkpoint ให้ Owner เปิด browser ทดสอบ
4. **ไล่เนื้อตาม build order (dependency ล่าง→บน)** — model/API → service → store/state → shared (dumb) components → feature components → container → capstone; ทำทีละ section หยุด checkpoint ทุกครั้ง
5. **Capstone** — checklist "สร้างใหม่จากศูนย์" ตามลำดับ dependency + glossary + quiz รวบยอด (นี่คือ payoff ของเป้าหมาย "rebuild ได้เอง")
6. **ปิดงาน** — ตรวจไม่เหลือ stub, นับ section/quiz/tab, ปิด `</body></html>` ครบ

## Design rules เฉพาะสื่อสอน
- **callout = พื้น tint + icon badge** (concept🔑 / gotcha⚠️ / bug🐞 / why✅) — **ไม่ใช่ border-left หนา** (AI tell ที่จำง่ายสุด)
- **ใช้มือเบา AI-tell** ถึงจะเป็น doc เก็บอ่านเอง: ลด emoji เยอะเกิน, เลี่ยง scaffold ซ้ำ (อย่าให้ทุกหัวข้อมี analogy/callout/การ์ดเรียงเป๊ะ) — [[feedback-ai-tell-personal-docs]]
- เลข section ใช้ได้ถ้าสื่อ **ลำดับ build จริง** (มีความหมาย ไม่ใช่ตกแต่ง)
- numeric rules (contrast/ฟอนต์/motion) + AI-tell catalogue เต็ม → ใช้ skill `design-quality-guide` (advisory: flag → เสนอ Owner → Owner ตัดสิน)

## หลักการเล่าเรื่อง (สำคัญสุด)
ไล่ตาม **ลำดับ build dependency ล่าง→บน** เสมอ — เพราะตรงกับลำดับที่ต้อง reconstruct จริง แต่ละ section พึ่งเฉพาะของที่ section ก่อนสร้างไว้แล้ว
ถ้าเป้าหมายคือ "rebuild ได้เอง" ลำดับนี้คือสิ่งเดียวที่ทำให้ทำได้
