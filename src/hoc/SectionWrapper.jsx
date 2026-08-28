import { motion } from 'framer-motion';

import { styles } from '../styles';
import { staggerContainer } from '../utils/motion';

/**
 * Contenitore comune delle sezioni.
 *
 * L'id sta sulla sezione stessa invece che su uno <span> vuoto: così l'ancora
 * punta a un elemento con dimensioni reali, che l'IntersectionObserver della
 * navbar può osservare per capire dove ci si trova. L'offset della navbar fissa
 * è gestito da scroll-margin-top, non più da un margine negativo compensato.
 */
const SectionWrapper = (Component, idName) =>
  function HOC() {
    return (
      <motion.section
        id={idName || undefined}
        variants={staggerContainer()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className={`${styles.padding} max-w-7xl mx-auto relative z-0 scroll-mt-24`}
      >
        <Component />
      </motion.section>
    );
  };

export default SectionWrapper;
