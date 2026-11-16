'use client';

import { useId } from 'react';

/* ──────────────────────────────────────────────────────────────
   Arte botânica em SVG: desenha arranjos com as flores reais de
   cada produto (rosas, hortênsias, lírios, orquídeas, lisianthus,
   girassóis, eucalipto, tango, astromélias, capim-dourado) na
   paleta escolhida. É o "still" de estúdio enquanto a foto real
   não é cadastrada: quando `imagem` existe, <Foto> mostra a foto.
   ────────────────────────────────────────────────────────────── */

export type Forma = 'buque' | 'cascata' | 'vaso-baixo' | 'vaso' | 'pedestal' | 'caixa' | 'cesta' | 'coracao' | 'arco';

type Tipo = 'rosa' | 'hortensia' | 'lirio' | 'orquidea' | 'lisianthus' | 'girassol' | 'astromelia' | 'flor5';

// ── utilidades determinísticas ──
function rng(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const hex = (c: string) => { const n = parseInt(c.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
export function mix(a: string, b: string, t: number) {
  const x = hex(a), y = hex(b);
  return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('');
}
const f = (n: number) => Math.round(n * 10) / 10;

// ── cores de cada flor por paleta ──
const COR_ROSA: Record<string, [string, string]> = {
  'Branco puro': ['#FFFDF8', '#E9DCC6'],
  'Amarelo+Azul assinatura': ['#FFF4D6', '#E8C66A'],
  'Rosa queimado': ['#F6D3CF', '#C98C88'],
  Marsala: ['#C77880', '#6E2433'],
  'Roxo orquídea': ['#F1E2F2', '#B58BC0'],
  'Vermelho paixão': ['#E0505A', '#7E1022'],
};

const FLOR: Record<string, { tipo: Tipo; cores?: [string, string]; folhagem?: 'eucalipto' | 'tango' | 'capim' }> = {
  rosa: { tipo: 'rosa' },
  lisianthus: { tipo: 'lisianthus', cores: ['#FFFFFF', '#D9CBE6'] },
  'hortensia-azul': { tipo: 'hortensia', cores: ['#DCE8F7', '#6F92C9'] },
  'lirio-amarelo': { tipo: 'lirio', cores: ['#FFF3B8', '#EDB72E'] },
  'orquidea-roxa': { tipo: 'orquidea', cores: ['#F1DDF3', '#8E4FA6'] },
  girassol: { tipo: 'girassol', cores: ['#FFD54A', '#E39A12'] },
  astromelia: { tipo: 'astromelia', cores: ['#FFE0D2', '#E9805E'] },
  eucalipto: { tipo: 'flor5', folhagem: 'eucalipto' },
  tango: { tipo: 'flor5', folhagem: 'tango' },
  'capim-dourado': { tipo: 'flor5', folhagem: 'capim' },
};

/** Gerenciador de gradientes por instância (ids únicos com useId). */
function criarDefs(uid: string) {
  const defs: JSX.Element[] = [];
  const mapa = new Map<string, string>();
  const radial = (c1: string, c2: string, cx = 50, cy = 50, r = 60) => {
    const k = `r${c1}${c2}${cx}${cy}${r}`;
    if (!mapa.has(k)) {
      const id = `${uid}g${mapa.size}`;
      mapa.set(k, id);
      defs.push(
        <radialGradient key={id} id={id} cx={`${cx}%`} cy={`${cy}%`} r={`${r}%`}>
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </radialGradient>,
      );
    }
    return `url(#${mapa.get(k)})`;
  };
  const linear = (c1: string, c2: string, vertical = true) => {
    const k = `l${c1}${c2}${vertical}`;
    if (!mapa.has(k)) {
      const id = `${uid}g${mapa.size}`;
      mapa.set(k, id);
      defs.push(
        <linearGradient key={id} id={id} x1="0" y1="0" x2={vertical ? 0 : 1} y2={vertical ? 1 : 0}>
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>,
      );
    }
    return `url(#${mapa.get(k)})`;
  };
  return { defs, radial, linear };
}
type Defs = ReturnType<typeof criarDefs>;

// ── primitivas ──
const petala = (w: number, l: number) => `M0 0 C ${f(-w)} ${f(-l * 0.25)} ${f(-w * 0.95)} ${f(-l * 0.92)} 0 ${f(-l)} C ${f(w * 0.95)} ${f(-l * 0.92)} ${f(w)} ${f(-l * 0.25)} 0 0Z`;
const pontuda = (w: number, l: number) => `M0 0 Q ${f(-w)} ${f(-l * 0.45)} 0 ${f(-l)} Q ${f(w)} ${f(-l * 0.45)} 0 0Z`;
const folhaPath = (w: number, l: number) => `M0 0 Q ${f(w)} ${f(-l * 0.5)} 0 ${f(-l)} Q ${f(-w)} ${f(-l * 0.5)} 0 0Z`;

function Rosa({ x, y, r, cores, rot, d }: { x: number; y: number; r: number; cores: [string, string]; rot: number; d: Defs }) {
  const [claro, escuro] = cores;
  const gExt = d.radial(mix(escuro, claro, 0.35), claro, 50, 50, 70);
  const gMeio = d.radial(escuro, mix(claro, escuro, 0.15), 50, 45, 75);
  const sombra = mix(escuro, '#2a1a10', 0.35);
  return (
    <g transform={`translate(${f(x)} ${f(y)}) rotate(${f(rot)})`}>
      <circle r={r * 0.82} fill={mix(escuro, '#3b2a20', 0.45)} opacity=".22" transform="translate(1 3)" />
      {Array.from({ length: 6 }).map((_, i) => (
        <path key={'a' + i} d={petala(r * 0.62, r)} transform={`rotate(${i * 60 + 12})`} fill={gExt} stroke={mix(escuro, claro, 0.2)} strokeWidth=".6" strokeOpacity=".55" />
      ))}
      {Array.from({ length: 5 }).map((_, i) => (
        <path key={'b' + i} d={petala(r * 0.5, r * 0.74)} transform={`rotate(${i * 72 + 40})`} fill={gExt} stroke={mix(escuro, claro, 0.1)} strokeWidth=".6" strokeOpacity=".6" />
      ))}
      <circle r={r * 0.46} fill={gMeio} />
      {/* espiral do miolo */}
      <path d={`M ${f(-r * 0.32)} ${f(r * 0.05)} C ${f(-r * 0.3)} ${f(-r * 0.36)} ${f(r * 0.32)} ${f(-r * 0.36)} ${f(r * 0.3)} ${f(r * 0.02)} C ${f(r * 0.26)} ${f(r * 0.3)} ${f(-r * 0.16)} ${f(r * 0.3)} ${f(-r * 0.15)} ${f(r * 0.02)} C ${f(-r * 0.12)} ${f(-r * 0.16)} ${f(r * 0.14)} ${f(-r * 0.16)} ${f(r * 0.12)} ${f(r * 0.04)}`} fill="none" stroke={sombra} strokeOpacity=".55" strokeWidth={f(Math.max(0.8, r * 0.035))} strokeLinecap="round" />
      <path d={`M ${f(-r * 0.42)} ${f(r * 0.18)} Q 0 ${f(r * 0.5)} ${f(r * 0.42)} ${f(r * 0.16)}`} fill="none" stroke={claro} strokeOpacity=".7" strokeWidth={f(Math.max(0.8, r * 0.04))} />
      <ellipse rx={r * 0.42} ry={r * 0.28} cx={-r * 0.18} cy={-r * 0.42} fill="#fff" opacity=".18" />
    </g>
  );
}

function Hortensia({ x, y, r, cores, rand, d }: { x: number; y: number; r: number; cores: [string, string]; rand: () => number; d: Defs }) {
  const [claro, escuro] = cores;
  const florzinhas = Array.from({ length: Math.round(r * 0.75) }).map((_, i) => {
    const a = i * 2.39996 + rand() * 0.4;
    const dist = Math.sqrt((i + 0.5) / (r * 0.75)) * r * 0.86;
    return { fx: Math.cos(a) * dist, fy: Math.sin(a) * dist, t: rand(), rot: rand() * 90, s: r * (0.17 + rand() * 0.05) };
  }).sort((a, b) => a.fy - b.fy);
  return (
    <g transform={`translate(${f(x)} ${f(y)})`}>
      <circle r={r * 0.82} fill={d.radial(escuro, mix(escuro, '#1d2340', 0.4), 40, 35, 70)} opacity=".85" />
      {florzinhas.map((p, i) => {
        const c = mix(claro, escuro, 0.15 + p.t * 0.55 + (p.fy / r) * 0.2);
        return (
          <g key={i} transform={`translate(${f(p.fx)} ${f(p.fy)}) rotate(${f(p.rot)})`}>
            {[0, 90, 180, 270].map((a) => (
              <ellipse key={a} cx="0" cy={f(-p.s * 0.55)} rx={f(p.s * 0.45)} ry={f(p.s * 0.6)} transform={`rotate(${a})`} fill={c} stroke={mix(c, '#1d2340', 0.25)} strokeWidth=".4" strokeOpacity=".5" />
            ))}
            <circle r={f(p.s * 0.14)} fill={mix(escuro, '#ffffff', 0.5)} />
          </g>
        );
      })}
      <ellipse rx={r * 0.5} ry={r * 0.32} cx={-r * 0.25} cy={-r * 0.45} fill="#fff" opacity=".14" />
    </g>
  );
}

function Lirio({ x, y, r, cores, rot, d }: { x: number; y: number; r: number; cores: [string, string]; rot: number; d: Defs }) {
  const [claro, escuro] = cores;
  const g = d.radial(escuro, claro, 50, 100, 95);
  return (
    <g transform={`translate(${f(x)} ${f(y)}) rotate(${f(rot)})`}>
      {[0, 60, 120, 180, 240, 300].map((a, i) => (
        <g key={a} transform={`rotate(${a + (i % 2 ? 6 : 0)})`}>
          <path d={pontuda(r * (i % 2 ? 0.3 : 0.36), r * (i % 2 ? 0.95 : 1.05))} fill={g} stroke={mix(escuro, '#7a4a10', 0.3)} strokeWidth=".6" strokeOpacity=".5" />
          <path d={`M0 ${f(-r * 0.1)} L0 ${f(-r * 0.8)}`} stroke={mix(escuro, '#a05a10', 0.4)} strokeWidth=".8" strokeOpacity=".5" />
          {[0.3, 0.42, 0.55].map((k) => <circle key={k} cx={f(r * 0.05)} cy={f(-r * k)} r={f(r * 0.022)} fill="#9a3d1a" opacity=".6" />)}
        </g>
      ))}
      <circle r={r * 0.12} fill={mix(escuro, '#5f7a2a', 0.5)} />
      {[15, 75, 135, 195, 255, 315].map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          <path d={`M0 0 Q ${f(r * 0.06)} ${f(-r * 0.3)} 0 ${f(-r * 0.52)}`} stroke="#d9e3a2" strokeWidth=".9" fill="none" />
          <ellipse cy={f(-r * 0.55)} rx={f(r * 0.035)} ry={f(r * 0.07)} fill="#8a3a12" />
        </g>
      ))}
    </g>
  );
}

function Orquidea({ x, y, r, cores, rot, d }: { x: number; y: number; r: number; cores: [string, string]; rot: number; d: Defs }) {
  const [claro, escuro] = cores;
  const g = d.radial(mix(claro, escuro, 0.25), claro, 50, 90, 90);
  return (
    <g transform={`translate(${f(x)} ${f(y)}) rotate(${f(rot)})`}>
      {[0, 125, 235].map((a) => <path key={a} d={pontuda(r * 0.28, r * 0.95)} transform={`rotate(${a})`} fill={g} stroke={escuro} strokeOpacity=".25" strokeWidth=".5" />)}
      {[62, 298].map((a) => <path key={a} d={petala(r * 0.52, r * 0.9)} transform={`rotate(${a})`} fill={g} stroke={escuro} strokeOpacity=".25" strokeWidth=".5" />)}
      {/* labelo */}
      <path d={`M ${f(-r * 0.3)} ${f(r * 0.05)} C ${f(-r * 0.45)} ${f(r * 0.6)} ${f(r * 0.45)} ${f(r * 0.6)} ${f(r * 0.3)} ${f(r * 0.05)} C ${f(r * 0.15)} ${f(r * 0.2)} ${f(-r * 0.15)} ${f(r * 0.2)} ${f(-r * 0.3)} ${f(r * 0.05)}Z`} fill={d.radial(mix(escuro, '#3a0f40', 0.35), escuro, 50, 20, 80)} />
      <path d={`M ${f(-r * 0.12)} ${f(r * 0.12)} Q 0 ${f(r * 0.32)} ${f(r * 0.12)} ${f(r * 0.12)}`} stroke="#FFE27A" strokeWidth={f(r * 0.05)} fill="none" strokeLinecap="round" />
      <ellipse cy={f(-r * 0.02)} rx={f(r * 0.08)} ry={f(r * 0.13)} fill="#fffaf2" />
    </g>
  );
}

function Lisianthus({ x, y, r, cores, rot, d }: { x: number; y: number; r: number; cores: [string, string]; rot: number; d: Defs }) {
  const [claro, escuro] = cores;
  const g = d.radial(mix(claro, '#e9f0d8', 0.4), escuro, 50, 95, 110);
  return (
    <g transform={`translate(${f(x)} ${f(y)}) rotate(${f(rot)})`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <path key={i} d={`M0 0 C ${f(-r * 0.75)} ${f(-r * 0.2)} ${f(-r * 0.7)} ${f(-r * 0.95)} ${f(-r * 0.25)} ${f(-r * 0.98)} Q 0 ${f(-r * 0.88)} ${f(r * 0.22)} ${f(-r * 1.0)} C ${f(r * 0.7)} ${f(-r * 0.95)} ${f(r * 0.75)} ${f(-r * 0.2)} 0 0Z`} transform={`rotate(${i * 72})`} fill={g} stroke={mix(escuro, '#5a4a6a', 0.3)} strokeWidth=".5" strokeOpacity=".45" />
      ))}
      <circle r={r * 0.28} fill={d.radial('#f4f7e6', '#c9d6a3')} />
      {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cy={f(-r * 0.12)} rx={f(r * 0.03)} ry={f(r * 0.08)} transform={`rotate(${a})`} fill="#c7a93f" />)}
    </g>
  );
}

