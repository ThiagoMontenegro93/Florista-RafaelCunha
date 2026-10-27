'use client';

import type { Produto } from '@/data/produtos';
import { brl } from '@/lib/format';

export function ProductCard({ p, onPersonalizar }: { p: Produto; onPersonalizar: (p: Produto) => void }) {
  return (
    <article className="group moldura flex flex-col overflow-hidden p-5 transition duration-500 hover:-translate-y-1.5 hover:shadow-brilho" id={p.id}>
      <div className="relative flex aspect-[4/3] items-center justify-center rounded-[24px]" style={{ background: `radial-gradient(circle at 30% 20%, ${p.gradiente[0]}66, transparent 55%), radial-gradient(circle at 80% 85%, ${p.gradiente[1]}88, transparent 60%), linear-gradient(160deg,rgb(var(--halo)),rgb(var(--creme)))` }}>
        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-veu/40 text-5xl backdrop-blur transition duration-500 group-hover:scale-110" style={{ boxShadow: '0 0 0 1px rgba(238,217,168,.5), 0 0 0 7px rgba(201,163,95,.08), 0 0 50px -6px rgba(238,217,168,.45)' }}>
          {p.emoji}
        </div>
        {p.badge && (
          <span className={`etiqueta absolute left-3 top-3 ${p.badge === 'BEST SELLER' ? '!bg-ouro !text-tinta' : ''}`}>{p.badge}</span>
        )}
      </div>
      <p className="mt-5 text-[10px] uppercase tracking-[0.3em] text-salvia">{p.categoria}</p>
      <h3 className="mt-1 font-serif text-2xl leading-tight">{p.nome}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-marrom/55">{p.descricao}</p>
      <div className="mt-auto flex items-end justify-between pt-4">
        <div>
          <p className="texto-ouro font-serif text-3xl">{brl(p.preco)}</p>
          <p className="text-xs text-marrom/60">Confecção {p.prazo} · entrega a combinar</p>
        </div>
      </div>
      <button className="btn-ouro mt-4 w-full" onClick={() => onPersonalizar(p)}>Personalizar e Encomendar</button>
    </article>
  );
}
