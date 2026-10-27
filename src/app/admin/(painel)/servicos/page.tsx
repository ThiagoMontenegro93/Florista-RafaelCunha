'use client';

import { useState } from 'react';
import { useAtelie } from '@/lib/store';
import { Kpi, Titulo, Aviso } from '@/components/admin/ui';
import { PECAS, PRE_VENDAS, WORKSHOPS, dataBR, disponivel, hojeISO, vagasPreVenda } from '@/data/servicos';
import { brl, cn, SITE_URL, waLink } from '@/lib/format';

const ABAS = ['Pré-venda', 'Aluguel', 'Workshops', 'Consultorias', 'Propostas', 'Preservação'] as const;

export default function AdminServicos() {
  const st = useAtelie();
  const { capacidades, vendidos, espera, reservas, inscritos, consultas, propostas, pedidos, set } = st;
  const [aba, setAba] = useState<(typeof ABAS)[number]>('Pré-venda');
  const [dia, setDia] = useState(hojeISO());
  const pedidosCom = (tipo: string) => pedidos.filter((p) => p.itens.some((i) => i.tipo === tipo));

  return (
    <>
      <Titulo kicker="Operação" titulo="Serviços do ateliê" />
      <div className="mb-6 flex flex-wrap gap-2">
        {ABAS.map((a) => <button key={a} onClick={() => setAba(a)} className={cn('rounded-full border px-4 py-1.5 text-sm', aba === a ? 'border-champanhe bg-ouro/15 text-champanhe' : 'border-areia text-marrom/70')}>{a}</button>)}
      </div>

      {aba === 'Pré-venda' && (
        <div className="space-y-4">
          {PRE_VENDAS.map((p) => {
            const fila = espera.filter((e) => e.prevenda === p.id);
            const vagas = vagasPreVenda(p.id, capacidades, vendidos);
            return (
              <div key={p.id} className="card-admin">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-3xl">{p.emoji}</span>
                  <div className="flex-1"><p className="font-serif text-xl">{p.nome} · {p.produto}</p><p className="text-sm text-marrom/60">Entrega {dataBR(p.data)} · vendas até {dataBR(p.abreAte)} · {brl(p.preco)}</p></div>
                  <div className="text-sm">Vendidos <strong>{vendidos[p.id] ?? 0}</strong> · Restam <strong className={vagas <= 15 ? 'text-rosa' : ''}>{vagas}</strong></div>
                  <label className="flex items-center gap-2 text-sm">Capacidade
                    <input type="number" min={vendidos[p.id] ?? 0} className="campo !w-24 !py-1" aria-label={`Capacidade ${p.nome}`} value={capacidades[p.id] ?? p.capacidade} onChange={(e) => set('capacidades', (c) => ({ ...c, [p.id]: Math.max(vendidos[p.id] ?? 0, +e.target.value) }))} />
                  </label>
                </div>
                {fila.length > 0 && (
                  <div className="mt-3 border-t border-areia pt-3">
                    <p className="text-xs uppercase tracking-wider text-marrom/60">Lista de espera ({fila.length})</p>
                    {fila.map((e, k) => (
                      <div key={k} className="flex items-center justify-between py-1 text-sm">
                        <span>{k + 1}. {e.nome} · {e.whatsapp} · {dataBR(e.data)}</span>
                        <a className="text-champanhe underline" target="_blank" rel="noreferrer" href={waLink(`Oi ${e.nome}! Abriu vaga na pré-venda ${p.nome} do ateliê. Garanta o seu: ${SITE_URL}/pre-venda`, e.whatsapp)}>Avisar vaga</a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {aba === 'Aluguel' && (
        <div className="space-y-4">
          <div className="card-admin flex flex-wrap items-center gap-3"><span className="text-sm">Disponibilidade em</span><input type="date" className="campo !w-44 !py-1" value={dia} onChange={(e) => setDia(e.target.value)} /></div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PECAS.map((p) => { const livre = disponivel(p.id, dia, dia, reservas); return (
              <div key={p.id} className="card-admin"><p className="font-serif text-lg">{p.emoji} {p.nome}</p><p className="text-sm text-marrom/60">Acervo {p.estoque} · {brl(p.preco)}/dia · caução {brl(p.caucao)}</p>
                <p className={cn('mt-1 text-sm', livre === 0 ? 'text-rosa' : 'text-salvia')}>{livre} livre(s) em {dataBR(dia)}</p></div>
            ); })}
          </div>
          <div className="card-admin overflow-x-auto">
            <p className="kicker mb-2">Reservas</p>
            <table className="tabela"><thead><tr><th>Peça</th><th>Qtd</th><th>Período</th><th>Cliente</th><th>Pedido</th><th /></tr></thead>
              <tbody>{reservas.map((r, k) => (
                <tr key={k}><td>{PECAS.find((p) => p.id === r.pecaId)?.nome}</td><td>{r.qtd}</td><td>{dataBR(r.inicio)} a {dataBR(r.fim)}</td><td>{r.cliente ?? '—'}</td><td>{r.pedido ? `#${r.pedido}` : '—'}</td>
                  <td><button className="text-xs text-marrom/50 hover:text-rosa" onClick={() => set('reservas', (rs) => rs.filter((_, j) => j !== k))}>devolvida / liberar</button></td></tr>
              ))}</tbody></table>
          </div>
        </div>
      )}

      {aba === 'Workshops' && (
        <div className="space-y-4">
          {WORKSHOPS.map((w) => { const n = inscritos[w.id] ?? 0; const ps = pedidos.filter((p) => p.itens.some((i) => i.tipo === 'workshop' && i.produtoId === w.id)); return (
            <div key={w.id} className="card-admin">
              <div className="flex flex-wrap items-center gap-4"><span className="text-3xl">{w.emoji}</span>
                <div className="flex-1"><p className="font-serif text-xl">{w.nome}</p><p className="text-sm text-marrom/60">{dataBR(w.data)} às {w.hora} · {brl(w.preco)}</p></div>
                <p className="text-sm"><strong>{n}</strong>/{w.vagas} inscritos · receita {brl(n * w.preco)}</p></div>
              {ps.length > 0 && <div className="mt-3 border-t border-areia pt-3 text-sm">{ps.map((p) => { const it = p.itens.find((i) => i.produtoId === w.id)!; return <p key={p.numero}>#{p.numero} · {p.nome} · {it.meta?.qtd} ingresso(s) · {p.whatsapp}</p>; })}</div>}
            </div>
          ); })}
        </div>
      )}

      {aba === 'Consultorias' && (
        <div className="card-admin overflow-x-auto">
          {consultas.length === 0 ? <p className="text-sm text-marrom/60">Nenhuma consultoria agendada ainda.</p> : (
            <table className="tabela"><thead><tr><th>Data</th><th>Hora</th><th>Noiva</th><th>Pedido</th><th>Crédito</th><th /></tr></thead>
              <tbody>{consultas.map((c) => (
                <tr key={c.codigo}><td>{dataBR(c.data)}</td><td>{c.hora}</td><td>{c.nome}</td><td>#{c.pedido}</td><td><strong className="text-champanhe">{c.codigo}</strong> · {c.creditoUsado ? 'usado' : 'disponível'}</td>
                  <td><a className="text-xs text-champanhe underline" target="_blank" rel="noreferrer" href={waLink(`Oi ${c.nome}! Confirmando sua consultoria no ateliê em ${dataBR(c.data)} às ${c.hora}. Seu crédito: ${c.codigo}.`, c.whatsapp)}>Confirmar</a></td></tr>
              ))}</tbody></table>
          )}
        </div>
      )}

      {aba === 'Propostas' && (
        <div className="space-y-3">
          <div className="grid gap-4 sm:grid-cols-3">
            <Kpi rotulo="Propostas" valor={propostas.length} />
            <Kpi rotulo="Com sinal pago" valor={propostas.filter((p) => p.status === 'Sinal pago').length} />
            <Kpi rotulo="Valor em propostas" valor={brl(propostas.reduce((s, p) => s + p.total, 0))} />
          </div>
          {propostas.map((p) => (
            <div key={p.codigo} className="card-admin flex flex-wrap items-center gap-4">
              <div className="flex-1"><p className="font-serif text-xl">{p.codigo} · {p.nome}</p><p className="text-sm text-marrom/60">{dataBR(p.data)} · {p.local || 'local a definir'} · {p.linhas.length} itens · criada {dataBR(p.criadaEm)}</p></div>
              <p>{brl(p.total)}</p>
              <span className={cn('pill', p.status === 'Sinal pago' ? 'bg-salvia/15 text-folha' : 'bg-ouro/15 text-champanhe')}>{p.status}</span>
            </div>
          ))}
        </div>
      )}

      {aba === 'Preservação' && (
        <div className="space-y-3">
          <Aviso>Busque o buquê em até 48h após o casamento. Os prazos começam a contar na retirada.</Aviso>
          {pedidosCom('preservacao').length === 0 && <p className="card-admin text-sm text-marrom/60">Nenhuma preservação encomendada ainda.</p>}
          {pedidosCom('preservacao').map((p) => p.itens.filter((i) => i.tipo === 'preservacao').map((i) => (
            <div key={p.numero + i.uid} className="card-admin"><p className="font-serif text-lg">{i.emoji} {i.nome} · #{p.numero} · {p.nome}</p><p className="text-sm text-marrom/60">{i.detalhe}</p></div>
          )))}
        </div>
      )}
    </>
  );
}