function Girassol({ x, y, r, cores, rot, d }: { x: number; y: number; r: number; cores: [string, string]; rot: number; d: Defs }) {
  const [claro, escuro] = cores;
  const g = d.linear(escuro, claro);
  return (
    <g transform={`translate(${f(x)} ${f(y)}) rotate(${f(rot)})`}>
      {Array.from({ length: 22 }).map((_, i) => <path key={'p' + i} d={pontuda(r * 0.15, r)} transform={`rotate(${i * 16.36 + 8})`} fill={escuro} />)}
      {Array.from({ length: 22 }).map((_, i) => <path key={'q' + i} d={pontuda(r * 0.14, r * 0.9)} transform={`rotate(${i * 16.36})`} fill={g} stroke="#b06d08" strokeWidth=".4" strokeOpacity=".5" />)}
      <circle r={r * 0.42} fill={d.radial('#7a4a1a', '#2e1a0c', 45, 40, 70)} />
      {Array.from({ length: 34 }).map((_, i) => {
        const a = i * 2.39996, dd = Math.sqrt(i / 34) * r * 0.36;
        return <circle key={i} cx={f(Math.cos(a) * dd)} cy={f(Math.sin(a) * dd)} r={f(r * 0.025)} fill="#c88a2c" opacity=".55" />;
      })}
    </g>
  );
}

