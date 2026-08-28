import { useEffect, useRef, useState } from 'react';

/**
 * Dice se il contenuto pesante può essere montato.
 *
 * Prima ogni canvas WebGL partiva durante il primo render: three, i modelli e le
 * texture competevano con l'HTML per la banda, e il first paint aspettava tutto.
 * Qui il montaggio avviene solo quando il riquadro si avvicina al viewport e il
 * browser ha finito il lavoro urgente.
 *
 * @param {object}  options
 * @param {string}  options.rootMargin  anticipo rispetto al bordo del viewport.
 * @param {boolean} options.waitForIdle attende il caricamento completo e la quiete.
 * @returns {[React.RefObject, boolean]} il ref da agganciare e il via libera.
 */
export function useDeferredMount({ rootMargin = '200px', waitForIdle = false } = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [idle, setIdle] = useState(!waitForIdle);

  useEffect(() => {
    // Senza IntersectionObserver si monta subito: meglio pesante che assente.
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    // Il nodo può non esistere ancora: chi usa questo hook a volte aggancia il
    // ref a un elemento che compare più tardi (le sezioni sotto la piega si
    // montano dopo l'evento load). Agganciarsi una volta sola al primo effetto
    // significava, in quel caso, non osservare nulla e non montare mai: era il
    // motivo per cui il cielo stellato dei contatti non compariva più.
    let frame = 0;
    const attach = () => {
      if (ref.current) {
        observer.observe(ref.current);
        return;
      }
      frame = requestAnimationFrame(attach);
    };
    attach();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [rootMargin]);

  useEffect(() => {
    if (!waitForIdle) return undefined;

    let idleId;
    let timeoutId;
    let cancelled = false;

    // Il solo requestIdleCallback scattava già a una cinquantina di millisecondi,
    // e i chunk 3D, poco più di un megabyte fra three, fiber e drei, partivano
    // in concorrenza con il CSS e con il poster. Su una 4G lenta si spartiscono la
    // banda, e il primo paint slittava di secondi. Aspettare `load` significa che
    // il download comincia quando ciò che serve a vedere la pagina è già arrivato.
    const startIdle = () => {
      if (cancelled) return;
      if (typeof window.requestIdleCallback === 'function') {
        idleId = window.requestIdleCallback(() => setIdle(true), { timeout: 2000 });
      } else {
        timeoutId = window.setTimeout(() => setIdle(true), 400);
      }
    };

    if (document.readyState === 'complete') {
      startIdle();
      return () => {
        cancelled = true;
        if (idleId) window.cancelIdleCallback(idleId);
        if (timeoutId) window.clearTimeout(timeoutId);
      };
    }

    window.addEventListener('load', startIdle, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener('load', startIdle);
      if (idleId) window.cancelIdleCallback(idleId);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [waitForIdle]);

  return [ref, visible && idle];
}

/** Rispetta la preferenza di sistema per il movimento ridotto. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(query.matches);

    const onChange = (event) => setReduced(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

/**
 * Fascia di viewport corrente. Un solo listener condiviso al posto delle tre
 * media query duplicate che ogni canvas registrava per conto proprio.
 */
export function useViewportTier() {
  const [tier, setTier] = useState('desktop');

  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      if (w <= 600) return 'mobile';
      if (w <= 1024) return 'tablet';
      if (w <= 1440) return 'laptop';
      return 'desktop';
    };

    setTier(compute());

    let frame = 0;
    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setTier(compute()));
    };

    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return tier;
}
