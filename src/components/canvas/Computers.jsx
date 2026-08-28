import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";

const Computers = ({ isMobile, isTablet, isDesktop }) => {
  const computer = useGLTF("./desktop_pc/scene.gltf");

  let scale, position;
  if (isMobile) {
    scale = 0.3;
    position = [0, -1.2, -0.5];
  } else if (isTablet) {
    scale = 0.5;
    position = [0, -1.8, -1];
  } else if (isDesktop) {
    scale = 0.70;
    position = [0, -2.5, -1.5];
  } else {
    scale = 1;
    position = [0, -3.5, -1.75];
  }

  return (
    <mesh>
      <hemisphereLight intensity={0.15} groundColor='black' />
      <spotLight 
        position={[-3, 5, 1]}
        angle={1}
        penumbra={1}
        intensity={300}
        castShadow
        shadow-mapSize={1024}
      />
      <pointLight intensity={2} 
        position={[0, -0.50, -0.25]}
      />
      <primitive
        object={computer.scene}
        scale={scale}
        position={position}
        rotation={[-0.01, -0.2, -0.1]}
      />
    </mesh>
  );
};

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Add listeners for changes to the screen size
    const mobileQuery = window.matchMedia("(max-width: 600px)");
    const tabletQuery = window.matchMedia("(min-width: 601px) and (max-width: 1024px)");
    const desktopQuery = window.matchMedia("(min-width: 1025px)");

    // Set the initial values of the state variables
    setIsMobile(mobileQuery.matches);
    setIsTablet(tabletQuery.matches);
    setIsDesktop(desktopQuery.matches);

    // Define callback functions to handle changes to the media queries
    const handleMobileQueryChange = (event) => setIsMobile(event.matches);
    const handleTabletQueryChange = (event) => setIsTablet(event.matches);
    const handleDesktopQueryChange = (event) => setIsDesktop(event.matches);

    // Add the callback functions as listeners for changes to the media queries
    mobileQuery.addEventListener("change", handleMobileQueryChange);
    tabletQuery.addEventListener("change", handleTabletQueryChange);
    desktopQuery.addEventListener("change", handleDesktopQueryChange);

    // Remove the listeners when the component is unmounted
    return () => {
      mobileQuery.removeEventListener("change", handleMobileQueryChange);
      tabletQuery.removeEventListener("change", handleTabletQueryChange);
      desktopQuery.removeEventListener("change", handleDesktopQueryChange);
    };
  }, []);

  return (
    <Canvas
      frameloop='demand'
      shadows
      dpr={[1, 2]}
      camera={{ position: [20, 3, 5], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Computers 
          isMobile={isMobile} 
          isTablet={isTablet} 
          isDesktop={isDesktop} 
        />
      </Suspense>

      <Preload all />
    </Canvas>
  );
};

export default ComputersCanvas;
