# Sakura — Feedback Log

---

## Format การบันทึก

```
### Session [วันที่] — [ชื่องาน]
**ทำได้ดี:** ...
**ทำพลาด:** ...
**แนวทางปรับปรุง:** ...
```

---

## กฎที่กลั่นแล้ว ⭐ (อ่านทุก spawn — กลั่นจากทุก session)
> โครงสร้าง 2 ชั้น (S024): ชั้นนี้ = กฎใช้งาน / "Log ล่าสุด" เก็บเรื่องเต็ม 3 sessions — entry เก่ากว่าอยู่ `archive/Sakurafeedback_archive.md` (Elysia หมุนเวียนตอน Session End)

## Log ล่าสุด (เก็บ 3 sessions)

### Session 029 — 2026-06-12 — stock-tracker Step 4d UI Review
**ทำได้ดี:** findings ครบ 12 ข้อ ชัดทุกจุด — ชี้ font floor 11px vs กฎ S021 (12px) ถูกต้อง 3 จุด, touch target .btn-remove 28px < 44px พร้อมวิธีแก้, จับ focus ring ถูกปิดไม่มี custom แทน (WCAG 2.4.7), จับ dead binding isLoading ด้วยการ trace code logic (ไม่ต้องรัน browser); แยก "ต้อง verify browser" ออกจาก "ฟันธงได้จาก code" ชัดเจน; format ตาราง summary ชัด เรียงตาม priority
**ทำพลาด:** ไม่มี — QA ตรงเป้า
**แนวทางปรับปรุง:** ดีอยู่แล้ว

### ก่อนออกแบบ
- requirement กำกวม (โทนสี, จำนวน card visible, slide/loop behavior) → ถาม Owner ก่อน อย่าเดา — เดาผิด = revise CSS ทั้งชุด (S005/S008)
- field ที่ค่า "อาจมาจาก step ก่อน" → เช็ค SPEC/Elysia ว่า prefill หรือ user-input ก่อนวาง (S017)
- เทคนิค layout ที่ต้องเล็งพิกัดเอง (iso transform) เปราะ — เลือกวิธี deterministic (Grid/top-down) (S010)
- pattern ที่ได้ผล: ทำ step แรกให้ Owner approve ทิศทางก่อน แล้วขยาย step ถัดไปด้วย design ต่อเนื่อง (S017)

### Mockup / Spec ส่งต่อ Mobius
- mockup = static HTML+CSS เท่านั้น; ส่วนที่ต้อง JS → note แยกให้ Mobius (S002)
- spec derive สี: ระบุทิศให้ตรง delta ของ token เดิมจริง ไม่เขียนลอยๆ (S015 — root cause ฝั่ง spec)
- component ใหม่ที่แทนของเดิม → note ชัดว่า "ต้องเปลี่ยน JS render + ลบ class เก่า" ไม่ใช่วาง CSS เฉยๆ (S011)
- AI Tells = advisory; ใช้ tell ด้วยเจตนาให้ note เหตุผลกำกับ (S009)

### QA UI
- เทียบ**ภาพ reference จริง** — จับ layout bug (centering) ที่อ่าน CSS เฉยๆ ไม่เห็น (S019)
- chart/interactive overlay ต้องเทส **hover/tooltip** ด้วย ไม่ใช่แค่ static layout + responsive (S016)
- ฟีเจอร์ scale ได้: เช็คทั้งปลายใหญ่ (ล้น/แตก) และปลายเล็ก (ตัวอักษร <12px / touch ต่ำกว่า min) — "ironic a11y" (S021)
- เทียบกับ decisions ใน task-context ด้วย — element นอกแผน flag ให้ Elysia ตัดสิน (อาจเป็น Owner แก้เอง) (S022)
- ตรวจ intent + simpler-alternative ก่อนลงรายละเอียด; pattern ที่ดูไม่ consistent แต่ถูก ให้อธิบายเหตุผล UX กัน false-positive (S023)
- ระบุชัดทุกข้อว่า "วิเคราะห์จาก code" vs "ต้อง verify browser" — ไม่ฟันธงของ runtime (S011/S016/S021)
- ฟีเจอร์สี: เทียบ default ที่ derive ออกกับสภาพเดิมก่อน user แตะ (S015)
- vendor prefix + stylesheet load order ใน angular.json = checklist ประจำ (S006/S007)
- อ่าน component.ts ด้วย — order/data มาจาก TS ไม่ใช่แค่ HTML (S004)
- class ไม่ตรง mockup = cleanup ที่ต้องทำ ไม่ใช่ minor ปล่อยผ่าน (S011)

