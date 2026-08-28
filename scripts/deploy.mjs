/**
 * Pubblica dist/ sul branch gh-pages.
 *
 * Usa l'API Node di gh-pages invece della CLI per un motivo preciso.
 *
 * Alla prima esecuzione gh-pages crea il branch con `git checkout --orphan`,
 * che si porta dietro l'albero di lavoro di main. Subito dopo cancella i file
 * che non appartengono alla pubblicazione, ma lo fa con
 *
 *     globby.sync(options.remove, { cwd })        // lib/index.js:183
 *
 * senza `dot: true`: i file nascosti sopravvivono alla pulizia, e nemmeno il
 * flag --dotfiles cambia le cose. Così .eslintrc.cjs, .gitignore,
 * public/.nojekyll e rocket/.gitattributes erano finiti online, e ogni deploy
 * successivo se li ritrovava già nel branch e li lasciava lì.
 *
 * Dalla CLI `--remove` accetta un solo pattern; dall'API accetta un elenco.
 *
 *   node scripts/deploy.mjs             pubblica
 *   node scripts/deploy.mjs --dry-run   prepara il commit senza inviarlo
 */
import { publish } from 'gh-pages';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readdir } from 'node:fs/promises';

const run = promisify(execFile);
const dryRun = process.argv.includes('--dry-run');

const entries = await readdir('dist').catch(() => []);
if (entries.length === 0) {
  console.error('dist/ è vuota o assente: esegui prima `npm run build`.');
  process.exit(1);
}

await new Promise((resolve, reject) => {
  publish(
    'dist',
    {
      branch: 'gh-pages',
      // I tre pattern coprono anche i file nascosti, alla radice e annidati.
      remove: ['**/*', '.*', '**/.*'],
      dotfiles: true,
      nojekyll: true,
      message: 'Deploy del sito compilato',
      push: !dryRun,
    },
    (err) => (err ? reject(err) : resolve()),
  );
});

// Verifica su quanto gh-pages ha effettivamente messo nel commit.
const { stdout: cacheDirs } = await run('node', [
  '-e',
  "const {join}=require('path');const {readdirSync}=require('fs');const d=join('node_modules','.cache','gh-pages');console.log(readdirSync(d).map(x=>join(d,x)).join('\\n'))",
]);
const cache = cacheDirs.trim().split('\n')[0];

const { stdout: tree } = await run('git', ['-C', cache, 'ls-tree', '--name-only', 'HEAD']);
const { stdout: all } = await run('git', ['-C', cache, 'ls-tree', '-r', '--name-only', 'HEAD']);

console.log(`\n${dryRun ? 'Preparato (non inviato)' : 'Pubblicato'} — radice del branch gh-pages:`);
for (const name of tree.trim().split('\n')) console.log(`  ${name}`);
console.log(`\n${all.trim().split('\n').length} file in totale.`);

// Nessun file di configurazione o di sorgente deve comparire nella pubblicazione.
const leaked = all
  .trim()
  .split('\n')
  .filter((f) => /^(\.eslintrc|\.gitignore|package\.json|src\/|scripts\/|public\/|rocket\/|desktop_pc\/)/.test(f));

if (leaked.length > 0) {
  console.error('\nFile che non dovrebbero essere pubblicati:');
  for (const f of leaked) console.error(`  ${f}`);
  process.exit(1);
}

console.log('Nessun file di sorgente o configurazione nella pubblicazione.\n');
