import { Tilt } from 'react-tilt';
import { motion } from 'framer-motion';

import { SectionWrapper } from '../hoc';
import { testimonials } from '../constants';
import { fadeIn } from '../utils/motion';
import SectionHeading from './SectionHeading';

const TILT_OPTIONS = { max: 14, scale: 1.02, speed: 450, glare: false };

const FeedbackCard = ({ index, testimonial, name, designation, company, image }) => (
  <motion.div variants={fadeIn('up', 'spring', index * 0.12, 0.65)} className="w-full">
    <Tilt options={TILT_OPTIONS} className="surface-card h-full">
      <figure className="flex h-full flex-col p-6 sm:p-7">
        <span className="text-[40px] font-black leading-none text-accent" aria-hidden="true">
          &ldquo;
        </span>

        <blockquote className="mt-2 text-[15px] leading-[1.75] text-white-100/90">
          {testimonial}
        </blockquote>

        <figcaption className="mt-auto flex items-center gap-3 border-t border-line-200 pt-5">
          <img
            src={image}
            alt=""
            width="36"
            height="36"
            loading="lazy"
            className="h-9 w-9 rounded-full object-cover"
          />
          <span>
            <span className="block text-[15px] font-semibold text-white">{name}</span>
            <span className="mt-0.5 block text-[12px] text-secondary">
              {designation}, {company}
            </span>
          </span>
        </figcaption>
      </figure>
    </Tilt>
  </motion.div>
);

const Feedbacks = () => (
  <>
    <SectionHeading eyebrow="From the Ph.D. committee" title="Reviews." />

    <div className="mt-14 grid gap-6 md:grid-cols-3">
      {testimonials.map((testimonial, index) => (
        <FeedbackCard key={testimonial.name} index={index} {...testimonial} />
      ))}
    </div>
  </>
);

export default SectionWrapper(Feedbacks, '');
