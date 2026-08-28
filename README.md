# atlasanatomy.github.io

Portfolio di Tommaso Bosi — React + Vite + Tailwind, con una scena three.js
nell'hero e una nella sezione contatti. Pubblicato su GitHub Pages.

## Come è fatto

```
index.html            documento d'ingresso: contiene il poster dell'hero, che è
                      l'elemento LCP e non dipende dal bundle
src/                  sorgente dell'applicazione
  components/         sezioni e canvas 3D
  constants/          tutti i contenuti (esperienze, pubblicazioni, progetti)
  hooks/              caricamento differito e preferenze di sistema
public/               file serviti così come sono, con URL stabile
  models/*.glb        modelli 3D compressi con Draco
  fonts/*.woff2       Poppins in locale
  hero-poster*.webp   render statici del modello dell'hero
  herobg.webp         sfondo dell'hero (preloadato: è l'elemento LCP)
scripts/              pipeline degli asset e verifiche
desktop_pc/, rocket/  modelli sorgente non compressi — NON pubblicati,
                      servono solo a rigenerare i .glb
```

## Sviluppo

```bash
npm install
npm run dev
```

## Pipeline degli asset

I file in `public/models`, `public/fonts` e i poster sono **generati**. Vanno
rifatti solo se cambiano i modelli sorgente, le immagini in `src/assets` o la
posa della camera in `src/components/canvas/Computers.jsx`.

```bash
npm run assets              # tutto quanto
npm run assets:models       # desktop_pc + rocket -> .glb Draco   (70,7 MB -> 1,5 MB)
npm run assets:images       # PNG -> WebP dimensionati            (21,7 MB -> 0,6 MB)
npm run assets:poster       # render dei poster dell'hero
npm run assets:fonts        # scarica i pesi di Poppins usati
```

> La posa del modello dell'hero è definita due volte: in `POSE` dentro
> `src/components/canvas/Computers.jsx` e in `VARIANTS` dentro
> `scripts/render-poster.mjs`. Devono restare allineate, altrimenti il modello
> salta nel momento in cui il canvas subentra al poster.

## Verifiche

```bash
npm run build
npm run verify              # overflow, aree toccabili, console, link, a 5 viewport
npm run verify:shots        # come sopra, salvando gli screenshot
npm run lighthouse          # Lighthouse mobile, throttling reale
npm run lighthouse:simulate # Lighthouse mobile, throttling simulato (come PageSpeed)
```

Il server di prova usato dalle verifiche comprime in gzip i formati testuali,
come fa GitHub Pages: senza, si misurerebbero 182 kB di bundle invece dei ~58
che il browser scarica davvero.

## Pubblicazione

```bash
npm run deploy              # build + push di dist/ sul branch gh-pages
npm run deploy:dry          # prepara il commit senza inviarlo, per ispezionarlo
```

Il deploy passa da `scripts/deploy.mjs` e non dalla CLI di gh-pages: quella
cancella i file della pubblicazione precedente con un glob privo di `dot: true`,
quindi i file nascosti sopravvivono. Alla creazione del branch, che avviene con
`git checkout --orphan`, l'albero di lavoro di `main` viene ereditato e i suoi
dotfile finivano online. Lo script passa pattern che li includono e, alla fine,
fallisce se nella pubblicazione compare un file di sorgente o di configurazione.

Richiede una modifica **una tantum** nelle impostazioni del repository:
*Settings → Pages → Build and deployment → Source: Deploy from a branch →
`gh-pages` / `(root)`*.

Finché l'impostazione punta a `main`, il sito pubblicato resta quello vecchio:
i file nella radice di `main` (`assets/`, `index.html` compilato, `desktop_pc/`,
`rocket/`) sono la pubblicazione precedente.

In alternativa, senza toccare le impostazioni, si può continuare a pubblicare
dalla radice di `main` copiandoci il contenuto di `dist/`. Va fatto rimuovendo
prima i file della pubblicazione precedente, altrimenti restano lì a occupare
spazio nel repository:

```bash
npm run build
git rm -r --cached assets && rm -rf assets   # bundle della vecchia build
cp -r dist/* .
```

I modelli sorgente `desktop_pc/` e `rocket/` vanno invece tenuti: servono alla
pipeline. Con la pubblicazione dalla radice restano però accessibili in rete;
è un altro motivo per preferire il branch `gh-pages`.