function Astromelia({ x, y, r, cores, rot, d }: { x: number; y: number; r: number; cores: [string, string]; rot: number; d: Defs }) {
  const [claro, escuro] = cores;
  const g = d.radial('#FFF6C9', mix(claro, escuro, 0.6), 50, 100, 100);
  return (
    <g transform={`translate(${f(x)} ${f(y)}) rotate(${f(rot)})`}>
      {[0, 60, 120, 180, 240, 300].map((a, i) => (
        <g key={a} transform={`rotate(${a})`}>
          <path d={petala(r * (i % 2 ? 0.32 : 0.4), r * (i % 2 ? 0.85 : 1))} fill={g} stroke={escuro} strokeOpacity=".3" strokeWidth=".5" />
          {i % 2 === 1 && [0.35, 0.48, 0.6].map((k) => <path key={k} d={`M ${f(-r * 0.04)} ${f(-r * k)} l ${f(r * 0.04)} ${f(-r * 0.05)}`} stroke="#5a2a20" strokeWidth=".9" strokeLinecap="round" />)}
        </g>
      ))}
      <circle r={r * 0.1} fill="#e7e2a5" />
    </g>
  );
}

function Flor5({ x, y, r, cores, rot, d }: { x: number; y: number; r: number; cores: [string, string]; rot: number; d: Defs }) {
  const [claro, escuro] = cores;
  const g = d.radial(mix(escuro, claro, 0.2), claro, 50, 95, 100);
  return (
    <g transform={`translate(${f(x)} ${f(y)}) rotate(${f(rot)})`}>
      {Array.from({ length: 5 }).map((_, i) => <path key={i} d={petala(r * 0.5, r)} transform={`rotate(${i * 72})`} fill={g} stroke={escuro} strokeOpacity=".3" strokeWidth=".6" />)}
      <circle r={r * 0.18} fill={mix(escuro, '#4a3010', 0.4)} />
    </g>
  );
}

