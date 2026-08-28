import { lazy, Suspense } from 'react';

// Import diretti, non attraverso un barrel: un file che riesporta tutte le
// sezioni le importerebbe staticamente, e i lazy() qui sotto non sposterebbero
// nulla. Vite arriverebbe a emettere <link rel="modulepreload"> per three.
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import { StarsCanvas } from './components/canvas';
import { useDeferredMount } from './hooks/useDeferredMount';
import { useAfterLoad } from './hooks/useAfterLoad';

// react-router-dom serviva solo per un <Link to='/'> nella navbar, su un sito
// di una pagina sola: 20 kB di router per un'ancora. La navbar ora usa un <a>.

// Sopra la piega ci sono solo Navbar e Hero. Tutto il resto, e con esso
// framer-motion, arriva da import() dinamici.
const About = lazy(() => import('./components/About'));
const Experience = lazy(() => import('./components/Experience'));
const Tech = lazy(() => import('./components/Tech'));
const Research = lazy(() => import('./components/Research'));
const Projects = lazy(() => import('./components/Projects'));
const Education = lazy(() => import('./components/Education'));
const Recognition = lazy(() => import('./components/Recognition'));
const Feedbacks = lazy(() => import('./components/Feedbacks'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));

const App = () => {
  // Tutto ciò che sta sotto la piega aspetta la fine del caricamento: i lazy()
  // da soli non bastavano, perché React monta i componenti al primo render
  // indipendentemente dal viewport, e i loro chunk partivano subito.
  const belowFold = useAfterLoad();

  // Il cielo stellato si monta quando la sezione contatti si avvicina.
  const [starsRef, showStars] = useDeferredMount({ rootMargin: '400px' });

  return (
    <div className="relative bg-primary">
      <Navbar />

      {/* Un landmark <main> esplicito: senza, chi naviga con uno screen reader
          non ha modo di saltare la navigazione e arrivare al contenuto. */}
      <main>
        <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
          <Hero />
        </div>

        {/* Un solo confine di Suspense: le sezioni condividono gli stessi
            chunk, quindi separarle moltiplicherebbe i fallback senza
            anticipare nulla. */}
        {belowFold && (
          <Suspense fallback={<div className="min-h-screen" aria-hidden="true" />}>
            <About />
            <Experience />
            <Tech />
            <Research />
            <Projects />
            <Education />
            <Recognition />
            <Feedbacks />

            {/* Il cielo stellato sta dietro ai contatti e al footer: il canvas
                è assoluto con z-index -1 dentro questo contenitore, quindi
                entrambi devono starci dentro. */}
            <div ref={starsRef} className="relative z-0">
              {showStars && <StarsCanvas />}
              <Contact />
              <Footer />
            </div>
          </Suspense>
        )}
      </main>
    </div>
  );
};

export default App;
