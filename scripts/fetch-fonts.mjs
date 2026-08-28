/**
 * Scarica in locale i soli pesi di Poppins effettivamente usati.
 *
 * src/index.css apriva con @import di Google Fonts: la richiesta partiva solo
 * dopo il download del CSS, e caricava 9 pesi in latin + latin-ext. Qui i .woff2
 * finiscono in public/fonts e vengono dichiarati con @font-face + font-display:swap,
 * eliminando due connessioni a terzi e la catena di richieste bloccanti.
 *
 *   node scripts/fetch-fonts.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises';

// 400 corpo, 500 nav/label, 600 sottotitoli, 700 grassetti, 800/900 titoli.
const WEIGHTS = [400, 500, 600, 700, 800, 900];
const FAMILY = 'Poppins';

const cssUrl = `https://fonts.googleapis.com/css2?family=${FAMILY}:wght@${WEIGHTS.join(';')}&display=swap`;

// Lo user-agent decide il formato: questo garantisce woff2 e il subset latin.
const res = await fetch(cssUrl, {
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
});
if (!res.ok) throw new Error(`Google Fonts ha risposto ${res.status}`);
const css = await res.text();

await mkdir('public/fonts', { recursive: true });

// Ogni @font-face porta con sé il subset in un commento: si tiene solo "latin".
const blocks = css.split('/*').filter((b) => b.includes('@font-face'));
const faces = [];

for (const block of blocks) {
  const subset = block.slice(0, block.indexOf('*/')).trim();
  if (subset !== 'latin') continue;

  const weight = block.match(/font-weight:\s*(\d+)/)?.[1];
  const url = block.match(/url\((https:[^)]+\.woff2)\)/)?.[1];
  if (!weight || !url) continue;

  const file = `poppins-${weight}.woff2`;
  const font = await fetch(url);
  if (!font.ok) throw new Error(`download ${file} fallito: ${font.status}`);
  const bytes = Buffer.from(await font.arrayBuffer());
  await writeFile(`public/fonts/${file}`, bytes);
  faces.push({ weight, file, size: bytes.length });
  console.log(`  ${file}  ${(bytes.length / 1024).toFixed(1)} KB`);
}

if (faces.length === 0) throw new Error('nessun @font-face latin trovato nella risposta');

const fontFaceCss = faces
  .sort((a, b) => a.weight - b.weight)
  .map(({ weight, file }) => `@font-face {
  font-family: "Poppins";
  font-style: normal;
  font-weight: ${weight};
  font-display: swap;
  src: url("/fonts/${file}") format("woff2");
}`).join('\n\n');

await writeFile('src/fonts.css', `/* Generato da scripts/fetch-fonts.mjs. Non modificare a mano. */\n\n${fontFaceCss}\n`);

const total = faces.reduce((n, f) => n + f.size, 0);
console.log(`\n${faces.length} pesi, ${(total / 1024).toFixed(1)} KB totali -> public/fonts/ + src/fonts.css`);
