import { socials } from '../constants';
import { styles } from '../styles';
import { logo } from '../assets';

const Footer = () => (
  <footer className={`${styles.paddingX} relative z-10 pb-10`}>
    {/* Il filetto sta sul contenitore interno, non sul <footer>: così corre
        quanto il contenuto, dal logo al copyright, invece di attaccarsi ai
        due bordi dello schermo. */}
    <div className="mx-auto flex max-w-7xl flex-col gap-6 border-t border-line-200 pt-10 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <img src={logo} alt="" width="36" height="36" className="h-9 w-9 object-contain" />
        <p className="text-[14px] leading-tight text-secondary">
          <span className="block font-semibold text-white">Tommaso Bosi</span>
          Rome, Italy
        </p>
      </div>

      {/* Il copyright chiude la riga dei link: sta fuori dalla <ul> perché non
          è una voce di navigazione, ma nello stesso flex per restare in linea. */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {socials.map((social) => (
            <li key={social.name}>
              <a
                href={social.href}
                target={social.href.startsWith('mailto:') ? undefined : '_blank'}
                rel="noreferrer noopener"
                className="inline-flex min-h-[44px] items-center text-[14px] font-medium text-secondary transition-colors duration-200 hover:text-white"
              >
                {social.name}
              </a>
            </li>
          ))}
        </ul>

        <p className="text-[12px] text-secondary">
          &copy; {new Date().getFullYear()} Tommaso Bosi
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
