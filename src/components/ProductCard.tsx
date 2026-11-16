'use client';

import { fotoProduto, formaProduto, type Produto } from '@/data/produtos';
import { brl } from '@/lib/format';
import { FotoArranjo } from './Foto';

export function ProductCard({ p, onPersonalizar }: { p: Produto; onPersonalizar: (p: Produto) => void }) {
  return (
    <article className="group moldura flex flex-col overflow-hidden p-2.5 transition duration-500 hover:-translate-y-1.5 hover:shadow-brilho" id={p.id}>
      <div className="relative">
        <FotoArranjo
          imagem={fotoProduto(p)}
          alt={`${p.nome}: ${p.descricao}`}
          seed={p.id}
          flores={p.flores}
          paleta={p.paletas[0]}
          forma={formaProduto(p)}
          fundo={p.gradiente}
          className="aspect-[4/5] rounded-[26px]"
        />
        {p.badge && (
          <span className={`etiqueta absolute left-3 top-3 ${p.badge === 'BEST SELLER' ? '!bg-ouro !text-tinta' : ''}`}>{p.badge}</span>
        )}
        <span className="etiqueta absolute right-3 top-3">{p.prazo}</span>
        {/* paleta em amostras de tecido */}
        <div className="absolute bottom-3 left-3 flex -space-x-1.5" aria-label={`Paletas: ${p.paletas.join(', ')}`}>
          {p.paletas.map((nome) => <span key={nome} title={nome} className="h-5 w-5 rounded-full border-2 border-white/90 shadow" style={{ background: corPaleta(nome) }} />)}
        </div>
      </div>
      <div className="flex flex-1 flex-col px-3 pb-3 pt-4">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-[10px] uppercase tracking-[0.3em] text-salvia">{p.categoria}</p>
          <p className="texto-ouro font-serif text-2xl leading-none">{brl(p.preco)}</p>
        </div>
        <h3 className="mt-2 font-serif text-[26px] leading-[1.05]">{p.nome}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-marrom/60">{p.descricao}</p>
        <p className="mt-3 text-xs text-marrom/60">Confecção {p.prazo} · entrega a combinar</p>
        <span className="min-h-4 flex-1" />
        <button className="btn-ouro w-full" onClick={() => onPersonalizar(p)}>Personalizar e Encomendar</button>
      </div>
    </article>
  );
}

const CORES: Record<string, string> = {
  'Branco puro': 'linear-gradient(135deg,#FFFFFF,#E9DCC6)',
  'Amarelo+Azul assinatura': 'linear-gradient(135deg,#F2C94C 50%,#6F92C9 50%)',
  'Rosa queimado': 'linear-gradient(135deg,#F6D3CF,#C98C88)',
  Marsala: 'linear-gradient(135deg,#C77880,#6E2433)',
  'Roxo orquídea': 'linear-gradient(135deg,#E3CDEB,#8E4FA6)',
  'Vermelho paixão': 'linear-gradient(135deg,#E0505A,#7E1022)',
};
export const corPaleta = (nome: string) => CORES[nome] ?? '#eee';
