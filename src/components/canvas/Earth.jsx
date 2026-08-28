import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";

const Earth = () => {
  const earth = useGLTF("./rocket/scene.gltf");

  return (
    <mesh>
    <primitive object={earth.scene} scale={3.5} position-y={0} rotation-y={-9.5} />
    <pointLight intensity={2} position={[2, 0, 0]} />
      <pointLight intensity={2} position={[-2, 0, 0]} />
      <pointLight intensity={2} position={[0, 2, 0]} />
      {/* Add ambient light */}
      <ambientLight intensity={0.3} />

      {/* Add hemisphere light */}
      <hemisphereLight skyColor={"#ffffff"} groundColor={"#000000"} intensity={0.5} position={[0, 1, 0]} />
    </mesh>
  );
};

const EarthCanvas = () => {
  return (
    <Canvas
      shadows
      frameloop='demand'
      dpr={[1, 2]}
      gl={{ preserveDrawingBuffer: true }}
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [-4, 3, 6],
      }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          autoRotate
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Earth />

        <Preload all />
      </Suspense>
    </Canvas>
  );
};

export default EarthCanvas;