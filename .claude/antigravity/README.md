# Antigravity Integration — ทีมลูกผสม Claude + Gemini

โฟลเดอร์นี้เก็บไฟล์สำหรับเชื่อม **Google Antigravity (Gemini)** เข้ากับทีม **Dashboard Dev Team (Claude)**
เป้าหมาย: ย้ายงาน "เขียนโค้ดปริมาณเยอะ" ไปใช้โควต้า **Google AI Pro** (จ่ายแล้ว) เพื่อ **ประหยัด Claude token**

---

## 🧠 ปรัชญา: filesystem คือสะพานเชื่อม

Antigravity กับ Claude Code เป็นคนละโปรแกรม คนละความจำ — **ไม่ sync กันอัตโนมัติ**
แต่ทั้งคู่ทำงานบน **ไฟล์ในเครื่องเดียวกัน** ได้ → เราแชร์ "ผลงาน" ผ่าน git working tree ไม่ใช่แชร์ความจำ

## 👥 การแบ่งงาน (แบ่งตามจุดแข็งทางเศรษฐศาสตร์ของแต่ละโมเดล)

| งาน | ใคร | ทำไม |
|---|---|---|
| คุย requirement, grill, วาง spec/architecture | **Elysia (Claude)** | งานตัดสินใจ — token น้อย leverage สูง |
| เขียนโค้ด component/boilerplate ตาม spec | **Gemini (Antigravity)** | งานปริมาณ — กิน token เยอะสุด → ย้ายไปโควต้าฟรี |
| QA: bug / security / design critique | **Aponia + Sakura (Claude)** | งานวิจารณ์ — ต้องสายตาคม |
| เปิดเว็บเทสจริง + screenshot | **Antigravity** | มี browser-verify ในตัว แก้ปัญหา "verify จริงก่อน declare done" |

> หัวใจ: **Gemini = คนเขียน (ปริมาณ, ฟรี) / Claude = คนคิด + คนตรวจ (คุณภาพ)**

---

## 🔄 Workflow ลูกผสม (1 รอบงาน)

1. **Elysia (Claude)** grill Owner → เขียน spec + step plan ลงไฟล์ในโปรเจค (เช่น `spec.md`)
   - 🎨 **งาน UI/dashboard (กฎ S032 — Design-First):** ก่อนส่ง Bronya ให้ **Sakura วาง Design Direction ก่อนเสมอ**
     (Step 2: primary goal / ข้อมูลสำคัญสุด / reading order / layout pattern + token) → Owner approve → **ฝัง direction
     เข้า brief Bronya** — *อย่าปล่อยให้ Bronya เดา layout เอง* (บทเรียน git-visualizer: ไม่มี direction → Bronya default เป็น AI tell เช่น accent bar/การ์ดเท่ากัน)
2. Owner เปิด **Antigravity IDE** บนโฟลเดอร์โปรเจคนั้น → โยน spec ให้ Gemini เขียนโค้ด *(ไม่กิน Claude token)*
3. Gemini เปิด browser เทสเอง → ได้ Artifacts (screenshot/recording)
4. Owner กลับมา Claude Code → **Elysia + Aponia + Sakura** อ่าน diff + Artifacts → QA/วิจารณ์
5. แก้รอบสุดท้าย (ฝั่งไหนก็ได้)

> นี่คือ **โหมด 1: Owner ขับ IDE เอง** (ประหยัด Claude token สูงสุด, manual)

---

## 🤝 โหมด 2: Elysia orchestrate Bronya ผ่าน CLI ("agents คุยกันเอง")

Antigravity CLI (`agy`) รองรับ headless → **Elysia (Claude) สั่ง Bronya (Gemini) ได้ตรงผ่าน Bash** ไม่ต้องให้ Owner เดินสาร

**สูตรที่ใช้ได้จริง** (เทสผ่าน S030):
```bash
# binary อยู่ที่ %LOCALAPPDATA%\agy\bin\agy.exe (PATH อาจไม่เข้า — ใช้ full path)
agy --dangerously-skip-permissions -p "<brief + context>" </dev/null
```
- ⚠️ **text response ของ Bronya ออกทาง TTY ไม่ลง stdout** (Windows console bypass) → **deliverable = ไฟล์** ที่เธอเขียน (Elysia อ่าน `git diff` ตรง); อยากได้คำอธิบายให้สั่งเธอเขียนลงไฟล์
- `--dangerously-skip-permissions` กัน agent ค้างรอ approve ตอนเขียนไฟล์ · `</dev/null` กันค้างรอ stdin
- scope: รันใน cwd = project folder (หรือ `--add-dir`) · model default = Gemini 3.5 Flash

