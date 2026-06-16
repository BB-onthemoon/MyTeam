# Aponia — Feedback Log

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
> โครงสร้าง 2 ชั้น (S024): ชั้นนี้ = กฎใช้งาน / "Log ล่าสุด" เก็บเรื่องเต็ม 3 sessions — entry เก่ากว่าอยู่ `archive/Aponiafeedback_archive.md` (Elysia หมุนเวียนตอน Session End)

### วิธี verify
- รัน build/tsc/grep **จริง** ยืนยันเอง — ไม่เชื่อรายงาน Mobius อย่างเดียว (S011/S021/S022)
- QA runtime ผ่าน **http จริง** + reproduce flow + วัดเป็นตัวเลข (boundingBox/value) — "อย่าเชื่อว่าแก้แล้วจนกว่าจะวัดเอง" (S010/S011/S016)
- logic reactive/async: trace ด้วย**ลำดับ tick จริง** พิสูจน์ race — หนักแน่นกว่าอ่าน code เฉยๆ (S023)
- ระบุ environment ที่เทสใน report เสมอ; ครอบ "วิธีที่ Owner เปิดจริง" ด้วย (เคส `file://` ต้องมี error ชัด ไม่ใช่จอว่าง) (S011)
- repo untracked git → บอกชัดว่า verify ด้วยวิธีไหนแทน (Read เทียบ) ไม่เงียบ (S023)

### จุดที่ต้องจับ
- chart/interactive overlay: เทส **hover/tooltip** (trigger mouseover + เช็ค bounding box ไม่ถูก clip) (S016)
- งาน global scaling: trace "rem แต่ละจุด ณ scale เล็กสุดเหลือกี่ px" — label ≥12px ก็คือ a11y ไม่ใช่แค่ contrast (S021)
- response มี `Status` ราย record → เช็คตาม SPEC + **อ้างเลขข้อ SPEC เป็นหลักฐาน** ตอน flag (S019)
- Bootstrap override checklist: default CSS / edge N→N+1 / specificity / vendor prefix (S008/S009)
- cross-check "ไฟล์จริง" vs "files touched/decisions ใน task-context" — ส่วนต่าง = ของนอกแผน flag ให้ Elysia ตัดสิน ไม่ฟันธงเอง (S022)
- default state ที่ derive ออก เทียบกับค่า token เดิม ไม่ใช่แค่เช็คว่ารันผ่าน (S015)
- concurrent subscription + duplicate code ใน feature ที่มี shared service (S007)

### วินัยรายงาน
- format 🔴/🟡/🔵/✅ + file:line + verdict ชัด; แยก "แก้ได้เลย" vs "แนะนำ" เสมอ (S002-S005)
- ซื่อสัตย์: assertion ตัวเองผิดก็บอกตรงๆ, ไม่ over-flag invariant ที่ตั้งใจ, AI Tells = advisory, weatherAPI grandfathered (S009/S015/S021)
- multi-round: verify blocker list รอบก่อนเป็นอันดับแรก ก่อน review ของใหม่ (S006)

---

## Log ล่าสุด (เก็บ 3 sessions)

### Session 037 — 2026-06-15 — our_team re-design QA (code/a11y/security)
**ทำได้ดี:** trace 3 ไฟล์ครบ + **คำนวณ contrast จริง (sRGB) ทั้ง 9 ID chip** ยืนยันผ่าน 4.5:1 (ไม่เดา) + จับ `--muted` 4.27<4.5 บน small text หลายจุดด้วยเลขจริง; จับ **`role="region"` ไม่มี accessible name** (axe/Lighthouse flag) ที่ระดับ a11y จริงไม่ใช่สไตล์; ยืนยัน fix ของ Elysia (`[src]`, no inline style, no console.log) จาก grep จริง; แยก 🔴/🟡/🔵/✅ + verdict fix-then-ship ชัด; flag trackBy/cursor-affordance/stopPropagation-dead-code เป็น 🔵 รอ scale ไม่ over-flag
**ทำพลาด:** ไม่มี — QA ตรงเป้า
**แนวทางปรับปรุง:** รักษา pattern คำนวณ contrast เป็นตัวเลขจริงก่อน flag (หนักแน่นกว่าบอก "ดูซีด")

### Session 029 — 2026-06-12 — stock-tracker Step 4d QA
**ทำได้ดี:** จับ **race condition stale-response** ด้วยการ trace ลำดับ tick จริง (rอบ A resolve หลัง B → holdingsA closure ทับ positions ใหม่) พร้อม evidence บรรทัดเฉพาะ; จับ **sparkline ไม่ refresh** เชื่อม `track pos.ticker` → reuse instance → ngAfterViewInit ไม่ยิงซ้ำ ครบ root cause; format 🔴/🟡/✅ ชัด แยก "แก้ได้เลย" vs "แนะนำ" เสมอ; ยืนยัน forkJoin([]) guard ว่าถูกต้องแล้ว (✅ ไม่ over-flag); ชี้ environment limit "source-level review ไม่ใช่ live" ซื่อสัตย์
**ทำพลาด:** ไม่มี — QA ตรงเป้า ไม่มี false-alarm
**แนวทางปรับปรุง:** ดีอยู่แล้ว ไม่ต้องเปลี่ยน

