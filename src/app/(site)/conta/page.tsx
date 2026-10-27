'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAtelie, TIMELINE_PEDIDO, proximoAniversario } from '@/lib/store';
import { dataBR } from '@/data/servicos';
import { GuiaCuidados } from '@/components/GuiaCuidados';
import { brl } from '@/lib/format';

export default function ContaPage() {
  const { pedidos, assinatura, creditos, avaliacoes } = useAtelie();
  const casamento = pedidos.find((p) => p.dataCasamento);
  const aniv = casamento?.dataCasamento ? proximoAniversario(casamento.dataCasamento) : null;
  const [guia, setGuia] = useState<string[] | null>(null);
  return (
    <div className="secao py-14">
      <p className="kicker">Minha conta</p>
      <h1 className="titulo-secao mt-2">Meus <em className="texto-ouro">buquês</em></h1>
      {assinatura && <p className="mt-4 text-sm">Assinatura {assinatura.plano} · {assinatura.status} · <Link href="/assinaturas" className="text-ouro underline">gerenciar</Link></p>}
      {aniv && casamento && (
        <div className="moldura mt-6 flex flex-wrap items-center gap-4 p-5">
          <span className="text-4xl">💍</span>
          <div className="flex-1">
            <p className="font-serif text-xl">{aniv.anos > 0 ? `${aniv.anos}º aniversário de casamento` : 'Seu casamento'} em {dataBR(aniv.data)}</p>
            <p className="text-sm text-marrom/60">{aniv.dias === 0 ? 'É hoje! Felicidades 🥂' : `Faltam ${aniv.dias} dias.`} Recrie o seu buquê em versão de mesa para comemorar.</p>
          </div>
          <Link href="/loja" className="btn-ouro">Recriar meu buquê</Link>
        </div>
      )}
      {Object.keys(creditos).length > 0 && (
        <p className="mt-4 rounded-xl border border-ouro/30 bg-ouro/[.06] p-3 text-sm">🎁 Créditos disponíveis: {Object.entries(creditos).map(([c, v]) => <strong key={c} className="mr-3 text-champanhe">{c} ({brl(v)})</strong>)}</p>
      )}
      <div className="mt-8 space-y-4">
        {pedidos.length === 0 && <p className="text-marrom/60">Nenhum pedido ainda. <Link className="text-ouro underline" href="/loja">Conheça a loja</Link>.</p>}
        {pedidos.map((p) => (
          <div key={p.numero} className="moldura flex flex-wrap items-center gap-4 p-5">
            <span className="text-3xl">{p.itens[0]?.emoji}</span>
            <div className="flex-1">
              <p className="font-serif text-xl">#{p.numero} · {p.itens.map((i) => i.nome).join(', ')}</p>
              <p className="text-sm text-marrom/60">{new Date(p.data).toLocaleDateString('pt-BR')} · {brl(p.total)} · {TIMELINE_PEDIDO[p.status]}</p>
            </div>
            <Link href={`/pedido/${p.numero}`} className="btn-linha">Acompanhar</Link>
            {p.status === TIMELINE_PEDIDO.length - 1 && !avaliacoes.some((a) => a.pedido === p.numero) && <Link href={`/avaliar/${p.numero}`} className="btn-linha">Avaliar ★</Link>}
            <button className="btn-ouro" onClick={() => setGuia(p.itens.map((i) => i.produtoId))}>Ver cuidados desse buquê</button>
          </div>
        ))}
      </div>
      {guia && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-overlay/45 p-4" onClick={() => setGuia(null)}>
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-moldura bg-creme" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-end p-3"><button onClick={() => setGuia(null)} aria-label="Fechar">✕</button></div>
            <GuiaCuidados produtoIds={guia} />
          </div>
        </div>
      )}
    </div>
  );
}
