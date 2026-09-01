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
 *
 * La soglia di ingresso è "some" e non una frazione della sezione.
 *
 * Con amount: 0.15 l'animazione partiva solo quando era visibile il 15%
 * dell'elemento, che per una sezione più alta di sei volte e mezzo lo schermo
 * non può succedere mai. Su un telefono da 610px di viewport la soglia era
 * irraggiungibile sopra i 4067px di sezione: Work ne misura 4677 e Research
 * 5792, e restavano tutte e due a opacità zero. Erano nel DOM, alte e piene di
 * contenuto, ma invisibili.
 *
 * Il margine negativo in basso ridà il ritardo che dava il 15%: la sezione si
 * anima quando è entrata di 80px, non appena sfiora il bordo. È una misura in
 * pixel sulla finestra, quindi non dipende da quanto è alta la sezione.
 */
const SectionWrapper = (Component, idName) =>
  function HOC() {
    return (
      <motion.section
        id={idName || undefined}
        variants={staggerContainer()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 'some', margin: '0px 0px -80px 0px' }}
        className={`${styles.padding} max-w-7xl mx-auto relative z-0 scroll-mt-24`}
      >
        <Component />
      </motion.section>
    );
  };

export default SectionWrapper;
