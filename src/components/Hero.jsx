import { Suspense, useCallback, useState } from 'react';

import { styles } from '../styles';
import { ComputersCanvas } from './canvas';
import { useDeferredMount, usePrefersReducedMotion } from '../hooks/useDeferredMount';
import coffeeCup from '../assets/coffee-cup.webp';

/**
 * L'hero.
 *
 * Al posto del modello, finché non è pronto, gira la tazzina: nessun poster,
 * nessuno screenshot statico da sostituire. Il canvas si monta dopo l'evento
 * load, così i circa 800 kB fra three, fiber e drei non si contendono la banda
 * con il CSS mentre la pagina deve ancora dipingersi la prima volta.
 */
const Hero = () => {
  const reducedMotion = usePrefersReducedMotion();
  const [stageRef, canMount] = useDeferredMount({ rootMargin: '0px', waitForIdle: true });
  const [modelReady, setModelReady] = useState(false);

  const onModelReady = useCallback(() => setModelReady(true), []);

  return (
    <section className="hero-section relative w-full">
      <div
        className={`absolute inset-0 top-[160px] sm:top-[120px] max-w-7xl mx-auto ${styles.paddingX} flex flex-row items-start gap-5 z-10 pointer-events-none`}
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
            I build optimization algorithms<span className="hidden xs:inline">,</span>
            <br className="hidden xs:block" /> web and mobile applications
          </p>
          <p className="mt-4 sm:mt-6 text-secondary text-[clamp(0.85rem,1.6vw,1rem)] leading-relaxed">
            Ph.D. in Computer Science and Automation · Innovation Manager · Rome
          </p>
        </div>
      </div>

      <div ref={stageRef} className="hero-stage">
        {canMount && (
          <div className="hero-layer" style={{ opacity: modelReady ? 1 : 0 }} aria-hidden="true">
            <Suspense fallback={null}>
              <ComputersCanvas onModelReady={onModelReady} />
            </Suspense>
          </div>
        )}

        {/* La tazzina resta finché il modello non è in scena. Sta nel DOM, non
            dentro il canvas: deve girare anche prima che three sia scaricato.

            Su mobile non va centrata nella sezione: lì finiva dietro al testo
            dell'hero, che parte da 160px. Sta invece al 64% dell'altezza, dove
            comparirà il modello, così il caricamento si vede dove poi si guarda.

            La traslazione sta sull'involucro e non sull'immagine: la tazzina ha
            già la sua animazione di rotazione sul transform, e le due si
            annullerebbero a vicenda. */}
        {!modelReady && (
          <div className="hero-layer" role="status" aria-live="polite">
            <div className="absolute left-1/2 top-[64%] -translate-x-1/2 -translate-y-1/2 sm:top-1/2">
              <img
                src={coffeeCup}
                alt=""
                width="56"
                height="56"
                className="coffee-cup-loader h-14 w-14"
              />
            </div>
            <span className="sr-only">Loading the 3D scene</span>
          </div>
        )}
      </div>

      {/*
        Su mobile l'indicatore è ancorato dall'alto, non dal basso: la scrivania
        del modello finisce a una percentuale fissa dell'altezza della sezione
        qualunque sia il telefono, quindi una percentuale la segue, mentre un
        margine fisso dal fondo no. Misurato: con 112px fissi, su uno schermo da
        640 l'indicatore finiva 14px dentro il modello. Su sm e oltre resta
        agganciato al fondo.

        Sui telefoni bassi torna invece in fondo: lì l'82% lo piazzerebbe dentro
        lo spazio che serve al modello per stare sotto il testo, e testo, modello
        e indicatore non ci starebbero tutti.
      */}
      <div className="absolute top-[84%] bottom-auto short:top-auto short:bottom-4 sm:top-auto sm:bottom-10 w-full flex justify-center items-center z-10">
        {/* Su mobile è poco più di metà: il tubo grande si mangiava 68px di
            altezza che servono al modello. Da sm torna alla misura piena. */}
        <a
          href="#about"
          aria-label="Skip to the introduction"
          className="grid place-items-center w-[28px] h-[44px] border-2 sm:w-[44px] sm:h-[68px] sm:border-4 rounded-3xl border-secondary/70 hover:border-accent transition-colors duration-300"
        >
          <span
            className={`block w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-secondary ${reducedMotion ? '' : 'scroll-dot'}`}
          />
        </a>
      </div>
    </section>
  );
};

export default Hero;
