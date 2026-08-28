import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

import CanvasLoader from '../Loader';
import { usePrefersReducedMotion } from '../../hooks/useDeferredMount';

// 55,62 MB di geometria non compressa per un oggetto decorativo che ruota da solo.
// Draco più una decimazione a 0.0001 lo portano a 0,42 MB restando a 88.085 vertici:
// nel confronto affiancato con l'originale non si distingue.
const MODEL_URL = '/models/rocket.glb';
const DRACO_PATH = '/draco/';

const Rocket = () => {
  const { scene } = useGLTF(MODEL_URL, DRACO_PATH);

  return (
    <mesh>
      <primitive object={scene} scale={3.5} position-y={0} rotation-y={-9.5} />
      <pointLight intensity={2} position={[2, 0, 0]} />
      <pointLight intensity={2} position={[-2, 0, 0]} />
      <pointLight intensity={2} position={[0, 2, 0]} />
      <ambientLight intensity={0.3} />
      <hemisphereLight skyColor="#ffffff" groundColor="#000000" intensity={0.5} position={[0, 1, 0]} />
    </mesh>
  );
};

const RocketCanvas = () => {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <Canvas
      shadows
      // Con la rotazione automatica il ciclo di render deve restare attivo;
      // se il movimento è disattivato basta ridisegnare su richiesta.
      frameloop={reducedMotion ? 'demand' : 'always'}
      dpr={[1, 1.5]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={{ fov: 45, near: 0.1, far: 200, position: [-4, 3, 6] }}
      aria-hidden="true"
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          autoRotate={!reducedMotion}
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Rocket />
      </Suspense>
    </Canvas>
  );
};

useGLTF.preload(MODEL_URL, DRACO_PATH);

export default RocketCanvas;
