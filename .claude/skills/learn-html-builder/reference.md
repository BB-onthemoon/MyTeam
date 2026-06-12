# learn-html-builder — Reference

เนื้อหนักของ skill: (1) ชุดคำถาม grill (2) แม่แบบ section ตาม build order (3) catalogue ของ engine
ดู `SKILL.md` สำหรับ workflow + design rules

---

## §1 — ชุดคำถาม grill ก่อนเริ่ม (ถามทีละข้อ + เสนอคำตอบแนะนำ)

ถามจน scope ชัดก่อนแตะโค้ด คำตอบของแต่ละข้อกำหนดสิ่งที่ตามมา (โดยเฉพาะข้อ 1 → กำหนดความลึกทั้งหมด)

| # | คำถาม | ตัวเลือก | แนะนำ (default) |
|---|---|---|---|
| 1 | **เป้าหมายหลังอ่านจบ** ทำอะไรได้? | อ่านโค้ดรู้เรื่อง+เข้าใจ pattern / เขียนใหม่ได้เองจากศูนย์ / ท่องจำ syntax | *เขียนใหม่ได้เอง* = ลึกสุด ต้องสอนลำดับคิด+เหตุผล |
| 2 | **ลำดับเล่าเรื่อง** | build dependency ล่าง→บน / ตาม user flow / ตามชั้นสถาปัตย์ | **build order ล่าง→บน** (ตรงกับลำดับ reconstruct จริง) |
| 3 | **ความลึกการแสดงโค้ด** | เต็มไฟล์+annotate จุดสำคัญ / line-by-line / เฉพาะ snippet | เต็มไฟล์+annotate (เห็นภาพจริง โฟกัสจุดต้องเข้าใจ) |
| 4 | **interactive ตัวไหน** (เลือกหลายข้อ) | sidebar scroll-spy / tab .ts-.html / quiz self-check / data-flow diagram | ครบทั้ง 4 ถ้าเป้าหมาย=rebuild |
| 5 | **ชั้นความรู้เสริม** | gotchas+API contract+why-decisions / แค่ API+gotchas / ไม่มี | ใส่ครบ — คือสิ่งที่ทำให้ reconstruct ได้จริง |
| 6 | **CSS/styling สอนไหม** | strategy+จุดสำคัญ / ลึกเท่า logic / ไม่มีเลย | ถาม — มักตัดออกถ้าเน้น logic (Owner เคยเลือกตัด) |
| 7 | **ที่วางไฟล์** | `<project>/learn.html` / docs folder / repo root | co-located `<project>/learn.html` |
| 8 | **จังหวะส่งมอบ** | ซอย section มี checkpoint / ทำรวดเดียวแล้วรีวิว | **ซอย section มี checkpoint** (Owner context จำกัด) |

> เพิ่ม: ถ้าเป็นงาน meta (สร้าง doc ไม่ใช่ feature) ถาม Owner ก่อนว่าจะ grill ไหม (กฎทีม) — ที่นี่ Owner มักอยาก grill เพราะ scope สื่อกว้าง

---

## §2 — แม่แบบ section (build order ล่าง→บน)

ปรับชื่อ/จำนวนตามระบบจริง แต่ลำดับ dependency คงเดิม โครงนี้มาจาก SalesDoc (Angular wizard + signal store)

| # | Section | เนื้อหา |
|---|---|---|
| 0 | โครง + engine | shell HTML, theme, sidebar, hero, **"วิธีใช้สื่อนี้"** ที่โชว์ทุก element ทำงานจริง, stub ที่เหลือ |
| 1 | ภาพรวม + data flow | สถาปัตย์เป็นชั้น (เช่น core/shared/features) + ตาราง "พึ่งพาใคร" + แผนภาพการไหล user→component→state→service→API→กลับ |
| 2 | API / data contract | req/res แต่ละ endpoint (tab req/res) + **ตารางของแสลง** (field สะกดเพี้ยน, key เอก/พหูพจน์) + นิยาม "สำเร็จ" |
| 3 | service / data-access layer | HTTP ล้วน, DI (`inject`), คืน Observable lazy (ไม่ subscribe), proxy/config |
| 4 | store / state | signal, computed, actions, **ที่เดียวที่ subscribe**, error handling, persistence, reset |
| 5 | shared / dumb components | `@Input`, presentational, VM pattern, ไม่รู้จัก store/API |
| 6 | feature components | local input + binding, เรียก action ของ store, state machine บนจอ (loading→error→results→empty), จุดต่างของแต่ละหน้า |
| 7 | container / orchestrator | สลับ view (`@switch`), gating ปุ่ม (computed), lifecycle, draft pattern |
| 8 | capstone | **checklist สร้างจากศูนย์ตามลำดับ dependency** + glossary ศัพท์ที่ใช้จริง + "5 อย่างที่ถ้าจำได้ก็พอ" + quiz รวบยอด |

