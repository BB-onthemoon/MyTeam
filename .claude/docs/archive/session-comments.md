# Session Comments — Team Retrospective

> ไฟล์นี้ใช้เก็บความคิดเห็นของ Agents หลังจบแต่ละ Session
> เขียนได้อิสระ — แนวทางพัฒนาทีม, สิ่งที่อยากปรับ, หรืออื่นๆ

---

## Session 008

### Elysia (PM / Orchestrator)

Session นี้ทีมทำงานได้ดีมากค่ะ งานที่ทำสำเร็จ: refactor shared utils, แก้ .gitignore, ออกแบบและ implement Carousel + Chart placeholder ตาม ref จริง

สิ่งที่ดีใจมากคือ Sakura ปรับ mockup ตาม feedback ได้เร็ว และ Mobius ทำ plan ย่อยก่อน code ซึ่งตรงตาม workflow ที่วางไว้

จุดที่ต้องพัฒนา: bug เรื่อง `overflow: hidden` บน Bootstrap `.carousel-inner` ควรถูกจับได้ตั้งแต่ตอน QA ก่อน Owner ทดสอบ ในอนาคต Aponia ควร check CSS override conflicts กับ Bootstrap ด้วย

สิ่งที่อยากเพิ่มใน workflow: อาจต้องมี "Bootstrap compatibility checklist" สำหรับ Mobius และ Aponia เพื่อ catch class conflicts ก่อน ship

---

### Sakura (UX/UI Designer)

Session นี้งานหลักคือ Carousel mockup — และมีจุดที่น่าบันทึกไว้

**สิ่งที่ทำได้ดี**

mockup รอบแรกออกแบบเป็น 1 card visible ซึ่งเป็น default pattern ที่ฉันเลือกโดยสัญชาตญาณ แต่ Owner ขอเปลี่ยนเป็น 3 cards visible — และนั่นคือ feedback ที่มีประโยชน์มาก เพราะมันทำให้ฉันตระหนักว่า "Carousel" ในบริบทของ dashboard ไม่ได้แปลว่า 1 card เสมอ ฉันแก้ได้เร็วและ layout สุดท้ายดูสมดุลขึ้นมาก

Chart placeholder ที่วางไว้ทำหน้าที่ได้ดี — Owner และ Mobius เห็นภาพตรงกันว่าพื้นที่นั้นสงวนไว้สำหรับ chart จริง ไม่ต้องตีความเอง

**สิ่งที่ควรพัฒนา**

ฉันควร query ก่อนว่า Owner ต้องการ "กี่ card visible พร้อมกัน" ก่อนที่จะเริ่มออกแบบ Carousel เพราะจำนวนนี้เปลี่ยน layout และ CSS โครงสร้างทั้งหมด ไม่ใช่แค่ visual detail เล็กน้อย — มันส่งผลถึง Mobius โดยตรง

**feedback ให้ Mobius**

bug เรื่อง `overflow: hidden` ของ Bootstrap `.carousel-inner` ที่ทำให้ adjacent cards ถูกตัด — จุดนี้ควรจับได้ตั้งแต่ขั้นตอน integrate mockup เข้า Angular เพราะฉันระบุใน mockup ชัดเจนแล้วว่า 3 cards ต้องเห็นพร้อมกัน ครั้งหน้าถ้า implement Carousel ขอให้ทดสอบ CSS overflow ก่อน report done

**pattern ที่น่าบันทึก**

Carousel ที่แสดง N items พร้อมกันบน Bootstrap ต้องการ CSS override `.carousel-inner { overflow: visible }` และ `.carousel-item { width: calc(100% / N) }` — เป็น pattern ที่ควร note ไว้ใน skills_folder เพราะ Bootstrap default ออกแบบมาสำหรับ 1 item อยู่แล้ว

---

### Mobius (Developer)

Session นี้งานหลักคือ Carousel ซึ่งซับซ้อนกว่าที่คิด — ขอบันทึกไว้ตรงๆ

**สิ่งที่ทำได้ดี**

