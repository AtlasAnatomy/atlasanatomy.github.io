import { motion } from 'framer-motion';

import { fadeIn } from '../utils/motion';

/**
 * Timeline delle esperienze e dei titoli.
 *
 * Sostituisce react-vertical-timeline-component. Quella libreria alternava le voci
 * a destra e a sinistra sopra i 1170px e le impilava sotto, il che significava due
 * layout da mantenere, un salto brusco nel mezzo e circa 40 KB fra JS e CSS per
 * ottenerlo. Con undici voci l'alternanza costringe anche l'occhio a rimbalzare
 * da un lato all'altro a ogni riga.
 *
 * Qui il binario è uno solo, a sinistra a ogni larghezza: una sola colonna da
 * leggere, e il layout si adatta con il flusso invece che con un breakpoint.
 */

/**
 * Pastiglia del logo.
 *
 * I loghi si dividono in due famiglie. Quelli con sfondo trasparente stanno
 * dentro il cerchio, appoggiati sul colore dichiarato da `iconBg`. Quelli con
 * uno sfondo proprio e opaco — bianco per Agenas, Oneskill e Formalba, nero per
 * PuntoEduca — riempiono invece l'intera pastiglia: messi al centro di un cerchio
 * colorato mostrerebbero il loro quadrato di sfondo ritagliato dentro il cerchio.
 * A distinguerli è `iconFit: 'cover'` nei dati.
 */
const Badge = ({ icon, iconFit, iconBg, alt }) => {
  const cover = iconFit === 'cover';

  return (
    <span
      className="absolute left-0 top-1 grid place-items-center w-11 h-11 rounded-full ring-4 ring-primary shrink-0 overflow-hidden"
      style={{ backgroundColor: cover ? undefined : iconBg }}
      aria-hidden="true"
    >
      <img
        src={icon}
        alt=""
        width={cover ? 44 : 26}
        height={cover ? 44 : 26}
        loading="lazy"
        decoding="async"
        className={cover ? 'w-full h-full object-cover' : 'w-[26px] h-[26px] object-contain'}
      />
      <span className="sr-only">{alt}</span>
    </span>
  );
};

const TimelineItem = ({ item, index, isLast }) => (
  <motion.li
    variants={fadeIn('up', 'spring', Math.min(index, 6) * 0.08, 0.6)}
    className={`relative pl-16 ${isLast ? '' : 'pb-12'}`}
  >
    {/* Il binario si ferma sull'ultima voce invece di proseguire nel vuoto. */}
    {!isLast && (
      <span className="absolute left-[21px] top-14 bottom-0 w-px bg-line-200" aria-hidden="true" />
    )}

    <Badge
      icon={item.icon}
      iconFit={item.iconFit}
      iconBg={item.iconBg}
      alt={item.company_name}
    />

    <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-accent">{item.date}</p>

    <h3 className="mt-2 text-white font-bold leading-tight text-[clamp(1.05rem,2.2vw,1.375rem)]">
      {item.title}
    </h3>

    <p className="mt-1 text-secondary text-[15px] font-medium">
      {item.link ? (
        <a
          href={item.link}
          target="_blank"
          rel="noreferrer noopener"
          className="hover:text-white transition-colors duration-200 underline decoration-line-100 underline-offset-4"
        >
          {item.company_name}
        </a>
      ) : (
        item.company_name
      )}
    </p>

    {item.points.length > 0 && (
      <ul className="mt-4 space-y-2">
        {item.points.map((point, pointIndex) => (
          <li
            key={`point-${pointIndex}`}
            className="relative pl-5 text-white-100/80 text-[14px] leading-[1.7]"
          >
            <span className="absolute left-0 top-[0.65em] w-1.5 h-px bg-accent" aria-hidden="true" />
            {point}
          </li>
        ))}
      </ul>
    )}
  </motion.li>
);

const Timeline = ({ items }) => (
  <ul className="mt-14 sm:pl-8 max-w-3xl">
    {items.map((item, index) => (
      <TimelineItem
        key={`${item.title}-${item.date}`}
        item={item}
        index={index}
        isLast={index === items.length - 1}
      />
    ))}
  </ul>
);

export default Timeline;
