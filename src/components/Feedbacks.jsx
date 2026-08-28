import { motion } from 'framer-motion';

import { SectionWrapper } from '../hoc';
import { testimonials } from '../constants';
import { fadeIn } from '../utils/motion';
import SectionHeading from './SectionHeading';

const FeedbackCard = ({ index, testimonial, name, designation, company, image }) => (
  <motion.figure
    variants={fadeIn('up', 'spring', index * 0.12, 0.65)}
    className="surface-panel flex h-full flex-col p-6 sm:p-7"
  >
    <span className="text-accent font-black text-[40px] leading-none" aria-hidden="true">
      &ldquo;
    </span>

    <blockquote className="mt-2 text-white-100/90 leading-[1.75] text-[15px]">
      {testimonial}
    </blockquote>

    <figcaption className="mt-6 flex items-center gap-3 pt-5 border-t border-line-200">
      <img src={image} alt="" width="36" height="36" loading="lazy" className="w-9 h-9 rounded-full object-cover" />
      <span>
        <span className="block text-white font-semibold text-[15px]">{name}</span>
        <span className="block mt-0.5 text-secondary text-[12px]">
          {designation}, {company}
        </span>
      </span>
    </figcaption>
  </motion.figure>
);

const Feedbacks = () => (
  <>
    <SectionHeading eyebrow="From the Ph.D. committee" title="Reviews." />

    <div className="mt-14 sm:pl-8 grid gap-5 md:grid-cols-3">
      {testimonials.map((testimonial, index) => (
        <FeedbackCard key={testimonial.name} index={index} {...testimonial} />
      ))}
    </div>
  </>
);

export default SectionWrapper(Feedbacks, '');
