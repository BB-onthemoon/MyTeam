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
- **HTML/CSS/JS:** เริ่มต้น — ยังอยู่ในช่วงเรียนรู้ แต่ **ลงมือ debug/refactor เองได้แล้ว** (S012: แยก inline `<script>`/`<style>` ใน office.html ออกเป็น `office.js`/`office.css` เอง → แก้บั๊ก data ที่ทีมยัง debug ไม่จบใน S011 ได้สำเร็จ) และ**แก้ working tree เองระหว่าง session ได้** (S022: เพิ่ม element/refactor `.label` เอง)
- **Angular:** กำลังเรียนอยู่ — setup โครงสร้าง component เองได้ (ขึ้น skeleton landing-page-pj + วางโครง SalesDoc เองบางส่วน S018) และมีสื่อการสอน `learn.html` ไว้ทบทวนโค้ดที่ทีมเขียน (S013, S020)
- **API / Fetch:** ใช้งานระดับ flow ได้ — เข้าใจ 3-API wizard ของ SalesDoc (S017-019), ประสาน CORS prod กับรุ่นพี่เองได้
- **Dashboard / Data Viz:** — (ยังไม่ทราบเชิงลึก — ผ่านงาน ApexCharts S016 ในฐานะผู้ review)
- **Git / Version Control:** ใช้พื้นฐานได้ — commit/push ผ่านทีม, แยก repo `StoreSalesReturnDoc` ออกจาก SalesDoc เอง (S021)

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
- **ลงมือแก้โค้ดเองระหว่าง session ได้** (Session 012, 022) — ไม่รอทีมอย่างเดียว: แยกไฟล์ html/css/js เองจนแก้บั๊ก data ที่ค้างได้ แล้วค่อยกลับมาให้ทีมปรับ UI ต่อ. ชอบ **แยกไฟล์เพื่อ maintenance** (สอดคล้องกับชอบ component แยกชัด). ทีมควรมองว่า Owner เป็น collaborator ที่ลงมือได้ ไม่ใช่แค่ผู้รับงาน — **และเจอ diff แปลกใน working tree ต้องถามก่อนสรุปว่าใครแก้** (บทเรียน S022)
- **ชอบให้ grill ก่อนลงมือ** (S019+) — Owner เพิ่ม skill `grill-me` ให้ Elysia เอง: งาน coding ต้อง grill ทุกครั้ง, งานอื่นถามก่อนว่าจะ grill ไหม — สะท้อนว่า Owner ให้ค่ากับ shared understanding มากกว่าความเร็ว
- **ตาไวเรื่อง AI-tell ในงาน design/doc** (S020) — จับได้แม้ในสื่อที่เก็บอ่านเอง; ทีมควร "มือเบา" ตั้งแต่แรก ไม่ใช่รอ Owner ทัก
- **เลือกตัด nice-to-have เพื่อรักษา invariant ได้เด็ดขาด** (S023) — เช่น ข้าม store-comment เพราะรักษากฎ "ไม่แตะ store" สำคัญกว่าความสวยเล็กน้อย
- **ใช้ fast path บ่อยกับงานปรับ UI บนของเดิม** (S021-S023) — สั่ง "Mobius code เลย" ข้าม mockup เมื่อมี ref ชัด; ดู `workflow.md > Fast Path`

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

> 🗄️ **ย้ายไป `.claude/docs/session-log.md` ที่เดียว (single source of truth) ตั้งแต่ S024** — ไฟล์นี้เก็บเฉพาะ "สิ่งที่รู้เกี่ยวกับ Owner" ไม่ duplicate ประวัติ session อีก (table เดิมเคยค้างที่ S012 เพราะซ้ำ 2 ที่)

---

## สิ่งที่ยังไม่รู้ / ต้องหาโอกาสถาม

- ระดับความรู้ด้าน Dashboard / Data Viz เชิงลึกของ Owner
- Landing page (Coffee Shop) ยังจะกลับมาทำต่อไหม หรือ focus งาน SalesDoc/StoreSalesReturnDoc แล้ว?
- WeatherAPI งานค้าง (persist pinnedCities + header/side-nav) จะหยิบกลับมาเมื่อไร?
