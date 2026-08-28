import { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

import { usePrefersReducedMotion, useViewportTier } from '../../hooks/useDeferredMount';

const Stars = ({ count, animate }) => {
  const ref = useRef();
  const [sphere] = useState(() => random.inSphere(new Float32Array(count), { radius: 1.2 }));

  useFrame((state, delta) => {
    if (!animate || !ref.current) return;
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled>
        <PointMaterial transparent color="#f272c8" size={0.002} sizeAttenuation depthWrite={false} />
      </Points>
    </group>
  );
};

const StarsCanvas = () => {
  const reducedMotion = usePrefersReducedMotion();
  const tier = useViewportTier();

  // Su mobile lo sfondo occupa meno area e la GPU è più modesta: metà punti.
  const count = tier === 'mobile' ? 2400 : 5000;

  return (
    <div className="w-full h-auto absolute inset-0 z-[-1]" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 1] }}
        frameloop={reducedMotion ? 'demand' : 'always'}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
      >
        <Suspense fallback={null}>
          <Stars count={count} animate={!reducedMotion} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default StarsCanvas;
