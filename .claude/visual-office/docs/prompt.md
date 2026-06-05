## Prompt จาก Claude.ai

สร้าง Visual Office สำหรับ Dashboard Dev Team

## สิ่งที่ต้องสร้าง
ไฟล์เดียว: `.claude/visual-office/office.html`

## Style
- Isometric office มุมมอง 2.5D
- ตัวละคร pixel art style บนโต๊ะ 4 ตัว: Elysia, Sakura, Mobius, Aponia
- สีประจำตัว: Elysia=#FF4081, Sakura=#FFB7C5, Mobius=#3f9b00, Aponia=#eee100
- การสร้างตัวละครอยากให้อิงจากไฟล์รูปอ้างอิง(จะเพิ่มให้ภายหลัง)

## Data Source
อ่านจาก 2 ไฟล์:
- `office_status.json` → แสดงสถานะ agent แต่ละตัว
- `activity_log.jsonl` → แสดง feed 10 รายการล่าสุด

## Fetch วิธี
ใช้ fetch() ผ่าน localhost:8080
auto-refresh ทุก 5 วินาที

## UI Elements ที่ต้องมี
1. ห้อง isometric พร้อมโต๊ะ 4 ตัว
2. ตัวละคร pixel art นั่งที่โต๊ะ
3. Status bubble เหนือหัวแต่ละตัว (สีตาม status)
   - idle = ⚪ / working = 🟡 / waiting = 🔵 / reviewing = 🟣 / done = 🟢
4. ชื่อ + task text ใต้ bubble
5. Activity feed ด้านล่าง แสดง 10 รายการล่าสุด
6. Timestamp "updated X seconds ago" มุมขวาบน
