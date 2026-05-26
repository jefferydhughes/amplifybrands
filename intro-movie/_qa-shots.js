const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const HTML = 'file://' + path.resolve(process.argv[2] || 'Amplify Intro Film.html');
const OUT = path.resolve('_qa');
fs.mkdirSync(OUT, { recursive: true });

// [time, label]
const SHOTS = [
  [1.2, 's1-chaos-build'], [5.6, 's1-words-glitch'],
  [9.0, 's2-pain-words'], [11.2, 's2-when-spinner'],
  [21.5, 's3-spaghetti-build'], [25.0, 's3-label'],
  [34.5, 's4-untangle'], [37.5, 's4-gets-used'],
  [46.8, 's5-modA'], [50.6, 's5-modB'], [54.3, 's5-modC'], [58.0, 's5-modD'], [62.6, 's5-timeback'],
  [64.0, 's6-guru'], [70.0, 's6-payoff'],
  [76.5, 's7-obsolete'], [80.2, 's7-converge'], [83.0, 's7-lockup'],
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()); });
  await page.goto(HTML, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__ready === true, { timeout: 15000 });
  await page.evaluate(() => window.__pause && window.__pause());
  for (const [t, label] of SHOTS) {
    await page.evaluate((tt) => window.__seekStage(tt), t);
    await page.waitForTimeout(160);
    await page.screenshot({ path: path.join(OUT, `${label}.png`) });
  }
  await browser.close();
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'No console/page errors.');
  console.log('Wrote ' + SHOTS.length + ' shots to _qa/');
})();
