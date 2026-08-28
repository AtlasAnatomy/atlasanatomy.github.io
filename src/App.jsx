import { lazy, Suspense } from 'react';

// Import diretti, non attraverso src/components/index.js: quel barrel importava
// staticamente ogni sezione, quindi i lazy() qui sotto non spostavano nulla e
// Vite emetteva perfino <link rel="modulepreload"> per three e framer-motion.
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import { StarsCanvas } from './components/canvas';
import { useDeferredMount } from './hooks/useDeferredMount';
import { useAfterLoad } from './hooks/useAfterLoad';

// react-router-dom serviva solo per un <Link to='/'> nella navbar, su un sito
// di una pagina sola: 20 KB di router per un'ancora. La navbar ora usa un <a>.

// Sopra la piega ci sono solo Navbar e Hero. Tutto il resto — e con esso
// framer-motion — arriva da import() dinamici.
const About = lazy(() => import('./components/About'));
const Experience = lazy(() => import('./components/Experience'));
const Tech = lazy(() => import('./components/Tech'));
const Research = lazy(() => import('./components/Research'));
const Projects = lazy(() => import('./components/Projects'));
const Education = lazy(() => import('./components/Education'));
const Recognition = lazy(() => import('./components/Recognition'));
const Feedbacks = lazy(() => import('./components/Feedbacks'));
const Contact = lazy(() => import('./components/Contact'));

const App = () => {
  // Tutto ciò che sta sotto la piega aspetta la fine del caricamento: i lazy()
  // da soli non bastavano, perché React monta i componenti al primo render
  // indipendentemente dal viewport, e i loro chunk partivano subito.
  const belowFold = useAfterLoad();

  // Lo sfondo stellato è decorativo: si monta solo quando ci si avvicina.
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

            <div ref={starsRef} className="relative z-0">
              <Contact />
              {showStars && <StarsCanvas />}
            </div>
          </Suspense>
        )}
      </main>
    </div>
  );
};

export default App;