**"agents คุยกันเอง" + Owner เห็นทุก turn:** ใช้ **ไฟล์กระดานร่วม** (เช่น `_agy_bridge/DISCUSSION.md` — ต้องอยู่ **นอก** `.claude/` เพราะ Bronya ห้ามแตะ .claude) Elysia เขียน turn → `agy -p` ให้ Bronya อ่าน+ต่อท้าย → Elysia อ่าน+ตอบ → วน · Owner เปิดไฟล์ดู dialogue โต real-time

---

## 📋 Handoff Protocol (ข้อตกลงมาตรฐาน — Elysia ↔ Bronya ออกแบบร่วมกัน S030)

> บังคับใช้ทุกงาน · ฝั่ง Bronya ฝังใน `GEMINI.md §11` แล้ว

**Elysia → Bronya (Task Brief 8 ข้อ):**
1. Task · 2. Project (**ให้ path** ไม่แนบ source กัน stale) · 3. Spec · 4. API
5. **Data shape** ⭐ (**ตัวอย่าง JSON จริง 1-2 record** — mandatory) · 6. **Explicit Negative Constraints** ⭐ (สิ่งที่ "ห้ามทำ" ชัดๆ)
7. Constraints/invariants · 8. QA feedback (รอบแก้ — checklist Aponia/Sakura)

> ⭐ **ตัวชี้เป็นชี้ตายของคุณภาพรอบแรก (Meeting S032 — Bronya ชี้เอง):**
> - **Data shape ต้องมี sample JSON จริง** (ไม่ใช่แค่ชื่อ endpoint) → Bronya ทำ `interface` ตรง ตัด runtime error #1
> - **Negative Constraints** ("ห้ามแตะ component พ่อ/ห้ามเพิ่ม lib/ห้ามแก้ service เดิม") → จำกัด blast radius, Bronya เดินไม่ออกนอกลู่
> - ถ้า 2 ข้อนี้ขาดใน brief — Bronya ได้รับคำสั่งให้ **ทวงก่อนเริ่ม**

**Bronya → Elysia:**
- ไฟล์โค้ด (Elysia อ่าน `git diff`)
- `_bronya_report.md`: (1) ทำอะไร (2) ตัดสินใจเอง (3) จุดไม่มั่นใจ (4) **State & Cleanup Verification** (3 states + subscription + chart)

**เมื่อ spec กำกวม:** logic/data/state → **หยุดถาม Captain** · UI เล็กน้อย → default design system + โน้ตใน report

**ส่วนเสริมจาก external review (Gemini web, S030) — ฝังใน `GEMINI.md §11` แล้ว:**
- **JSON status block** ปิดท้าย `_bronya_report.md` (`status`/`files_changed`/`decisions`/`needs_review`/`blockers`/`verification`) → Elysia parse อัตโนมัติ แตกงานต่อแม่นขึ้น
- **`[BRONYA_DONE]`** ลงท้ายเมื่อจบงาน → กัน conversational loop เปลืองโควตา (สำคัญถ้าวันหลังทำ auto-loop ต้องมี exit condition)
- **Bronya ไม่รัน git เอง** → Elysia จัดการ git ทั้งหมด กัน `.git/index.lock` ชนกัน (อย่ารัน git พร้อม `agy`)
- **เลือก model ตามงาน** (ฝั่ง Elysia ผ่าน `--model`): Flash = boilerplate/งานเร็ว · Pro = logic ซับซ้อน (อย่าฝาก logic หนักไว้กับ Flash อย่างเดียว)

---

## ⚡ Bronya Efficiency Rules (S032 — รีดคุณภาพรอบแรก + ลด friction)

> *ธีสิสที่ Bronya ช่วยพลิก:* **อย่าฝังเยอะใน `GEMINI.md`** (snippet เปลือง token + stale) —
> เก็บ GEMINI.md ให้ lean (rule + lessons) แล้วไปรีดที่ **คุณภาพ brief ต่องาน + ลำดับ workflow**

