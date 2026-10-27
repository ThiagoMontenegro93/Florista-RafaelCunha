'use client';

import { useState } from 'react';
import { useAtelie } from '@/lib/store';
import { itemServico } from '@/lib/servico';
import { PECAS, dataBR, diasEntre, disponivel, hojeISO, type ReservaAluguel } from '@/data/servicos';
import { brl, cn } from '@/lib/format';

export default function AluguelPage() {
  const { reservas, carrinho, set, abrirCarrinho } = useAtelie();
  const [inicio, setInicio] = useState('');
  const [fim, setFim] = useState('');
  const [qtd, setQtd] = useState<Record<string, number>>({});
  const periodoOk = inicio && fim && fim >= inicio && inicio >= hojeISO();
  const dias = periodoOk ? diasEntre(inicio, fim) : 0;
  // itens já no carrinho também ocupam estoque
  const noCarrinho: ReservaAluguel[] = carrinho.filter((i) => i.tipo === 'aluguel').map((i) => ({ pecaId: i.produtoId, inicio: String(i.meta?.inicio), fim: String(i.meta?.fim), qtd: Number(i.meta?.qtd ?? 1) }));

  return (
    <div className="secao py-14">
      <p className="kicker">Aluguel de peças</p>
      <h1 className="titulo-secao mt-2">Arcos, candelabros e vasos <em className="texto-ouro">do acervo do ateliê</em></h1>
      <p className="mt-3 max-w-2xl text-marrom/75">As mesmas peças dos casamentos do Rafael, para quem faz a própria decoração. Diária por peça, caução devolvida após a conferência.</p>
      <div className="moldura mt-8 grid gap-3 p-5 sm:grid-cols-3">
        <div><label className="rotulo">Retirada</label><input type="date" min={hojeISO()} className="campo" value={inicio} onChange={(e) => setInicio(e.target.value)} /></div>
        <div><label className="rotulo">Devolução</label><input type="date" min={inicio || hojeISO()} className="campo" value={fim} onChange={(e) => setFim(e.target.value)} /></div>
        <div className="flex items-end text-sm">{periodoOk ? <p><strong>{dias}</strong> diária(s) · {dataBR(inicio)} a {dataBR(fim)}</p> : <p className="text-marrom/60">Escolha o período para ver a disponibilidade.</p>}</div>
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PECAS.map((p) => {
          const livre = periodoOk ? disponivel(p.id, inicio, fim, [...reservas, ...noCarrinho]) : p.estoque;
          const q = Math.min(qtd[p.id] ?? 1, Math.max(1, livre));
          const aluguel = p.preco * q * Math.max(1, dias);
          const caucao = p.caucao * q;
          return (
            <article key={p.id} className="moldura flex flex-col p-5">
              <div className="flex items-center gap-3"><span className="text-4xl">{p.emoji}</span><div><h2 className="font-serif text-xl leading-tight">{p.nome}</h2><p className="text-xs text-marrom/60">{brl(p.preco)}/dia · caução {brl(p.caucao)}</p></div></div>
              <p className={cn('mt-3 text-sm', livre === 0 ? 'text-rosa' : 'text-salvia')} data-livre={livre}>{periodoOk ? (livre === 0 ? 'Indisponível no período' : `${livre} disponível(is) no período`) : `Acervo: ${p.estoque} un.`}</p>
              <div className="mt-auto flex items-center gap-2 pt-4">
                <select className="campo w-20" aria-label="Quantidade" value={q} disabled={!periodoOk || livre === 0} onChange={(e) => setQtd({ ...qtd, [p.id]: +e.target.value })}>{Array.from({ length: Math.max(1, livre) }, (_, i) => i + 1).map((n) => <option key={n}>{n}</option>)}</select>
                <button className="btn-ouro flex-1 !px-3" disabled={!periodoOk || livre === 0} onClick={() => { set('carrinho', (c) => [...c, itemServico({ tipo: 'aluguel', id: p.id, nome: `Aluguel · ${p.nome}`, emoji: p.emoji, preco: aluguel + caucao, detalhe: `${q} un. · ${dataBR(inicio)} a ${dataBR(fim)} · ${brl(aluguel)} + caução ${brl(caucao)} (devolvida)`, data: inicio, meta: { qtd: q, inicio, fim, caucao } })]); abrirCarrinho(true); }}>
                  {periodoOk ? `Reservar · ${brl(aluguel + caucao)}` : 'Escolha as datas'}
                </button>
              </div>
            </article>
          );
        })}
      </div>
      <p className="mt-8 text-sm text-marrom/60">Retirada e devolução no ateliê. Montagem no local disponível sob orçamento. Peças danificadas são descontadas da caução.</p>
    </div>
  );
}
