import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        night: { DEFAULT: '#121B3A', 700: '#1D2A55', 600: '#2B3B73', 100: '#DDE2F3' },
        lamp: { DEFAULT: '#FFB547', deep: '#E8961A', soft: '#FFF1D6' },
        mist: '#F4F6FB',
        ink: '#1B2236',
        ok: '#2F9E8F',
        danger: '#E5534B',
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        lift: '0 10px 30px -12px rgba(18,27,58,.25)',
        glow: '0 0 120px 40px rgba(255,181,71,.35)',
      },
    },
  },
  plugins: [],
};
export default config;