- **Type/Interface First** (`GEMINI.md §4`): งานมี data → Bronya ประกาศ `interface` จาก JSON จริงให้จบ **ก่อน** logic/template — data model ชัด = พลาดทีหลังแทบเป็นศูนย์
- **Code as source of truth (ไม่ทำ Pattern Cookbook):** อยากให้ Bronya ตามรูปแบบไหน → **ระบุ exemplar file ใน spec** ("ดูรูปแบบจาก `x.component.ts`") แทนการแปะ snippet — กัน stale + ประหยัด token
- **Mini-Recon:** งานเล็ก/spec รัดกุม → แค่ Bronya วาง plan 1-2-3 ตาม `GEMINI.md §2` ก็พอ (Owner เบรกได้ถ้า plan มีรู) · **full recon (สรุปความเข้าใจ+สมมติฐาน รอ approve)** เฉพาะงานใหญ่/แตะหลายไฟล์
- **Self-QA แยกบทบาทกับ build-gate:** compile/template = build-gate คุม · logic/state/cleanup (3 state, chart destroy/reflow, race) = Bronya self-QA เอง (ไม่ซ้ำ)
- 🧠 **Lessons feedback loop (หน้าที่ Elysia):** ทุกครั้ง Aponia/Sakura จับ Bronya พลาด → Elysia กลั่นบทเรียนเข้า `GEMINI.md §8` (= ความจำภายนอกของ Bronya) → **`Copy-Item` ทับ global ใหม่** → Bronya ไม่พลาดซ้ำ

---

## 🛡️ Build Gate — ตาข่ายนิรภัยก่อนถึง QA (S032, แก้ความไม่เสถียร S031)

> *ปัญหา S031:* Bronya บอก "เสร็จ" ทั้งที่ `ng build` พัง + บางครั้งลืม `_bronya_report.md`
> → ทีม QA ฝั่ง Claude เสียเวลาจับของที่ควรถูกดักตั้งแต่ต้น. แก้ด้วย **gate 2 ชั้น**

**ชั้น 1 — Bronya self-verify** (ฝังใน `GEMINI.md §10`): ต้องรัน `ng build --configuration development`
ให้ผ่านก่อนพ่น `[BRONYA_DONE]` เสมอ — build ไม่ผ่าน ห้ามบอกเสร็จ

**ชั้น 2 — Elysia gate** (ตาข่ายนิรภัย): หลัง Bronya ส่งงานกลับ **ก่อน spawn Aponia/Sakura เสมอ** Elysia รัน:
```powershell
powershell -ExecutionPolicy Bypass -File .claude/antigravity/build-gate.ps1 -ProjectPath "practice/<ชื่องาน>"
```
gate เช็ค: (1) มี `_bronya_report.md` (2) parse JSON status block ได้ (3) `status:BLOCKED`→หยุดให้ Owner ตัดสิน
(4) `ng build --configuration development` ผ่าน. ผลลัพธ์ `GATE: PASS` / `FAIL (build|no report|bad json)` / `BLOCKED`

**เมื่อ build fail → กฎ retry:** Elysia bounce error กลับ Bronya เป็น default (ฝั่ง Gemini quota แก้)
**max 2 รอบ** → ยังไม่ผ่าน → **หยุด escalate หา Owner** (กันวนเผาโควตา — เกิน 2 รอบมักเป็นปัญหา architecture/dep/spec)

- **โหมด 1 (Owner ขับ IDE):** Elysia รัน gate → fail → บอก Owner ให้ส่งกลับ Bronya ใน IDE แก้
- **โหมด 2 (Elysia CLI):** Elysia auto-bounce กลับ Bronya ผ่าน `agy -p` พร้อม error ได้เลย
- **เกณฑ์ = dev config** (Bronya เสนอ S032): ข้าม minify/optimize เร็วขึ้น แต่ยังเช็ค Type+Template ครบ
- **Blind spot ที่รู้ตัว:** gate จับแค่ compile/type/template — **ไม่จับ** runtime/logic/lint. ถ้าอนาคตเจอ runtime พังบ่อย → เพิ่ม `ng lint`/test เป็น gate ชั้นถัดไป

---

## 💬 Meeting Mode — ประชุม/วางแผนร่วมกับ Bronya (S032)

> *เมื่อไร:* วางแผน/ปรับแผน/ออกแบบสถาปัตยกรรมร่วมกัน (ไม่ใช่ส่งงานโค้ด) — อยากได้มุมวิศวกรของ Bronya

**Setup 2-terminal** (Owner = ประธาน + คนเดินเรื่องทั้ง 2 ฝั่ง):

| | Terminal 1 | Terminal 2 |
|---|---|---|
| ใครอยู่ | Claude (Elysia) | Antigravity (Bronya) |
| ใครขับ | Owner คุยกับ Elysia | Owner trigger Bronya |
| สะพาน | ← ไฟล์กลาง `_agy_bridge/live_chat.md` → | (ทั้งคู่อ่าน/เขียนไฟล์เดียวกัน) |