function desenharFlor(tipo: Tipo, p: { x: number; y: number; r: number; cores: [string, string]; rot: number; d: Defs; rand: () => number }, key: string | number) {
  switch (tipo) {
    case 'rosa': return <g key={key}>{Rosa(p)}</g>;
    case 'hortensia': return <g key={key}>{Hortensia(p)}</g>;
    case 'lirio': return <g key={key}>{Lirio(p)}</g>;
    case 'orquidea': return <g key={key}>{Orquidea(p)}</g>;
    case 'lisianthus': return <g key={key}>{Lisianthus(p)}</g>;
    case 'girassol': return <g key={key}>{Girassol(p)}</g>;
    case 'astromelia': return <g key={key}>{Astromelia(p)}</g>;
    default: return <g key={key}>{Flor5(p)}</g>;
  }
}

// ── folhagens ──
function RamoEucalipto({ x, y, ang, l, rand, d }: { x: number; y: number; ang: number; l: number; rand: () => number; d: Defs }) {
  const folhas = Math.round(l / 16);
  const g = d.radial('#C9D8D1', '#7E9A92', 35, 30, 80);
  return (
    <g transform={`translate(${f(x)} ${f(y)}) rotate(${f(ang)})`}>
      <path d={`M0 0 Q ${f(l * 0.08)} ${f(-l * 0.5)} 0 ${f(-l)}`} stroke="#7a6a58" strokeWidth="1.2" fill="none" />
      {Array.from({ length: folhas }).map((_, i) => {
        const t = (i + 1) / (folhas + 1);
        const s = 9 * (1.1 - t * 0.5) + rand() * 2;
        const lado = i % 2 ? 1 : -1;
        return <ellipse key={i} cx={f(lado * s * 0.8 + l * 0.04 * Math.sin(t * 3))} cy={f(-l * t)} rx={f(s)} ry={f(s * 0.85)} fill={g} stroke="#6d8a80" strokeWidth=".5" strokeOpacity=".6" />;
      })}
    </g>
  );
}

function Folha({ x, y, ang, l, d, cor = ['#6E8B5E', '#3E5A38'] }: { x: number; y: number; ang: number; l: number; d: Defs; cor?: [string, string] }) {
  return (
    <g transform={`translate(${f(x)} ${f(y)}) rotate(${f(ang)})`}>
      <path d={folhaPath(l * 0.26, l)} fill={d.linear(cor[0], cor[1])} stroke="#2f4a2a" strokeOpacity=".35" strokeWidth=".6" />
      <path d={`M0 0 L0 ${f(-l * 0.92)}`} stroke="#c6d4a8" strokeOpacity=".5" strokeWidth=".7" />
    </g>
  );
}

