const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const filePath = 'D:\\BBIBBI\\Cloud\\OneDrive\\Work\\VSCODE\\dashbord_dev_team\\.claude\\visual-office\\color-panel-mockup-sakura.html';
  const fileUrl = 'file:///' + filePath.replace(/\\/g, '/');

  // Desktop view — 1440×900 fullPage
  // panel เป็น fixed จะปรากฏใน viewport จริง แต่ fullPage จะเห็นทั้งหน้า
  // เราถ่าย fullPage เพื่อให้เห็น layout รวม ส่วน panel อยู่ท้ายของภาพเป็น overlay
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(fileUrl);
  await page.waitForTimeout(400);

  // เพิ่ม spacer ชั่วคราวผ่าน JS เพื่อให้ panel ปรากฏใน fullPage screenshot
  // panel fixed bottom:80px + height ~270px = ต้องการ space ล่าง ~360px
  await page.evaluate(() => {
    const spacer = document.createElement('div');
    spacer.style.height = '400px';
    spacer.id = 'mockup-spacer';
    document.querySelector('.main').appendChild(spacer);
  });

  await page.screenshot({
    path: 'D:\\BBIBBI\\Cloud\\OneDrive\\Work\\VSCODE\\dashbord_dev_team\\.claude\\visual-office\\screenshots\\color-panel-desktop.png',
    fullPage: true
  });
  console.log('Desktop screenshot done');

  // Mobile view — 375×812
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(fileUrl);
  await page.waitForTimeout(400);

  // mobile: panel เป็น bottom sheet ที่ bottom:68px จาก viewport bottom
  // เพิ่ม spacer เพื่อให้เห็นใน fullPage
  await page.evaluate(() => {
    const spacer = document.createElement('div');
    spacer.style.height = '500px';
    spacer.id = 'mockup-spacer';
    document.querySelector('.main').appendChild(spacer);
  });

  await page.screenshot({
    path: 'D:\\BBIBBI\\Cloud\\OneDrive\\Work\\VSCODE\\dashbord_dev_team\\.claude\\visual-office\\screenshots\\color-panel-mobile.png',
    fullPage: true
  });
  console.log('Mobile screenshot done');

  await browser.close();
  console.log('All screenshots complete');
})();
