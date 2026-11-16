'use client';

import Link from 'next/link';
import { useAtelie } from '@/lib/store';
import { PRE_VENDAS, SERVICOS, dataBR, hojeISO, vagasPreVenda } from '@/data/servicos';
import { brl } from '@/lib/format';
import { Icone } from './Ornamentos';
import { Revelar } from './Foto';

/** Faixa da pré-venda mais próxima ainda aberta. */
export function PreVendaBanner() {
  const { capacidades, vendidos, pronto } = useAtelie();
  const p = PRE_VENDAS.find((x) => hojeISO() <= x.abreAte);
  if (!p || !pronto) return null;
  const vagas = vagasPreVenda(p.id, capacidades, vendidos);
  return (
    <section className="secao pt-10">
      <Link href="/pre-venda" className="moldura group flex flex-wrap items-center justify-between gap-4 p-5 transition hover:shadow-brilho">
        <span className="flex items-center gap-4"><span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-champanhe/30 bg-gradient-to-br from-ouro/25 to-transparent text-2xl shadow-brilho">{p.emoji}</span><span><span className="kicker block">Pré-venda {p.nome}</span><span className="font-serif text-2xl">{p.produto} · {brl(p.preco)}</span></span></span>
        <span className="text-sm"><strong className={vagas <= 15 ? 'text-rosa' : 'text-champanhe'}>{vagas > 0 ? `Restam ${vagas} vagas` : 'Esgotado · lista de espera'}</strong> <span className="text-marrom/60">· entrega {dataBR(p.data)}</span> <span className="ml-2 text-champanhe transition group-hover:translate-x-1">→</span></span>
      </Link>
    </section>
  );
}

export function ServicosAtelie() {
  return (
    <section className="secao py-16">
      <div className="mb-10 text-center">
        <p className="kicker">Serviços do ateliê</p>
        <h2 className="titulo-secao mt-2">Muito além do <em className="texto-ouro">buquê</em></h2>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {SERVICOS.map((s, i) => (
          <Revelar key={s.href} atraso={(i % 4) * 80}>
            <Link href={s.href} className="moldura group flex h-full flex-col items-center p-6 text-center transition duration-500 hover:-translate-y-1.5 hover:shadow-brilho">
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-champanhe/30 bg-gradient-to-br from-ouro/25 to-transparent text-champanhe transition duration-500 group-hover:rotate-[8deg] group-hover:scale-110"><Icone nome={s.icone} className="h-6 w-6" /></span>
              <p className="mt-4 font-serif text-xl leading-tight">{s.label}</p>
              <p className="mt-1 text-xs text-marrom/60">{s.d}</p>
              <span className="mt-3 text-xs tracking-[0.2em] text-champanhe opacity-0 transition duration-500 group-hover:opacity-100">CONHECER →</span>
            </Link>
          </Revelar>
        ))}
      </div>
    </section>
  );
}
