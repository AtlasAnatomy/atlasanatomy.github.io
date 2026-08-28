import { Html, useProgress } from '@react-three/drei';
import coffeeCup from '../assets/coffee-cup.webp';

const CanvasLoader = () => {
  const { progress } = useProgress();

  return (
    <Html as="div" center>
      <div className="flex flex-col items-center justify-center gap-5" role="status" aria-live="polite">
        <img src={coffeeCup} alt="" width="50" height="50" className="coffee-cup-loader" />
        <p className="text-[13px] font-extrabold tracking-[0.18em] text-white-100 tabular-nums">
          {progress.toFixed(0)}%
        </p>
        <span className="sr-only">Loading the 3D scene</span>
      </div>
    </Html>
  );
};

export default CanvasLoader;