- **กระดาน = `_agy_bridge/live_chat.md`** (ไวท์บอร์ดสด, gitignored) — append ใต้หัวข้อ turn ตัวเอง, ห้ามแก้ของคนอื่น
- **Owner เป็นคน trigger ทั้ง 2 ฝั่ง** (เลือกแบบนี้เพราะ Owner ใช้ Bronya ไปค้นข้อมูลมาประกอบเองได้ด้วย) — Elysia แค่อ่านไฟล์เมื่อ Owner บอกว่ามีของใหม่ + เขียน turn ตอบ (ไม่ต้องรัน `agy` เอง = ไม่มีปัญหา TTY)
- **model = Pro** สำหรับโหมดประชุม (งานคิด/ออกไอเดีย ไม่ใช่ boilerplate)
- **Bronya = ที่ปรึกษา, Owner = คนเคาะ** — Bronya เสนอ/ชี้ flaw/ค้นเรฟได้ แต่ไม่ตัดสินใจแทน
- **TTY หายปัญหา:** โหมดนี้ Bronya เขียนลง**ไฟล์** ไม่พ่น stdout → Elysia อ่านไฟล์ได้ตรงๆ
- จบประชุม: decision จริง Elysia กลั่นเข้า docs/spec ตัวจริง (live_chat เป็น scratch หายได้)

> ✅ ทดสอบจริงครั้งแรก S032: Bronya รีวิว build-gate design ผ่าน live_chat.md → เสนอ `--configuration development` เข้ามาช่วยจริง

---

## 🚀 วิธีติดตั้ง rules — **Global (ทำครั้งเดียวจบ)**

`GEMINI.md` ในโฟลเดอร์นี้ = **ตัวต้นฉบับ** (version-controlled กับทีม) ให้ตัวตน + กฎแก่ **Bronya** (Gemini engineer ของทีม)

วางเป็น **global rule** ที่ Antigravity อ่านทุก project — **ไม่ต้องใส่ไฟล์ใน repo งานเลย**:

```powershell
Copy-Item ".claude\antigravity\GEMINI.md" "$HOME\.gemini\GEMINI.md" -Force
```

- Antigravity auto-load `~/.gemini/GEMINI.md` เป็น **global Always-On rule** ทุก workspace
- **ไม่มีไฟล์ tooling ปนเข้า project repo** — practice ส่วนใหญ่มี `.git` แยกของตัวเอง วิธีนี้เลยสะอาดสุด
- ไฟล์ต้นฉบับมี **scope guard** ที่หัวไฟล์: ถ้า project ไหนไม่ใช่ Angular → Gemini จะยึด convention ของ project นั้นแทน (กฎ Angular ไม่ไปขวางงาน stack อื่น)

> ⚠️ `~/.gemini/` มักถูกสร้างตอนติดตั้ง Antigravity — ถ้ายังไม่มีโฟลเดอร์ ให้รัน
> `New-Item -ItemType Directory -Force "$HOME\.gemini"` ก่อน copy
>
> เวลาเปลี่ยนกฎ: แก้ที่ **ต้นฉบับนี้** ก่อนเสมอ แล้วรัน `Copy-Item ... -Force` ทับใหม่ — กันกฎหลายเวอร์ชันหลุดจากกัน

> **ทางเลือกอื่น (ถ้าวันหลังอยาก scoped เฉพาะ project):** วาง `GEMINI.md` ที่ root ของ project
> แล้วเพิ่ม `GEMINI.md` ใน `.gitignore` ของ project นั้น (Antigravity อ่าน local ได้ แต่ไม่ commit) —
> หรือใช้ `<project>/.agent/rules/*.md`

---

## 🖥️ เลือก Surface: ใช้ **Antigravity IDE**

มี 4 แบบ (2.0 desktop / IDE / CLI / SDK) — เราใช้ **IDE** เพราะ:
- เป็น fork ของ VS Code → เปิด repo เดิมได้ทันที, สะพาน filesystem ทำงานเป๊ะ
- เห็นโค้ดทีละบรรทัด accept/reject ได้ → ตรงกฎ "ห้ามรับโค้ดที่ไม่เข้าใจ" + Owner ได้เรียนรู้
- เห็น diff ชัด ส่งให้ Claude QA ต่อง่าย

(2.0 = black-box ปล่อยสร้างเอง / CLI = ทับ niche เทอร์มินัลที่ Claude Code ครองอยู่)
