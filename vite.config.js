import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    // Nessun manualChunks. La versione a oggetto ({ three: ['three'], ... })
    // sembrava ragionevole ma faceva finire React dentro il chunk di
    // @react-three per via dell'interop CommonJS: l'entry si ritrovava a
    // importarlo staticamente, Vite ci metteva sopra un <link rel="modulepreload">
    // e three partiva insieme al CSS invece che dopo.
    //
    // I confini giusti li disegnano già gli import dinamici: l'entry tiene React
    // più Navbar e Hero, ogni sezione e ogni canvas hanno il proprio chunk, e
    // three arriva solo quando un canvas viene montato davvero.
    rollupOptions: {},
    // I chunk 3D restano naturalmente sopra i 500 kB: sono fuori dal percorso
    // critico, quindi l'avviso di default non aiuta.
    chunkSizeWarningLimit: 900,
    target: 'es2020',
    cssCodeSplit: true,
    reportCompressedSize: false,
  },
});
