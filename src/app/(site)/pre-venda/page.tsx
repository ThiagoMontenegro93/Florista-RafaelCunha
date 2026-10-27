'use client';

import { useEffect, useState } from 'react';
import { useAtelie } from '@/lib/store';
import { itemServico } from '@/lib/servico';
import { PRE_VENDAS, dataBR, hojeISO, vagasPreVenda } from '@/data/servicos';
import { brl, cn } from '@/lib/format';

function useAgora() {
  const [t, setT] = useState<number | null>(null);
  useEffect(() => { setT(Date.now()); const i = setInterval(() => setT(Date.now()), 1000); return () => clearInterval(i); }, []);
  return t;
}

function Contagem({ ate, agora }: { ate: string; agora: number | null }) {
  if (agora === null) return <span className="h-6" />;
  const ms = Math.max(0, +new Date(ate + 'T23:59:59') - agora);
  const d = Math.floor(ms / 86400000), h = Math.floor(ms / 3600000) % 24, m = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60;
  return (
    <div className="flex justify-center gap-2 tabular-nums">
      {[[d, 'dias'], [h, 'h'], [m, 'min'], [s, 's']].map(([v, l]) => <span key={l as string} className="min-w-[52px] rounded-xl border border-areia bg-vidro px-2 py-1 text-center"><span className="block font-serif text-2xl text-champanhe">{String(v).padStart(2, '0')}</span><span className="text-[10px] uppercase tracking-widest text-marrom/50">{l}</span></span>)}
    </div>
  );
}

export default function PreVendaPage() {
  const { capacidades, vendidos, set, abrirCarrinho, espera, carrinho } = useAtelie();
  const agora = useAgora();
  const [qtd, setQtd] = useState<Record<string, number>>({});
  const [lista, setLista] = useState<string | null>(null);
  const [f, setF] = useState({ nome: '', whatsapp: '' });
  const [ok, setOk] = useState('');

  return (
    <div className="secao py-14">
      <div className="mx-auto max-w-3xl text-center">
        <p className="kicker">Pré-venda das datas especiais</p>
        <h1 className="titulo-secao mt-2">Garanta antes que <em className="texto-ouro">esgote</em></h1>
        <p className="mt-4 text-marrom/75">Produção limitada para cada data. Quem reserva primeiro escolhe o horário de entrega e recebe as flores mais frescas do lote.</p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {PRE_VENDAS.map((p) => {
          const noCarrinho = carrinho.filter((i) => i.tipo === 'prevenda' && i.produtoId === p.id).reduce((s, i) => s + Number(i.meta?.qtd ?? 1), 0);
          const vagas = Math.max(0, vagasPreVenda(p.id, capacidades, vendidos) - noCarrinho);
          const cap = capacidades[p.id] ?? p.capacidade;
          const encerrada = hojeISO() > p.abreAte;
          const esgotado = vagas === 0 || encerrada;
          const q = Math.min(qtd[p.id] ?? 1, Math.max(1, vagas));
          const pct = Math.min(100, ((cap - vagas) / cap) * 100);
          return (
            <article key={p.id} className="moldura flex flex-col p-6 text-center">
              <span className="text-5xl">{p.emoji}</span>
              <p className="kicker mt-3">{p.nome} · entrega {dataBR(p.data)}</p>
              <h2 className="mt-1 font-serif text-2xl">{p.produto}</h2>
              <p className="mt-2 flex-1 text-sm text-marrom/70">{p.descricao}</p>
              <p className="texto-ouro mt-3 font-serif text-3xl">{brl(p.preco)}</p>
              <div className="mt-3"><Contagem ate={p.abreAte} agora={agora} /></div>
              <div className="mt-4">
                <div className="h-2 overflow-hidden rounded-full bg-areia"><div className="h-full rounded-full bg-gradient-to-r from-ouro to-champanhe" style={{ width: `${pct}%` }} /></div>
                <p className={cn('mt-1 text-sm', vagas <= 15 && !esgotado ? 'text-rosa' : 'text-marrom/70')} data-vagas={vagas}>{esgotado ? (encerrada ? 'Pré-venda encerrada' : 'Esgotado') : `Restam ${vagas} de ${cap}`}</p>
              </div>
              {!esgotado ? (
                <div className="mt-4 flex items-center gap-2">
                  <select className="campo w-20" value={q} onChange={(e) => setQtd({ ...qtd, [p.id]: +e.target.value })} aria-label="Quantidade">{Array.from({ length: Math.min(5, vagas) }, (_, i) => i + 1).map((n) => <option key={n}>{n}</option>)}</select>
                  <button className="btn-ouro flex-1" onClick={() => { set('carrinho', (c) => [...c, itemServico({ tipo: 'prevenda', id: p.id, nome: `${p.produto} (${p.nome})`, emoji: p.emoji, preco: p.preco * q, detalhe: `${q}× · entrega em ${dataBR(p.data)}`, data: p.data, meta: { qtd: q } })]); abrirCarrinho(true); }}>Garantir o meu</button>
                </div>
              ) : (
                <button className="btn-linha mt-4" onClick={() => { setLista(p.id); setOk(''); }}>Entrar na lista de espera</button>
              )}
              {lista === p.id && (
                <form className="mt-3 space-y-2 text-left" onSubmit={(e) => { e.preventDefault(); set('espera', (es) => [...es, { prevenda: p.id, nome: f.nome, whatsapp: f.whatsapp.replace(/\D/g, ''), data: hojeISO() }]); setOk(p.id); setLista(null); setF({ nome: '', whatsapp: '' }); }}>
                  <input required className="campo" placeholder="Seu nome" value={f.nome} onChange={(e) => setF({ ...f, nome: e.target.value })} />
                  <input required className="campo" placeholder="WhatsApp" inputMode="tel" value={f.whatsapp} onChange={(e) => setF({ ...f, whatsapp: e.target.value })} />
                  <button className="btn-ouro w-full">Avise-me se abrir vaga</button>
                </form>
              )}
              {ok === p.id && <p className="mt-2 text-sm text-salvia">Você está na lista ✓ ({espera.filter((e) => e.prevenda === p.id).length} na fila)</p>}
            </article>
          );
        })}
      </div>
    </div>
  );
}
