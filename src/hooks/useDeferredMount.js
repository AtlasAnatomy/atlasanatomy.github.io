import { useEffect, useRef, useState } from 'react';

// Segnali che indicano una persona presente e attiva sulla pagina.
const INTERACTION_EVENTS = ['pointerdown', 'pointermove', 'wheel', 'touchstart', 'keydown', 'scroll'];

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
 * @param {boolean} options.waitForInteraction attende un primo gesto dell'utente.
 * @returns {[React.RefObject, boolean]} il ref da agganciare e il via libera.
 */
export function useDeferredMount({
  rootMargin = '200px',
  waitForIdle = false,
  waitForInteraction = false,
} = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [idle, setIdle] = useState(!waitForIdle);
  const [engaged, setEngaged] = useState(!waitForInteraction);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

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

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);

  useEffect(() => {
    if (!waitForIdle) return undefined;

    let idleId;
    let timeoutId;
    let cancelled = false;

    // Il solo requestIdleCallback scattava già a una cinquantina di millisecondi,
    // e i chunk 3D — poco più di un megabyte fra three, fiber e drei — partivano
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

  // La scena 3D dell'hero pesa circa 800 kB fra three, fiber e drei, più il
  // modello. È un arricchimento: il poster mostra già la stessa inquadratura.
  // Farla partire al primo gesto — un movimento del puntatore, uno scorrimento,
  // un tasto — significa che chi apre e chiude la pagina non la scarica mai,
  // e che chi resta la vede comparire entro pochi istanti. È lo stesso schema
  // che si usa per gli embed pesanti: prima la facciata, poi il contenuto vero.
  useEffect(() => {
    if (!waitForInteraction) return undefined;

    const onInteract = () => setEngaged(true);
    for (const type of INTERACTION_EVENTS) {
      window.addEventListener(type, onInteract, { once: true, passive: true });
    }

    return () => {
      for (const type of INTERACTION_EVENTS) {
        window.removeEventListener(type, onInteract);
      }
    };
  }, [waitForInteraction]);

  return [ref, visible && idle && engaged];
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
