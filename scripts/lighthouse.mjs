/**
 * Misura Lighthouse su mobile con throttling 4G.
 *
 *   node scripts/lighthouse.mjs dist            → il sito ricostruito
 *   node scripts/lighthouse.mjs --baseline      → il sito com'era prima
 *
 * La modalità baseline serve la radice del repository con l'index.html originale
 * ripreso da git: è esattamente ciò che GitHub Pages pubblicava, modelli da 74 MB
 * e immagini da 22 MB compresi.
 */
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { execFileSync } from 'node:child_process';
import { extname, join } from 'node:path';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json',
  '.bin': 'application/octet-stream',
  '.wasm': 'application/wasm',
};

const baseline = process.argv.includes('--baseline');
const root = baseline ? '.' : (process.argv[2] ?? 'dist');

// L'index.html pre-intervento: ultimo commit di main prima di questo lavoro.
const baselineHtml = baseline
  ? execFileSync('git', ['show', '20787d4:index.html'], { encoding: 'utf-8' })
  : null;

// GitHub Pages comprime i formati testuali, non quelli già compressi.
// Senza gzip qui si misurerebbero 182 kB di bundle invece dei ~58 che il
// browser scarica davvero, e i tempi sarebbero pessimisti di conseguenza.
const COMPRESSIBLE = new Set(['.html', '.js', '.css', '.json', '.svg', '.wasm']);

const send = (req, res, rel, body) => {
  const headers = { 'Content-Type': MIME[extname(rel)] || 'application/octet-stream' };
  const acceptsGzip = /\bgzip\b/.test(req.headers['accept-encoding'] ?? '');

  if (acceptsGzip && COMPRESSIBLE.has(extname(rel))) {
    const gz = gzipSync(body, { level: 9 });
    headers['Content-Encoding'] = 'gzip';
    headers['Content-Length'] = gz.length;
    res.writeHead(200, headers);
    return res.end(gz);
  }

  headers['Content-Length'] = body.length;
  res.writeHead(200, headers);
  res.end(body);
};

const server = createServer(async (req, res) => {
  const path = decodeURIComponent(req.url.split('?')[0]);

  if (baseline && (path === '/' || path === '/index.html')) {
    return send(req, res, 'index.html', Buffer.from(baselineHtml));
  }

  const rel = path === '/' ? 'index.html' : path.replace(/^\/+/, '');
  try {
    send(req, res, rel, await readFile(join(root, rel)));
  } catch {
    res.writeHead(404);
    res.end('non trovato');
  }
});

await new Promise((r) => server.listen(0, '127.0.0.1', r));
const url = `http://127.0.0.1:${server.address().port}/`;

const chrome = await chromeLauncher.launch({
  chromeFlags: ['--headless=new', '--no-sandbox', '--use-gl=angle', '--enable-unsafe-swiftshader'],
});

/*
 * Due metodi di throttling, ed è importante sapere quale si sta leggendo.
 *
 * 'simulate' (il default, quello di PageSpeed Insights) registra la pagina senza
 * freni e poi ne ricalcola i tempi con un modello. Il modello considera parte del
 * grafo dell'LCP tutto ciò che è arrivato prima dell'LCP osservato: servendo da
 * localhost, dove ogni richiesta chiude in pochi millisecondi, ci finisce dentro
 * anche il JS che l'elemento LCP non aspetta affatto, e il risultato è pessimista.
 *
 * 'devtools' applica il freno vero al browser. Sui numeri di questa pagina è il
 * metodo che corrisponde a ciò che si misura con un PerformanceObserver.
 */
const devtools = process.argv.includes('--devtools');

const result = await lighthouse(
  url,
  { port: chrome.port, output: 'json', logLevel: 'error' },
  {
    extends: 'lighthouse:default',
    settings: {
      formFactor: 'mobile',
      screenEmulation: { mobile: true, disabled: false },
      throttlingMethod: devtools ? 'devtools' : 'simulate',
    },
  },
);

