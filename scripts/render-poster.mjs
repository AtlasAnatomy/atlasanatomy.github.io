/**
 * Genera il poster statico dell'hero.
 *
 * L'immagine è ciò che il browser dipinge come LCP: compare subito, e il canvas
 * WebGL le si sovrappone in dissolvenza solo dopo il first paint. Perché lo scambio
 * sia invisibile, il poster va renderizzato con la stessa camera, le stesse luci
 * e la stessa posa del modello usati da src/components/canvas/Computers.jsx.
 *
 * Rende su fondo trasparente, così il poster resta valido sopra bg-hero-pattern.
 *
 *   node scripts/render-poster.mjs
 */
import { chromium } from 'playwright';
import sharp from 'sharp';
import { readFile, mkdir, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname } from 'node:path';

// Una variante per fascia di viewport: le pose di Computers.jsx sono diverse,
// e un poster con la posa sbagliata farebbe saltare il modello nel momento in cui
// il canvas gli subentra. I nomi devono restare allineati a POSE in Computers.jsx.
const VARIANTS = [
  {
    name: 'hero-poster',
    width: 1400,
    height: 1000,
    camera: { position: [20, 3, 5], fov: 25 },
    scale: 0.7,
    position: [0, -2.5, -1.5],
    rotation: [-0.01, -0.2, -0.1],
  },
  {
    name: 'hero-poster-mobile',
    width: 720,
    height: 720,
    camera: { position: [20, 3, 5], fov: 25 },
    scale: 0.3,
    position: [0, -1.2, -0.5],
    rotation: [-0.01, -0.2, -0.1],
  },
];

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript',
  '.glb': 'model/gltf-binary', '.wasm': 'application/wasm',
};

// three e il decoder Draco vengono serviti da node_modules: nessuna CDN.
// /jsm/** mappa l'intero albero degli addon, così anche gli import interni
// dei loader (BufferGeometryUtils e simili) si risolvono da soli.
const ROUTES = {
  '/three.module.js': 'node_modules/three/build/three.module.js',
  '/model.glb': 'public/models/desktop_pc.glb',
};
const PREFIXES = { '/jsm/': 'node_modules/three/examples/jsm/' };

const pageFor = (variant) => `<!doctype html>
<html><head><meta charset="utf-8"><style>
  html,body{margin:0;background:transparent}canvas{display:block}
</style>
<script type="importmap">{"imports":{"three":"/three.module.js","three/addons/":"/jsm/"}}</script>
</head><body>
<script type="module">
import * as THREE from 'three';
import { GLTFLoader } from '/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from '/jsm/loaders/DRACOLoader.js';

const POSE = ${JSON.stringify(variant)};
const W = ${variant.width}, H = ${variant.height};

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(2);
renderer.setSize(W, H);
renderer.shadowMap.enabled = true;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(POSE.camera.fov, W / H, 0.1, 1000);
camera.position.set(...POSE.camera.position);
camera.lookAt(0, 0, 0);

// Stesse luci di Computers.jsx.
scene.add(new THREE.HemisphereLight(0xffffff, 0x000000, 0.15));
const spot = new THREE.SpotLight(0xffffff, 300, 0, 1, 1);
spot.position.set(-3, 5, 1);
spot.castShadow = true;
spot.shadow.mapSize.set(1024, 1024);
scene.add(spot);
const point = new THREE.PointLight(0xffffff, 2);
point.position.set(0, -0.5, -0.25);
scene.add(point);

const draco = new DRACOLoader().setDecoderPath('/jsm/libs/draco/');
const loader = new GLTFLoader().setDRACOLoader(draco);

loader.load('/model.glb', (gltf) => {
  const m = gltf.scene;
  m.scale.setScalar(POSE.scale);
  m.position.set(...POSE.position);
  m.rotation.set(...POSE.rotation);
  scene.add(m);
  renderer.render(scene, camera);
  window.__ready = true;
}, undefined, (err) => { window.__error = String(err); });
</script></body></html>`;

// Impostata prima di ogni navigazione, così un solo server serve tutte le varianti.
let currentPage = '';

const server = createServer(async (req, res) => {
  const url = req.url.split('?')[0];
  if (url === '/' || url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end(currentPage);
  }
  let file = ROUTES[url];
  if (!file) {
    for (const [prefix, dir] of Object.entries(PREFIXES)) {
      if (url.startsWith(prefix) && !url.includes('..')) {
        file = dir + url.slice(prefix.length);
        break;
      }
    }
  }
  if (!file) { res.writeHead(404); return res.end('non trovato: ' + url); }
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' });
    res.end(body);
  } catch (err) {
    res.writeHead(500); res.end(String(err));
  }
});

await new Promise((r) => server.listen(0, '127.0.0.1', r));
const port = server.address().port;

const browser = await chromium.launch({ args: ['--use-gl=angle', '--enable-unsafe-swiftshader'] });
await mkdir('public', { recursive: true });

for (const variant of VARIANTS) {
  currentPage = pageFor(variant);

  const page = await browser.newPage({
    viewport: { width: variant.width, height: variant.height },
    deviceScaleFactor: 1,
  });
  page.on('console', (m) => m.type() === 'error' && console.warn('  browser:', m.text()));

  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__ready || window.__error, null, { timeout: 90_000 });

  const error = await page.evaluate(() => window.__error);
  if (error) {
    await browser.close();
    server.close();
    throw new Error(`caricamento modello fallito (${variant.name}): ${error}`);
  }

  const shot = await page.locator('canvas').screenshot({ omitBackground: true });
  await page.close();

  // Nessun ritaglio: il poster conserva l'inquadratura del canvas, così CSS può
  // sovrapporli con lo stesso object-fit senza ricalcolare le proporzioni.
  const out = `public/${variant.name}.webp`;
  await sharp(shot)
    .resize(variant.width, null, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82, effort: 6, alphaQuality: 90 })
    .toFile(out);

  const meta = await sharp(out).metadata();
  console.log(`${out}  ${meta.width}x${meta.height}  ${((await stat(out)).size / 1024).toFixed(0)} KB`);
}

await browser.close();
server.close();
