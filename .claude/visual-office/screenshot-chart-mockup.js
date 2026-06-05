const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Desktop view
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('file:///D:/BBIBBI/Cloud/OneDrive/Work/VSCODE/dashbord_dev_team/.claude/visual-office/chart-mockup-sakura.html');
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'D:/BBIBBI/Cloud/OneDrive/Work/VSCODE/dashbord_dev_team/.claude/visual-office/screenshots/chart-mockup-desktop.png', fullPage: true });

  // Mobile view
  await page.setViewportSize({ width: 375, height: 812 });
  await page.screenshot({ path: 'D:/BBIBBI/Cloud/OneDrive/Work/VSCODE/dashbord_dev_team/.claude/visual-office/screenshots/chart-mockup-mobile.png', fullPage: true });

  await browser.close();
  console.log('Screenshot complete');
})();
