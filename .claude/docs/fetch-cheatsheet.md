# 🎣 Fetch & Async-State Cheat Sheet

> เปิดดูทุกครั้งที่ต้อง "ดึง API + จัดการ loading/error" — ใช้ได้ทุกโปรเจค
> สร้าง S033 (country-explorer) · Angular 21 zoneless + signals

---

## 0. หลักคิดเดียวที่ต้องจำ

> **ทุก fetch บนโลกนี้มีแค่ 4 ส่วน — ที่ดูไม่เหมือนกันเพราะแต่ละคน "ห่อ" 4 ส่วนนี้คนละสไตล์ ไม่ใช่มันต่างกันจริง**

อ่านโค้ด fetch ของใครก็ตาม (fetch / axios / HttpClient / RxJS / async-await) → หา 4 ช่องนี้ให้เจอ แล้วจะเข้าใจทั้งก้อนในนาทีเดียว

---

## 1. 🔍 เลนส์อ่านโค้ด — 4 ช่อง

| ช่อง | คำถาม | ดูตรงไหนในโค้ด |
|---|---|---|
| **WHEN** | ยิงเมื่อไหร่? | ตอน init / กดปุ่ม / พิมพ์ค้นหา / signal เปลี่ยน |
| **HOW** | ยิงไปไหน ยังไง? | `http.get(URL)` / `fetch(url)` / `axios.get` |
| **STATE** | loading / error / success จัดการยังไง? | flag / try-catch / `catchError` / `rxResource` |
| **SHAPE** | ปั้น data ดิบให้พร้อมใช้ยังไง? | `.map()` / `transform` / destructure |

**วิธีใช้:** เจอโค้ดแปลกหน้า → ถาม 4 คำถามนี้ตามลำดับ → จบ

---

## 2. ✍️ ท่ามาตรฐาน "เขียนมือ" (เข้าใจกลไก + คุมได้ละเอียด)

ใช้เมื่อ: อยากเข้าใจข้างใน / ต้องการ custom state / รองรับเคสซับซ้อน (debounce, retry, dependent fetch)

### Service — แยก "ดึง + transform" ออกจาก UI
```ts
@Injectable({ providedIn: 'root' })
export class XxxService {
  private http = inject(HttpClient);
  private readonly URL = '...';

  getItems(): Observable<Item[]> {
    return this.http.get<RawItem[]>(this.URL).pipe(
      map(list => list.map(r => this.toItem(r)))   // ← SHAPE
    );
  }
  private toItem(r: RawItem): Item {
    return { /* คลี่ nested, ?? กัน null, derive field */ };
  }
}
```

### Component — state machine 3 สถานะ
```ts
private result = toSignal(
  this.service.getItems().pipe(
    map(data => ({ loading: false, error: '', data })),                 // ① สำเร็จ
    startWith({ loading: true, error: '', data: [] as Item[] }),        // ② loading นำหน้า (หลัง map!)
    catchError(err => of({ loading: false, error: err.message, data: [] as Item[] }))  // ③ ดักท้ายสุด
  ),
  { initialValue: { loading: true, error: '', data: [] as Item[] } }
);
loading = computed(() => this.result().loading);
error   = computed(() => this.result().error);
items   = computed(() => this.result().data);
```

**กฎทอง operator (ลำดับสำคัญ!):** `map` (แปลงสำเร็จ) → `startWith` (ใส่ loading นำหน้า) → `catchError` (ดักทุก error ท้ายสุด)
- `of(x)` = ห่อค่าธรรมดาให้เป็น Observable (catchError ต้อง return Observable)

---

## 3. ⚡ Cheat code ตัวจริง: `rxResource()` (Angular 21+)

ใช้เมื่อ: งานจริงทั่วไป — มันทำ state machine ข้อ 2 **ให้อัตโนมัติ**

```ts
import { rxResource } from '@angular/core/rxjs-interop';

xxxRes = rxResource({
  stream: () => this.service.getItems(),   // แค่บอกว่าดึงยังไง (รับ Observable)
});
```

ได้ของพวกนี้มา **ฟรี** (ทุกตัวเป็น signal):
| ใช้ใน template | ได้อะไร |
|---|---|
| `xxxRes.isLoading()` | `boolean` — กำลังโหลดไหม |
| `xxxRes.error()` | `Error \| undefined` |
| `xxxRes.value()` | `T \| undefined` — ข้อมูล (undefined ตอนยังโหลด → ใส่ `?? []`) |
| `xxxRes.status()` | สถานะละเอียด ('loading'/'resolved'/'error'/...) |
| `xxxRes.reload()` | **กดดึงใหม่!** (refresh button ได้เลย) |

### Template
```html
@if (xxxRes.isLoading()) {
  <p>⏳ กำลังโหลด...</p>
} @else if (xxxRes.error()) {
  <p>❌ {{ xxxRes.error()?.message }}</p>
} @else {
  @for (x of xxxRes.value() ?? []; track x.id) { ... }
}
```

**caveat:**
- `value()` เป็น `T | undefined` → ต้อง `?? []` ใน `@for`
- `error()` เป็น `Error` object → ใช้ `.error()?.message` ไม่ใช่ทั้งก้อน
- ดึง "ครั้งเดียวตอน init" พอแล้ว; ถ้า `stream` อ้าง signal ข้างใน → จะ re-fetch อัตโนมัติเมื่อ signal เปลี่ยน (ใช้ทำ dependent fetch / search ได้)

---

## 4. 🧭 เลือกใช้อันไหน?

| สถานการณ์ | ใช้ |
|---|---|
| เรียนรู้ / อยากเข้าใจกลไก | ✍️ มือ (ข้อ 2) |
| งานจริง Angular 21 ทั่วไป | ⚡ `rxResource` (ข้อ 3) |
| ต้อง custom state แปลกๆ / คุม pipeline เอง | ✍️ มือ |
| search + debounce | `rxResource` + `stream` อ่าน signal คำค้น (re-fetch อัตโนมัติ) **หรือ** client-side filter ด้วย `computed` |

> 💡 รู้ทั้ง 2 ท่า = ใช้ cheat code แบบ "รู้ทัน" ไม่ใช่มายากล — เพราะเข้าใจว่า `rxResource` ทำข้อ 2 ให้ข้างใน

---

## 5. 📋 หลักการที่ใช้ซ้ำได้ทุกงาน

1. **แยก service (ดึง+transform) ออกจาก component (state+UI)** เสมอ
2. **มี `RawXxx` type (ดิบจาก API) + `Xxx` type (สะอาดพร้อมใช้)** — อย่าใช้ raw ตรงๆ ใน UI
3. **transform คือที่กัน bug:** คลี่ nested · `?.[0] ?? ''` (array ว่าง) · `?? []` (undefined) · derive field (เช่นประกอบ URL จาก code)
4. **3 สถานะเสมอ:** loading / error / success — อย่าลืม error (API ตายได้จริง!)
5. **API เปลี่ยน/ตายได้** — เก็บ URL เป็น `const` ที่เดียว, แยก service ไว้ → เปลี่ยน API กระทบจุดเดียว
