'use client';

/**
 * Efeitos que remetem ao ofício do florista: pétalas caindo, ramo que cresce e desabrocha,
 * fita que se desenha, explosão de pétalas ao encomendar e o processo "do campo ao laço".
 * Tudo em SVG/CSS, sem bibliotecas, e desligado com prefers-reduced-motion.
 */

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/format';
import { Revelar } from './Foto';

const PETALA_D = 'M12 1 C 19 5, 23 14, 18 21 C 15 25, 9 25, 6 21 C 1 14, 5 5, 12 1 Z';
const VEIO_D = 'M12 4 C 11 10, 11 16, 12 22';

/** Observa quando o elemento entra na tela (uma vez só). */
function useVisivel<T extends Element>(margem = '0px 0px -10% 0px') {
  const ref = useRef<T>(null);
  const [visivel, setVisivel] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) { setVisivel(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisivel(true); io.disconnect(); } }, { rootMargin: margem });
    io.observe(el);
    return () => io.disconnect();
  }, [margem]);
  return [ref, visivel] as const;
}

/* ───────────── Pétalas caindo ───────────── */

const TONS = [
  ['#FFF4EE', '#F2BFC0'],
  ['#FFFFFF', '#EBD9C8'],
  ['#FBE3E3', '#D99A9E'],
  ['#FFF7E3', '#EBCB8B'],
];

/** Pétalas de rosa em SVG que caem girando e balançando ao vento. Pausam fora da tela. */
export function PetalasVivas({ qtd = 16 }: { qtd?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([e]) => el.classList.toggle('pausado', !e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="petalas-vivas pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: qtd }).map((_, i) => {
        const [c1, c2] = TONS[i % TONS.length];
        const tam = 12 + ((i * 7) % 12);
        return (
          <span
            key={i}
            className="pv-queda"
            style={{ left: `${(i * 61 + 7) % 100}%`, animationDuration: `${13 + ((i * 5) % 10)}s`, animationDelay: `${-((i * 1.7) % 14)}s` }}
          >
            <span className="pv-vento" style={{ animationDuration: `${3 + (i % 4)}s`, animationDelay: `${-(i % 3)}s` }}>
              <svg viewBox="0 0 24 26" width={tam} height={tam} className="pv-giro" style={{ animationDuration: `${4 + (i % 5)}s` }}>
                <defs>
                  <radialGradient id={`pv${i}`} cx="45%" cy="30%" r="80%">
                    <stop offset="0%" stopColor={c1} />
                    <stop offset="100%" stopColor={c2} />
                  </radialGradient>
                </defs>
                <path d={PETALA_D} fill={`url(#pv${i})`} />
                <path d={VEIO_D} fill="none" stroke={c2} strokeOpacity=".5" strokeWidth=".6" />
              </svg>
            </span>
          </span>
        );
      })}
    </div>
  );
}

/* ───────────── Ramo que cresce e desabrocha ───────────── */

const FOLHA_D = 'M0 0 C 6 -9, 17 -9, 22 0 C 17 6, 6 6, 0 0 Z';

