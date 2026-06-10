# Handoff — ส่งงานข้าม Session (ไฟล์เดียว)

> **ระบบไฟล์เดียว (ตั้งแต่ S024):** Elysia ก๊อปไฟล์นี้เป็น `.claude/docs/handoff.md` ตอนปิด session ที่**มีงานค้าง** — เขียนทับของเก่าได้เสมอ (ประวัติเต็มอยู่ `session-log.md` แล้ว ไม่ต้องเก็บราย session)
> **คนเขียน:** Elysia ตอนปิด session / **คนอ่าน:** Elysia ตอนเปิด session ถัดไป — อ่านก่อนเริ่มงานใดๆ
> **Lifecycle (mirror กับ task-context):** มีไฟล์ = มีงานค้าง → เปิด session ใหม่อ่าน → resume งานแล้ว **ลบทันที**
>
> ⚠️ **ห้ามก๊อปเนื้อหาซ้ำกับ `task-context.md`** — ถ้างานค้างเป็น task หลาย step ที่มี task-context อยู่แล้ว ให้**คงไฟล์นั้นข้าม session** แล้ว "ชี้" ไปที่มัน; handoff เก็บเฉพาะ context **ระดับ session** ที่ task-context ไม่มี
>
> 🧭 แยก axis ให้ถูก: `task-context.md` = ความจำ**ภายใน task** ให้ subagent ที่ spawn หลายรอบ / `handoff.md` = ความจำ**ข้าม session** ให้ Elysia เอง

---

## สถานะปัจจุบัน

**Session ที่ปิด:** Sxxx — <วันที่จาก Get-Date>
**งานที่ค้าง:** ...
**อยู่ที่ Step:** ... (ดู workflow.md)
**task-context.md:** ☐ มี → คงไว้แล้ว รายละเอียด step/ไฟล์/decision ดูที่นั่น / ☐ ไม่มี (งานค้างเป็น one-shot)

---

## สิ่งที่ทำเสร็จแล้วใน session นี้

-

---

## Todo session ถัดไป (เรียงลำดับความสำคัญ)

- [ ]

---

## สิ่งที่รอถาม / รอ Owner ตัดสินใจ

-

---

## ข้อมูลระดับ session ที่ task-context ไม่มี

> เช่น งานรองอื่นที่ค้างคนละ task, ข้อตกลงปากเปล่ากับ Owner, สิ่งแวดล้อมที่ต้องเตรียม (dev server / proxy / API key)

-
