import os
from PIL import Image

# character_pixel อยู่ที่ visual-office/ (parent) — script นี้ถูกย้ายลง assets-src/
d = os.path.join(os.path.dirname(__file__), "..", "character_pixel")
names = ["Elysia", "Sakura", "Mobius", "Aponia"]
scale = 6
imgs = [Image.open(os.path.join(d, n + "_pixel.png")).convert("RGBA") for n in names]
cell_w = max(i.width for i in imgs) * scale + 30
cell_h = max(i.height for i in imgs) * scale + 30
sheet = Image.new("RGBA", (cell_w * 4, cell_h), (40, 36, 64, 255))
for idx, im in enumerate(imgs):
    big = im.resize((im.width * scale, im.height * scale), Image.NEAREST)
    x = idx * cell_w + (cell_w - big.width) // 2
    y = (cell_h - big.height) // 2
    sheet.alpha_composite(big, (x, y))
out = os.path.join(d, "_preview.png")
sheet.convert("RGB").save(out)
print(out)