const { categories, audits } = result.lhr;
const pct = (c) => (c ? Math.round(c.score * 100) : '—');

const method = devtools ? 'devtools (freno reale)' : 'simulate (lantern)';
console.log(`\n${baseline ? 'PRIMA (sito pubblicato)' : `DOPO (${root})`} — throttling: ${method}`);
console.log('─'.repeat(52));
console.log(`Performance      ${String(pct(categories.performance)).padStart(4)}`);
console.log(`Accessibility    ${String(pct(categories.accessibility)).padStart(4)}`);
console.log(`Best practices   ${String(pct(categories['best-practices'])).padStart(4)}`);
console.log(`SEO              ${String(pct(categories.seo)).padStart(4)}`);
console.log('─'.repeat(52));

for (const id of [
  'first-contentful-paint',
  'largest-contentful-paint',
  'total-blocking-time',
  'cumulative-layout-shift',
  'speed-index',
]) {
  const audit = audits[id];
  if (audit) console.log(`${audit.title.padEnd(28)} ${String(audit.displayValue ?? '—').padStart(10)}`);
}

const bytes = audits['total-byte-weight'];
if (bytes) console.log(`${'Peso totale trasferito'.padEnd(28)} ${String(bytes.displayValue).padStart(10)}`);

// Quale elemento Lighthouse considera LCP: senza questo si ottimizza alla cieca.
console.log('\n--- audit LCP ---');
const lcpAudit = audits['largest-contentful-paint-element'];
console.log(`score ${lcpAudit?.score} | mode ${lcpAudit?.scoreDisplayMode} | errore: ${lcpAudit?.errorMessage ?? 'nessuno'}`);
console.log(JSON.stringify(lcpAudit?.details ?? {}, null, 1).slice(0, 1000));

// I tempi osservati, distinti da quelli simulati riportati sopra.
console.log('\n--- osservato vs simulato ---');
const m = audits.metrics?.details?.items?.[0] ?? {};
for (const k of [
  'observedFirstContentfulPaint', 'observedLargestContentfulPaint',
  'observedDomContentLoaded', 'observedLoad',
  'firstContentfulPaint', 'largestContentfulPaint', 'lcpLoadStart', 'lcpLoadEnd',
]) {
  if (k in m) console.log(`  ${k.padEnd(32)} ${m[k]} ms`);
}

// Ordine e tempi di arrivo delle richieste: mostra cosa occupa il percorso critico.
const net = audits['network-requests']?.details?.items ?? [];
console.log('\n--- prime 16 richieste (per fine download) ---');
for (const r of [...net].sort((a, b) => (a.networkEndTime ?? 0) - (b.networkEndTime ?? 0)).slice(0, 16)) {
  const path = String(r.url).replace(/^https?:\/\/[^/]+/, '').slice(0, 58);
  console.log(
    `${String(Math.round(r.networkEndTime ?? 0)).padStart(6)} ms  ${String(Math.round((r.transferSize ?? 0) / 1024)).padStart(5)} KB  ${path}`,
  );
}

// Audit non superati nelle categorie non prestazionali.
for (const [name, key] of [['Accessibilità', 'accessibility'], ['Best practices', 'best-practices'], ['SEO', 'seo']]) {
  const failed = (categories[key]?.auditRefs ?? [])
    .map((ref) => audits[ref.id])
    .filter((a) => a && a.score !== null && a.score < 1 && a.scoreDisplayMode !== 'notApplicable');
  if (failed.length) {
    console.log(`
${name} — audit non superati:`);
    for (const a of failed) console.log(`  - ${a.title}${a.displayValue ? ` (${a.displayValue})` : ''}`);
  }
}

const longTasks = audits['long-tasks']?.details?.items?.slice(0, 4);
if (longTasks?.length) {
  console.log('\nTask lunghi:');
  for (const task of longTasks) {
    console.log(`  ${String(Math.round(task.duration)).padStart(5)} ms  ${task.url.replace(/^https?:\/\/[^/]+/, '')}`);
  }
}

console.log('');

await chrome.kill();
server.close();
