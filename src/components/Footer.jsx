import { socials } from '../constants';
import { styles } from '../styles';
import { logo } from '../assets';

const Footer = () => (
  <footer className={`${styles.paddingX} relative z-10 border-t border-line-200 py-10`}>
    <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <img src={logo} alt="" width="36" height="36" className="h-9 w-9 object-contain" />
        <p className="text-[14px] leading-tight text-secondary">
          <span className="block font-semibold text-white">Tommaso Bosi</span>
          Rome, Italy
        </p>
      </div>

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
    </div>

    <p className="mx-auto mt-8 max-w-7xl text-[12px] text-secondary">
      &copy; {new Date().getFullYear()} Tommaso Bosi
    </p>
  </footer>
);

export default Footer;
