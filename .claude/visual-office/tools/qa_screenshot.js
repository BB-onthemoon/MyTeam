const { chromium } = require('playwright');
const path = require('path');
const { pathToFileURL } = require('url');

// script นี้อยู่ใน tools/ — office.html อยู่ parent, screenshot ออกที่ ../screenshots/
// รับ URL จาก argv ได้ (เช่น http://localhost:8123/office.html เพื่อให้ fetch JSON ทำงาน)
// ถ้าไม่ส่ง fallback เป็น file:// (status จะไม่โหลด เพราะ fetch ถูกบล็อกบน file://)
const officeUrl = process.argv[2] || pathToFileURL(path.join(__dirname, '..', 'office.html')).href;
const shotDir = path.join(__dirname, '..', 'screenshots');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Desktop view
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(officeUrl);
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(shotDir, 'office_qa_desktop.png'), fullPage: true });

  // Mobile view
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(officeUrl);
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(shotDir, 'office_qa_mobile.png'), fullPage: true });

  await browser.close();
  console.log('Screenshot done');
})();