/** Divisor vivo: o caule se desenha dos dois lados, as folhas brotam e a flor do centro desabrocha. */
export function RamoCrescendo({ className = '' }: { className?: string }) {
  const [ref, vivo] = useVisivel<HTMLDivElement>();
  // folhas: [x, y, ângulo, atraso]
  const folhas: [number, number, number, number][] = [
    [128, 30, -150, 0.35], [104, 33, 160, 0.55], [80, 31, -160, 0.75], [56, 34, 165, 0.95], [34, 33, -170, 1.1],
    [192, 30, -30, 0.35], [216, 33, 20, 0.55], [240, 31, -20, 0.75], [264, 34, 15, 0.95], [286, 33, -10, 1.1],
  ];
  return (
    <div ref={ref} className={cn('flex items-center justify-center py-4', className)} aria-hidden>
      <svg viewBox="0 0 320 60" className={cn('ramo h-14 w-[min(420px,90vw)] overflow-visible', vivo && 'vivo')}>
        <path className="caule" pathLength={1} d="M160 30 C 130 28, 110 36, 80 32 S 30 34, 6 32" />
        <path className="caule" pathLength={1} d="M160 30 C 190 28, 210 36, 240 32 S 290 34, 314 32" />
        {folhas.map(([x, y, a, d], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${a})`}>
            <path className="folha" d={FOLHA_D} style={{ transitionDelay: `${d}s` }} />
            <path className="folha nervura" d="M2 0 L 19 0" style={{ transitionDelay: `${d}s` }} />
          </g>
        ))}
        <g className="flor">
          {[0, 72, 144, 216, 288].map((a, i) => (
            <g key={a} transform={`translate(160 30) rotate(${a})`}>
              <path className="petalo" d="M0 0 C -9 -4, -8 -16, 0 -17 C 8 -16, 9 -4, 0 0 Z" style={{ transitionDelay: `${1.25 + i * 0.08}s` }} />
            </g>
          ))}
          <circle className="miolo" cx="160" cy="30" r="3.4" />
        </g>
      </svg>
    </div>
  );
}

/* ───────────── Fita que se desenha ───────────── */

/** Fita de cetim dourada, desenhada à mão sob um título, com um laço no fim. */
export function FitaDourada({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 420 46" className={cn('fita overflow-visible', className)} aria-hidden>
      <defs>
        <linearGradient id="fita-ouro" x1="0" x2="1">
          <stop offset="0%" style={{ stopColor: 'var(--ouro-1)' }} />
          <stop offset="45%" style={{ stopColor: 'var(--ouro-4)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--ouro-2)' }} />
        </linearGradient>
      </defs>
      <path pathLength={1} d="M4 30 C 70 18, 150 40, 230 24 S 330 18, 350 26 C 362 31, 372 22, 366 14 C 360 6, 344 14, 352 24 C 358 32, 376 34, 390 26 M352 24 C 346 34, 340 40, 332 44 M356 26 C 364 34, 370 40, 380 43" />
    </svg>
  );
}

/* ───────────── Explosão de pétalas ───────────── */

function reduzido() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

/** Solta um punhado de pétalas a partir de um ponto da tela. */
export function explodirPetalas(x: number, y: number, qtd = 18) {
  if (typeof document === 'undefined' || reduzido()) return;
  const raiz = document.createElement('div');
  raiz.setAttribute('aria-hidden', 'true');
  raiz.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden';
  document.body.appendChild(raiz);
  let vivas = qtd;
  for (let i = 0; i < qtd; i++) {
    const [c1, c2] = TONS[i % TONS.length];
    const tam = 14 + Math.random() * 14;
    const el = document.createElement('span');
    el.style.cssText = `position:absolute;left:${x - tam / 2}px;top:${y - tam / 2}px;width:${tam}px;height:${tam}px`;
    el.innerHTML = `<svg viewBox="0 0 24 26" width="${tam}" height="${tam}"><path d="${PETALA_D}" fill="${c2}"/><path d="${PETALA_D}" fill="${c1}" transform="scale(.7) translate(5 3)"/></svg>`;
    raiz.appendChild(el);
    const ang = (-90 + (Math.random() - 0.5) * 150) * (Math.PI / 180);
    const forca = 70 + Math.random() * 110;
    const dx = Math.cos(ang) * forca;
    const dy = Math.sin(ang) * forca;
    const giro = (Math.random() - 0.5) * 720;
    const anim = el.animate(
      [
        { transform: 'translate(0,0) rotate(0deg) scale(.4)', opacity: 0 },
        { transform: `translate(${dx * 0.7}px,${dy * 0.7}px) rotate(${giro * 0.4}deg) scale(1)`, opacity: 1, offset: 0.25 },
        { transform: `translate(${dx}px,${dy + 160}px) rotate(${giro}deg) scale(.9)`, opacity: 0 },
      ],
      { duration: 1300 + Math.random() * 700, easing: 'cubic-bezier(.2,.7,.4,1)', fill: 'forwards' },
    );
    anim.onfinish = () => { if (--vivas === 0) raiz.remove(); };
  }
}

/** Escuta cliques em qualquer elemento com `data-petalas` e solta pétalas no ponto do clique. */
export function EfeitosOficio() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const alvo = (e.target as HTMLElement | null)?.closest?.('[data-petalas]') as HTMLElement | null;
      if (!alvo || (alvo as HTMLButtonElement).disabled) return;
      let { clientX: x, clientY: y } = e;
      if (!x && !y) { const r = alvo.getBoundingClientRect(); x = r.left + r.width / 2; y = r.top + r.height / 2; }
      explodirPetalas(x, y);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);
  return null;
}

/* ───────────── Do campo ao laço ───────────── */

const ETAPAS: { titulo: string; texto: string; icone: React.ReactNode }[] = [
  {
    titulo: 'Colheita na serra',
    texto: 'Flores da estação escolhidas uma a uma com produtores de Petrópolis, Friburgo e Holambra.',
    icone: (
      <>
        <path pathLength={1} className="tracar" d="M32 60 C 31 46, 26 34, 20 24 M32 60 C 32 44, 33 30, 32 16 M32 60 C 34 46, 40 34, 46 26" />
        <path pathLength={1} className="tracar" d="M20 24 m-6 0 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0 M32 16 m-7 0 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0 M46 26 m-5 0 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0" />
        <path pathLength={1} className="tracar" d="M28 48 C 22 46, 18 42, 17 38 C 23 39, 27 43, 28 48 M35 44 C 41 41, 45 38, 47 34 C 41 34, 37 38, 35 44" />
      </>
    ),
  },
  {
    titulo: 'Corte e hidratação',
    texto: 'Haste cortada em diagonal, sob água, e descanso de horas no frio antes de qualquer montagem.',
    icone: (
      <g className="tesoura">
        <g className="lamina-a"><path pathLength={1} className="tracar" d="M32 34 L 52 10 M22 48 m-7 0 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0 M27 43 L 32 34" /></g>
        <g className="lamina-b"><path pathLength={1} className="tracar" d="M32 34 L 12 10 M42 48 m-7 0 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0 M37 43 L 32 34" /></g>
        <circle cx="32" cy="34" r="1.6" className="pino" />
      </g>
    ),
  },
  {
    titulo: 'Montagem em espiral',
    texto: 'Haste por haste, girando o buquê na mão. Sem espuma floral, para a flor beber água de verdade.',
    icone: (
      <>
        <path pathLength={1} className="tracar" d="M14 12 L 40 58 M50 12 L 24 58 M24 8 L 36 58 M40 8 L 28 58 M32 6 L 32 58" />
        <path pathLength={1} className="tracar" d="M22 38 C 26 42, 38 42, 42 38" />
        <path pathLength={1} className="tracar" d="M14 12 m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0 M50 12 m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0 M32 6 m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0" />
      </>
    ),
  },
  {
    titulo: 'Laço e selo do ateliê',
    texto: 'Fita de cetim, tag dourada com QR dos cuidados e o selo RC. Pronto para a sua história.',
    icone: (
      <>
        <path pathLength={1} className="tracar" d="M32 30 C 20 16, 6 20, 10 32 C 13 40, 26 36, 32 30 C 38 36, 51 40, 54 32 C 58 20, 44 16, 32 30 Z" />
        <path pathLength={1} className="tracar" d="M30 32 C 26 42, 22 50, 18 58 M34 32 C 38 42, 42 50, 46 58" />
        <circle cx="32" cy="30" r="3" className="pino" />
      </>
    ),
  },
];

/** Seção que conta o ofício em quatro gestos, com ícones que se desenham ao rolar. */
export function ProcessoOficio() {
  const [ref, vivo] = useVisivel<HTMLDivElement>('0px 0px -20% 0px');
  return (
    <section className="secao py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="kicker justify-center">O ofício</p>
        <h2 className="titulo-secao mt-2">Do campo <em className="texto-ouro">ao laço</em></h2>
        <p className="mt-4 text-sm text-marrom/70">Cada arranjo passa pelas mãos do Rafael em quatro gestos que não têm atalho.</p>
      </div>
      <div ref={ref} className={cn('oficio relative mt-14', vivo && 'vivo')}>
        {/* caule que liga as etapas */}
        <svg className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-12 hidden h-6 w-[75%] overflow-visible lg:block" viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden>
          <path className="caule-oficio" pathLength={1} d="M0 12 C 50 2, 100 22, 150 12 S 250 2, 300 12" vectorEffect="non-scaling-stroke" />
        </svg>
        <ol className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {ETAPAS.map((e, i) => (
            <li key={e.titulo}>
              <Revelar atraso={i * 220} className="etapa text-center">
                <div className="medalhao-oficio mx-auto">
                  <svg viewBox="0 0 64 64" className="h-14 w-14" aria-hidden>{e.icone}</svg>
                  <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#EBD3A0] to-[#B48A45] font-serif text-sm text-tinta shadow-brilho">{i + 1}</span>
                </div>
                <h3 className="mt-5 font-serif text-2xl">{e.titulo}</h3>
                <p className="mx-auto mt-2 max-w-[260px] text-sm text-marrom/70">{e.texto}</p>
              </Revelar>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
