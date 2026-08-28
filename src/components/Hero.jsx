import { Suspense, useCallback, useEffect, useState } from 'react';

import { styles } from '../styles';
import { ComputersCanvas } from './canvas';
import { useDeferredMount, usePrefersReducedMotion } from '../hooks/useDeferredMount';

/**
 * L'hero.
 *
 * L'LCP è il poster: un WebP di 40 KB già presente nell'HTML come preload, che
 * si dipinge senza aspettare React, three o il modello. Il canvas WebGL si monta
 * dopo, sopra la stessa area, e il poster sfuma via solo quando il modello è
 * davvero in scena. Prima il primo paint restava bloccato dietro 15 MB di gltf.
 *
 * Su connessioni lente o con risparmio dati attivo il 3D non parte da solo:
 * resta il poster con un comando esplicito per caricarlo.
 */
const Hero = () => {
  const reducedMotion = usePrefersReducedMotion();
  const [stageRef, canMount] = useDeferredMount({
    rootMargin: '0px',
    waitForIdle: true,
    waitForInteraction: true,
  });

  const [modelReady, setModelReady] = useState(false);
  const [userRequested, setUserRequested] = useState(false);
  const [saveData, setSaveData] = useState(false);

  useEffect(() => {
    // Network Information API: assente su Safari e Firefox, quindi il default
    // è "connessione normale" e il 3D parte da solo.
    const connection = navigator.connection;
    if (!connection) return undefined;

    const check = () => setSaveData(Boolean(connection.saveData) || /2g/.test(connection.effectiveType ?? ''));
    check();

    connection.addEventListener?.('change', check);
    return () => connection.removeEventListener?.('change', check);
  }, []);

  const onModelReady = useCallback(() => setModelReady(true), []);

  // Il poster sta in index.html e resta lì: qui si comanda solo la dissolvenza,
  // quando il modello è in scena e può prenderne il posto.
  useEffect(() => {
    const poster = document.getElementById('boot-hero');
    if (!poster) return undefined;

    poster.style.opacity = modelReady ? '0' : '1';

    // A dissolvenza finita esce dall'albero di accessibilità e dal compositing;
    // se il canvas venisse smontato, tornerebbe visibile.
    if (!modelReady) {
      poster.style.visibility = 'visible';
      return undefined;
    }

    const timer = window.setTimeout(() => {
      poster.style.visibility = 'hidden';
    }, 700);
    return () => window.clearTimeout(timer);
  }, [modelReady]);

  const holdBack = saveData && !userRequested;
  const showCanvas = canMount && !holdBack;

  return (
    <section className="hero-section relative w-full">
      <div
        className={`absolute inset-0 top-[104px] sm:top-[120px] max-w-7xl mx-auto ${styles.paddingX} flex flex-row items-start gap-5 z-10 pointer-events-none`}
      >
        <div className="flex flex-col justify-center items-center mt-2 sm:mt-5" aria-hidden="true">
          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-accent" />
          <div className="w-1 h-32 sm:h-64 lg:h-80 violet-gradient" />
        </div>

        <div className="max-w-[46ch]">
          <h1 className={styles.heroHeadText}>
            Hi, I&rsquo;m <span className="text-accent">Tom</span>
          </h1>
          <p className={`${styles.heroSubText} mt-3 sm:mt-4`}>
            I build optimization algorithms
            <br className="hidden xs:block" /> for transport networks
          </p>
          <p className="mt-4 sm:mt-6 text-secondary text-[clamp(0.85rem,1.6vw,1rem)] leading-relaxed">
            Ph.D. in Computer Science and Automation · 13 peer-reviewed papers · Rome
          </p>
        </div>
      </div>

      <div ref={stageRef} className="hero-stage">
        {showCanvas && (
          <div
            className="hero-layer"
            style={{ opacity: modelReady ? 1 : 0 }}
            // Finché è invisibile non deve intercettare il trascinamento.
            aria-hidden="true"
          >
            <Suspense fallback={null}>
              <ComputersCanvas onModelReady={onModelReady} />
            </Suspense>
          </div>
        )}

        {holdBack && (
          <div className="absolute inset-x-0 bottom-24 flex justify-center px-6">
            <button
              type="button"
              onClick={() => setUserRequested(true)}
              className="surface-chip min-h-[44px] px-5 py-3 text-[14px] font-medium text-white-100 rounded-full"
            >
              Load the interactive 3D scene
            </button>
          </div>
        )}
      </div>

      <div className="absolute bottom-8 sm:bottom-10 w-full flex justify-center items-center z-10">
        <a
          href="#about"
          aria-label="Skip to the introduction"
          className="grid place-items-center w-[44px] h-[68px] rounded-3xl border-4 border-secondary/70 hover:border-accent transition-colors duration-300"
        >
          {/* Animato in CSS e non con framer-motion: è l'unico movimento
              sopra la piega, e tenerlo qui toglie 119 kB dal percorso critico. */}
          <span className={`block w-3 h-3 rounded-full bg-secondary ${reducedMotion ? '' : 'scroll-dot'}`} />
        </a>
      </div>
    </section>
  );
};

export default Hero;
