# Task Context — S038 ยกทีมเป็น FullStack

> Elysia เป็น single-writer. Subagent อ่านอย่างเดียวก่อนเริ่มทุก spawn.
> updated: 2026-06-16T13:10:14+07:00

## 0. PHASE 2 ACTIVE — FIFA Tournament Browser (grill จบ 2026-06-16)
**Decisions (grill 4 ข้อ):**
- โหมด = 🎓 **Learn** — Owner เขียน backend เอง, Elysia mentor (อธิบาย concept ก่อน → Owner พิมพ์, ไม่แย่งพิมพ์)
- Dashboard = **Tournament Browser** (เลือกปี → ดูแมตช์ตาม stage; ไป-กลับกับ DB)
- API = **2 endpoints**: `GET /api/tournaments` (list ปี + host + match count) · `GET /api/tournaments/:year/matches`
- ลำดับ = **Backend ก่อน** (เทส curl/browser) → frontend ทีหลัง
- Frontend = **Sakura design-first → Bronya (Gemini) เขียน Angular** (ลูกผสม; Owner โฟกัส backend)
- Stack backend = Node+Express+TS + better-sqlite3 (raw SQL), folder `practice/fifa-worldcup/{frontend,backend}`, Angular proxy /api → :3000
- DB = `SQL/fifaworldcup_data.db` ตาราง `wc_all_matches` 184 rows (ดู §5 schema)

