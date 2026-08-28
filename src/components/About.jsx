import { motion } from 'framer-motion';

import { services, skillGroups } from '../constants';
import { SectionWrapper } from '../hoc';
import { fadeIn } from '../utils/motion';
import SectionHeading from './SectionHeading';

const ServiceCard = ({ index, title, icon }) => (
  <motion.div
    variants={fadeIn('up', 'spring', index * 0.12, 0.6)}
    className="surface-panel flex items-center gap-4 p-5 sm:flex-col sm:items-start sm:gap-6 sm:p-6 sm:min-h-[168px]"
  >
    <img src={icon} alt="" width="40" height="40" className="w-10 h-10 object-contain shrink-0" />
    <h3 className="text-white text-[16px] sm:text-[18px] font-bold leading-snug sm:mt-auto">{title}</h3>
  </motion.div>
);

const About = () => (
  <>
    <SectionHeading eyebrow="Introduction" title="Overview." />

    <motion.div variants={fadeIn('', '', 0.1, 1)} className="mt-6 sm:pl-8 max-w-3xl space-y-5">
      <p className="text-secondary leading-[1.8] text-[clamp(0.95rem,1.7vw,1.0625rem)]">
        I hold a European Ph.D. in Computer Science and Automation from Roma Tre, where I also
        represented the doctoral students until October 2023. My work sits between operations
        research and software: I write the models and the algorithms, and then I write the thing
        that runs them.
      </p>
      <p className="text-secondary leading-[1.8] text-[clamp(0.95rem,1.7vw,1.0625rem)]">
        Most of it has been about moving people and freight — shunting yards for CFL in Luxembourg,
        train calendars for Trenitalia, electric bus fleets, metro rescheduling. Thirteen papers
        came out of that, with groups in Luxembourg, Delft, Rome and Beijing. Alongside the
        research I build the systems that put it to use: e-learning platforms, web applications,
        and lately retrieval-augmented chatbots running on small models on private servers, where
        the data cannot leave the building.
      </p>
      <p className="text-secondary leading-[1.8] text-[clamp(0.95rem,1.7vw,1.0625rem)]">
        I teach as well — Computer Science and Mathematics at ITS ECO-STEM Generation, and Public
        Transport Optimization as a guest lecturer at Roma Tre.
      </p>
    </motion.div>

    <div className="mt-14 sm:pl-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
      {services.map((service, index) => (
        <ServiceCard key={service.title} index={index} {...service} />
      ))}
    </div>

    <div className="mt-14 sm:pl-8 grid gap-8 sm:grid-cols-2">
      {skillGroups.map((group, index) => (
        <motion.div key={group.label} variants={fadeIn('up', 'spring', index * 0.1, 0.6)}>
          <h3 className="text-white text-[13px] font-semibold uppercase tracking-[0.18em]">
            {group.label}
          </h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {group.items.map((item) => (
              <li key={item} className="surface-chip rounded-full px-3 py-1.5 text-[13px] text-white-100">
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  </>
);

export default SectionWrapper(About, 'about');
