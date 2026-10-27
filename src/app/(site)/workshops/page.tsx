'use client';

import { useState } from 'react';
import { useAtelie } from '@/lib/store';
import { itemServico } from '@/lib/servico';
import { WORKSHOPS, dataBR } from '@/data/servicos';
import { brl, cn } from '@/lib/format';

export default function WorkshopsPage() {
  const { inscritos, carrinho, set, abrirCarrinho } = useAtelie();
  const [qtd, setQtd] = useState<Record<string, number>>({});
  return (
    <div className="secao py-14">
      <div className="mx-auto max-w-3xl text-center">
        <p className="kicker">Workshops no ateliê</p>
        <h1 className="titulo-secao mt-2">Aprenda com Rafael, <em className="texto-ouro">mãos nas flores</em></h1>
        <p className="mt-4 text-marrom/75">Turmas pequenas, flores da estação, material incluso e você leva sua criação para casa.</p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {WORKSHOPS.map((w) => {
          const noCarrinho = carrinho.filter((i) => i.tipo === 'workshop' && i.produtoId === w.id).reduce((s, i) => s + Number(i.meta?.qtd ?? 1), 0);
          const vagas = Math.max(0, w.vagas - (inscritos[w.id] ?? 0) - noCarrinho);
          const q = Math.min(qtd[w.id] ?? 1, Math.max(1, vagas));
          return (
            <article key={w.id} className="moldura flex flex-col p-6">
              <span className="text-5xl">{w.emoji}</span>
              <p className="kicker mt-3">{dataBR(w.data)} · {w.hora} · {w.duracao}</p>
              <h2 className="mt-1 font-serif text-2xl">{w.nome}</h2>
              <p className="mt-2 flex-1 text-sm text-marrom/70">{w.descricao}</p>
              <div className="mt-3 flex gap-1">{Array.from({ length: w.vagas }).map((_, i) => <span key={i} className={cn('h-2 flex-1 rounded-full', i < w.vagas - vagas ? 'bg-ouro' : 'bg-areia')} />)}</div>
              <p className={cn('mt-1 text-sm', vagas <= 2 ? 'text-rosa' : 'text-marrom/70')} data-vagas={vagas}>{vagas === 0 ? 'Turma lotada' : `${vagas} vaga(s) de ${w.vagas}`}</p>
              <p className="texto-ouro mt-2 font-serif text-3xl">{brl(w.preco)}</p>
              <div className="mt-4 flex items-center gap-2">
                <select className="campo w-20" aria-label="Ingressos" disabled={vagas === 0} value={q} onChange={(e) => setQtd({ ...qtd, [w.id]: +e.target.value })}>{Array.from({ length: Math.max(1, Math.min(4, vagas)) }, (_, i) => i + 1).map((n) => <option key={n}>{n}</option>)}</select>
                <button className="btn-ouro flex-1" disabled={vagas === 0} onClick={() => { set('carrinho', (c) => [...c, itemServico({ tipo: 'workshop', id: w.id, nome: `Workshop · ${w.nome}`, emoji: w.emoji, preco: w.preco * q, detalhe: `${q} ingresso(s) · ${dataBR(w.data)} às ${w.hora}`, data: w.data, meta: { qtd: q } })]); abrirCarrinho(true); }}>{vagas === 0 ? 'Lotado' : 'Comprar ingresso'}</button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
