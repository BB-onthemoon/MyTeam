# Task Context — <ชื่องาน>

> ความจำงาน intra-task (ต่อ context ข้ามหลาย spawn) — **Elysia เป็น single-writer**
> subagent **อ่านอย่างเดียว** ก่อนเริ่มทุก spawn (Elysia ฝัง pointer ใน spawn prompt)
> 🪶 เป็น **digest** ชี้ไป SPEC ไม่ก๊อปมาทั้งดุ้น
> 🗑️ งานจบ: กลั่นบทเรียนถาวรเข้า feedback_log/session-log ก่อน แล้ว **ลบไฟล์นี้ทันที**
>
> วิธีใช้: Elysia ก๊อปไฟล์นี้เป็น `.claude/docs/task-context.md` ตอนเริ่มงานที่จะ spawn subagent >1 รอบ

---

## 1. Task header
- **งาน:** <ชื่องาน>
- **SPEC / Mockup:** <ลิงก์ไฟล์ เช่น `SalesDocumentReturnSystem/SPEC.md`>
- **เริ่ม:** <วันที่จาก Get-Date>
- **Session:** <Sxxx>

## 2. Plan + step status  ⭐
> หัวใจของความต่อเนื่อง — สถานะ: ✅ เสร็จ / 🔄 กำลังทำ / ⬜ รอ

- [ ] A — <สรุปสั้น> ⬜
- [ ] B — <สรุปสั้น> ⬜
- [ ] C — <สรุปสั้น> ⬜

## 3. Files touched  ⭐
> รายการไฟล์ที่ "สร้าง/แก้แล้วจริง" — กัน false-alarm ว่า step ก่อนยังไม่ได้ทำ

| ไฟล์ | สถานะ | จุดประสงค์ (บรรทัดเดียว) |
|---|---|---|
| `path/to/file` | สร้าง / แก้ | <...> |

## 4. Decisions / invariants
> ข้อตกลงสถาปัตยกรรมที่ step หลังต้อง "เคารพ" ห้ามเผลอรื้อ

- <เช่น: Store เป็น signal-based เป็นที่เดียวที่ subscribe>
- <เช่น: ใช้ `[(ngModel)]` ไม่ใช่ `[value]` บน control ใน `@if`/`@for`>

## 5. Repo state
- **build:** เขียว / แดง — (คำสั่งที่ verify เช่น `ng build`)
- **warning / backlog ค้าง:** <...>

## 6. Next step brief
> ให้ Elysia ส่ง pointer สั้นๆ แทน re-derive ใหม่ทุกรอบ

- **รอบหน้าทำ:** <step ถัดไป + ไฟล์ที่เกี่ยว + จุดที่ต้องระวัง>
