import { Tilt } from 'react-tilt';
import { motion } from 'framer-motion';

import { SectionWrapper } from '../hoc';
import { featuredPapers, publications } from '../constants';
import { fadeIn } from '../utils/motion';
import SectionHeading from './SectionHeading';

const TILT_OPTIONS = { max: 18, scale: 1.02, speed: 450, glare: false };

const PaperCard = ({ index, name, description, tags, image, source_code_link }) => (
  <motion.div variants={fadeIn('up', 'spring', Math.min(index, 4) * 0.1, 0.6)} className="w-full">
    <Tilt options={TILT_OPTIONS} className="surface-card h-full">
      <a
        href={source_code_link}
        target="_blank"
        rel="noreferrer noopener"
        className="flex h-full flex-col p-5"
      >
        <img
          src={image}
          alt=""
          width="360"
          height="230"
          loading="lazy"
          decoding="async"
          className="h-[200px] w-full rounded-2xl object-cover"
        />

        <h3 className="mt-5 font-bold leading-snug text-white text-[clamp(1.05rem,2vw,1.25rem)]">
          {name}
        </h3>

        <p className="mt-2 text-[14px] leading-[1.7] text-secondary">{description}</p>

        <ul className="mt-auto flex flex-wrap gap-x-3 gap-y-1 pt-5">
          {tags.map((tag) => (
            <li key={`${name}-${tag.name}`} className={`text-[13px] font-medium ${tag.color}`}>
              #{tag.name}
            </li>
          ))}
        </ul>
      </a>
    </Tilt>
  </motion.div>
);

const PublicationRow = ({ index, title, authors, venue, detail, year, link }) => (
  <motion.li variants={fadeIn('up', 'spring', Math.min(index, 5) * 0.06, 0.5)} className="surface-row">
    <a
      href={link}
      target="_blank"
      rel="noreferrer noopener"
      className="group grid gap-x-6 gap-y-1 px-1 py-5 sm:grid-cols-[4.5rem_1fr]"
    >
      <span className="text-[13px] font-semibold tabular-nums text-accent sm:pt-0.5">{year}</span>

      <span>
        <span className="block text-[15px] font-semibold leading-snug text-white-100 transition-colors duration-200 group-hover:text-white">
          {title}
        </span>
        <span className="mt-1.5 block text-[13px] leading-relaxed text-secondary">{authors}</span>
        <span className="mt-1 block text-[13px] text-secondary/70">
          <em className="not-italic font-medium text-secondary">{venue}</em>
          {detail ? ` · ${detail}` : ''}
        </span>
      </span>
    </a>
  </motion.li>
);

const Research = () => (
  <>
    <SectionHeading eyebrow="Peer-reviewed work" title="Research.">
      Thirteen papers in Transportation Research Part C and Part E, Computers &amp; Industrial
      Engineering, IEEE Access and IEEE T-ITS, Expert Systems with Applications and others, written
      with groups in Luxembourg, Delft, Rome and Beijing. Most of them started from an operational
      problem someone actually had.
    </SectionHeading>

    <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {featuredPapers.map((paper, index) => (
        <PaperCard key={paper.name} index={index} {...paper} />
      ))}
    </div>

    <div className="mt-16">
      <h3 className="text-[12px] font-semibold uppercase tracking-[0.2em] text-secondary">
        Also published
      </h3>
      <ul className="mt-4 max-w-4xl">
        {publications.map((publication, index) => (
          <PublicationRow key={publication.title} index={index} {...publication} />
        ))}
      </ul>
    </div>
  </>
);

export default SectionWrapper(Research, 'research');
