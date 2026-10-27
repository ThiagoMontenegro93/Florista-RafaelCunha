import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: ['selector', '[data-tema="onix"]'], // tema escuro Ônix usa as variantes dark:
  theme: {
    extend: {
      colors: {
        // Cores por variável CSS: o tema ativo (data-tema no <html>) define os valores em globals.css
        creme: 'rgb(var(--creme) / <alpha-value>)',
        vidro: 'rgb(var(--vidro) / <alpha-value>)',
        blush: 'rgb(var(--blush) / <alpha-value>)',
        areia: 'rgb(var(--areia) / <alpha-value>)',
        salvia: 'rgb(var(--salvia) / <alpha-value>)',
        rosa: 'rgb(var(--rosa) / <alpha-value>)',
        ouro: 'rgb(var(--ouro) / <alpha-value>)',
        champanhe: 'rgb(var(--champanhe) / <alpha-value>)',
        marrom: 'rgb(var(--marrom) / <alpha-value>)',
        folha: 'rgb(var(--folha) / <alpha-value>)',
        tinta: 'rgb(var(--tinta) / <alpha-value>)',
        veu: 'rgb(var(--veu) / <alpha-value>)',
        realce: 'rgb(var(--realce) / <alpha-value>)',
        overlay: 'rgb(var(--overlay) / <alpha-value>)',
        halo: 'rgb(var(--halo) / <alpha-value>)',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        script: ['"Great Vibes"', 'cursive'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: { moldura: '32px' },
      boxShadow: {
        suave: '0 30px 70px -32px rgb(var(--sombra) / var(--sombra-a)), 0 0 0 1px rgb(var(--ouro) / .08) inset',
        brilho: '0 0 40px -6px rgb(var(--brilho) / .45)',
      },
      keyframes: {
        cair: {
          '0%': { transform: 'translateY(-10vh) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '0.7' },
          '100%': { transform: 'translateY(110vh) rotate(540deg)', opacity: '0' },
        },
        surgir: { '0%': { opacity: '0', transform: 'translateY(12px)' }, '100%': { opacity: '1', transform: 'none' } },
        aurora: { '0%,100%': { transform: 'translate(0,0) scale(1)' }, '50%': { transform: 'translate(6%,-4%) scale(1.15)' } },
        brilhar: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        girar: { to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        cair: 'cair linear infinite',
        surgir: 'surgir .6s cubic-bezier(.2,.8,.2,1) both',
        aurora: 'aurora 18s ease-in-out infinite',
        brilhar: 'brilhar 6s linear infinite',
        marquee: 'marquee 40s linear infinite',
        girar: 'girar 30s linear infinite',
      },
    },
  },
  plugins: [],
};
export default config;
