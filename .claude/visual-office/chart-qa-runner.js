// chart-qa-runner.js — Sakura QA script for Chart component (Session 016)
// Verifies: desktop / tablet / mobile breakpoints, empty state + chart state
// Screenshots saved to .claude/visual-office/screenshots/chart-qa-*.png

const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:4200';
const SCREENSHOT_DIR = 'D:/BBIBBI/Cloud/OneDrive/Work/VSCODE/dashbord_dev_team/.claude/visual-office/screenshots';

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet',  width: 768,  height: 1024 },
  { name: 'mobile',  width: 375,  height: 812 },
];

// Search city name + wait for card + click pin button
// selector จากการอ่าน component HTML จริง:
//   input: .search-input
//   search btn: .search-btn
//   pin btn: .card-pin-btn
async function searchAndPin(page, cityName) {
  // 1. clear + fill input
  const input = await page.waitForSelector('.search-input', { timeout: 8000 });
  await input.click({ clickCount: 3 });
  await input.fill(cityName);
  await page.waitForTimeout(300);

  // 2. click search button
  const searchBtn = await page.waitForSelector('.search-btn', { timeout: 5000 });
  await searchBtn.click();

  // 3. รอ weather card โผล่ (Angular render data card ใน data-board)
  try {
    await page.waitForSelector('.weather-card', { timeout: 10000 });
  } catch {
    console.warn(`  [WARN] weather card ไม่โผล่หลัง search "${cityName}"`);
    return false;
  }

  // 4. click pin button (stable — รอ card render)
  await page.waitForTimeout(400);
  try {
    const pinBtn = await page.waitForSelector('.card-pin-btn', { timeout: 5000 });
    await pinBtn.click();
    await page.waitForTimeout(600);
    return true;
  } catch (e) {
    console.warn(`  [WARN] pin button ไม่พบสำหรับ "${cityName}": ${e.message}`);
    return false;
  }
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const results = {};

  // ====================================================
  // PASS 1: Screenshot + measure ทุก breakpoint
  // ====================================================
  for (const vp of VIEWPORTS) {
    console.log(`\n===== VIEWPORT: ${vp.name} (${vp.width}x${vp.height}) =====`);
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();

    // ---- STATE 1: Empty placeholder (no pinned cities) ----
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForSelector('.chart-container', { timeout: 10000 });
    await page.waitForTimeout(800);

    const emptyFile = `${SCREENSHOT_DIR}/chart-qa-${vp.name}-empty.png`;
    await page.screenshot({ path: emptyFile, fullPage: true });
    console.log(`  [screenshot] ${emptyFile}`);

    const phBox       = await page.$('.chart-placeholder').then(el => el?.boundingBox() ?? null);
    const dropdownEl  = await page.$('.metric-select');
    const containerBoxE = await page.$('.chart-container').then(el => el?.boundingBox() ?? null);
    const headerBoxE  = await page.$('.chart-header').then(el => el?.boundingBox() ?? null);

    results[`${vp.name}_empty`] = {
      placeholder_visible: phBox !== null,
      placeholder_box: phBox ? { w: Math.round(phBox.width), h: Math.round(phBox.height) } : null,
      dropdown_hidden: dropdownEl === null,
      header_height: headerBoxE ? Math.round(headerBoxE.height) : null,
    };
    console.log(`    Placeholder visible : ${phBox !== null}`);
    console.log(`    Dropdown hidden     : ${dropdownEl === null}`);
    if (phBox) console.log(`    Placeholder size    : ${Math.round(phBox.width)} x ${Math.round(phBox.height)}`);

    // ---- STATE 2: pin 2 cities → chart visible ----
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(800);

    const city1OK = await searchAndPin(page, 'Bangkok');
    await page.waitForTimeout(1200);
    const city2OK = await searchAndPin(page, 'Tokyo');
    await page.waitForTimeout(2500);

    // รอ chart host
    let chartVisible = false;
    try {
      await page.waitForSelector('.chart-apex-host', { timeout: 8000 });
      chartVisible = true;
    } catch {
      console.warn(`  [WARN] .chart-apex-host ไม่โผล่หลัง pin 2 เมือง`);
    }

    // รอ ApexCharts SVG render (ข้าม timeout ถ้าไม่โผล่)
    let svgVisible = false;
    if (chartVisible) {
      try {
        await page.waitForSelector('.chart-apex-host svg', { timeout: 6000 });
        svgVisible = true;
      } catch {
        console.warn(`  [WARN] ApexCharts SVG ยังไม่ render`);
      }
    }
    await page.waitForTimeout(800);

    const chartFile = `${SCREENSHOT_DIR}/chart-qa-${vp.name}-chart.png`;
    await page.screenshot({ path: chartFile, fullPage: true });
    console.log(`  [screenshot] ${chartFile}`);

    // วัด bounding boxes
    const chartBox      = await page.$('.chart-apex-host').then(el => el?.boundingBox() ?? null);
    const containerBoxC = await page.$('.chart-container').then(el => el?.boundingBox() ?? null);
    const headerBoxC    = await page.$('.chart-header').then(el => el?.boundingBox() ?? null);
    const dropdownBoxC  = await page.$('.metric-select').then(el => el?.boundingBox() ?? null);

    // ตรวจ overflow: dropdown ขวาขอบ > container ขวาขอบ (+4px tolerance)
    let dropdownOverflow = false;
    if (dropdownBoxC && containerBoxC) {
      dropdownOverflow = (dropdownBoxC.x + dropdownBoxC.width) > (containerBoxC.x + containerBoxC.width + 4);
    }

    // ตรวจ header wrap: height > 60px = น่าจะ wrap
    const headerWrapped = headerBoxC ? headerBoxC.height > 60 : false;

    // ตรวจ SVG overflow
    let svgOverflow = false;
    if (svgVisible && containerBoxC) {
      try {
        const svgBB = await page.$eval('.chart-apex-host svg', el => {
          const r = el.getBoundingClientRect();
          return { x: r.x, w: r.width };
        });
        svgOverflow = (svgBB.x + svgBB.w) > (containerBoxC.x + containerBoxC.width + 4);
      } catch { /* SVG อาจ scroll-hidden */ }
    }

    // ตรวจ footer label มีข้อความไหม
    let footerText = null;
    try {
      footerText = await page.$eval('.chart-footer-label', el => el.textContent?.trim());
    } catch { /* no footer if chart not visible */ }

    results[`${vp.name}_chart`] = {
      city1_pinned: city1OK,
      city2_pinned: city2OK,
      chart_visible: chartVisible,
      svg_rendered: svgVisible,
      chart_box: chartBox ? { w: Math.round(chartBox.width), h: Math.round(chartBox.height) } : null,
      dropdown_visible: dropdownBoxC !== null,
      dropdown_overflow: dropdownOverflow,
      dropdown_box: dropdownBoxC ? { w: Math.round(dropdownBoxC.width), h: Math.round(dropdownBoxC.height) } : null,
      header_wrapped: headerWrapped,
      header_height: headerBoxC ? Math.round(headerBoxC.height) : null,
      svg_overflow: svgOverflow,
      footer_text: footerText,
    };

    console.log(`    City1 pinned    : ${city1OK}`);
    console.log(`    City2 pinned    : ${city2OK}`);
    console.log(`    Chart visible   : ${chartVisible}`);
    console.log(`    SVG rendered    : ${svgVisible}`);
    if (chartBox) console.log(`    Chart size      : ${Math.round(chartBox.width)} x ${Math.round(chartBox.height)}`);
    if (dropdownBoxC) console.log(`    Dropdown size   : ${Math.round(dropdownBoxC.width)} x ${Math.round(dropdownBoxC.height)}`);
    console.log(`    Header wrapped  : ${headerWrapped} (height=${headerBoxC ? Math.round(headerBoxC.height) : 'n/a'}px)`);
    console.log(`    Dropdown overflow: ${dropdownOverflow}`);
    console.log(`    SVG overflow    : ${svgOverflow}`);
    console.log(`    Footer text     : "${footerText}"`);

    await context.close();
  }

  // ====================================================
  // PASS 2: Metric switch test (desktop only — chart must be visible)
  // ====================================================
  console.log(`\n===== METRIC SWITCH TEST (desktop) =====`);
  const mCtx  = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const mPage = await mCtx.newPage();
  await mPage.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await mPage.waitForTimeout(800);

  await searchAndPin(mPage, 'Bangkok');
  await mPage.waitForTimeout(1200);
  await searchAndPin(mPage, 'Tokyo');
  await mPage.waitForTimeout(2500);

  let metricSwitchOK = false;
  try {
    await mPage.waitForSelector('.metric-select', { timeout: 8000 });

    // เปลี่ยน metric เป็น Humidity (index 2)
    await mPage.selectOption('.metric-select', { index: 2 });
    await mPage.waitForTimeout(1500);

    const mFile = `${SCREENSHOT_DIR}/chart-qa-desktop-metric-humidity.png`;
    await mPage.screenshot({ path: mFile, fullPage: true });
    console.log(`  [screenshot] ${mFile}`);

    const footerAfter = await mPage.$eval('.chart-footer-label', el => el.textContent?.trim());
    console.log(`  Footer after switch: "${footerAfter}"`);
    metricSwitchOK = footerAfter?.toLowerCase().includes('humidity') ?? false;
    results['metric_switch'] = {
      success: metricSwitchOK,
      footer_text: footerAfter,
    };
  } catch (e) {
    console.warn(`  [WARN] metric switch test error: ${e.message}`);
    results['metric_switch'] = { success: false, error: String(e.message) };
  }
  await mCtx.close();

  await browser.close();

  // ====================================================
  // SUMMARY
  // ====================================================
  console.log('\n\n===== QA RAW RESULTS =====');
  console.log(JSON.stringify(results, null, 2));
}

run().catch(err => {
  console.error('[FATAL ERROR]', err);
  process.exit(1);
});
