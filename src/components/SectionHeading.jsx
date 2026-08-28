import { motion } from 'framer-motion';

import { styles } from '../styles';
import { textVariant } from '../utils/motion';

const SectionHeading = ({ eyebrow, title, align = 'left', children }) => (
  <motion.div variants={textVariant()} className={align === 'center' ? 'text-center' : ''}>
    <p className={styles.sectionSubText}>{eyebrow}</p>
    <h2 className={`${styles.sectionHeadText} mt-3`}>{title}</h2>
    {children && (
      <div className={`mt-5 ${styles.bodyText} max-w-3xl ${align === 'center' ? 'mx-auto' : ''}`}>
        {children}
      </div>
    )}
  </motion.div>
);

export default SectionHeading;
