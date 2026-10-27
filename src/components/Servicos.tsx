'use client';

import Link from 'next/link';
import { useAtelie } from '@/lib/store';
import { PRE_VENDAS, SERVICOS, dataBR, hojeISO, vagasPreVenda } from '@/data/servicos';
import { brl } from '@/lib/format';

/** Faixa da pré-venda mais próxima ainda aberta. */
export function PreVendaBanner() {
  const { capacidades, vendidos, pronto } = useAtelie();
  const p = PRE_VENDAS.find((x) => hojeISO() <= x.abreAte);
  if (!p || !pronto) return null;
  const vagas = vagasPreVenda(p.id, capacidades, vendidos);
  return (
    <section className="secao pt-10">
      <Link href="/pre-venda" className="moldura group flex flex-wrap items-center justify-between gap-4 p-5 transition hover:shadow-brilho">
        <span className="flex items-center gap-4"><span className="text-4xl">{p.emoji}</span><span><span className="kicker block">Pré-venda {p.nome}</span><span className="font-serif text-2xl">{p.produto} · {brl(p.preco)}</span></span></span>
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
        {SERVICOS.map((s) => (
          <Link key={s.href} href={s.href} className="moldura p-5 text-center transition hover:-translate-y-1 hover:shadow-brilho">
            <span className="text-3xl">{s.e}</span>
            <p className="mt-2 font-serif text-lg leading-tight">{s.label}</p>
            <p className="text-xs text-marrom/60">{s.d}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
