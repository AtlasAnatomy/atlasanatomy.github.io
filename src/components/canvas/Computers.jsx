import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

import CanvasLoader from '../Loader';
import { useViewportTier } from '../../hooks/useDeferredMount';

// Il .glb è Draco + texture WebP: 15,08 MB di gltf/bin/textures sciolti diventano
// 1,13 MB in un file solo. Il decoder è servito da /draco/, non dalla CDN gstatic
// su cui drei ricade per default.
const MODEL_URL = '/models/desktop_pc.glb';
const DRACO_PATH = '/draco/';

// Posa per fascia di viewport. Il ramo desktop deve restare allineato a
// scripts/render-poster.mjs, altrimenti il poster e il canvas non si sovrappongono.
const POSE = {
  mobile: { scale: 0.3, position: [0, -1.2, -0.5] },
  tablet: { scale: 0.5, position: [0, -1.8, -1] },
  laptop: { scale: 0.62, position: [0, -2.2, -1.3] },
  desktop: { scale: 0.7, position: [0, -2.5, -1.5] },
};

const Computers = ({ tier, onReady }) => {
  const { scene } = useGLTF(MODEL_URL, DRACO_PATH);
  const { scale, position } = POSE[tier] ?? POSE.desktop;

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
        <Computers tier={tier} onReady={onModelReady} />
      </Suspense>
    </Canvas>
  );
};

useGLTF.preload(MODEL_URL, DRACO_PATH);

export default ComputersCanvas;
