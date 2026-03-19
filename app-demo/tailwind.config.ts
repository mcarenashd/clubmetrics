import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          azul: '#1464A0',
          'azul-oscuro': '#0D4A7A',
          verde: '#3DC99A',
          'verde-oscuro': '#2BA87E',
        },
        texto: {
          principal: '#1E2B3C',
          secundario: '#4A5568',
        },
        fondo: {
          suave: '#F0F4F8',
          blanco: '#FFFFFF',
        },
        bordes: '#D1D9E0',
        semaforo: {
          verde: '#27AE60',
          ambar: '#F39C12',
          rojo: '#E74C3C',
          gris: '#A0AEC0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
