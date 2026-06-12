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
5. **Data shape** (ตัวอย่าง JSON/ฟิลด์ที่ต้องใช้) · 6. **Impact Scope** (แตะอะไรได้/ห้ามแตะ)
7. Constraints/invariants · 8. QA feedback (รอบแก้ — checklist Aponia/Sakura)

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