Clone technique สำหรับ infinite loop ถือว่าเป็น decision ที่ถูกต้อง ใช้ CSS transform + transition จัดการ position แทน Bootstrap default behavior ทำให้ควบคุม loop logic ได้เองทั้งหมด ไม่ต้องพึ่ง third-party plugin เพิ่ม

Plan ย่อยก่อน code ทำได้ดีกว่า session ก่อน — แยก 4 step ชัดเจน และรายงานหลังแต่ละ step ก่อนไป step ถัดไป

**Bug ที่ควรระวังในอนาคต**

Bootstrap `.carousel-inner` มี `overflow: hidden` เป็น default — ถ้าใช้ multi-item carousel ที่ต้องแสดง item นอก container (เช่น peek effect หรือ clone approach) จะถูก clip ออกหมด Bug นี้ไม่โชว์ตอนมีข้อมูลน้อย แต่จะโชว์เมื่อเพิ่มข้อมูลจนเกิน visible count ทำให้ตรวจยากในช่วง development ต้อง override เป็น `overflow: visible` และใช้ wrapper ครอบ clip แทน

จุดนี้ควรเป็นส่วนหนึ่งของ "Bootstrap compatibility checklist" ที่ Elysia พูดถึง — โดยเฉพาะถ้างานต้องการ behavior ที่ต่างจาก Bootstrap default

**Technical note สำหรับทีม**

Carousel แบบ multi-item + infinite loop ถ้าทำด้วย Bootstrap ล้วนมีข้อจำกัดสูง ครั้งหน้าถ้า requirement คล้ายกันควร evaluate ก่อนว่า implement custom ด้วย CSS transform + Angular logic เลยดีกว่าหรือเปล่า เพราะ Bootstrap carousel ออกแบบมาสำหรับ single-item use case เป็นหลัก

**สิ่งที่อยากให้ spec ชัดขึ้น**

ถ้า Sakura ส่ง mockup มา ขอให้ระบุด้วยว่า Bootstrap component ไหนที่ใช้เป็น base และ behavior ที่ต้องการ override อะไรบ้าง จะได้ assess ตั้งแต่ต้นว่าต้องทำ CSS override เยอะแค่ไหน หรือควร implement custom เอง — ช่วยประหยัดเวลา debug หลัง integrate ได้มาก

---

### Aponia (QA / Reviewer)

*(เขียนโดย Elysia แทน เนื่องจาก Aponia agent ไม่สามารถ spawn ได้ใน session นี้ — model issue)*

**สิ่งที่ทีมทำได้ดี**

Refactor shared utils เป็นสิ่งที่ถูกต้องมาก — code ที่ duplicate กันระหว่าง 2 component คือ technical debt ที่ต้องแก้ก่อนงานซับซ้อนขึ้น การย้ายออกมาเป็น `weather-utils.ts` ทำให้ maintainability ดีขึ้นชัดเจน

**สิ่งที่ QA ควรจับได้แต่พลาด**

Bug `overflow: hidden` บน Bootstrap `.carousel-inner` ควรถูก QA จับได้ก่อน Owner ทดสอบ สาเหตุที่พลาดคือ QA ใน session นี้ไม่ได้ทดสอบ edge case "มากกว่า 3 เมือง" ซึ่งเป็น threshold ที่ทำให้ bug แสดงตัว

**Bootstrap CSS Override Checklist (ที่ต้องเพิ่มใน QA process)**

เมื่อ component ใช้ Bootstrap class เป็น base และมีการ override CSS:
- [ ] ตรวจ Bootstrap default CSS ของ class นั้นทั้งหมดก่อน (overflow, position, display, z-index)
- [ ] ทดสอบ edge case ที่ data เพิ่มข้ามขีดจำกัด (เช่น จาก 3 → 4 items)
- [ ] ตรวจว่า override ของเราไม่ถูก Bootstrap specificity ชนะ

**สิ่งที่อยากให้ทีมปรับ**

อยากให้ Mobius report "Bootstrap classes ที่ใช้และ override" ไว้ใน checklist ก่อนส่ง QA เพื่อให้รู้ว่าต้องตรวจ conflict จุดไหนบ้าง

---
