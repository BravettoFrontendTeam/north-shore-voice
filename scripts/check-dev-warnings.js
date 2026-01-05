/* north-shore/scripts/check-dev-warnings.js
   Usage: DEV_URL=http://127.0.0.1:3001/demo HEADLESS=false node scripts/check-dev-warnings.js
*/
const { chromium } = require('playwright');

(async () => {
  const url = process.env.DEV_URL || 'http://127.0.0.1:3001/demo';
  const headless = process.env.HEADLESS !== 'false';
  const browser = await chromium.launch({ headless });
  const page = await browser.newPage();

  const logs = [];
  const reqFails = [];

  page.on('console', msg => logs.push(msg.text()));
  page.on('requestfailed', req => reqFails.push({ url: req.url(), error: req.failure()?.errorText }));

  await page.goto(url, { waitUntil: 'networkidle' }).catch(e => logs.push(`Navigation error: ${e.message}`));
  await page.waitForTimeout(1000);
  await browser.close();

  const problems = logs.filter(t => /React Router Future|v7_startTransition|v7_relativeSplatPath|CORS|net::ERR_FAILED|Access to fetch/i.test(t));
  const networkProblems = reqFails.map(r => `NETWORK FAIL: ${r.url} ${r.error}`);

  if (problems.length || networkProblems.length) {
    console.error('=== Problems found ===');
    if (problems.length) console.error('Console warnings/errors:\n', problems.join('\n'));
    if (networkProblems.length) console.error('Network failures:\n', networkProblems.join('\n'));
    process.exit(2);
  }

  console.log('No targeted warnings found ✅');
  process.exit(0);
})();
