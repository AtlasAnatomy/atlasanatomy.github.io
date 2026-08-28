import { motion } from 'framer-motion';

import { SectionWrapper } from '../hoc';
import { awards, certifications } from '../constants';
import { fadeIn } from '../utils/motion';
import SectionHeading from './SectionHeading';

const Row = ({ index, title, issuer, year, link }) => {
  const content = (
    <>
      <span className="text-[13px] font-semibold tabular-nums text-accent">{year || ''}</span>
      <span>
        <span className="block text-white-100 text-[15px] font-semibold leading-snug">{title}</span>
        <span className="mt-1 block text-secondary text-[13px] leading-relaxed">{issuer}</span>
      </span>
    </>
  );

  const className = 'grid gap-x-6 gap-y-1 px-1 py-5 sm:grid-cols-[3.5rem_1fr]';

  return (
    <motion.li variants={fadeIn('up', 'spring', Math.min(index, 5) * 0.06, 0.5)} className="surface-row">
      {link ? (
        <a href={link} target="_blank" rel="noreferrer noopener" className={className}>
          {content}
        </a>
      ) : (
        <div className={className}>{content}</div>
      )}
    </motion.li>
  );
};

const Recognition = () => (
  <>
    <SectionHeading eyebrow="Awards and certifications" title="Recognition." />

    <div className="mt-12 grid max-w-5xl gap-x-12 gap-y-10 lg:grid-cols-2">
      <div>
        <h3 className="text-[12px] font-semibold uppercase tracking-[0.2em] text-secondary">Awards</h3>
        <ul className="mt-4">
          {awards.map((award, index) => (
            <Row key={award.title} index={index} {...award} />
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-[12px] font-semibold uppercase tracking-[0.2em] text-secondary">
          Certifications
        </h3>
        <ul className="mt-4">
          {certifications.map((certification, index) => (
            <Row key={certification.title} index={index} {...certification} />
          ))}
        </ul>
      </div>
    </div>
  </>
);

export default SectionWrapper(Recognition, '');