function Tango({ x, y, ang, l, rand }: { x: number; y: number; ang: number; l: number; rand: () => number }) {
  return (
    <g transform={`translate(${f(x)} ${f(y)}) rotate(${f(ang)})`}>
      <path d={`M0 0 L0 ${f(-l)}`} stroke="#7d8c46" strokeWidth="1" />
      {Array.from({ length: 5 }).map((_, i) => {
        const yy = -l * (0.45 + i * 0.12), lado = i % 2 ? 1 : -1;
        return (
          <g key={i}>
            <path d={`M0 ${f(yy)} q ${f(lado * 8)} -4 ${f(lado * 14)} -10`} stroke="#8d9a4c" strokeWidth=".7" fill="none" />
            {Array.from({ length: 6 }).map((_, k) => <circle key={k} cx={f(lado * (3 + k * 2.2))} cy={f(yy - k * 1.6 - rand() * 2)} r={f(1.3 + rand())} fill={k % 2 ? '#F2C230' : '#E5A91B'} />)}
          </g>
        );
      })}
    </g>
  );
}

function Capim({ x, y, ang, l }: { x: number; y: number; ang: number; l: number }) {
  return (
    <g transform={`translate(${f(x)} ${f(y)}) rotate(${f(ang)})`}>
      <path d={`M0 0 Q ${f(l * 0.15)} ${f(-l * 0.6)} ${f(l * 0.05)} ${f(-l)}`} stroke="#C99A3B" strokeWidth=".9" fill="none" />
      <circle cx={f(l * 0.05)} cy={f(-l)} r="3" fill="#E7C46A" stroke="#a87a22" strokeWidth=".5" />
    </g>
  );
}

// ── composição ──
type Props = {
  seed: string;
  flores: string[];
  paleta?: string;
  forma?: Forma;
  fundo?: [string, string];
  className?: string;
  titulo?: string;
};

