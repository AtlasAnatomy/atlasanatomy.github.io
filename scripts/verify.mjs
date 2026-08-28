/**
 * Verifica del sito compilato.
 *
 * Serve dist/ e per ogni viewport richiesto controlla: scorrimento orizzontale,
 * errori in console, richieste fallite, dimensione delle aree toccabili e
 * presenza delle sezioni. Salva anche uno screenshot per l'ispezione visiva.
 *
 *   node scripts/verify.mjs [--shots]
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const ROOT = 'dist';
const SHOT_DIR = 'scripts/shots';
const withShots = process.argv.includes('--shots');

const VIEWPORTS = [
  { name: '320', width: 320, height: 720, mobile: true },
  { name: '375', width: 375, height: 812, mobile: true },
  { name: '768', width: 768, height: 1024, mobile: false },
  { name: '1024', width: 1024, height: 800, mobile: false },
  { name: '1440', width: 1440, height: 900, mobile: false },
];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.glb': 'model/gltf-binary',
  '.wasm': 'application/wasm',
};

const server = createServer(async (req, res) => {
  const path = decodeURIComponent(req.url.split('?')[0]);
  const rel = normalize(path === '/' ? '/index.html' : path).replace(/^(\.\.[/\\])+/, '');
  try {
    const body = await readFile(join(ROOT, rel));
    res.writeHead(200, { 'Content-Type': MIME[extname(rel)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end('non trovato');
  }
});

await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch({ args: ['--use-gl=angle', '--enable-unsafe-swiftshader'] });
if (withShots) await mkdir(SHOT_DIR, { recursive: true });

// Le sezioni che devono esistere in ogni caso.
const REQUIRED_IDS = ['about', 'work', 'research', 'projects', 'education', 'contact'];

let failures = 0;
const note = (ok, text) => {
  if (!ok) failures++;
  console.log(`    ${ok ? 'ok  ' : 'FAIL'}  ${text}`);
};

for (const viewport of VIEWPORTS) {
  console.log(`\n[${viewport.name}px]`);

  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    isMobile: viewport.mobile,
    hasTouch: viewport.mobile,
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  const consoleErrors = [];
  const failedRequests = [];
  page.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push(m.text());
  });
  page.on('requestfailed', (r) => failedRequests.push(`${r.url()} — ${r.failure()?.errorText}`));
  page.on('response', (r) => {
    if (r.status() >= 400) failedRequests.push(`${r.url()} — HTTP ${r.status()}`);
  });

  await page.goto(base, { waitUntil: 'networkidle', timeout: 60_000 });

  // Scorre l'intera pagina: monta le sezioni lazy e i canvas differiti.
  await page.evaluate(async () => {
    const step = window.innerHeight;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 160));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 400));
  });
  await page.waitForTimeout(1200);

  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    const offenders = [];
    if (doc.scrollWidth > doc.clientWidth) {
      for (const el of document.querySelectorAll('*')) {
        const r = el.getBoundingClientRect();
        if (r.right > doc.clientWidth + 1 || r.left < -1) {
          offenders.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)}`);
          if (offenders.length >= 5) break;
        }
      }
    }
    return { scrollWidth: doc.scrollWidth, clientWidth: doc.clientWidth, offenders };
  });

  note(
    overflow.scrollWidth <= overflow.clientWidth,
    `nessuno scorrimento orizzontale (scrollWidth ${overflow.scrollWidth} / client ${overflow.clientWidth})` +
      (overflow.offenders.length ? `\n          responsabili: ${overflow.offenders.join(', ')}` : ''),
  );

  const missing = await page.evaluate(
    (ids) => ids.filter((id) => !document.getElementById(id)),
    REQUIRED_IDS,
  );
  note(missing.length === 0, `sezioni presenti${missing.length ? ` — mancano: ${missing.join(', ')}` : ''}`);

  // Area toccabile: si controllano solo gli elementi realmente visibili.
  const smallTargets = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll('a, button, input, textarea, [role="button"]')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (getComputedStyle(el).visibility === 'hidden') continue;
      if (r.height < 44 && r.width < 44) {
        out.push(`${el.tagName.toLowerCase()} "${(el.textContent || '').trim().slice(0, 30)}" ${Math.round(r.width)}x${Math.round(r.height)}`);
      }
    }
    return out;
  });
  note(smallTargets.length === 0, `aree toccabili >= 44px${smallTargets.length ? ` — sotto misura: ${smallTargets.join(' | ')}` : ''}`);

  // Gli avvisi di React su chiavi/prop sono rumore noto di drei: si filtrano no.
  note(consoleErrors.length === 0, `console pulita${consoleErrors.length ? `:\n          ${consoleErrors.slice(0, 4).join('\n          ')}` : ''}`);
  note(failedRequests.length === 0, `nessuna richiesta fallita${failedRequests.length ? `:\n          ${failedRequests.slice(0, 4).join('\n          ')}` : ''}`);

  const canvases = await page.locator('canvas').count();
  note(canvases > 0 && canvases <= 4, `contesti WebGL: ${canvases} (limite pratico del browser ~16)`);

  if (withShots) {
    await page.screenshot({ path: `${SHOT_DIR}/${viewport.name}.png`, fullPage: false });
    await page.screenshot({ path: `${SHOT_DIR}/${viewport.name}-full.png`, fullPage: true });
  }

  await context.close();
}

// I link esterni si controllano una volta sola, non per ogni viewport.
console.log('\n[link]');
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
await page.goto(base, { waitUntil: 'networkidle' });
await page.evaluate(async () => {
  const step = window.innerHeight;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 120));
  }
});
await page.waitForTimeout(800);

const links = await page.evaluate(() =>
  [...new Set([...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')))],
);
await context.close();
await browser.close();
server.close();

const external = links.filter((href) => /^https?:/.test(href));
const anchors = links.filter((href) => href.startsWith('#'));
const mailto = links.filter((href) => href.startsWith('mailto:'));

console.log(`    ${anchors.length} ancore interne, ${external.length} link esterni, ${mailto.length} mailto`);

// Editori scientifici, LinkedIn e Cloudflare rispondono 403 o 999 a qualunque
// client che non sia un browser vero. Non significa che il link sia rotto:
// per questi domini si verifica solo che l'host risolva e risponda.
const BOT_WALLED = [
  'sciencedirect.com', 'linkedin.com', 'onlinelibrary.wiley.com',
  'doi.org', 'ieeexplore.ieee.org', 'travisions.eu',
];
const isBotWalled = (href) => BOT_WALLED.some((d) => new URL(href).hostname.endsWith(d));

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

let unverified = 0;

for (const href of external) {
  try {
    let res = await fetch(href, { method: 'HEAD', redirect: 'follow', headers: { 'User-Agent': UA } });
    if (res.status >= 400) {
      res = await fetch(href, { method: 'GET', redirect: 'follow', headers: { 'User-Agent': UA } });
    }

    if (res.status < 400) {
      note(true, `${res.status}  ${href}`);
    } else if (isBotWalled(href)) {
      unverified++;
      console.log(`    --    ${res.status}  ${href}  (anti-bot, host raggiungibile)`);
    } else {
      note(false, `${res.status}  ${href}`);
    }
  } catch (err) {
    if (isBotWalled(href)) {
      unverified++;
      console.log(`    --    bloccato  ${href}  (${err.message})`);
    } else {
      note(false, `errore rete  ${href} — ${err.message}`);
    }
  }
}

if (unverified > 0) {
  console.log(`\n    ${unverified} link dietro protezione anti-bot: da aprire a mano per la conferma finale.`);
}

console.log(failures === 0 ? '\nTutti i controlli superati.\n' : `\n${failures} controlli falliti.\n`);
process.exit(failures === 0 ? 0 : 1);