---

## Log ล่าสุด (เก็บ 3 sessions)

### Session 023 — 2026-06-09 — SweetAlert2 popup UI/UX QA (StoreSalesReturnDoc)
**ทำได้ดี:** **ตรวจ intent + simpler-alternative ก่อน** (Swal เหมาะกับ scale โปรเจคนี้ — `window.confirm` ไม่รองรับ Thai UI, custom modal scope ใหญ่กว่า); **วิเคราะห์ consistency popup(step3) vs inline-alert(step1/2) ว่าเหมาะสมไม่สับสน** ด้วยเหตุผล UX จริง (popup=action การเงิน irreversible / inline=validation ใกล้ input ให้ context แก้) ไม่ตี false-positive ว่า "ไม่ consistent"; แยก role popup-success vs success-card ชัด (immediate feedback vs รายละเอียดอ้างอิง = ไม่ซ้ำซ้อน); เสนอ nice-to-have ที่มี user-value จริง (error footer fallback เผื่อ API คืน technical string, cancelColor ตรง token) **แยก "ควรแก้" vs "nice-to-have" ชัด**; ระบุชัดทุกข้อว่าวิเคราะห์จาก code vs ต้อง verify browser (font ไม่ inherit IBM Plex, animation, backdrop block double-submit)
**ทำพลาด:** ไม่มี — QA ตรงเป้า advisory ใช้มือเบา (ไม่ flag เรื่องสี icon ที่ Owner ตัดสินแล้ว)
**แนวทางปรับปรุง:** รักษา pattern "ตรวจ intent + simpler-alternative ก่อนลงรายละเอียด" และ "อธิบายว่าทำไม pattern ที่ดูไม่ consistent จริงๆ เหมาะสม" — กัน false-positive ที่ทำให้ Owner เสียเวลาแก้ของที่ถูกอยู่แล้ว

### Session 022 — 2026-06-09 — ปรับ UX/UI 4 จุด UI/UX QA (StoreSalesReturnDoc)
**ทำได้ดี:** **จับ consistency gap ที่เกิน brief แต่ถูกต้อง** — brief พูดแค่ searchbox step2 แต่ Sakura เห็นว่า step1 ใช้ input-group pattern เดียวกัน = มี bug มือถือตัวเดียวกัน → เสนอแก้ด้วย (Owner เห็นด้วย, Elysia แก้); flag edge เพิ่ม (empty chips → orphan label, glass 2 ก้อนสูงไม่เท่าตอน scale xl, contrast ปุ่ม inactive ~4.5:1 ขอบ AA); **ระบุชัดทุกข้อว่า "วิเคราะห์จาก code" vs "ต้อง verify browser"** (S011/S016); ตาราง brief↔implement ครบ 4 จุด แมปตรง requirement
**ทำพลาด:** ไม่มีข้อพลาดหลัก — (เหมือน Aponia) ไม่เอะใจว่า label "ขนาดตัวอักษร" + `.label` refactor **ไม่อยู่ใน decisions ของ task-context** (1b ตกลงแค่ "ห่อ glass") = element นอกแผน ควร flag ว่า "นี่อยู่นอก scope ที่ approve หรือเปล่า?" (สุดท้าย Owner เพิ่มเอง)
**แนวทางปรับปรุง:** เวลา QA UI ให้เทียบกับ **decisions ใน task-context** ด้วย ไม่ใช่แค่ brief — ถ้าเห็น element ที่ไม่อยู่ใน decision ที่ตกลงกัน (เช่น label ที่ไม่ได้คุย) ให้ flag ว่าเป็นของนอก scope/approve หรือไม่ ช่วย Elysia จับ deviation เร็ว

