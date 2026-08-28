import { motion } from 'framer-motion';

import { styles } from '../styles';
import { textVariant } from '../utils/motion';

/**
 * Intestazione di sezione.
 *
 * Il filo verticale accanto al titolo riprende quello dell'hero: è l'elemento
 * che tiene insieme le sezioni senza doverle chiudere tutte dentro una card.
 */
const SectionHeading = ({ eyebrow, title, align = 'left', children }) => (
  <motion.div variants={textVariant()} className={align === 'center' ? 'text-center' : ''}>
    <div className={`flex items-center gap-4 ${align === 'center' ? 'justify-center' : ''}`}>
      {align === 'left' && <span className="rule-accent block w-px h-10 shrink-0" aria-hidden="true" />}
      <p className={styles.sectionSubText}>{eyebrow}</p>
    </div>
    <h2 className={`${styles.sectionHeadText} mt-3 ${align === 'left' ? 'sm:pl-8' : ''}`}>{title}</h2>
    {children && (
      <div className={`mt-5 ${styles.bodyText} max-w-3xl ${align === 'left' ? 'sm:pl-8' : 'mx-auto'}`}>
        {children}
      </div>
    )}
  </motion.div>
);

export default SectionHeading;
