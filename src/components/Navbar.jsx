import { useCallback, useEffect, useRef, useState } from 'react';

import { styles } from '../styles';
import { navLinks, socials } from '../constants';
import { logo, menu, close } from '../assets';
import { EmailIcon, GitHubIcon, LinkedInIcon, LinktreeIcon } from './SocialIcons';

/**
 * La navbar.
 *
 * Su mobile il menu è un pannello laterale che entra da destra, dallo stesso
 * lato del pulsante che lo apre. Si chiude con Esc, con la crocetta in alto,
 * toccando il velo, o scegliendo una voce. Le voci stanno in alto e i profili
 * in fondo, oltre un filetto, come nel footer della pagina.
 *
 * Lo scorrimento è affidato alle transizioni CSS invece che a framer-motion:
 * questo componente sta sopra la piega, e tirarsi dietro la libreria di
 * animazione qui dentro vanificherebbe i lazy() di App.jsx. Il blocco
 * prefers-reduced-motion in index.css azzera già queste durate.
 *
 * La voce attiva viene ricavata dallo scorrimento invece che dall'ultimo clic,
 * così resta corretta anche quando si naviga con la rotella.
 */

// Ordine dei profili nel pannello; gli indirizzi restano in constants.
const SOCIAL_ICONS = {
  LinkedIn: LinkedInIcon,
  GitHub: GitHubIcon,
  Linktree: LinktreeIcon,
  Email: EmailIcon,
};
const SOCIAL_ORDER = ['LinkedIn', 'GitHub', 'Linktree', 'Email'];

