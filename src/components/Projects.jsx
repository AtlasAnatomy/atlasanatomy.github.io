import { motion } from 'framer-motion';

import { SectionWrapper } from '../hoc';
import { projects } from '../constants';
import { fadeIn } from '../utils/motion';
import SectionHeading from './SectionHeading';

/**
 * Software in produzione, tenuto separato dai paper.
 *
 * Niente anteprime: uno screenshot di un catalogo o di un'estensione dice meno
 * di due righe su cosa fa. Lo spazio va al testo e ai link che portano al
 * prodotto vero.
 */
const ProjectCard = ({ index, name, role, year, description, highlights, tags, links }) => (
  <motion.article
    variants={fadeIn('up', 'spring', index * 0.14, 0.7)}
    className="surface-panel p-6 sm:p-8"
  >
    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
      <h3 className="text-white font-black tracking-tight text-[clamp(1.4rem,3.4vw,2rem)]">{name}</h3>
      <p className="text-[13px] font-medium text-accent">{role}</p>
      <p className="text-[13px] tabular-nums text-secondary ml-auto">{year}</p>
    </div>

    <p className="mt-4 max-w-2xl text-secondary leading-[1.8] text-[clamp(0.9rem,1.6vw,1rem)]">
      {description}
    </p>

    <ul className="mt-6 grid gap-2 sm:grid-cols-2">
      {highlights.map((highlight) => (
        <li key={highlight} className="relative pl-5 text-white-100/80 text-[14px] leading-[1.65]">
          <span className="absolute left-0 top-[0.65em] w-1.5 h-px bg-accent" aria-hidden="true" />
          {highlight}
        </li>
      ))}
    </ul>

    <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-3 pt-5 border-t border-line-200">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noreferrer noopener"
          className="surface-chip inline-flex items-center gap-2 min-h-[44px] rounded-full px-4 text-[14px] font-medium text-white-100"
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
  </motion.article>
);

const Projects = () => (
  <>
    <SectionHeading eyebrow="Things I have shipped" title="Projects.">
      Two that are out in the world: one a platform teams use to buy and sell training, the other a
      browser extension that exists because I wanted to see whether the idea would actually work.
    </SectionHeading>

    <div className="mt-14 sm:pl-8 grid gap-5 max-w-5xl">
      {projects.map((project, index) => (
        <ProjectCard key={project.name} index={index} {...project} />
      ))}
    </div>
  </>
);

export default SectionWrapper(Projects, 'projects');
