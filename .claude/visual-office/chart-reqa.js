// chart-reqa.js — Sakura re-QA Session 016
// ตรวจ: chart height ใหม่ (2 เมือง), badge X/2 cities, regression 3 breakpoints
// run: node chart-reqa.js

const { chromium } = require('playwright');
const path = require('path');
const ssDir = path.join(__dirname, 'screenshots');

// helper: search + pin เมือง 1 เมือง
async function searchAndPin(page, cityName) {
  await page.fill('.search-input', cityName);
  await page.click('.search-btn');
  await page.waitForTimeout(3000); // รอ API
  const pinBtn = await page.$('.card-pin-btn');
  if (pinBtn) {
    await pinBtn.click();
    await page.waitForTimeout(800);
    return true;
  }
  console.log(`WARN: pin button not found after searching "${cityName}"`);
  return false;
}

(async () => {
  const browser = await chromium.launch();

  const viewports = [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'tablet',  width: 768,  height: 1024 },
    { name: 'mobile',  width: 375,  height: 812 },
  ];

  // =================================================================
  // PASS 1: empty state (0 เมือง) — ตรวจ badge "0/2 cities"
  // =================================================================
  console.log('\n=== PASS 1: EMPTY STATE ===');
  for (const vp of viewports) {
    const page = await browser.newPage();
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('http://localhost:4200', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const badgeText = await page.$eval('.cities-badge', el => el.textContent.trim()).catch(() => 'NOT_FOUND');
    const badgeBox  = await page.evaluate(() => {
      const el = document.querySelector('.cities-badge');
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { top: Math.round(r.top), left: Math.round(r.left), width: Math.round(r.width), height: Math.round(r.height) };
    });
    const headerBox = await page.evaluate(() => {
      const el = document.querySelector('.chart-header');
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width), height: Math.round(r.height) };
    });
    const dropdownVisible = await page.$('.metric-select') !== null;

    console.log(`[${vp.name}:empty] badge="${badgeText}" badgeBox=${JSON.stringify(badgeBox)} headerBox=${JSON.stringify(headerBox)} dropdown=${dropdownVisible}`);

    await page.screenshot({ path: path.join(ssDir, `chart-reqa-${vp.name}-empty.png`), fullPage: true });
    await page.close();
  }

  // =================================================================
  // PASS 2: pin 1 เมือง → badge ต้องอัปเดตเป็น "1/2 cities"
  // =================================================================
  console.log('\n=== PASS 2: PIN 1 CITY ===');
  {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:4200', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    await searchAndPin(page, 'Bangkok');

    const badge1 = await page.$eval('.cities-badge', el => el.textContent.trim()).catch(() => 'NOT_FOUND');
    const dropAfter1 = await page.$('.metric-select') !== null;
    console.log(`[desktop:pin1] badge="${badge1}" dropdown=${dropAfter1}`);
    await page.screenshot({ path: path.join(ssDir, `chart-reqa-desktop-pin1.png`), fullPage: true });
    await page.close();
  }

  // =================================================================
  // PASS 3: pin 2 เมือง → chart แสดง
  //   - วัด apex-host height จริง (เทียบ 135px ของเดิม vs สูตรใหม่ 56*2=112 min150 → 150px)
  //   - badge ต้องหาย, dropdown ต้องปรากฏ
  //   - footer ต้องปรากฏ
  //   - container ไม่ overflow viewport
  //   - screenshot: chart-reqa-{vp}-chart.png
  // =================================================================
  console.log('\n=== PASS 3: PIN 2 CITIES (CHART STATE) ===');
  for (const vp of viewports) {
    const page = await browser.newPage();
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('http://localhost:4200', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const ok1 = await searchAndPin(page, 'Bangkok');
    const ok2 = await searchAndPin(page, 'Tokyo');

    if (!ok1 || !ok2) {
      console.log(`[${vp.name}:chart] WARN: pin failed, skipping measurements`);
      await page.close();
      continue;
    }

    // รอ ApexCharts render
    await page.waitForTimeout(2000);

    // วัด apex-host height จริง (ตัวเลขสำคัญ)
    const apexBox = await page.evaluate(() => {
      const el = document.querySelector('.chart-apex-host');
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { width: Math.round(r.width), height: Math.round(r.height) };
    });

    // วัด SVG inside apex-host (ApexCharts mount svg ข้างใน)
    const svgBox = await page.evaluate(() => {
      const el = document.querySelector('.chart-apex-host svg');
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { width: Math.round(r.width), height: Math.round(r.height) };
    });

    const badgeAbsent    = await page.$('.cities-badge') === null;
    const dropdownExists = await page.$('.metric-select') !== null;
    const footerExists   = await page.$('.chart-footer') !== null;

    // container overflow check
    const containerRight = await page.evaluate(() => {
      const el = document.querySelector('.chart-container');
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { rightEdge: Math.round(r.right), viewportWidth: window.innerWidth };
    });

    console.log(`[${vp.name}:chart] apexHostBox=${JSON.stringify(apexBox)} svgBox=${JSON.stringify(svgBox)}`);
    console.log(`[${vp.name}:chart] badgeAbsent=${badgeAbsent} dropdown=${dropdownExists} footer=${footerExists}`);
    console.log(`[${vp.name}:chart] containerRight=${JSON.stringify(containerRight)}`);

    await page.screenshot({ path: path.join(ssDir, `chart-reqa-${vp.name}-chart.png`), fullPage: true });
    await page.close();
  }

  console.log('\n=== ALL DONE ===');
  await browser.close();
})();