const Navbar = () => {
  const [active, setActive] = useState('');
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const panelRef = useRef(null);
  const toggleRef = useRef(null);
  const closeRef = useRef(null);

  const closeMenu = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Sezione attiva: si segue quella che occupa la fascia alta del viewport.
  //
  // Le sezioni sono montate in lazy dopo l'evento load, quindi al primo render
  // della navbar nessuna esiste ancora: agganciare l'observer una volta sola
  // significherebbe non osservare niente e non evidenziare mai nulla. Un
  // MutationObserver aspetta che compaiano e riaggancia, poi si spegne.
  useEffect(() => {
    const intersection = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-20% 0px -70% 0px' },
    );

    const observed = new Set();

    const attach = () => {
      for (const link of navLinks) {
        if (observed.has(link.id)) continue;
        const section = document.getElementById(link.id);
        if (section) {
          intersection.observe(section);
          observed.add(link.id);
        }
      }
      return observed.size === navLinks.length;
    };

    if (attach()) return () => intersection.disconnect();

    const mutation = new MutationObserver(() => {
      if (attach()) mutation.disconnect();
    });
    mutation.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutation.disconnect();
      intersection.disconnect();
    };
  }, []);

  // Chiusura del menu: Esc da tastiera, tocco fuori dal pannello.
  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };

    const onPointerDown = (event) => {
      if (
        !panelRef.current?.contains(event.target) &&
        !toggleRef.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open]);

  /*
   * A pannello aperto la pagina sotto non deve scorrere: su mobile il gesto
   * finirebbe sul corpo invece che sul menu, e riaprendolo ci si ritroverebbe
   * altrove. Il valore precedente viene ripristinato invece che azzerato, per
   * non calpestare eventuali altri blocchi.
   *
   * Il fuoco si sposta sulla crocetta due fotogrammi dopo, non subito. Misurato
   * sul posto: all'uscita dell'effetto, e ancora al primo requestAnimationFrame,
   * il pannello risulta visibility:hidden, e un elemento nascosto non può
   * ricevere il fuoco: la chiamata cadeva nel vuoto e chi naviga da tastiera
   * restava col fuoco sul pulsante di apertura, fuori dal pannello. Al secondo
   * fotogramma lo stile è applicato e la chiamata attecchisce.
   */
  useEffect(() => {
    if (!open) return undefined;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    let interno = 0;
    const esterno = requestAnimationFrame(() => {
      interno = requestAnimationFrame(() => closeRef.current?.focus());
    });

    return () => {
      cancelAnimationFrame(esterno);
      cancelAnimationFrame(interno);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    /*
     * Il velo e il pannello sono fratelli del <nav>, non figli.
     *
     * Da scorrimento avviato la navbar prende backdrop-blur, e backdrop-filter
     * crea un blocco contenitore per i discendenti position:fixed: dentro al
     * <nav> il pannello si dimensionava sulla navbar invece che sul viewport e
     * si apriva alto 76px invece di 610. Fuori, fixed torna a riferirsi allo
     * schermo.
     */
    <>
      <nav
        className={`${styles.paddingX} w-full flex items-center py-4 fixed top-0 z-30 transition-colors duration-300 ${
          scrolled ? 'bg-primary/90 backdrop-blur-md border-b border-line-200' : 'bg-transparent'
        }`}
      >
        <div className="w-full flex justify-between items-center max-w-7xl mx-auto gap-4">
          <a
            href="#top"
            className="flex items-center gap-3 min-h-[44px] shrink-0"
            onClick={(event) => {
              event.preventDefault();
              setActive('');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <img src={logo} alt="" width="40" height="40" className="w-10 h-10 object-contain" />
            <span className="text-white text-[15px] font-bold leading-tight">
              Tommaso Bosi
              <span className="hidden lg:block text-secondary text-[12px] font-medium tracking-wide">
                IT Manager &amp; Developer
              </span>
            </span>
          </a>

          <ul className="list-none hidden md:flex flex-row gap-8 lg:gap-10">
            {navLinks.map((link) => (
              <li key={link.id}>
                {/* inline-flex + min-h-[44px] porta l'area cliccabile alla misura
                    minima: il solo testo misurava 39x37. La voce attiva si
                    distingue dal colore, senza sottolineature. */}
                <a
                  href={`#${link.id}`}
                  aria-current={active === link.id ? 'true' : undefined}
                  className={`${
                    active === link.id ? 'text-white' : 'text-secondary'
                  } inline-flex min-h-[44px] items-center text-[15px] font-medium transition-colors duration-200 hover:text-white`}
                >
                  {link.title}
                </a>
              </li>
            ))}
          </ul>

          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Open the menu"
            onClick={() => setOpen(true)}
            className="md:hidden grid place-items-center w-11 h-11 -mr-2"
          >
            <img src={menu} alt="" width="24" height="24" className="w-6 h-6 object-contain" />
          </button>
        </div>
      </nav>

      {/* Velo: scurisce e sfoca la pagina, e fa da bersaglio per chiudere. */}
      <div
        aria-hidden="true"
        className={`md:hidden fixed inset-0 z-40 bg-primary/70 backdrop-blur-sm transition-opacity duration-[420ms] ease-out-expo ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/*
       * Il pannello resta nel DOM anche da chiuso, altrimenti non avrebbe nulla
       * da cui uscire in transizione. visibility:hidden lo toglie però dal giro
       * di tabulazione, così da chiuso non riceve fuoco.
       */}
      <aside
        ref={panelRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={`md:hidden fixed inset-y-0 right-0 z-50 flex w-[82%] max-w-[360px] flex-col border-l border-line-100 bg-gradient-to-b from-black-100 to-primary shadow-card transition-[transform,visibility] duration-[420ms] ease-out-expo ${
          open ? 'visible translate-x-0' : 'invisible translate-x-full'
        }`}
      >
        {/* Chi sei a sinistra, come si esce a destra: il pannello copre la
            navbar, e senza il logo si perderebbe il riferimento di dove si è. */}
        <div className="flex items-center justify-between gap-3 px-4 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={logo}
              alt=""
              width="36"
              height="36"
              className="h-9 w-9 shrink-0 object-contain"
            />
            <span className="truncate text-[15px] font-bold leading-tight text-white">
              Tommaso Bosi
            </span>
          </div>

          <button
            ref={closeRef}
            type="button"
            aria-label="Close the menu"
            onClick={closeMenu}
            className="grid shrink-0 place-items-center w-11 h-11 rounded-lg transition-colors duration-200 hover:bg-white/5"
          >
            <img
              src={close}
              alt=""
              width="22"
              height="22"
              className="w-[22px] h-[22px] object-contain"
            />
          </button>
        </div>

        <ul className="list-none flex-1 overflow-y-auto px-4">
          {navLinks.map((link, index) => (
            <li
              key={link.id}
              /* Le voci entrano una dopo l'altra mentre il pannello scivola. In
                 chiusura il ritardo torna a zero: escono insieme al pannello,
                 senza code che restano indietro. */
              style={{ transitionDelay: open ? `${110 + index * 45}ms` : '0ms' }}
              className={`transition-[opacity,transform] duration-500 ease-out-expo ${
                open ? 'translate-x-0 opacity-100' : 'translate-x-5 opacity-0'
              }`}
            >
              <a
                href={`#${link.id}`}
                onClick={closeMenu}
                aria-current={active === link.id ? 'true' : undefined}
                className={`${
                  active === link.id ? 'text-white' : 'text-secondary hover:text-white'
                } relative flex min-h-[52px] items-center rounded-lg pl-5 pr-4 text-[17px] font-medium transition-colors duration-200`}
              >
                {/* Dove sei: una barretta sull'accento, non una sottolineatura. */}
                {active === link.id && (
                  <span
                    aria-hidden="true"
                    className="absolute left-0 h-5 w-[3px] rounded-full bg-accent"
                  />
                )}
                {link.title}
              </a>
            </li>
          ))}
        </ul>

        <div className="px-4 pb-8 pt-5">
          <ul className="list-none flex items-center gap-1 border-t border-line-200 pt-5">
            {SOCIAL_ORDER.map((name) => {
              const social = socials.find((item) => item.name === name);
              const Icon = SOCIAL_ICONS[name];
              if (!social || !Icon) return null;

              return (
                <li key={name}>
                  <a
                    href={social.href}
                    target={social.href.startsWith('mailto:') ? undefined : '_blank'}
                    rel="noreferrer noopener"
                    aria-label={name}
                    title={name}
                    onClick={closeMenu}
                    className="grid place-items-center w-12 h-12 rounded-lg text-secondary transition-colors duration-200 hover:bg-white/5 hover:text-accent"
                  >
                    <Icon />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
