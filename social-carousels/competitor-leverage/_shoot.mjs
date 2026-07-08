import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW_PATH);
import { fileURLToPath } from 'url';
import path from 'path';

const dir = path.dirname(fileURLToPath(import.meta.url));
const html = 'file://' + path.join(dir, 'Competitor Leverage Carousel.html');

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 2 });
await page.goto(html, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);

for (let i = 1; i <= 5; i++) {
  const el = await page.$(`#slide-${i}`);
  await el.screenshot({ path: path.join(dir, `slide-${i}.png`) });
  console.log(`shot slide-${i}.png`);
}
await browser.close();