export function ArteArranjo({ seed, flores, paleta = 'Branco puro', forma = 'buque', fundo = ['#FFFFFF', '#F5E6D3'], className = '', titulo }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const d = criarDefs(uid);
  const rand = rng(seed);
  const W = 400, H = 500;

  // geometria da "copa" por forma
  const geo = {
    buque: { cx: 200, cy: 215, rx: 118, ry: 100 },
    cascata: { cx: 200, cy: 200, rx: 112, ry: 90 },
    coracao: { cx: 200, cy: 210, rx: 140, ry: 130 },
    'vaso-baixo': { cx: 200, cy: 270, rx: 165, ry: 78 },
    vaso: { cx: 200, cy: 200, rx: 125, ry: 105 },
    pedestal: { cx: 200, cy: 175, rx: 140, ry: 95 },
    caixa: { cx: 200, cy: 250, rx: 120, ry: 62 },
    cesta: { cx: 200, cy: 240, rx: 110, ry: 62 },
    arco: { cx: 200, cy: 250, rx: 175, ry: 175 },
  }[forma];

  const cabecas = flores.filter((s) => FLOR[s] && !FLOR[s].folhagem);
  const lista = cabecas.length ? cabecas : ['rosa'];
  const temEuc = flores.includes('eucalipto');
  const temTango = flores.includes('tango');
  const temCapim = flores.includes('capim-dourado');

  const coresDe = (slug: string): [string, string] => {
    const fl = FLOR[slug];
    if (fl?.tipo === 'rosa') return COR_ROSA[paleta] ?? COR_ROSA['Branco puro'];
    if (slug === 'hortensia-azul' && paleta === 'Branco puro') return ['#FFFFFF', '#CFD9C8'];
    return fl?.cores ?? ['#FFF', '#ddd'];
  };

  // posições: espiral áurea dentro da elipse (ou coração), flores de trás primeiro
  const n = forma === 'vaso-baixo' ? 20 : forma === 'arco' ? 24 : forma === 'caixa' || forma === 'cesta' ? 13 : forma === 'coracao' ? 22 : 19;
  type Cab = { x: number; y: number; r: number; slug: string; rot: number };
  const cab: Cab[] = [];
  for (let i = 0; i < n; i++) {
    let px: number, py: number;
    if (forma === 'arco') {
      const t = i / (n - 1);
      const a = Math.PI * (1 - t);
      const rr = 150 + (rand() - 0.5) * 30;
      px = 200 + Math.cos(a) * rr;
      py = 300 - Math.sin(a) * rr * 1.05;
    } else if (forma === 'coracao') {
      // amostragem dentro do coração: (x²+y²-1)³ - x²y³ < 0
      let hx = 0, hy = 0;
      for (let k = 0; k < 60; k++) {
        hx = rand() * 2.4 - 1.2; hy = rand() * 2.4 - 1.1;
        if (Math.pow(hx * hx + hy * hy - 1, 3) - hx * hx * hy * hy * hy < -0.02) break;
      }
      px = geo.cx + hx * 112;
      py = geo.cy - hy * 100 - 10;
    } else {
      const a = i * 2.39996 + rand() * 0.3;
      const dist = Math.sqrt((i + 0.6) / n) * 0.92;
      px = geo.cx + Math.cos(a) * geo.rx * dist;
      py = geo.cy + Math.sin(a) * geo.ry * dist;
    }
    // primeira flor da lista domina (60%), as outras dividem o resto
    const slug = lista.length === 1 || rand() < 0.5 ? lista[0] : lista[1 + Math.floor(rand() * (lista.length - 1))];
    const tipo = FLOR[slug].tipo;
    const base = tipo === 'hortensia' ? 44 : tipo === 'girassol' ? 40 : tipo === 'lirio' ? 42 : tipo === 'orquidea' ? 30 : tipo === 'astromelia' ? 24 : tipo === 'lisianthus' ? 28 : 33;
    const escala = forma === 'caixa' || forma === 'cesta' ? 0.85 : forma === 'arco' ? 0.72 : forma === 'coracao' ? 0.82 : 1;
    cab.push({ x: px, y: py, r: base * escala * (0.85 + rand() * 0.3), slug, rot: rand() * 360 });
  }
  cab.sort((a, b) => a.y - b.y);

  // folhagem atrás da copa
  const atras: JSX.Element[] = [];
  const folhasN = forma === 'arco' ? 18 : 12;
  for (let i = 0; i < folhasN; i++) {
    const a = forma === 'arco' ? Math.PI * (i / (folhasN - 1)) : (i / folhasN) * Math.PI * 2 + rand() * 0.3;
    const ex = forma === 'arco' ? 200 - Math.cos(a) * 150 : geo.cx + Math.cos(a) * geo.rx * 0.82;
    const ey = forma === 'arco' ? 300 - Math.sin(a) * 158 : geo.cy + Math.sin(a) * geo.ry * 0.82;
    const ang = (Math.atan2(ey - geo.cy, ex - geo.cx) * 180) / Math.PI + 90 + (rand() - 0.5) * 30;
    if (temEuc && i % 2 === 0) atras.push(<g key={'e' + i}>{RamoEucalipto({ x: ex, y: ey, ang: ang, l: 60 + rand() * 30, rand: rand, d: d })}</g>);
    else atras.push(<g key={'f' + i}>{Folha({ x: ex, y: ey, ang: ang, l: 46 + rand() * 24, d: d })}</g>);
  }
  if (temTango) for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + 0.4;
    atras.push(<g key={'t' + i}>{Tango({ x: geo.cx + Math.cos(a) * geo.rx * 0.7, y: geo.cy + Math.sin(a) * geo.ry * 0.7, ang: (a * 180) / Math.PI + 90, l: 58, rand: rand })}</g>);
  }
  if (temCapim) for (let i = 0; i < 9; i++) {
    const a = -Math.PI / 2 + (i - 4) * 0.32;
    atras.push(<g key={'c' + i}>{Capim({ x: geo.cx + Math.cos(a) * geo.rx * 0.55, y: geo.cy + Math.sin(a) * geo.ry * 0.55, ang: (a * 180) / Math.PI + 90, l: 70 + rand() * 20 })}</g>);
  }

  // base / suporte
  const fita = paleta === 'Vermelho paixão' ? ['#B0303C', '#6E1420'] : paleta === 'Marsala' ? ['#8A3040', '#4E1420'] : ['#FFF8EE', '#D9C4A0'];
  const base: JSX.Element[] = [];
  const frente: JSX.Element[] = [];
  if (forma === 'buque' || forma === 'cascata' || forma === 'coracao') {
    // hastes reunidas + amarração em cetim
    for (let i = 0; i < 9; i++) {
      const sx = 200 + (i - 4) * 4.5;
      base.push(<path key={'h' + i} d={`M ${f(200 + (i - 4) * 12)} 300 Q ${f(sx)} 360 ${f(200 + (i - 4) * 3)} 470`} stroke={i % 2 ? '#6B8450' : '#56703F'} strokeWidth="5" fill="none" strokeLinecap="round" />);
    }
    frente.push(
      <g key="fita">
        <path d="M168 352 L232 352 L228 400 L172 400Z" fill={d.linear(fita[0], fita[1], false)} />
        <path d="M168 352 L232 352 L231 362 L169 362Z" fill="#fff" opacity=".25" />
        <path d="M200 372 C 170 350 150 362 160 384 C 170 400 190 386 200 376Z" fill={d.linear(fita[0], fita[1])} stroke={fita[1]} strokeWidth=".6" />
        <path d="M200 372 C 230 350 250 362 240 384 C 230 400 210 386 200 376Z" fill={d.linear(fita[0], fita[1])} stroke={fita[1]} strokeWidth=".6" />
        <path d="M196 376 Q 186 420 176 452 L 188 448 L 194 458 Q 200 420 203 378Z" fill={d.linear(fita[0], fita[1])} />
        <path d="M204 376 Q 216 418 230 446 L 218 444 L 214 454 Q 204 420 199 378Z" fill={d.linear(fita[0], fita[1])} opacity=".9" />
        <circle cx="200" cy="375" r="7" fill={fita[1]} />
        <ellipse cx="197" cy="372" rx="3" ry="2" fill="#fff" opacity=".4" />
      </g>,
    );
    if (forma === 'cascata') {
      for (let i = 0; i < 7; i++) {
        const yy = 290 + i * 26, xx = 200 + Math.sin(i * 1.3) * 26;
        frente.push(desenharFlor('orquidea', { x: xx, y: yy, r: 26 - i * 1.6, cores: FLOR['orquidea-roxa'].cores!, rot: rand() * 360, d, rand }, 'cz' + i));
        if (i % 2 === 0) frente.push(<g key={'cf' + i}>{Folha({ x: xx - 18, y: yy, ang: 200, l: 34, d: d })}</g>);
      }
    }
  } else if (forma === 'vaso-baixo') {
    base.push(
      <g key="vb">
        <ellipse cx="200" cy="300" rx="150" ry="16" fill="#cfe0e6" opacity=".5" />
        <path d="M60 300 L340 300 L326 388 Q200 402 74 388Z" fill={d.linear('#F4FAFC', '#BFD5DC')} opacity=".75" stroke="#A9C3CB" strokeWidth="1" />
        <path d="M78 312 L96 382" stroke="#fff" strokeWidth="4" opacity=".6" strokeLinecap="round" />
        <path d="M74 370 Q200 384 326 370" stroke="#8fb4a0" strokeWidth="1.2" fill="none" opacity=".6" />
      </g>,
    );
  } else if (forma === 'vaso') {
    base.push(
      <g key="v">
        {Array.from({ length: 6 }).map((_, i) => <path key={i} d={`M ${190 + i * 4} 290 L ${192 + i * 3} 400`} stroke="#6f8a52" strokeWidth="3" opacity=".7" />)}
        <path d="M150 285 Q 140 340 160 420 Q 200 432 240 420 Q 260 340 250 285Z" fill={d.linear('#F6FBFC', '#BFD5DC')} opacity=".7" stroke="#A9C3CB" />
        <ellipse cx="200" cy="286" rx="50" ry="9" fill="none" stroke="#A9C3CB" />
        <path d="M162 300 Q 156 350 168 408" stroke="#fff" strokeWidth="4" opacity=".7" fill="none" strokeLinecap="round" />
        <path d="M152 340 Q 200 350 248 340" stroke="#9cc0b0" strokeWidth="1" opacity=".6" fill="none" />
      </g>,
    );
  } else if (forma === 'pedestal') {
    base.push(
      <g key="p">
        <path d="M110 250 Q 200 300 290 250 L 270 290 Q 200 320 130 290Z" fill={d.linear('#F2E3C4', '#B8924F')} stroke="#9a7a3e" strokeWidth=".8" />
        <rect x="186" y="300" width="28" height="110" fill={d.linear('#E9D6AE', '#A9844A', false)} />
        <path d="M150 410 L250 410 L262 440 L138 440Z" fill={d.linear('#F2E3C4', '#9a7a3e')} />
        <path d="M120 262 Q 200 296 280 262" stroke="#fff" strokeOpacity=".5" strokeWidth="2" fill="none" />
      </g>,
    );
    for (let i = 0; i < 6; i++) frente.push(<g key={'pe' + i}>{RamoEucalipto({ x: 140 + i * 24, y: 262, ang: 180 + (i - 2.5) * 14, l: 70 + rand() * 30, rand: rand, d: d })}</g>);
  } else if (forma === 'caixa') {
    base.push(
      <g key="cx">
        <path d="M95 260 L95 410 Q 200 440 305 410 L305 260Z" fill={d.linear('#7A2430', '#3E0E16', false)} />
        <ellipse cx="200" cy="260" rx="105" ry="22" fill="#4a1018" />
        <path d="M95 300 Q 200 330 305 300" stroke="#E7C46A" strokeWidth="5" fill="none" />
        <path d="M110 280 L110 400" stroke="#fff" strokeOpacity=".15" strokeWidth="6" />
        {[0, 1, 2, 3].map((i) => <rect key={i} x={130 + i * 38} y={392 + (i % 2) * 6} width="22" height="16" rx="5" fill="#5a3218" stroke="#E7C46A" strokeWidth=".8" />)}
      </g>,
    );
  } else if (forma === 'cesta') {
    base.push(
      <g key="ce">
        <path d="M100 250 Q 200 120 300 250" stroke="#B88A55" strokeWidth="9" fill="none" />
        <path d="M90 260 L110 400 Q 200 420 290 400 L310 260Z" fill={d.linear('#D9B07A', '#9C6A36')} />
        {Array.from({ length: 6 }).map((_, i) => <path key={i} d={`M ${94 + i * 0.5} ${280 + i * 22} Q 200 ${296 + i * 22} ${306 - i * 0.5} ${280 + i * 22}`} stroke="#8a5a2a" strokeOpacity=".5" strokeWidth="1.4" fill="none" />)}
        {Array.from({ length: 10 }).map((_, i) => <path key={'v' + i} d={`M ${110 + i * 20} 262 L ${116 + i * 19} 404`} stroke="#8a5a2a" strokeOpacity=".3" strokeWidth="1.2" />)}
        <rect x="150" y="300" width="44" height="60" rx="6" fill="#F7F1E6" stroke="#c9b58e" />
        <rect x="204" y="312" width="52" height="40" rx="6" fill="#6A3B1E" />
        <text x="172" y="334" textAnchor="middle" fontSize="9" fill="#8a6a3a" fontFamily="Georgia">café</text>
      </g>,
    );
  } else if (forma === 'arco') {
    base.push(
      <g key="ar">
        <path d="M60 470 L60 300 A140 150 0 0 1 340 300 L340 470" stroke={d.linear('#F2E3C4', '#B8924F')} strokeWidth="7" fill="none" />
        <rect x="40" y="462" width="40" height="12" rx="3" fill="#B8924F" />
        <rect x="320" y="462" width="40" height="12" rx="3" fill="#B8924F" />
        <path d="M150 470 L250 470" stroke="#e8dcc8" strokeWidth="3" />
      </g>,
    );
  }

  const flor = cab.map((c, i) => desenharFlor(FLOR[c.slug].tipo, { x: c.x, y: c.y, r: c.r, cores: coresDe(c.slug), rot: c.rot, d, rand }, i));

  const gFundo = d.radial(mix(fundo[0], '#ffffff', 0.55), mix(fundo[1], '#ffffff', 0.25), 38, 28, 95);
  const gChao = d.linear(mix(fundo[1], '#ffffff', 0.4), mix(fundo[1], '#8a6a4a', 0.35));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} role="img" aria-label={titulo ?? 'Ilustração do arranjo'} preserveAspectRatio="xMidYMid slice">
      <defs>
        {d.defs}
        <filter id={`${uid}s`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#3a2410" floodOpacity=".22" />
        </filter>
        <filter id={`${uid}b`}><feGaussianBlur stdDeviation="14" /></filter>
        <radialGradient id={`${uid}luz`} cx="22%" cy="12%" r="70%">
          <stop offset="0%" stopColor="#fff" stopOpacity=".55" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* fundo de estúdio: parede + mesa */}
      <rect width={W} height={H} fill={gFundo} />
      <rect y={H * 0.82} width={W} height={H * 0.18} fill={gChao} opacity=".28" />
      <ellipse cx="200" cy={forma === 'buque' || forma === 'cascata' || forma === 'coracao' ? 470 : 432} rx="150" ry="18" fill="#3a2410" opacity=".18" filter={`url(#${uid}b)`} />
      <g filter={`url(#${uid}s)`}>
        {base}
        {atras}
        {flor}
        {frente}
      </g>
      <rect width={W} height={H} fill={`url(#${uid}luz)`} />
    </svg>
  );
}