**กฎเหล็ก:** อ่านไฟล์จริงที่ section นั้นพูดถึง **ก่อน** เขียนทุกครั้ง — ห้ามเดาเนื้อหาจากความจำ

---

## §3 — Engine catalogue (copy จาก `SalesDocumentReturnSystem/learn.html`)

ไม่ต้องเขียนใหม่ — copy `<style>` + `<script>` จาก SalesDoc/learn.html แล้วปรับ theme token ข้างล่าง

### theme token ที่ต้องปรับให้ echo โปรเจคเป้าหมาย
ใน `:root` — `--navy`(header/hero/codebar) · `--steel`(accent) + `--steel-bg`(tint) · `--success/warn/danger` + `-bg` · `--bg/--card/--ink/--ink-soft/--line` · `--code-bg/--code-ink` · `--radius`(echo โปรเจค) · `--font-sans/--font-mono`

### markup convention ของแต่ละ element

**Tab (.ts/.html หรือ req/res)** — JS หา `[data-tabs]` สลับ panel ใน group เดียวกัน
```html
<div class="tabs" data-tabs>
  <div class="tabs__bar">
    <button class="tabs__btn active" data-tab="ts">file.ts</button>
    <button class="tabs__btn" data-tab="html">file.html</button>
  </div>
  <div class="tabs__panel active" data-panel="ts"> <div class="codewrap"><pre><code data-lang="ts">...</code></pre></div> </div>
  <div class="tabs__panel" data-panel="html"> ... </div>
</div>
```

**Quiz (กดเฉลย)** — JS ล็อกคำตอบหลังกด ใส่ ✓/✗ + เปิด `.quiz__why`
```html
<div class="quiz" data-quiz>
  <div class="quiz__tag">ทบทวน</div>
  <p class="quiz__q">คำถาม...</p>
  <button class="quiz__opt" data-correct="false">ตัวเลือกผิด</button>
  <button class="quiz__opt" data-correct="true">ตัวเลือกถูก</button>
  <div class="quiz__why">คำอธิบายเฉลย...</div>
</div>
```

**Callout 4 สี (tint+icon ไม่ใช่ border-left หนา)**
```html
<div class="callout concept"> <!-- concept | gotcha | bug | win -->
  <span class="callout__icon">🔑</span>  <!-- 🔑 / ⚠️ / 🐞 / ✅ -->
  <div class="callout__body"><strong>หัวข้อ:</strong> เนื้อ...</div>
</div>
```

**Code block + highlight** — ใส่ `data-lang` ให้ JS ระบายสี (`ts` / `html`)
```html
<div class="codewrap"><div class="codewrap__bar"><span class="dots"><i></i><i></i><i></i></span><span class="fname">file.ts</span></div>
<pre><code data-lang="ts">...โค้ด escape &lt; &gt; แล้ว...</code></pre></div>
```

**Line-by-line explainer** — `.lines > .lines__row > (.lines__code + .lines__exp)` แสดงโค้ดคู่คำอธิบาย

**Data-flow diagram** — `.flow > .flow__row > .node` (variant `--comp/--store/--service/--api`) คั่นด้วย `.flow__arrow`

### engine ใน `<script>` (มีครบใน source — อย่าแก้)
1. **syntax highlighter** — regex + **private-use marker** (`0xE000/0xE100`) กัน regex รอบถัดไป match attribute ของ span ที่เพิ่งใส่ → **ห้าม rewrite** พังง่าย
2. **tab** — `[data-tabs]` toggle `.active`
3. **collapse** — `.collapse__head` toggle `.open`
4. **quiz** — `[data-quiz]` กดแล้ว lock + เฉลย
5. **scroll-spy** — `IntersectionObserver` ไฮไลต์ `.nav a` ตาม section

### ตรวจก่อนปิดงาน
- ไม่เหลือ `class="stub"` / 🚧
- นับ `<section id=` / `data-quiz` / `data-tabs` ให้ครบตามแผน
- ปิด `</body></html>` ครบ
- honor `prefers-reduced-motion` (มีใน source แล้ว)
