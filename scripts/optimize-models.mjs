/**
 * Pipeline di ottimizzazione dei modelli 3D.
 *
 * Sorgenti (non pubblicate, restano fuori dal sito):
 *   desktop_pc/scene.gltf  ~15.5 MB  (1.8 MB json + 4.3 MB bin + 9.4 MB in 51 texture)
 *   rocket/scene.gltf      ~58.3 MB  (geometria f32 non compressa, nessuna texture)
 *
 * Output pubblicati in public/models/*.glb: un file solo, Draco + texture WebP.
 *
 * Le texture vengono ricodificate a mano con sharp invece che con textureCompress():
 * il vips incluso in @gltf-transform/cli fallisce su alcune texture di questo
 * modello con "colourspace: parameter space not set".
 *
 *   node scripts/optimize-models.mjs
 */
import { NodeIO } from '@gltf-transform/core';
import { KHRDracoMeshCompression, EXTTextureWebP, ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { draco, dedup, prune, weld, simplify, flatten, join } from '@gltf-transform/functions';
import { MeshoptSimplifier } from 'meshoptimizer';
import draco3d from 'draco3dgltf';
import sharp from 'sharp';
import { mkdir, stat, readdir } from 'node:fs/promises';
import { dirname, join as joinPath } from 'node:path';

const MB = (n) => (n / 1048576).toFixed(2) + ' MB';

/** Peso di ciò che il browser scaricherebbe davvero: .gltf + .bin + textures/. */
async function sourceSize(gltfPath) {
  const dir = dirname(gltfPath);
  let total = 0;
  const walk = async (d) => {
    for (const entry of await readdir(d, { withFileTypes: true })) {
      const p = joinPath(d, entry.name);
      if (entry.isDirectory()) await walk(p);
      // scene.glb è un duplicato inutilizzato del modello, non va contato.
      else if (!/\.(glb|txt)$/i.test(entry.name)) total += (await stat(p)).size;
    }
  };
  await walk(dir);
  return total;
}

async function sizeOf(p) {
  try { return (await stat(p)).size; } catch { return 0; }
}

/** Ricodifica ogni texture in WebP, con dimensione massima per ruolo. */
async function recompressTextures(document, { maxSize, quality }) {
  const textures = document.getRoot().listTextures();
  let before = 0, after = 0, skipped = 0;

  for (const texture of textures) {
    const image = texture.getImage();
    if (!image) continue;
    before += image.byteLength;

    try {
      let pipeline = sharp(Buffer.from(image), { unlimited: true }).toColourspace('srgb');
      const meta = await pipeline.metadata();

      if (meta.width > maxSize || meta.height > maxSize) {
        pipeline = pipeline.resize(maxSize, maxSize, { fit: 'inside', withoutEnlargement: true });
      }

      // L'alpha va conservato: alcune texture del case sono ritagli con trasparenza.
      const out = await pipeline.webp({ quality, effort: 6, alphaQuality: 90 }).toBuffer();

      if (out.byteLength < image.byteLength) {
        texture.setImage(out).setMimeType('image/webp');
        const uri = texture.getURI();
        if (uri) texture.setURI(uri.replace(/\.\w+$/, '.webp'));
        after += out.byteLength;
      } else {
        after += image.byteLength;
        skipped++;
      }
    } catch (err) {
      console.warn(`    ! texture "${texture.getName() || '(senza nome)'}" saltata: ${err.message.split('\n')[0]}`);
      after += image.byteLength;
      skipped++;
    }
  }

  console.log(`    texture: ${textures.length} (${MB(before)} -> ${MB(after)}${skipped ? `, ${skipped} invariate` : ''})`);
  return { before, after };
}

async function optimize({ label, input, output, maxSize, quality, simplifyError }) {
  console.log(`\n[${label}]`);
  const inputSize = await sourceSize(input);

  const io = new NodeIO()
    .registerExtensions(ALL_EXTENSIONS)
    .registerDependencies({
      'draco3d.decoder': await draco3d.createDecoderModule(),
      'draco3d.encoder': await draco3d.createEncoderModule(),
    });

  const document = await io.read(input);

  // Pulizia strutturale prima di toccare geometria e texture.
  await document.transform(
    dedup(),
    flatten(),
    // join() fonde le mesh che condividono materiale: taglia le draw call.
    join({ keepNamed: false }),
    weld(),
  );

  if (simplifyError > 0) {
    await MeshoptSimplifier.ready;
    await document.transform(
      simplify({ simplifier: MeshoptSimplifier, error: simplifyError, ratio: 0.0 }),
    );
  }

  if (document.getRoot().listTextures().length > 0) {
    document.createExtension(EXTTextureWebP).setRequired(false);
    await recompressTextures(document, { maxSize, quality });
  }

  await document.transform(
    prune({ keepAttributes: false, keepLeaves: false }),
    draco({ method: 'edgebreaker', quantizePosition: 14, quantizeNormal: 10, quantizeTexcoord: 12 }),
  );

  document.createExtension(KHRDracoMeshCompression).setRequired(true);

  await io.write(output, document);

  const outputSize = await sizeOf(output);
  const saved = (100 * (1 - outputSize / inputSize)).toFixed(1);
  console.log(`    ${MB(inputSize)} -> ${MB(outputSize)}  (-${saved}%)`);
  return { inputSize, outputSize };
}

await mkdir('public/models', { recursive: true });

// L'hero: la fedeltà conta, è il modello che si guarda da vicino.
const pc = await optimize({
  label: 'desktop_pc  (hero)',
  input: 'desktop_pc/scene.gltf',
  output: 'public/models/desktop_pc.glb',
  maxSize: 1024,
  quality: 80,
  simplifyError: 0,
});

// Il razzo arriva a 1.017.073 vertici per un oggetto piccolo che ruota da solo:
// il solo Draco porta 58,3 MB a 2,08 MB, la decimazione a 0.0001 scende a 0,42 MB
// restando a 88.085 vertici. Oltre (0.0005 -> 16k, 0.002 -> 6,5k) il profilo si sfalda.
const rocket = await optimize({
  label: 'rocket  (contatti)',
  input: 'rocket/scene.gltf',
  output: 'public/models/rocket.glb',
  maxSize: 1024,
  quality: 80,
  simplifyError: 0.0001,
});

const inTotal = pc.inputSize + rocket.inputSize;
const outTotal = pc.outputSize + rocket.outputSize;
console.log(`\nTOTALE  ${MB(inTotal)} -> ${MB(outTotal)}  (-${(100 * (1 - outTotal / inTotal)).toFixed(1)}%)\n`);
