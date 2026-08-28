import { Tilt } from 'react-tilt';
import { motion } from 'framer-motion';

import { SectionWrapper } from '../hoc';
import { projects } from '../constants';
import { fadeIn } from '../utils/motion';
import SectionHeading from './SectionHeading';

// Card larghe: inclinazione contenuta, o il testo diventa illeggibile.
const TILT_OPTIONS = { max: 8, scale: 1.01, speed: 500, glare: false };

const ProjectCard = ({ index, name, role, year, description, highlights, tags, links }) => (
  <motion.div variants={fadeIn('up', 'spring', index * 0.14, 0.7)} className="w-full">
    <Tilt options={TILT_OPTIONS} className="surface-card">
      <article className="p-6 sm:p-8">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h3 className="font-black tracking-tight text-white text-[clamp(1.4rem,3.4vw,2rem)]">
            {name}
          </h3>
          <p className="text-[13px] font-medium text-accent">{role}</p>
          <p className="ml-auto text-[13px] tabular-nums text-secondary">{year}</p>
        </div>

        <p className="mt-4 max-w-2xl leading-[1.8] text-secondary text-[clamp(0.9rem,1.6vw,1rem)]">
          {description}
        </p>

        <ul className="mt-6 grid gap-2 sm:grid-cols-2">
          {highlights.map((highlight) => (
            <li key={highlight} className="relative pl-5 text-[14px] leading-[1.65] text-white-100/80">
              <span className="absolute left-0 top-[0.65em] h-px w-1.5 bg-accent" aria-hidden="true" />
              {highlight}
            </li>
          ))}
        </ul>

        <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-3 border-t border-line-200 pt-5">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer noopener"
              className="surface-chip inline-flex min-h-[44px] items-center gap-2 rounded-full px-4 text-[14px] font-medium text-white-100"
            >
              {link.label}
              <span aria-hidden="true">&rarr;</span>
            </a>
          ))}

          <ul className="flex flex-wrap gap-x-3 gap-y-1 sm:ml-auto">
            {tags.map((tag) => (
              <li key={tag} className="text-[13px] text-secondary">
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </article>
    </Tilt>
  </motion.div>
);

const Projects = () => (
  <>
    <SectionHeading eyebrow="Things I have shipped" title="Projects.">
      Two that are out in the world: one a platform teams use to buy and sell training, the other a
      browser extension that exists because I wanted to see whether the idea would actually work.
    </SectionHeading>

    <div className="mt-14 grid max-w-5xl gap-6">
      {projects.map((project, index) => (
        <ProjectCard key={project.name} index={index} {...project} />
      ))}
    </div>
  </>
);

export default SectionWrapper(Projects, 'projects');
