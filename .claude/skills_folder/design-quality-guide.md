# Design Quality Guide — เลี่ยง "AI Tells"

> ดัดแปลงจาก Impeccable (pbakaus) ให้เข้ากับ stack ของเรา: **Angular 21 + Bootstrap 5 + minimal style**
>
> **สถานะ: ที่ปรึกษา ไม่ใช่กฎตายตัว** — flag เพื่อให้คิด ไม่ใช่บังคับแก้ Owner ตัดสินใจสุดท้ายเสมอ
> weatherAPI = design ที่ตั้งใจแล้ว (grandfathered) ไม่ต้องแก้ตาม guide นี้
>
> **เป้าหมาย:** Dashboard ต้องไม่ออกมาเหมือน "พิมพ์เขียวจากโรงงานที่สร้างจาก prompt เดียว"

---

## 🚩 ส่วนที่ 1 — "AI Tells" ที่ทำให้ดีไซน์ดู generic (เลี่ยงถ้าทำได้)

| Tell | ทำไมดู AI | หมายเหตุสำหรับ Bootstrap |
|---|---|---|
| ขอบสีหนาด้านเดียวบนการ์ด (`border-left` หนาๆ) | tell ที่จำง่ายที่สุด | เลี่ยงการใช้ accent border ซ้ายแบบ default |
| ตัวอักษรไล่สี (`background-clip: text`) | ตกแต่งเกินจำเป็น | — |
| Glassmorphism (blur ฟุ้งๆ) ใช้พร่ำเพรื่อ | "look เท่ของ AI" | ใช้เมื่อมีเหตุผลเท่านั้น |
| การ์ดหน้าตาเหมือนกันเรียงยาวไม่จบ | ขาดลำดับความสำคัญ | Bootstrap card ใช้ได้ แต่ให้มี hierarchy/variation |
| `border: 1px solid` + `box-shadow` ฟุ้ง บน element เดียว | AI tell คลาสสิก | เลือกอย่างใดอย่างหนึ่ง |
| มุมโค้งเกินเหตุ (`border-radius` > 32px) | — | เพดานแนะนำ 12–16px |
| purple/violet gradient, cyan-on-dark | palette ของ AI | minimal style ของเราเลี่ยงอยู่แล้ว |
| eyebrow ตัวพิมพ์ใหญ่จิ๋วเหนือทุก section ("ABOUT") | scaffold ของ AI | ใช้เท่าที่จำเป็น |
| numbered section markers (01/02/03) แบบสะท้อนกลไก | scaffold ของ AI | ใช้เมื่อมีความหมายจริง |

---

## 📐 ส่วนที่ 2 — กฎตัวเลขที่ยึดได้ (ของดีที่ไม่ขัดกับใคร)

- **Contrast:** body text ≥ 4.5:1, ตัวใหญ่ ≥ 3:1, placeholder ก็ต้อง ≥ 4.5:1 (ห้าม gray จางเกิน)
- **Font size:** body แนะนำ ≥ 16px (advisory — ทีมเราคง 14px เป็นขั้นต่ำเดิมได้ ถ้า design กำหนด), ใช้ `rem` ไม่ใช้ `px`
- **Line length:** 45–75 ตัวอักษรต่อบรรทัด (ใช้ `max-width: 65ch`)
- **Hierarchy:** ขนาด heading ต่างกันชัด (ratio ≥ 1.25) อย่าให้ 14/15/16px ปนกันจนมั่ว
- **Font family:** ≤ 3 แบบ (display / body / mono ถ้าจำเป็น)
- **Motion:** easing แบบ ease-out (เลี่ยง bounce/elastic) + มี `prefers-reduced-motion` เสมอ
- **Animation:** ไม่ animate layout property (width/height/padding/margin) → ใช้ `transform`/`opacity` กัน layout thrash
- **Heading:** อย่าข้ามลำดับ (h1 → h3) เพื่อ screen reader
- **Padding ในคอนเทนเนอร์ที่มีขอบ/สี:** อย่างน้อย 8px ดีสุด 12–16px

---

## ✅ ส่วนที่ 3 — วิธีใช้ guide นี้

1. เป็น **checklist ช่วยคิด** ไม่ใช่ gate ที่บล็อกงาน
2. เจอจุดที่ตรง tell → **เสนอ Owner พร้อมเหตุผล** ไม่แก้เองเงียบๆ
3. ขัดกับ Bootstrap / รสนิยม minimal ของ Owner → **เลือกตามบริบทงาน**
4. design ที่ตั้งใจไว้แล้ว = ไม่ใช่ bug (เช่น weatherAPI pastel lofi + card carousel)

---

## บทบาทของแต่ละ agent

| Agent | ใช้ตอนไหน | เน้นส่วนไหน |
|---|---|---|
| **Sakura** | ตอนออกแบบ mockup | ส่วนที่ 1 (AI Tells เชิงดีไซน์) |
| **Mobius** | ตอนเขียน CSS | ส่วนที่ 2 (AI Tells เชิงโค้ด) |
| **Aponia** | ตอน QA | ทั้ง 2 ส่วน แบบ advisory — flag เสนอ Owner |
