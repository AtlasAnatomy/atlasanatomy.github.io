/**
 * Marchi social del menu mobile, disegnati come SVG in linea.
 *
 * In linea e non come file: a 20px un PNG si vede sgranato sui display a 2x, e
 * quattro richieste in più per quattro icone non hanno senso. Così ereditano
 * currentColor e seguono il colore del link senza una seconda copia colorata.
 *
 * LinkedIn e GitHub sono i marchi ufficiali, quindi pieni. Linktree e la busta
 * sono ricostruiti a tratto, con lo stesso spessore, per stare insieme agli
 * altri due senza stonare.
 */

const box = {
  viewBox: '0 0 24 24',
  width: 26,
  height: 26,
  'aria-hidden': 'true',
  focusable: 'false',
};

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.9,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export const LinkedInIcon = () => (
  <svg {...box} fill="currentColor">
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.35-1.85 3.59 0 4.26 2.36 4.26 5.44v6.3zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.55V9h3.57v11.45z" />
  </svg>
);

export const GitHubIcon = () => (
  <svg {...box} fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.64-1.34-2.23-.25-4.57-1.11-4.57-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5.01 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85 0 1.34-.01 2.42-.01 2.75 0 .27.18.58.69.48A10 10 0 0 0 22 12c0-5.52-4.48-10-10-10z" />
  </svg>
);

/*
 * Tracciato ufficiale del marchio.
 *
 * Riempie la viewBox da bordo a bordo, mentre LinkedIn sta fra 3,3 e 20,5 e
 * GitHub fra 2 e 22. Alla stessa misura sarebbe quindi sembrato più grosso
 * degli altri due: la trasformazione lo rimappa da 0-24 a 2-22, cioè
 * sull'ingombro di GitHub, così i tre marchi pesano uguale nella riga.
 */
export const LinktreeIcon = () => (
  <svg {...box} fill="currentColor">
    <g transform="translate(2 2) scale(0.8333)">
      <path d="m13.73635 5.85251 4.00467 -4.11665 2.3248 2.3808 -4.20064 4.00466h5.9085v3.30473h-5.9365l4.22865 4.10766 -2.3248 2.3338L12.0005 12.099l-5.74052 5.76852 -2.3248 -2.3248 4.22864 -4.10766h-5.9375V8.12132h5.9085L3.93417 4.11666l2.3248 -2.3808 4.00468 4.11665V0h3.4727zm-3.4727 10.30614h3.4727V24h-3.4727z" />
    </g>
  </svg>
);

export const EmailIcon = () => (
  <svg {...box} {...stroke}>
    <rect x="2.9" y="5.3" width="18.2" height="13.4" rx="2.4" />
    <path d="m3.8 7.5 7.1 5a2 2 0 0 0 2.2 0l7.1-5" />
  </svg>
);
