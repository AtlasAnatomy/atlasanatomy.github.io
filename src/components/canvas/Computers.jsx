import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

import CanvasLoader from '../Loader';
import { useViewportTier } from '../../hooks/useDeferredMount';

// Deve restare allineata al breakpoint `short` di tailwind.config.js: di là
// scende l'indicatore dell'hero, di qua il modello, e i due si spartiscono lo
// stesso spazio.
const SHORT_QUERY = '(max-height: 800px) and (max-width: 639px)';

/*
 * Vero sui telefoni bassi. Il valore iniziale si legge già al primo render e
 * non in un effetto: il canvas gira con frameloop="demand", e una posa corretta
 * solo al secondo render rischiava di non essere mai ridipinta.
 */
function useShortViewport() {
  const [short, setShort] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(SHORT_QUERY).matches,
  );

  useEffect(() => {
    const query = window.matchMedia(SHORT_QUERY);
    setShort(query.matches);

    const onChange = (event) => setShort(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return short;
}

// Il .glb è Draco + texture WebP: 15,08 MB di gltf/bin/textures sciolti diventano
// 1,13 MB in un file solo. Il decoder è servito da /draco/, non dalla CDN gstatic
// su cui drei ricade per default.
const MODEL_URL = '/models/desktop_pc.glb';
const DRACO_PATH = '/draco/';

// Posa per fascia di viewport. Il ramo desktop deve restare allineato a
// scripts/render-poster.mjs, altrimenti il poster e il canvas non si sovrappongono.
//
// La y del ramo mobile è scesa da -1,2 a -2,2 per staccare il modello dal testo
// dell'hero, che gli finiva praticamente addosso: da 10px di stacco a 59 su un
// iPhone 12.
//
// Attenzione se la si ritocca. Il modello si posiziona a una percentuale fissa
// dell'altezza della sezione, mentre il testo parte da 160px fissi: più lo
// schermo è corto, più il modello sale sul testo. Sotto ci passa l'indicatore,
// che su mobile sta all'82%, quindi scendere troppo lo manda addosso a quello.
const POSE = {
  mobile: { scale: 0.3, position: [0, -2.2, -0.5] },
  tablet: { scale: 0.5, position: [0, -1.8, -1] },
  laptop: { scale: 0.62, position: [0, -2.2, -1.3] },
  desktop: { scale: 0.7, position: [0, -2.5, -1.5] },
};

/*
 * Telefoni bassi: più piccolo e più in basso.
 *
 * Con la posa mobile normale, su un iPhone SE il modello finiva sopra il testo
 * dell'hero. Rimpicciolirlo e basta non bastava, la cima si alzava di appena
 * 5px: quello che conta è la y. Scendere e basta però lo mandava addosso
 * all'indicatore, che infatti su questi schermi torna in fondo (breakpoint
 * `short`).
 *
 * Su un iPhone SE, fra la fine del testo e il fondo della sezione restano 199px
 * da spartire fra il modello, l'indicatore e i tre stacchi. Con questa scala il
 * modello ne prende 65, l'indicatore 68, e avanzano 66px divisi in 27 sopra il
 * modello, 27 sotto e 12 in fondo. Rimpicciolire ancora è l'unico modo per
 * allargare quegli stacchi.
 */
const MOBILE_SHORT = { scale: 0.22, position: [0, -2.65, -0.5] };

const Computers = ({ tier, short, onReady }) => {
  const { scene } = useGLTF(MODEL_URL, DRACO_PATH);
  const { scale, position } =
    short && tier === 'mobile' ? MOBILE_SHORT : POSE[tier] ?? POSE.desktop;

  // useGLTF sospende finché il modello non è pronto: quando questo effetto parte
  // la scena esiste già, ed è il momento giusto per far sfumare via il poster.
  useEffect(() => {
    onReady?.();
  }, [onReady]);

  return (
    <mesh>
      <hemisphereLight intensity={0.15} groundColor="black" />
      <spotLight
        position={[-3, 5, 1]}
        angle={1}
        penumbra={1}
        intensity={300}
        castShadow
        shadow-mapSize={1024}
      />
      <pointLight intensity={2} position={[0, -0.5, -0.25]} />
      <primitive object={scene} scale={scale} position={position} rotation={[-0.01, -0.2, -0.1]} />
    </mesh>
  );
};

const ComputersCanvas = ({ onModelReady }) => {
  const tier = useViewportTier();
  const short = useShortViewport();

  return (
    <Canvas
      frameloop="demand"
      shadows
      // Su mobile il pixel ratio resta a 1: raddoppiarlo quadruplica i pixel da
      // riempire senza guadagno percepibile su questi schermi.
      dpr={tier === 'mobile' ? 1 : [1, 2]}
      camera={{ position: [20, 3, 5], fov: 25 }}
      // preserveDrawingBuffer teneva in vita un secondo framebuffer a ogni frame
      // e serviva solo a poter fare screenshot del canvas.
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      aria-hidden="true"
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Computers tier={tier} short={short} onReady={onModelReady} />
      </Suspense>
    </Canvas>
  );
};

useGLTF.preload(MODEL_URL, DRACO_PATH);

export default ComputersCanvas;
