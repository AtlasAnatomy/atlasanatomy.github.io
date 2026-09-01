/**
 * Ricodifica in WebP le immagini di src/assets, dimensionandole per l'uso reale.
 *
 * I PNG originali sono sproporzionati rispetto a come vengono mostrati: il logo
 * della navbar pesava 2,2 MB per essere disegnato a 48x48, le anteprime dei paper
 * fino a 5 MB per una card di 360x230. Qui ogni gruppo ha un tetto di larghezza
 * pari al doppio della dimensione di rendering (per i display a 2x).
 *
 * I file sorgente restano al loro posto: lo script scrive <nome>.webp accanto
 * a ognuno, ed è src/assets/index.js a puntare ai .webp.
 *
 *   node scripts/optimize-images.mjs
 */
import sharp from 'sharp';
import { readdir, readFile, stat, unlink, writeFile } from 'node:fs/promises';
import { join, extname, basename, dirname } from 'node:path';

// maxWidth = doppio della dimensione massima a schermo; quality tarata sul contenuto.
const RULES = [
  { dir: 'src/assets/papers', maxWidth: 760, quality: 78 },  // card 360x230
  { dir: 'src/assets/company', maxWidth: 200, quality: 82 }, // icona timeline ~48px
  { dir: 'src/assets/tech', maxWidth: 320, quality: 85 },    // texture decal 3D
  { dir: 'src/assets', maxWidth: 512, quality: 82, only: [
      'backend.png', 'creator.png', 'mobile.png', 'web.png',
      'scholar.png', 'profile.png', 'coffee-cup.png',
    ] },
  { dir: 'src/assets', maxWidth: 128, quality: 88, only: ['logo1.png'] },
];

/*
 * Lo sfondo dell'hero esce da questo giro e va in public/ con un nome stabile.
 *
 * Copre un'area più grande del poster, quindi è lui l'elemento che il browser
 * elegge a LCP. Passando per src/assets prendeva un nome con hash, impossibile
 * da nominare in un <link rel="preload">, e veniva scoperto solo dopo il parse
 * del CSS: arrivava a 1812 ms contro i 948 del poster. Da public/ ha un URL
 * fisso, index.html lo può preloadare, e parte insieme al resto.
 *
 * Resta a piena risoluzione e a qualità alta: è una trama di linee sottili su
 * fondo scuro, e sotto q80 il WebP le impasta in bande ben visibili. A 3200px/q88
 * pesa 187 kB, contro i 33 kB di 1600px/q58 che si vedevano sgranati sui display
 * a 2x, e contro 1,1 MB del sorgente non compresso.
 */
const HERO_BACKGROUND = { from: 'src/assets/herobg.png', to: 'public/herobg.webp', maxWidth: 3200, quality: 88 };

const KB = (n) => (n / 1024).toFixed(0).padStart(6) + ' KB';

let totalBefore = 0;
let totalAfter = 0;
const rows = [];

for (const rule of RULES) {
  let entries;
  try {
    entries = (await readdir(rule.dir, { withFileTypes: true })).filter((e) => e.isFile());
  } catch {
    console.warn(`  ! cartella assente: ${rule.dir}`);
    continue;
  }

  /*
   * I .webp già pronti vengono ridimensionati sul posto quando eccedono il
   * tetto della regola. Alcuni loghi aziendali arrivano a 2048px per un badge
   * disegnato a 44: senza questo passaggio finirebbero nel bundle a piena
   * risoluzione, perché la pipeline PNG -> WebP non li tocca.
   * L'operazione è idempotente: una volta rientrati nel tetto, non si ripete.
   */
  const rasterNames = new Set(
    entries.filter((e) => /\.(png|jpe?g)$/i.test(e.name)).map((e) => basename(e.name, extname(e.name))),
  );

  for (const entry of entries.filter((e) => /\.webp$/i.test(e.name))) {
    if (rule.only && !rule.only.includes(entry.name)) continue;

    // Un .webp che ha un PNG omonimo accanto è un prodotto di questo script:
    // lo rigenera il ciclo più sotto. Toccarlo qui significherebbe ricomprimere
    // ogni volta un file già compresso, perdendo qualità a ogni esecuzione.
    if (rasterNames.has(basename(entry.name, '.webp'))) continue;

    const path = join(rule.dir, entry.name);
    // Il file va letto in memoria: passando il percorso, su Windows sharp
    // trattiene un handle che impedisce la riscrittura più avanti nello script.
    const source = await readFile(path);
    const before = source.length;
    const meta = await sharp(source).metadata();
    if (meta.width <= rule.maxWidth && meta.height <= rule.maxWidth) continue;

    const resized = await sharp(source, { unlimited: true })
      .resize(rule.maxWidth, rule.maxWidth, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: rule.quality, effort: 6, alphaQuality: 90 })
      .toBuffer();

    await writeFile(path, resized);
    rows.push([path, before, resized.length, `(ridimensionato sul posto, ${meta.width}px -> ${rule.maxWidth}px)`]);
    totalBefore += before;
    totalAfter += resized.length;
  }

  let files = entries.filter((e) => /\.(png|jpe?g)$/i.test(e.name)).map((e) => e.name);
  if (rule.only) files = files.filter((f) => rule.only.includes(f));

  for (const name of files) {
    const src = join(rule.dir, name);
    const out = join(dirname(src), basename(name, extname(name)) + '.webp');

    const before = (await stat(src)).size;
    const image = sharp(src, { unlimited: true });
    const meta = await image.metadata();

    let pipeline = image;
    if (meta.width > rule.maxWidth) {
      pipeline = pipeline.resize(rule.maxWidth, null, { fit: 'inside', withoutEnlargement: true });
    }

    await pipeline.webp({ quality: rule.quality, effort: 6, alphaQuality: 90 }).toFile(out);

    const after = (await stat(out)).size;

    // Un WebP più pesante dell'originale non ha senso: si tiene il PNG.
    if (after >= before) {
      await unlink(out);
      rows.push([src, before, before, '(PNG più leggero, invariato)']);
      totalBefore += before;
      totalAfter += before;
      continue;
    }

    rows.push([src, before, after, '']);
    totalBefore += before;
    totalAfter += after;
  }
}

{
  const before = (await stat(HERO_BACKGROUND.from)).size;
  await sharp(HERO_BACKGROUND.from, { unlimited: true })
    .resize(HERO_BACKGROUND.maxWidth, null, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: HERO_BACKGROUND.quality, effort: 6 })
    .toFile(HERO_BACKGROUND.to);
  const after = (await stat(HERO_BACKGROUND.to)).size;
  rows.push([HERO_BACKGROUND.to, before, after, '(preloadato da index.html)']);
  totalBefore += before;
  totalAfter += after;
}

rows.sort((a, b) => b[1] - a[1]);
for (const [path, before, after, note] of rows) {
  const pct = before === after ? '' : `-${(100 * (1 - after / before)).toFixed(0)}%`;
  console.log(`${KB(before)} -> ${KB(after)}  ${pct.padStart(5)}  ${path} ${note}`);
}

console.log(`\nTOTALE  ${KB(totalBefore)} -> ${KB(totalAfter)}  (-${(100 * (1 - totalAfter / totalBefore)).toFixed(1)}%)\n`);
