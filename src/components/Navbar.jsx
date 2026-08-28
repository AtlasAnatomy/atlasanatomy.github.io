import { useEffect, useRef, useState } from 'react';

import { styles } from '../styles';
import { navLinks } from '../constants';
import { logo, menu, close } from '../assets';

/**
 * La navbar.
 *
 * Il menu mobile ora è un vero pulsante con stato dichiarato, si chiude con Esc
 * o cliccando fuori, e ogni voce ha un'area toccabile di almeno 44px. La voce
 * attiva viene ricavata dallo scorrimento invece che dall'ultimo clic, così
 * resta corretta anche quando si naviga con la rotella.
 */
const Navbar = () => {
  const [active, setActive] = useState('');
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const panelRef = useRef(null);
  const toggleRef = useRef(null);

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

  // Chiusura del menu: Esc da tastiera, clic fuori dal pannello col puntatore.
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

  return (
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
              Operations Research &amp; Optimization
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

        <div className="md:hidden flex justify-end items-center">
          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close the menu' : 'Open the menu'}
            onClick={() => setOpen((value) => !value)}
            className="grid place-items-center w-11 h-11 -mr-2"
          >
            <img src={open ? close : menu} alt="" width="24" height="24" className="w-6 h-6 object-contain" />
          </button>

          <div
            ref={panelRef}
            id="mobile-menu"
            hidden={!open}
            className="bgblack absolute top-[72px] right-4 min-w-[200px] z-20 rounded-xl border border-line-100 p-2 shadow-card"
          >
            <ul className="list-none flex flex-col">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={() => setOpen(false)}
                    aria-current={active === link.id ? 'true' : undefined}
                    className={`${
                      active === link.id ? 'text-white bg-white/5' : 'text-secondary'
                    } flex items-center min-h-[44px] px-4 rounded-lg font-medium text-[16px] hover:text-white hover:bg-white/5 transition-colors duration-200`}
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
