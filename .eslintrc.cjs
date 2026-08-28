module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  // `assets/` è il bundle minificato della vecchia pubblicazione, ancora nella
  // radice del repository: non è codice sorgente e non va analizzato.
  ignorePatterns: ['dist', 'assets', 'scripts/shots', 'public'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react/jsx-no-target-blank': 'off',
    // Il progetto non usa prop-types: tenere la regola accesa produceva oltre
    // mille errori su codice corretto, e un lint che urla sempre non lo legge
    // più nessuno.
    'react/prop-types': 'off',
    // react-three-fiber traduce ogni classe di three in un tag JSX, con le
    // proprietà del costruttore come attributi. Il plugin react conosce solo
    // il DOM, quindi segnalava come sconosciute proprietà del tutto legittime.
    'react/no-unknown-property': 'off',
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  },
  overrides: [
    {
      // File di configurazione e script della pipeline: girano in Node. Gli
      // script Playwright contengono però callback di page.evaluate(), che
      // vengono serializzate ed eseguite nel browser: lì window e document
      // esistono davvero, quindi servono entrambi gli ambienti.
      files: ['*.cjs', '*.config.js', 'scripts/**/*.mjs'],
      env: { node: true, browser: true },
      parserOptions: { sourceType: 'module' },
      rules: { 'no-console': 'off' },
    },
  ],
};