**Phase 2 plan (backend-first, Learn = Owner เขียนทีละ step + checkpoint):**
- [x] B1: backend skeleton ✅ (express@5+better-sqlite3@12+tsx+ts@6; ลงผิดที่ Owner ย้ายเข้า backend/ เอง)
- [x] B2: DB connection + server :3000 ✅ — src/server.ts (/api/health) + src/db.ts (readonly, fileMustExist, path=**../db/** ; Owner เปลี่ยนชื่อโฟลเดอร์ sql→db ระหว่างทาง). DB copy ที่ backend/db/. Fixed PORT 30000->3000. gitignore: track เฉพาะ practice/fifa-worldcup/ (node_modules ยัง ignore)
- [x] B3: endpoint 1 `GET /api/tournaments` ✅ — GROUP BY year → {year,host,matchCount} 22 ตัว (verify curl)
- [x] B4: endpoint 2 `GET /api/tournaments/:year/matches` ✅ — Number(param)+parameterized `?`+validation; injection blocked (verify)
- [x] B5: Build-Gate tsc PASS + Aponia QA ✅ — PASS-with-issues → Owner fix #1 error-handler middleware+try/catch (กัน stack-trace leak), #2 validation 4-digit regex `^\d{4}$` (กัน 01930/0x10/1e3/ws/neg/huge). re-verify PASS. **BACKEND COMPLETE**
- [ ] F1+: Sakura design-first → Bronya เขียน frontend Angular (consume /api, proxy → :3000) ← ทำต่อ

### Aponia QA notes ค้างไว้ทำตอน frontend/polish (ไม่บล็อก)
- TS interface กลาง front↔back (กัน contract drift) — ทำตอนต่อ frontend
- prepared statement สร้างใหม่ทุก request (perf nit, 184 rows ไม่กระทบ)
- 404/method ผิด ตอบ HTML ไม่ใช่ JSON (HTTP hygiene, ไม่เร่ง)
- host มาจาก country (GROUP BY year หยิบแถวใดก็ได้) — พึ่ง assumption 1 ปี 1 เจ้าภาพ (2002 co-host ระวัง)

## 1. Task header
ยกระดับ Dashboard Dev Team จาก frontend-only → **FullStack**. Owner (thanapiy) เรียน backend มา (Express/JS) เพราะตำแหน่งงานอนาคตต้องทำ backend เองทั้งหมด. grill 9 ข้อจบแล้ว → ทำ **Phase 1 (ยกระบบทีมให้ครบ) ก่อน** แล้วค่อย Phase 2 (โปรเจคนำร่อง FIFA).

## 2. Plan + step status ⭐
**Phase 1 — ยกระบบทีม (ทำตอนนี้, ทีละ step + checkpoint Owner ทุกไฟล์)**
- [x] Step 1: CLAUDE.md — Tech Stack +backend, Team table (Mobius FullStack/Aponia +backend QA), Learn/Auto mode, folder structure front/back ✅
- [x] Step 1.5: รีด CLAUDE.md 198→80 บรรทัด (Owner สั่ง ≤150, two-tier) — แยกกลไก Status/Task-Context ไป `.claude/rules/team-ops.md`, ย่อ session-log/hybrid note ✅
- [x] Step 2: agent profiles ✅ — Mobius.md (+backend หน้าที่ + Backend DoD), Aponia.md (+backend QA DoD), GEMINI.md (Tech Stack แก้ "ไม่มี backend" + §7.5 Backend rules + build-gate backend = tsc)
- [x] Step 3: Build-Gate backend ✅ — เพิ่ม `-Mode backend` ใน build-gate.ps1 (frontend=ng build เดิม / backend=`tsc --noEmit` + opt-in `-SmokeUrl` ยิง endpoint 200 + taskkill /T กัน orphan). ASCII-only. parse+run ผ่าน (exit codes: 1 build/tsc, 2 path, 3 report, 4 json, 5 BLOCKED, 6 pkg/tsconfig, 7 smoke)
- [x] Step 4: workflow.md ✅ — Step 1 +ถาม backend?/Learn-Auto · section FullStack Flow (API contract first → implement ตามโหมด → Build-Gate backend → Aponia QA → verify จริง; Learn=ไม่ spawn Mobius) · Fast Path +backend non-negotiable · Spawn table +Learn note
- [x] Step 5: Backend QA checklist ✅ — ยุบเข้า Aponia.md (Backend QA DoD ตอน Step 2) ไม่ทำไฟล์แยก (Owner เลือก ก — single-source-of-truth)

**✅ PHASE 1 จบครบ (2026-06-16) — ระบบทีมพร้อมรับ FullStack**

- [x] Step 2.5: รีด GEMINI.md 246→91 บรรทัด (Owner สั่ง 80-150 เหมือน CLAUDE.md) — two-tier contract, คงบทเรียน external memory ครบ, ไม่ย้ายออกไฟล์อื่น (Bronya อ่านไฟล์นี้เป็นหลัก) ✅

**Phase 2 — โปรเจค FIFA (เริ่มหลัง Phase 1 approve)** — ยังไม่เริ่ม

## 3. Files touched ⭐
- `office_status.json`, `activity_log.jsonl` — อัปเดต S038 แล้ว
- (รอแก้) CLAUDE.md, .claude/agents/Mobius.md, .claude/agents/Aponia.md, .claude/antigravity/GEMINI.md, .claude/docs/workflow.md

## 4. Decisions / invariants (จาก grill 9 ข้อ)
1. Backend = **Node.js + Express + TypeScript** (Owner เรียน Express มาเป็น JS แต่ทีมใช้ TS)
2. เป้าหมาย = **B backend จริงเพื่องาน** (ตำแหน่งงาน Owner ต้องทำเอง)
3. ทีม = **ไม่ fix คนทำ เลือกโหมดต่อ task**: 🎓 Learn (Owner เขียนเอง, Elysia mentor=อธิบาย concept ก่อนแล้วให้ลงมือ) / ⚡ Auto (Mobius·Bronya เขียน). Elysia ถาม "Learn/Auto?" ก่อนเริ่มงานทุกครั้ง
4. **Aponia ขยาย QA ครอบ backend เสมอ ทุกโหมด** (endpoint/response/security) — non-negotiable
5. DB = **SQLite** (Owner ลองมาแล้ว มี SQL/ practice), ย้าย Postgres ทีหลังได้
6. DB access = **Raw SQL + better-sqlite3** (ฝึก SQL จริง ไม่ใช้ ORM ซ่อน)
7. โปรเจคนำร่อง = **FIFA World Cup** (SQL/fifaworldcup_data.db: ตาราง wc_all_matches 184 แมตช์ปี1930+)
8. โครงสร้าง = `practice/fifa-worldcup/{frontend,backend}` + Angular proxy (/api → :3000)
9. ลำดับ = **Phase 1 ระบบก่อน แล้วโปรเจค** (Owner เลือก A — เห็นภาพรวมก่อน)

## 5. Repo state
- env พร้อม: Node v24.15.0, npm 11.12.1. sqlite3 CLI ไม่มี (Owner ใช้ DB Browser GUI). branch main.
- DB quirk: คอลัมน์ team1 ประกาศ INTEGER แต่เก็บข้อความ "France" (SQLite typing หลวม) — เก็บไว้คุยตอน Phase 2 schema cleanup

## 6. Next step
Step 1: แก้ CLAUDE.md (Tech Stack + Learn/Auto mode + folder structure) → checkpoint Owner → Step 2
