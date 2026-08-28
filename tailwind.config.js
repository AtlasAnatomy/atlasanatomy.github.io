/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  mode: 'jit',
  theme: {
    extend: {
      colors: {
        primary: '#050816',
        secondary: '#aaa6c3',
        tertiary: '#151030',
        accent: '#915EFF',
        'black-100': '#100d25',
        'black-200': '#090325',
        'white-100': '#f3f3f3',
        // Bordi e velature ricavati dalla palette esistente: servono a
        // differenziare le superfici senza introdurre colori nuovi.
        'line-100': 'rgba(145, 94, 255, 0.16)',
        'line-200': 'rgba(170, 166, 195, 0.14)',
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        card: '0px 35px 120px -15px #211e35',
      },
      screens: {
        // 360 copre gli schermi stretti reali (320-374) senza forzare un breakpoint
        // dedicato; xs resta il salto storico del progetto.
        xs: '450px',
      },
      backgroundImage: {
        // Da public/, non da src/assets: serve un URL stabile perché index.html
        // possa preloadarlo. È l'elemento LCP della pagina.
        'hero-pattern': "url('/herobg.webp')",
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
