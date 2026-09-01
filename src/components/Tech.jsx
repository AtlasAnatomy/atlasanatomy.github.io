import { Suspense, useEffect, useRef, useState } from 'react';

import { TechCanvas } from './canvas';
import { SectionWrapper } from '../hoc';
import { technologies } from '../constants';
import { useDeferredMount, useViewportTier } from '../hooks/useDeferredMount';
import SectionHeading from './SectionHeading';

/*
 * Colonne per fascia di viewport, e lato massimo della cella.
 *
 * Il lato effettivo non è però questo: viene ricavato dalla larghezza reale del
 * contenitore, misurata a runtime. Fissare i pixel a priori significava che a
 * 320px la griglia sbordava e le sfere ai lati restavano tagliate.
 */
const LAYOUT = {
  mobile: { columns: 2, maxCell: 150 },
  tablet: { columns: 4, maxCell: 150 },
  laptop: { columns: 6, maxCell: 160 },
  desktop: { columns: 6, maxCell: 180 },
};

// Deve restare allineato a PAD_CELLS in TechCanvas.jsx.
const PAD_CELLS = 0.3;

const Tech = () => {
  const tier = useViewportTier();
  const [mountRef, mounted] = useDeferredMount({ rootMargin: '250px' });
  const boxRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const node = boxRef.current;
    if (!node) return undefined;

    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const { columns, maxCell } = LAYOUT[tier] ?? LAYOUT.desktop;
  const rows = Math.ceil(technologies.length / columns);

  // La larghezza disponibile deve coprire le colonne più il margine laterale.
  const cellPx = width > 0 ? Math.min(maxCell, Math.floor(width / (columns + 2 * PAD_CELLS))) : 0;

  return (
    <>
      <SectionHeading eyebrow="Frameworks and programming languages" title="Skills." />

      {/* -mx-2 recupera un po' di respiro sui bordi stretti senza toccare
          la spaziatura delle altre sezioni. */}
      <div ref={boxRef} className="-mx-2 mt-10 flex justify-center sm:mx-0">
        <div
          ref={mountRef}
          style={{
            width: cellPx ? columns * cellPx + 2 * PAD_CELLS * cellPx : '100%',
            height: cellPx ? rows * cellPx + 2 * PAD_CELLS * cellPx : rows * 120,
          }}
        >
          {mounted && cellPx > 0 && (
            <Suspense fallback={null}>
              <TechCanvas technologies={technologies} columns={columns} cellPx={cellPx} />
            </Suspense>
          )}
        </div>

        <ul className="sr-only">
          {technologies.map((technology) => (
            <li key={technology.name}>{technology.name}</li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default SectionWrapper(Tech, 'skills');
