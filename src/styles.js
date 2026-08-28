/**
 * Scala tipografica e ritmo delle sezioni.
 *
 * Le misure sono espresse in clamp() invece che per breakpoint: fra 320 e 1440 px
 * il testo scala con continuità, senza i salti che si vedevano fra xs, sm e lg.
 * Il tracking si stringe man mano che il corpo cresce, così i titoli grandi
 * restano compatti invece di aprirsi.
 */
const styles = {
  paddingX: 'px-6 sm:px-10 lg:px-16',
  paddingY: 'py-10 sm:py-16',
  padding: 'px-6 sm:px-10 lg:px-16 py-12 sm:py-20',

  heroHeadText:
    'font-black text-white leading-[1.02] tracking-[-0.03em] text-[clamp(2.5rem,9vw,5rem)]',
  heroSubText:
    'text-[#dfd9ff] font-medium leading-[1.5] text-[clamp(1rem,2.4vw,1.75rem)]',

  sectionHeadText:
    'text-white font-black leading-[1.05] tracking-[-0.025em] text-[clamp(2rem,6vw,3.75rem)]',
  sectionSubText:
    'text-secondary uppercase tracking-[0.22em] font-medium text-[clamp(0.7rem,1.4vw,0.8rem)]',

  bodyText: 'text-secondary leading-[1.75] text-[clamp(0.95rem,1.6vw,1.0625rem)]',
};

export { styles };
