import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { styles } from '../styles';
import { ComputersCanvas } from './canvas';

const Hero = () => {
  const [screenSize, setScreenSize] = useState('');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 600 && width <= 1440) {
        setScreenSize('laptop');
      } else if (width > 1440) {
        setScreenSize('desktop');
      } else {
        setScreenSize('mobile');
      }
    };

    window.addEventListener('resize', handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  let heroHeight;
  switch (screenSize) {
    case 'desktop':
      heroHeight = '120vh'; // Adjust height for desktop
      break;
    case 'laptop':
      heroHeight = '140vh'; // Adjust height for laptop
      break;
    case 'mobile':
      heroHeight = '90vh'; // Adjust height for mobile
      break;
    default:
      heroHeight = '120vh';
  }

  return (
    <section
      className="relative w-full mx-auto"
      style={{ height: heroHeight }}
    >
      <div
        className={`absolute inset-0 top-[120px] max-w-7xl mx-auto ${styles.paddingX} flex flex-row items-start gap-5`}
      >
        <div className="flex flex-col justify-center items-center mt-5">
          <div className="w-5 h-5 rounded-full bg-[#915EFF]" />
          <div className="w-1 sm:h-80 h-40 violet-gradient" />
        </div>
  
        <div>
          <h1 className={`${styles.heroHeadText} text-white`}>
            Hi, I'm <span className="text-[#915EFF]">Tom</span>
          </h1>
          <p className={`${styles.heroSubText} mt-2 text-white-100`}>
            I develop algorithms <br/>
            for sustainable transport networks
          </p>
        </div>
      </div>
      
      <ComputersCanvas />
  
      <div className="absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center">
        <a href="#about">
          <div className="w-[35px] h-[64px] rounded-3xl border-4 border-secondary flex justify-center items-start p-2">
            <motion.div
              animate={{
                y: [0, 24, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: 'loop',
              }}
              className="w-3 h-3 rounded-full bg-secondary mb-1"
            />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
