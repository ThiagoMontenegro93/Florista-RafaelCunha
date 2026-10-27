import type { SVGProps } from 'react';

/** Ramo de eucalipto em line art dourada — usado como divisor de seções. */
export function RamoEucalipto({ className = '', ...p }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 220 40" fill="none" stroke="#C9A35F" strokeWidth="1" strokeLinecap="round" className={className} aria-hidden {...p}>
      <path d="M4 20 C 60 18, 160 22, 216 20" />
      {[24, 48, 72, 96, 120, 144, 168, 192].map((x, i) => (
        <g key={x}>
          <ellipse cx={x} cy={i % 2 ? 12 : 28} rx="7" ry="5" transform={`rotate(${i % 2 ? -25 : 25} ${x} ${i % 2 ? 12 : 28})`} />
          <path d={`M${x} ${i % 2 ? 16 : 24} L${x - 2} 20`} />
        </g>
      ))}
    </svg>
  );
}

export function Divisor({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 py-2 ${className}`}>
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-ouro/60" />
      <RamoEucalipto className="h-6 w-40" />
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-ouro/60" />
    </div>
  );
}

/** Selo de cera dourado "Atelier Floral". */
export function SeloCera({ size = 92, className = '' }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={`drop-shadow-[0_0_18px_rgba(238,217,168,.35)] ${className}`} aria-label="Selo Atelier Floral">
      <defs>
        <radialGradient id="cera" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#E3C78F" />
          <stop offset="55%" stopColor="#B08D57" />
          <stop offset="100%" stopColor="#7E6234" />
        </radialGradient>
        <path id="arco" d="M50 50 m-31 0 a31 31 0 1 1 62 0 a31 31 0 1 1 -62 0" />
      </defs>
      <path d="M50 4 C62 6 70 2 78 12 C88 18 98 28 95 44 C99 58 92 70 86 80 C76 92 62 98 50 96 C36 99 22 92 14 82 C4 72 2 58 5 44 C3 30 12 16 24 10 C32 4 42 6 50 4Z" fill="url(#cera)" />
      <circle cx="50" cy="50" r="38" fill="none" stroke="#FFF1E8" strokeOpacity=".55" strokeWidth=".8" />
      <text fontSize="7.4" fill="#FFF8EE" letterSpacing="2.4" fontFamily="Inter, sans-serif">
        <textPath href="#arco" startOffset="2%">ATELIER FLORAL · RAFAEL CUNHA ·</textPath>
      </text>
      <text x="50" y="58" textAnchor="middle" fontSize="22" fill="#FFF8EE" fontFamily="'Great Vibes', cursive">RC</text>
    </svg>
  );
}

/** Pétalas caindo — CSS puro, desligado com prefers-reduced-motion. */
export function Petalas({ qtd = 14 }: { qtd?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: qtd }).map((_, i) => {
        const size = 8 + ((i * 7) % 10);
        return (
          <span
            key={i}
            className="petala"
            style={{
              left: `${(i * 73) % 100}%`,
              width: size,
              height: size,
              background: i % 3 === 0 ? '#F5E6D3' : i % 3 === 1 ? '#F3C9C4' : '#FFF1E8',
              opacity: 0.7,
              animationDuration: `${11 + ((i * 5) % 9)}s`,
              animationDelay: `${(i * 1.3) % 10}s`,
            }}
          />
        );
      })}
    </div>
  );
}

type IconeNome = 'tesoura' | 'regador' | 'fita' | 'vaso' | 'gota' | 'sol' | 'borrifo' | 'polen' | 'raiz' | 'camera' | 'cadeado' | 'mao' | 'caminhao' | 'folha';

const paths: Record<IconeNome, JSX.Element> = {
  tesoura: <><circle cx="6" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><path d="M8.5 7.5 20 18M8.5 16.5 20 6" /></>,
  regador: <><path d="M4 10h11v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" /><path d="M15 12l5-5M18 5l3 3M7 10V7a3 3 0 0 1 6 0" /></>,
  fita: <><path d="M12 9c-3-5-8-4-8-1s5 3 8 1zm0 0c3-5 8-4 8-1s-5 3-8 1z" /><path d="M12 9l-3 12M12 9l3 12" /></>,
  vaso: <><path d="M8 3h8M9 3c0 4-3 5-3 10a6 6 0 0 0 12 0c0-5-3-6-3-10" /></>,
  gota: <path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z" />,
  sol: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5" /></>,
  borrifo: <><path d="M9 8h6v12H9zM10 8V5h4v3M15 6h3" /><path d="M20 3v.01M21 6v.01M20 9v.01" /></>,
  polen: <><circle cx="12" cy="12" r="2" /><path d="M12 10V4M14 12h6M12 14v6M10 12H4" /><circle cx="12" cy="4" r="1" /><circle cx="20" cy="12" r="1" /></>,
  raiz: <><path d="M12 3v9M12 12c-2 2-5 3-6 7M12 12c2 2 5 3 6 7M12 12v9" /></>,
  camera: <><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></>,
  cadeado: <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>,
  mao: <><path d="M7 11V5a1.5 1.5 0 0 1 3 0v5M10 10V4a1.5 1.5 0 0 1 3 0v6M13 10V5a1.5 1.5 0 0 1 3 0v7M16 12V8a1.5 1.5 0 0 1 3 0v6a7 7 0 0 1-7 7h-1a6 6 0 0 1-5-3l-2.5-4a1.5 1.5 0 0 1 2.5-1.5L7 14" /></>,
  caminhao: <><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="1.8" /><circle cx="17" cy="18" r="1.8" /></>,
  folha: <><path d="M5 19C5 10 11 5 20 4c-1 9-6 15-15 15z" /><path d="M5 19 14 10" /></>,
};

export function Icone({ nome, className = 'h-5 w-5' }: { nome: IconeNome; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {paths[nome]}
    </svg>
  );
}

/** Círculo duplo dourado com monograma — placeholder elegante da foto do Rafael. */
export function RetratoRafael({ size = 112, foto }: { size?: number; foto?: string }) {
  return (
    <div className="relative shrink-0 rounded-full p-1.5" style={{ width: size, height: size, background: 'conic-gradient(from 140deg,#E3C78F,#B08D57,#E3C78F,#96763F,#E3C78F)' }}>
      <div className="h-full w-full rounded-full bg-creme p-1 shadow-[0_0_40px_-8px_rgba(238,217,168,.55)]">
        <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border border-ouro/60 bg-[radial-gradient(circle_at_35%_30%,rgb(var(--blush)),rgb(var(--creme)))]">
          {foto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={foto} alt="Rafael Cunha" className="h-full w-full object-cover" />
          ) : (
            <span className="texto-ouro font-script" style={{ fontSize: size * 0.34 }}>RC</span>
          )}
        </div>
      </div>
    </div>
  );
}
