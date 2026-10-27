'use client';

import type { Bioma } from '@/data/flores';

// Mapa estilizado em line art dourada (não cartográfico) — regiões/biomas e UFs do Sudeste.
const REGIOES: { nome: Bioma; pts: string; label: [number, number] }[] = [
  { nome: 'Amazônia', pts: '60,80 110,40 170,30 215,55 240,50 255,95 235,130 225,170 150,185 95,175 40,150 25,110', label: [140, 110] },
  { nome: 'Nordeste', pts: '240,50 290,85 345,110 370,140 355,185 320,215 290,225 260,200 235,170 235,130 255,95', label: [300, 150] },
  { nome: 'Centro-Oeste', pts: '150,185 225,170 235,170 260,200 255,250 225,290 185,295 160,260 140,220', label: [200, 235] },
  { nome: 'Sudeste', pts: '260,200 290,225 320,215 315,255 295,290 255,310 225,300 225,290 255,250', label: [278, 255] },
  { nome: 'Sul', pts: '225,300 255,310 240,340 215,380 190,370 185,330 185,295 225,290', label: [215, 335] },
];

const UFS_SE: { sigla: string; pts: string; label: [number, number] }[] = [
  { sigla: 'MG', pts: '262,212 300,230 300,262 270,272 250,258 258,230', label: [276, 246] },
  { sigla: 'ES', pts: '300,230 318,222 314,256 300,262', label: [308, 244] },
  { sigla: 'SP', pts: '250,258 270,272 278,290 252,304 228,296 238,272', label: [254, 285] },
  { sigla: 'RJ', pts: '270,272 300,262 308,276 286,292 278,290', label: [290, 279] },
];

export function MapaBrasil({
  modo = 'biomas', selecionado, onSelect, ufsAtivas = ['RJ'], className = '',
}: { modo?: 'biomas' | 'ufs'; selecionado?: string | null; onSelect?: (v: string) => void; ufsAtivas?: string[]; className?: string }) {
  return (
    <svg viewBox="10 20 375 375" className={className} role="img" aria-label="Mapa do Brasil em line art">
      <defs><linearGradient id="ouroMapa" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#EED9A8" /><stop offset="1" stopColor="#9E7A3E" /></linearGradient></defs>
      {REGIOES.map((r) => {
        const ativo = modo === 'biomas' && selecionado === r.nome;
        return (
          <g key={r.nome} onClick={() => modo === 'biomas' && onSelect?.(r.nome)} className={modo === 'biomas' ? 'cursor-pointer' : ''}>
            <polygon points={r.pts} fill={ativo ? 'url(#ouroMapa)' : 'rgba(201,163,95,.04)'} fillOpacity={ativo ? 0.55 : 1} stroke="#C9A35F" style={ativo ? { filter: 'drop-shadow(0 0 10px rgba(238,217,168,.6))' } : undefined} strokeWidth={ativo ? 1.8 : 1} strokeLinejoin="round" className="transition-all hover:fill-[rgba(201,163,95,.15)]" />
            {modo === 'biomas' && <text x={r.label[0]} y={r.label[1]} textAnchor="middle" fontSize="11" fill="rgb(var(--champanhe))" fontFamily="'Cormorant Garamond', serif" fontStyle="italic">{r.nome}</text>}
          </g>
        );
      })}
      {modo === 'ufs' &&
        UFS_SE.map((u) => {
          const on = ufsAtivas.includes(u.sigla);
          return (
            <g key={u.sigla} onClick={() => onSelect?.(u.sigla)} className="cursor-pointer">
              <polygon points={u.pts} fill={on ? 'url(#ouroMapa)' : 'rgba(201,163,95,.04)'} stroke="#C9A35F" strokeWidth="1" strokeDasharray={on ? undefined : '3 2'} />
              <text x={u.label[0]} y={u.label[1] + 3} textAnchor="middle" fontSize="8" fill={on ? 'rgb(var(--tinta))' : 'rgb(var(--champanhe))'} fontWeight="600">{u.sigla}</text>
            </g>
          );
        })}
      {/* rosa dos ventos */}
      <g transform="translate(50 330)" stroke="#C9A35F" fill="none" strokeWidth=".8">
        <circle r="14" /><path d="M0 -20 L3 0 L0 20 L-3 0Z M-20 0 L0 3 L20 0 L0 -3Z" fill="#B08D57" fillOpacity=".25" />
        <text y="-24" textAnchor="middle" fontSize="8" fill="#B08D57" stroke="none">N</text>
      </g>
    </svg>
  );
}