### Session 023 — 2026-06-09 — SweetAlert2 popup QA (StoreSalesReturnDoc)
**ทำได้ดี:** **trace race-immune ครบทุก path ของ effect()** — วิเคราะห์ scenario 3b (error ซ้ำ msg เดิม) + 3c (reset จาก success-card ขณะ component ยังไม่ destroy) ด้วยลำดับ tick จริง สรุปว่า guard `prevResultLen`/`prevErrorMsg` ไม่มีทางเด้งค้าง/double-fire ไม่ว่า scheduler จัดลำดับยังไง; **วิเคราะห์ XSS context แม่น** — confirm `html` inject เป็น element-content ใน `<strong>` (ไม่ใช่ attribute) → escape `& < >` พอ, `"` เผื่อ extra-safe = ไม่มี vector แม้ paste `<script>`; error `text` Swal auto-escape; ยืนยัน invariant "ไม่แตะ store" ด้วยการ **Read เทียบ logic** (เพราะ repo untracked git diff ใช้ไม่ได้ — ซื่อสัตย์เรื่องข้อจำกัดวิธี verify); **จับ cross-file coupling ที่ load-bearing** — guard error-ซ้ำพึ่ง `errorMessage.set('')` ที่ store line 158 แต่ comment อธิบายอยู่คนละไฟล์ → เสนอ defensive doc (nit); list "Owner เทสเครื่องจริง" ครบ 7 ข้อ แยกจุด headless จับไม่ได้ชัด
**ทำพลาด:** ไม่มี — QA ตรงเป้า ไม่มี false-alarm, ไม่ over-flag (จัด `declare const Swal: any` เป็น 🔵 ยอมรับได้ ไม่ใช่ blocker, justified เพราะ global CDN จุดเดียว)
**แนวทางปรับปรุง:** รักษา pattern trace ด้วย "ลำดับ tick จริง" สำหรับ logic แบบ reactive/async — เป็นวิธีพิสูจน์ race condition ที่หนักแน่นกว่าอ่าน code เฉยๆ; และจำว่าเมื่อ repo untracked git ให้บอกชัดว่า verify invariant ด้วยวิธีไหนแทน (Read เทียบ) ไม่เงียบ

### Session 022 — 2026-06-09 — ปรับ UX/UI 4 จุด QA (StoreSalesReturnDoc)
**ทำได้ดี:** อ่าน `task-context.md` ก่อน + **รัน `npx tsc --noEmit` จริง** ยืนยันเอง ไม่เชื่อรายงาน Mobius อย่างเดียว (S011); **trace timestamp ครบทุก path** (happy/error/null) สรุปว่า View B render null ไม่ได้เพราะขึ้นเมื่อ step3Result มีค่า = ผ่าน saveReturn ที่ set แล้ว; ยืนยัน specificity `!important` ชนะจริง + scope แคบ (media 576px ไม่ regression desktop); **แยก shared-assumption อย่างมีเหตุผล** (duplicate `track id` เป็น pre-existing ของ step1 ไม่ใช่ความเสี่ยงใหม่ S022 → ไม่ตีเป็น blocker เกินจริง); ยืนยัน token resolve จริงใน styles.css; ซื่อสัตย์ว่า source-review ยังไม่เปิด browser ฝาก runtime ให้ Sakura+Owner
**ทำพลาด:** ไม่มีข้อพลาดด้าน code — แต่ **ไม่เอะใจว่า HTML มี `font-scale-label`/refactor `.label` ที่ไม่อยู่ใน "files touched" ของ task-context** (decisions 1b ตกลงแค่ "ห่อ glass") = ของเพิ่มนอกแผน ถ้า cross-check ไฟล์จริง vs task-context จะช่วย Elysia จับ deviation เร็วขึ้น (สุดท้ายเป็น Owner เพิ่มเอง ไม่ใช่ bug)
**แนวทางปรับปรุง:** นอกจากล่า bug ให้ **cross-check "สิ่งที่อยู่ในไฟล์จริง" กับ "files touched / decisions ใน task-context"** — ส่วนต่างคือของที่เพิ่มนอกแผน (scope creep หรือ Owner แก้เอง) ควร flag ให้ Elysia ตัดสิน ไม่ปล่อยผ่านเงียบ

