// Re-captures the game screens the site shows (img/app-clans.webp, img/map-*.webp) from the
// game's local stack (Quizup/docs/local-dev.md): backend :3001 + Vite :5173 up, then
// `Quizup/local/seed-clans.sh`. Avatar photos are blanked so the game draws letter avatars
// (the bot photos have no known licence). Writes raw PNGs to the given dir; convert and crop
// as the commit that added this did (720 px phone screen, 820 px maps without the toggle row).
//
//   node scripts/capture-app.mjs /tmp/caps
import { createRequire } from 'module';
const require = createRequire('/home/asim/Quizup/frontend/package.json');
const { chromium } = require('@playwright/test');
const out = process.argv[2];
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3,
  storageState: '/home/asim/Quizup/frontend/e2e/.auth/alice.json', isMobile: true, hasTouch: true });
// Bot photos have no known licence: blank every avatar_url so the game draws its letter avatars
const strip = v => Array.isArray(v) ? v.map(strip) : v && typeof v === 'object'
  ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, k === 'avatar_url' ? null : strip(x)])) : v;
await ctx.route('**/api/**', async route => {
  const r = await route.fetch();
  const ct = r.headers()['content-type'] || '';
  if (!ct.includes('json')) return route.fulfill({ response: r });
  route.fulfill({ response: r, body: JSON.stringify(strip(await r.json())) });
});
const page = await ctx.newPage();
await page.goto('http://localhost:5173/');
await page.getByText('ALL TOPICS').waitFor({ timeout: 40000 });
await page.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'Clans' }).click();
await page.waitForTimeout(7000);
await page.screenshot({ path: `${out}/screen-clans.png` });
const map = page.locator('canvas[aria-label="Map"]').locator('xpath=ancestor::*[contains(@class,"rounded")][1]');
await map.screenshot({ path: `${out}/map-sydney.png` });
await page.getByRole('button', { name: 'Australia', exact: true }).click();
await page.waitForTimeout(5000);
await map.screenshot({ path: `${out}/map-australia.png` });
await browser.close();
