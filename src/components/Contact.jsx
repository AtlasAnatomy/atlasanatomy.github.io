import { Suspense, useRef, useState } from 'react';
import { motion } from 'framer-motion';

import { styles } from '../styles';
import { RocketCanvas } from './canvas';
import { SectionWrapper } from '../hoc';
import { slideIn } from '../utils/motion';
import { socials } from '../constants';
import { useDeferredMount } from '../hooks/useDeferredMount';

const EMAILJS = {
  serviceId: 'service_qrsub7d',
  templateId: 'template_gsfb8g9',
  publicKey: 'e5Z7EHNA4koXXIx8Q',
};

const FIELD_CLASS =
  'bg-tertiary py-4 px-5 rounded-lg border border-line-200 text-white placeholder:text-secondary/60 font-medium ' +
  'focus:border-accent focus:outline-none transition-colors duration-200';

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  // 'idle' | 'sent' | 'error'. Sostituisce le due alert() bloccanti.
  const [status, setStatus] = useState('idle');

  const [rocketRef, showRocket] = useDeferredMount({ rootMargin: '300px' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (status !== 'idle') setStatus('idle');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus('idle');

    try {
      // Import dinamico: @emailjs/browser serve solo se qualcuno invia davvero
      // il modulo, quindi non ha ragione di stare nel bundle iniziale.
      const { default: emailjs } = await import('@emailjs/browser');

      await emailjs.send(
        EMAILJS.serviceId,
        EMAILJS.templateId,
        {
          from_name: form.name,
          to_name: 'Tommaso Bosi',
          from_email: form.email,
          to_email: 'bositommaso13@gmail.com',
          message: form.message,
        },
        EMAILJS.publicKey,
      );

      setStatus('sent');
      setForm({ name: '', email: '', message: '' });
    } catch (error) {
      console.error(error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col-reverse gap-12 xl:flex-row xl:mt-12">
      <motion.div variants={slideIn('left', 'tween', 0.2, 1)} className="flex-[0.75] bg-black-100 p-6 sm:p-8 rounded-2xl border border-line-200">
        <p className={styles.sectionSubText}>Get in touch</p>
        <h2 className={`${styles.sectionHeadText} mt-3`}>Contact.</h2>

        <p className="mt-4 text-secondary text-[15px] leading-relaxed">
          Research collaborations, optimization work, or teaching: write to me and I will get back
          to you.
        </p>

        <form ref={formRef} onSubmit={handleSubmit} className="mt-10 flex flex-col gap-6">
          <label className="flex flex-col">
            <span className="text-white font-medium mb-3 text-[15px]">Your name</span>
            <input
              type="text"
              name="name"
              required
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ada Lovelace"
              className={FIELD_CLASS}
            />
          </label>

          <label className="flex flex-col">
            <span className="text-white font-medium mb-3 text-[15px]">Your email</span>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              placeholder="ada@example.com"
              className={FIELD_CLASS}
            />
          </label>

          <label className="flex flex-col">
            <span className="text-white font-medium mb-3 text-[15px]">Your message</span>
            <textarea
              rows={6}
              name="message"
              required
              value={form.message}
              onChange={handleChange}
              placeholder="What would you like to work on?"
              className={`${FIELD_CLASS} resize-y`}
            />
          </label>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="surface-chip min-h-[48px] rounded-xl px-8 font-bold text-white disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending…' : 'Send'}
            </button>

            {/* aria-live: chi usa uno screen reader sente l'esito senza doverlo cercare. */}
            <p aria-live="polite" className="text-[14px]">
              {status === 'sent' && <span className="text-[#38ef7d]">Thanks, I will get back to you.</span>}
              {status === 'error' && (
                <span className="text-[#fc6767]">
                  That did not go through. Email me directly at bositommaso13@gmail.com.
                </span>
              )}
            </p>
          </div>
        </form>

        <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 pt-6 border-t border-line-200">
          {socials.map((social) => (
            <li key={social.name}>
              <a
                href={social.href}
                target={social.href.startsWith('mailto:') ? undefined : '_blank'}
                rel="noreferrer noopener"
                className="inline-flex items-center min-h-[44px] text-secondary hover:text-white transition-colors duration-200 text-[14px]"
              >
                <span className="font-medium">{social.name}</span>
                <span className="mx-2 text-secondary/40" aria-hidden="true">
                  /
                </span>
                <span className="text-secondary/70">{social.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        ref={rocketRef}
        variants={slideIn('right', 'tween', 0.2, 1)}
        className="xl:flex-1 h-[320px] sm:h-[420px] xl:h-auto xl:min-h-[560px]"
      >
        {showRocket && (
          <Suspense fallback={null}>
            <RocketCanvas />
          </Suspense>
        )}
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Contact, 'contact');
