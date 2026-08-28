import { useEffect, useState } from 'react';

/**
 * Diventa vero quando la pagina ha finito di caricare ed è tornata quieta.
 *
 * Serve a tenere fuori dal percorso critico tutto ciò che sta sotto la piega.
 * React monta i componenti a prescindere dal viewport, quindi le sezioni in
 * lazy() partivano comunque durante il caricamento iniziale: framer-motion e i
 * chunk di sezione — circa 130 kB — si contendevano la banda con il CSS e con
 * il poster dell'hero. Rimandarli a dopo `load` lascia libero il primo paint.
 */
export function useAfterLoad() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let idleId;
    let timeoutId;
    let cancelled = false;

    const start = () => {
      if (cancelled) return;
      const run = () => {
        if (cancelled) return;
        setReady(true);

        // Un link diretto a #contact arriva prima che la sezione esista:
        // quando compare, si ripete lo scorrimento verso l'ancora.
        const { hash } = window.location;
        if (hash.length > 1) {
          requestAnimationFrame(() => {
            document.querySelector(hash)?.scrollIntoView({ behavior: 'auto', block: 'start' });
          });
        }
      };

      if (typeof window.requestIdleCallback === 'function') {
        idleId = window.requestIdleCallback(run, { timeout: 1200 });
      } else {
        timeoutId = window.setTimeout(run, 200);
      }
    };

    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener('load', start);
      if (idleId) window.cancelIdleCallback(idleId);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  return ready;
}
