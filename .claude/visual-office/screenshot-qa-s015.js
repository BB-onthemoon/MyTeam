/**
 * screenshot-qa-s015.js — Sakura QA screenshot script for S015 color panel
 * Serve office.html via http (required for fetch + localStorage)
 * Takes 4 screenshots:
 *   1. desktop — panel closed (default state)
 *   2. desktop — panel open (trigger clicked)
 *   3. desktop — after color change (floor = red for visibility check)
 *   4. mobile — panel open (bottom sheet)
 */

const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8097;
const ROOT = path.join('D:\\BBIBBI\\Cloud\\OneDrive\\Work\\VSCODE\\dashbord_dev_team\\.claude\\visual-office');
const SCREENSHOTS = path.join(ROOT, 'screenshots');
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.jsonl': 'text/plain',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
};

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let urlPath = decodeURIComponent(req.url.split('?')[0]);
      if (urlPath === '/') urlPath = '/office.html';
      const filePath = path.join(ROOT, urlPath);
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end('Not found: ' + urlPath);
          return;
        }
        const ext = path.extname(filePath);
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'text/plain' });
        res.end(data);
      });
    });
    server.listen(PORT, () => {
      console.log('HTTP server running on port', PORT);
      resolve(server);
    });
  });
}

(async () => {
  const server = await startServer();
  const browser = await chromium.launch();
  const BASE_URL = `http://localhost:${PORT}/office.html`;

  // ---- 1. DESKTOP — panel closed ----
  {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(BASE_URL, { waitUntil: 'load' });
    await page.waitForTimeout(1000); // let JS init + fetch run
    await page.screenshot({
      path: path.join(SCREENSHOTS, 'qa-s015-desktop-closed.png'),
      fullPage: false,
    });
    console.log('1. desktop closed — done');
    await page.close();
  }

  // ---- 2. DESKTOP — panel open ----
  {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(BASE_URL, { waitUntil: 'load' });
    await page.waitForTimeout(800);
    // clear localStorage เพื่อให้ได้ default colors (บริสุทธิ์ ไม่เอาค่าเก่า)
    await page.evaluate(() => localStorage.removeItem('office-colors'));
    await page.reload({ waitUntil: 'load' });
    await page.waitForTimeout(800);
    // click trigger เพื่อเปิด panel
    await page.click('#js-color-trigger');
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(SCREENSHOTS, 'qa-s015-desktop-open.png'),
      fullPage: false,
    });
    console.log('2. desktop open — done');
    await page.close();
  }

  // ---- 3. DESKTOP — after color change (floor = bright orange) ----
  {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(BASE_URL, { waitUntil: 'load' });
    await page.waitForTimeout(800);
    await page.evaluate(() => localStorage.removeItem('office-colors'));
    await page.reload({ waitUntil: 'load' });
    await page.waitForTimeout(800);
    // เปิด panel
    await page.click('#js-color-trigger');
    await page.waitForTimeout(200);
    // เปลี่ยนสีพื้นเป็น orange และสีกำแพงเป็นน้ำเงิน เพื่อดูว่าห้องเปลี่ยนตามจริงไหม
    await page.evaluate(() => {
      const floorInput = document.querySelector('.color-row__input[data-target="floor"]');
      floorInput.value = '#e07020';
      floorInput.dispatchEvent(new Event('input', { bubbles: true }));
      const wallInput = document.querySelector('.color-row__input[data-target="wall"]');
      wallInput.value = '#2a4a8a';
      wallInput.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(SCREENSHOTS, 'qa-s015-desktop-colored.png'),
      fullPage: false,
    });
    console.log('3. desktop colored — done');
    await page.close();
  }

  // ---- 4. MOBILE — panel open (bottom sheet) ----
  {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(BASE_URL, { waitUntil: 'load' });
    await page.waitForTimeout(800);
    await page.evaluate(() => localStorage.removeItem('office-colors'));
    await page.reload({ waitUntil: 'load' });
    await page.waitForTimeout(800);
    // เปิด panel
    await page.click('#js-color-trigger');
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(SCREENSHOTS, 'qa-s015-mobile-open.png'),
      fullPage: false,
    });
    console.log('4. mobile open — done');
    await page.close();
  }

  // ---- 5. MOBILE — default state (closed) ----
  {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(BASE_URL, { waitUntil: 'load' });
    await page.waitForTimeout(800);
    await page.evaluate(() => localStorage.removeItem('office-colors'));
    await page.reload({ waitUntil: 'load' });
    await page.waitForTimeout(800);
    await page.screenshot({
      path: path.join(SCREENSHOTS, 'qa-s015-mobile-closed.png'),
      fullPage: false,
    });
    console.log('5. mobile closed — done');
    await page.close();
  }

  await browser.close();
  server.close();
  console.log('\nAll QA screenshots complete.');
})();