/** Uma flor isolada (Flores do Brasil). Usa a primitiva mais próxima da espécie. */
export function ArteFlor({ slug, cores, className = '', titulo }: { slug: string; cores: [string, string]; className?: string; titulo?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const d = criarDefs(uid);
  const rand = rng(slug);
  const fl = FLOR[slug];
  const tipo: Tipo = fl && !fl.folhagem ? fl.tipo : 'flor5';
  const c: [string, string] = fl?.cores ?? (slug === 'rosa' ? COR_ROSA['Rosa queimado'] : [mix(cores[0], '#ffffff', 0.3), cores[1]]);
  return (
    <svg viewBox="0 0 300 200" className={className} role="img" aria-label={titulo ?? slug} preserveAspectRatio="xMidYMid slice">
      <defs>
        {d.defs}
        <filter id={`${uid}s`}><feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#3a2410" floodOpacity=".25" /></filter>
      </defs>
      <g filter={`url(#${uid}s)`}>
        {fl?.folhagem === 'eucalipto' ? (
          <>
            <g>{RamoEucalipto({ x: 130, y: 200, ang: -18, l: 190, rand: rand, d: d })}</g>
            <g>{RamoEucalipto({ x: 170, y: 200, ang: 22, l: 170, rand: rand, d: d })}</g>
          </>
        ) : fl?.folhagem === 'tango' ? (
          <>
            <g>{Tango({ x: 130, y: 200, ang: -14, l: 160, rand: rand })}</g>
            <g>{Tango({ x: 175, y: 200, ang: 16, l: 150, rand: rand })}</g>
          </>
        ) : fl?.folhagem === 'capim' ? (
          Array.from({ length: 11 }).map((_, i) => <g key={i}>{Capim({ x: 150, y: 205, ang: (i - 5) * 9, l: 150 + rand() * 30 })}</g>)
        ) : (
          <>
            <g>{Folha({ x: 150, y: 200, ang: -40, l: 90, d: d })}</g>
            <g>{Folha({ x: 150, y: 200, ang: 45, l: 80, d: d })}</g>
            <path d="M150 200 L150 120" stroke="#56703F" strokeWidth="4" />
            {desenharFlor(tipo, { x: 150, y: 100, r: tipo === 'hortensia' ? 62 : tipo === 'orquidea' ? 52 : 58, cores: c, rot: rand() * 40 - 20, d, rand }, 'f')}
          </>
        )}
      </g>
    </svg>
  );
}
