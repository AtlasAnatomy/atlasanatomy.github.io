import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

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
// Il ramo mobile è passato da scala 0,3 e y -1,2 a 0,33 e -2,1: il modello era
// piccolo e appiccicato al testo. Su un iPhone 12 ora è alto 160px invece di
// 109 e ne dista 148.
//
// Il grosso del guadagno però non è la scala: è l'hero che su mobile è passata
// a 100svh in index.css. Il modello non ha una dimensione propria, la ricava
// dall'altezza del canvas, quindi allungare la sezione lo ingrandisce da solo.
//
// Il tetto alla scala è la larghezza: oltre 0,33 la scrivania sborda e il case
// del PC resta tagliato a metà sul bordo destro.
//
// Attenzione se si ritocca la y. Il modello sta a una percentuale fissa
// dell'altezza della sezione mentre il testo parte da 160px fissi: più lo
// schermo è corto, più il modello sale sul testo. Sotto passa l'indicatore, che
// su mobile sta all'84%, quindi scendere troppo lo manda addosso a quello.
const POSE = {
  mobile: { scale: 0.33, position: [0, -2.1, -0.5] },
  tablet: { scale: 0.5, position: [0, -1.8, -1] },
  laptop: { scale: 0.62, position: [0, -2.2, -1.3] },
  desktop: { scale: 0.7, position: [0, -2.5, -1.5] },
};

/*
 * Telefoni bassi: appena più piccolo e sensibilmente più in basso.
 *
 * Con la posa mobile normale, su questi schermi il modello finiva sopra il testo
 * dell'hero. Rimpicciolirlo e basta non serviva, la cima si alzava di appena
 * 5px: quello che conta è la y. Scendere e basta però lo mandava addosso
 * all'indicatore, che infatti qui torna in fondo (breakpoint `short`).
 *
 * Il caso stretto è un Android da 360x610 con la barra del browser aperta: lì il
 * sottotitolo va a tre righe e il testo finisce a 335px, lasciandone 275 fino al
 * fondo. Il modello ne prende 112, l'indicatore 44, e avanzano 119px divisi in
 * 38 sopra il modello, 65 sotto e 16 in fondo.
 */
const MOBILE_SHORT = { scale: 0.32, position: [0, -2.6, -0.5] };

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
      {/*
        Nessun fallback qui dentro.

        CanvasLoader si piazza proiettando l'origine 3D sullo schermo, che su
        mobile cade a metà sezione, cioè dietro al testo dell'hero. In più Hero
        disegna già la sua tazzina fuori dal canvas: mentre il modello scaricava
        se ne vedevano due, una addosso alla scritta e una al posto giusto.
        Quella dell'hero basta, e gira anche prima che three sia scaricato.
        Gli altri canvas continuano a usare CanvasLoader: lì non c'è testo sotto.
      */}
      <Suspense fallback={null}>
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
