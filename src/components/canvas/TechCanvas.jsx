import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Decal, Float, useTexture } from '@react-three/drei';

import CanvasLoader from '../Loader';
import { usePrefersReducedMotion } from '../../hooks/useDeferredMount';

/**
 * Le sfere delle competenze, in un unico contesto WebGL.
 *
 * Prima ogni icona aveva il proprio <Canvas>: dodici contesti WebGL, dodici cicli
 * di render e dodici copie dello stato di three, per una fila di icone decorative.
 * I browser ne concedono circa sedici per pagina, quindi la sezione da sola
 * consumava quasi l'intero budget.
 *
 * La camera è ortografica: con zoom = cellPx / CELL_UNITS una unità di mondo
 * vale un numero fisso di pixel, e la griglia 3D si allinea a quella CSS.
 */

const CELL_UNITS = 2; // lato della cella in unità di mondo
const BALL_SCALE = 0.8;

/*
 * Margine attorno alla griglia, in frazione di cella.
 *
 * Il canvas era grande esattamente quanto la griglia, quindi le sfere delle
 * colonne esterne venivano tagliate dal bordo: <Float> le sposta di continuo, e
 * un raggio di 0,8 unità più l'oscillazione supera la mezza cella disponibile.
 */
const PAD_CELLS = 0.3;

const Ball = ({ imgUrl, position, animate }) => {
  const [decal] = useTexture([imgUrl]);

  const mesh = (
    <mesh castShadow receiveShadow scale={BALL_SCALE}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial color="#fff8eb" polygonOffset polygonOffsetFactor={-5} flatShading />
      <Decal position={[0, 0, 1]} rotation={[2 * Math.PI, 0, 6.25]} scale={1} map={decal} flatShading />
    </mesh>
  );

  // Float anima il proprio gruppo, quindi porta lui la posizione; senza
  // animazione la stessa posizione va sul group che lo sostituisce.
  return animate ? (
    <Float speed={1.75} rotationIntensity={1} floatIntensity={1.4} position={position}>
      {mesh}
    </Float>
  ) : (
    <group position={position}>{mesh}</group>
  );
};

const TechCanvas = ({ technologies, columns, cellPx }) => {
  const reducedMotion = usePrefersReducedMotion();
  const rows = Math.ceil(technologies.length / columns);

  // La griglia è centrata sull'origine: la prima colonna sta a sinistra di
  // (columns - 1) / 2 celle, la prima riga altrettanto in alto.
  const placed = useMemo(
    () =>
      technologies.map((technology, index) => {
        const column = index % columns;
        const row = Math.floor(index / columns);
        return {
          ...technology,
          position: [
            (column - (columns - 1) / 2) * CELL_UNITS,
            -(row - (rows - 1) / 2) * CELL_UNITS,
            0,
          ],
        };
      }),
    [technologies, columns, rows],
  );

  const pad = 2 * PAD_CELLS * cellPx;

  return (
    <Canvas
      orthographic
      // Con la camera ortografica il frustum è in pixel di canvas diviso zoom:
      // fissare zoom così mappa una cella su esattamente cellPx pixel.
      camera={{ position: [0, 0, 10], zoom: cellPx / CELL_UNITS }}
      frameloop={reducedMotion ? 'demand' : 'always'}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ width: columns * cellPx + pad, height: rows * cellPx + pad }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.25} />
      <directionalLight position={[0, 0, 0.05]} />
      <Suspense fallback={<CanvasLoader />}>
        {placed.map((technology) => (
          <Ball
            key={technology.name}
            imgUrl={technology.icon}
            position={technology.position}
            animate={!reducedMotion}
          />
        ))}
      </Suspense>
    </Canvas>
  );
};

export default TechCanvas;
