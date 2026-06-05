"""
แปลงรูปตัวละคร chibi → pixel 8-bit สำหรับ Visual Office
- ลบพื้นหลังขาว (เฉพาะรูปที่ไม่มี alpha) ด้วย flood-fill จากขอบ
- crop ให้พอดีตัว → ย่อเหลือ TARGET_H px → ลดสีเหลือ N_COLORS
- เซฟเป็น PNG พื้นโปร่งใน character_pixel/
"""
import os
from PIL import Image, ImageDraw

SRC_DIR = os.path.join(os.path.dirname(__file__), "character_pic_ref")
# character_pixel เป็น runtime asset อยู่ที่ visual-office/ (parent) — script นี้ถูกย้ายลง assets-src/
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "character_pixel")
os.makedirs(OUT_DIR, exist_ok=True)

TARGET_H = 80      # ความสูงพิกเซล (ยิ่งน้อยยิ่งเป็นบล็อก)
N_COLORS = 24      # จำนวนสีในพาเลตต์ (ลุค 8-bit)
WHITE_THRESH = 38  # ความคลาดเคลื่อนของสีขาวที่ยอมให้เป็นพื้นหลัง

FILES = {
    "Elysia": "Elysia_ref.png",
    "Sakura": "Sakura_ref.webp",
    "Mobius": "Mobius_ref.jpg",
    "Aponia": "Aponia_ref.webp",
}

# ตัดส่วนล่างของรูปต้นฉบับเป็นสัดส่วน (เช่น Sakura มีฐานวงรีติดมา)
CROP_BOTTOM = {
    "Sakura": 0.17,
}


def has_alpha(img):
    """รูปนี้มีพื้นโปร่งจริงไหม"""
    if img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info):
        a = img.convert("RGBA").split()[-1]
        return a.getextrema()[0] < 250
    return False


def remove_white_bg(img):
    """ลบพื้นหลังขาวที่ต่อกับขอบภาพ (flood-fill 4 มุม) — ไม่แตะสีขาวด้านในตัวละคร"""
    rgb = img.convert("RGB")
    w, h = rgb.size
    sentinel = (255, 0, 255)  # สีหมุดหมายที่ไม่น่าซ้ำกับในรูป
    seeds = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1),
             (w // 2, 0), (w // 2, h - 1)]
    for s in seeds:
        if sum(abs(a - b) for a, b in zip(rgb.getpixel(s), (255, 255, 255))) <= WHITE_THRESH * 3:
            ImageDraw.floodfill(rgb, s, sentinel, thresh=WHITE_THRESH)
    px = rgb.load()
    out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    op = out.load()
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            op[x, y] = (0, 0, 0, 0) if (r, g, b) == sentinel else (r, g, b, 255)
    return out


def autocrop(img):
    bbox = img.split()[-1].getbbox()
    return img.crop(bbox) if bbox else img


def pixelate(img, target_h, n_colors):
    # ย่อรักษาอัตราส่วน (LANCZOS เพื่อเฉลี่ยสีก่อนลดพาเลตต์)
    w, h = img.size
    target_w = max(1, round(w * target_h / h))
    small = img.resize((target_w, target_h), Image.LANCZOS)
    # แยก alpha ออกมาทำให้คม (hard edge แบบ pixel art)
    r, g, b, a = small.split()
    a = a.point(lambda v: 255 if v >= 128 else 0)
    rgb = Image.merge("RGB", (r, g, b))
    rgb = rgb.quantize(colors=n_colors, method=Image.MEDIANCUT).convert("RGB")
    out = rgb.convert("RGBA")
    out.putalpha(a)
    return out


for name, fname in FILES.items():
    path = os.path.join(SRC_DIR, fname)
    img = Image.open(path)
    # ตัดส่วนล่างก่อน (เอาฐาน/ขาตั้งออก) ถ้ากำหนดไว้
    if name in CROP_BOTTOM:
        w, h = img.size
        img = img.crop((0, 0, w, int(h * (1 - CROP_BOTTOM[name]))))
    img = img.convert("RGBA") if has_alpha(img) else remove_white_bg(img)
    img = autocrop(img)
    img = pixelate(img, TARGET_H, N_COLORS)
    out_path = os.path.join(OUT_DIR, f"{name}_pixel.png")
    img.save(out_path)
    print(f"{name:8s} -> {out_path}  ({img.size[0]}x{img.size[1]}, {N_COLORS} colors)")

print("done")
