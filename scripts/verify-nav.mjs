/**
 * Verifica della navigazione su mobile.
 *
 * Copre ciò che verify.mjs non guarda: il menu si apre e si chiude davvero,
 * risponde a Escape e al tocco fuori, porta alla sezione giusta senza che la
 * navbar fissa ne copra il titolo, e la voce attiva segue lo scorrimento.
 *
 * Quest'ultimo controllo esiste perché il caso si era rotto: le sezioni sono
 * montate in lazy dopo l'evento load, e l'IntersectionObserver della navbar,
 * agganciato una volta sola al primo render, non trovava nulla da osservare.
 *
 *   node scripts/verify-nav.mjs
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.glb': 'model/gltf-binary', '.wasm': 'application/wasm' };

const server = createServer(async (req, res) => {
  const p = decodeURIComponent(req.url.split('?')[0]);
  const rel = p === '/' ? 'index.html' : p.replace(/^\/+/, '');
  try {
    const b = await readFile(join('dist', rel));
    res.writeHead(200, { 'Content-Type': MIME[extname(rel)] || 'application/octet-stream' });
    res.end(b);
  } catch { res.writeHead(404); res.end(); }
});

await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}/`;

const browser = await chromium.launch({ args: ['--use-gl=angle', '--enable-unsafe-swiftshader'] });
const context = await browser.newContext({ viewport: { width: 375, height: 812 }, hasTouch: true, isMobile: true });
const page = await context.newPage();

let failures = 0;
const check = (ok, text) => { if (!ok) failures++; console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${text}`); };

await page.goto(base, { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);

const toggle = page.locator('button[aria-controls="mobile-menu"]');
const panel = page.locator('#mobile-menu');

check(await toggle.isVisible(), 'il pulsante del menu è visibile a 375px');
check((await toggle.getAttribute('aria-expanded')) === 'false', 'aria-expanded parte da false');
check(!(await panel.isVisible()), 'il pannello parte chiuso');

await toggle.tap();
await page.waitForTimeout(300);
check((await toggle.getAttribute('aria-expanded')) === 'true', 'aria-expanded diventa true al tocco');
check(await panel.isVisible(), 'il pannello si apre');

// Chiusura con Escape.
await page.keyboard.press('Escape');
await page.waitForTimeout(300);
check(!(await panel.isVisible()), 'Escape chiude il pannello');

// Riapertura e chiusura toccando fuori.
await toggle.tap();
await page.waitForTimeout(300);
await page.tap('body', { position: { x: 40, y: 500 } });
await page.waitForTimeout(300);
check(!(await panel.isVisible()), 'un tocco fuori chiude il pannello');

// Navigazione da una voce del menu.
await toggle.tap();
await page.waitForTimeout(300);
await panel.locator('a[href="#projects"]').tap();
await page.waitForTimeout(1500);
check(!(await panel.isVisible()), 'il pannello si chiude dopo la scelta');

const scrolled = await page.evaluate(() => {
  const el = document.getElementById('projects');
  return el ? Math.round(el.getBoundingClientRect().top) : null;
});
check(scrolled !== null && Math.abs(scrolled) < 200, `la sezione Projects è in cima (top = ${scrolled}px)`);

// La navbar non deve coprire il titolo della sezione raggiunta.
const covered = await page.evaluate(() => {
  const heading = document.querySelector('#projects h2');
  const nav = document.querySelector('nav');
  if (!heading || !nav) return null;
  return heading.getBoundingClientRect().top >= nav.getBoundingClientRect().bottom - 4;
});
check(covered === true, 'il titolo non finisce sotto la navbar fissa');

// Voce attiva evidenziata.
const active = await page.evaluate(() =>
  [...document.querySelectorAll('a[aria-current="true"]')].map((a) => a.textContent.trim()),
);
check(active.includes('Projects'), `la voce attiva segue lo scorrimento (${active.join(', ') || 'nessuna'})`);

await browser.close();
server.close();
console.log(failures === 0 ? '\nMenu mobile: tutto ok.\n' : `\n${failures} controlli falliti.\n`);
process.exit(failures === 0 ? 0 : 1);
