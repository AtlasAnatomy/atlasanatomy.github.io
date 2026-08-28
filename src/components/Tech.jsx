import { Suspense } from 'react';

import { TechCanvas } from './canvas';
import { SectionWrapper } from '../hoc';
import { technologies } from '../constants';
import { useDeferredMount, useViewportTier } from '../hooks/useDeferredMount';

// Numero di colonne e lato della cella per fascia: la griglia 3D viene costruita
// con questi stessi numeri, quindi le sfere cadono esattamente dove starebbero
// le celle di una griglia CSS.
const LAYOUT = {
  mobile: { columns: 3, cellPx: 96 },
  tablet: { columns: 4, cellPx: 108 },
  laptop: { columns: 6, cellPx: 112 },
  desktop: { columns: 6, cellPx: 112 },
};

const Tech = () => {
  const tier = useViewportTier();
  const [ref, mounted] = useDeferredMount({ rootMargin: '250px' });
  const { columns, cellPx } = LAYOUT[tier] ?? LAYOUT.desktop;

  const rows = Math.ceil(technologies.length / columns);

  return (
    <div ref={ref} className="flex justify-center">
      {/* Il riquadro tiene la sua dimensione anche prima che il canvas si monti:
          senza, la sezione sotto salterebbe al momento del caricamento. */}
      <div style={{ width: columns * cellPx, height: rows * cellPx }} className="max-w-full">
        {mounted && (
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
  );
};

export default SectionWrapper(Tech, '');
