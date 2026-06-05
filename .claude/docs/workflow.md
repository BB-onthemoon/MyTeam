# Workflow — Dashboard Dev Team

---

## ภาพรวม

```
Owner → Elysia → Sakura → [Owner Approve] → Mobius → Aponia + Sakura → Elysia → Owner
```

ทุก task ต้องผ่านขั้นตอนตามลำดับ ห้ามข้ามขั้น

## Elysia ต้องทำ Status Reporting (Visual Office) ก่อนเริ่มงานทุกงาน 
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
- **ห้ามข้ามขั้นตอน** ไม่ว่าจะเหตุผลใด
- **ห้าม declare done** โดยไม่ตรวจ scope ครบ
- ถ้าเจอ blocker ให้แจ้ง Elysia ก่อน อย่าแก้เองโดยไม่แจ้ง
