'use client';

import { useState } from 'react';
import { useAtelie, TIMELINE_PEDIDO } from '@/lib/store';
import { Titulo } from '@/components/admin/ui';
import { brl, cn, SITE_URL, waLink } from '@/lib/format';

export default function AdminPedidos() {
  const { pedidos, set, avaliacoes } = useAtelie();
  const ultimo = TIMELINE_PEDIDO.length - 1;
  const [busca, setBusca] = useState('');
  const [status, setStatus] = useState(-1);
  const q = busca.trim().toLowerCase();
  const lista = pedidos.filter((p) => (status < 0 || p.status === status) && (!q || `${p.numero} ${p.nome} ${p.itens.map((i) => i.nome).join(' ')}`.toLowerCase().includes(q)));
  return (
    <>
      <Titulo kicker="Operação" titulo="Pedidos">
        <input className="campo !w-56 !py-2" placeholder="Buscar nº, cliente ou item" aria-label="Buscar pedidos" value={busca} onChange={(e) => setBusca(e.target.value)} />
        <select className="campo !w-48 !py-2" aria-label="Filtrar por status" value={status} onChange={(e) => setStatus(+e.target.value)}>
          <option value={-1}>Todos os status</option>
          {TIMELINE_PEDIDO.map((t, i) => <option key={t} value={i}>{t}</option>)}
        </select>
      </Titulo>
      {pedidos.length === 0 && <p className="card-admin text-sm text-marrom/60">Nenhum pedido ainda. Use “Ver como Cliente”, encomende um arranjo e volte aqui.</p>}
      <div className="space-y-3">
        {pedidos.length > 0 && lista.length === 0 && <p className="card-admin text-sm text-marrom/60">Nenhum pedido com esse filtro.</p>}
        {lista.map((p) => (
          <div key={p.numero} className="card-admin flex flex-wrap items-center gap-4">
            <div className="flex-1">
              <p className="font-serif text-xl">#{p.numero} · {p.nome}</p>
              <p className="text-sm text-marrom/60">{p.itens.map((i) => `${i.nome} (${i.detalhe ?? `${i.tamanho}, ${i.paleta}`})`).join(' · ')}</p>
              <p className="text-xs text-marrom/50">{brl(p.total)} · {p.pagamento} · {new Date(p.data).toLocaleString('pt-BR')}{p.ref ? ` · indicação ${p.ref}` : ''}{p.dataCasamento ? ` · casamento ${p.dataCasamento.split('-').reverse().join('/')}` : ''}</p>
            </div>
            <select className="campo w-56" value={p.status} onChange={(e) => set('pedidos', (ps) => ps.map((x) => (x.numero === p.numero ? { ...x, status: +e.target.value } : x)))}>
              {TIMELINE_PEDIDO.map((t, i) => <option key={t} value={i}>{t}</option>)}
            </select>
            <a className="btn-whats !py-2" target="_blank" rel="noreferrer" href={waLink(`Olá ${p.nome}! Aqui é o Rafael. Vamos combinar a entrega do pedido #${p.numero}?`, p.whatsapp)}>Combinar entrega</a>
            {avaliacoes.some((a) => a.pedido === p.numero) ? <span className="pill bg-salvia/15 text-folha">Avaliado ★</span> : (
              <a
                className={cn('btn-linha !py-2', p.status !== ultimo && 'pointer-events-none opacity-40')}
                aria-disabled={p.status !== ultimo}
                title={p.status !== ultimo ? 'Disponível quando o pedido estiver Entregue' : undefined}
                target="_blank" rel="noreferrer"
                onClick={() => set('pedidos', (ps) => ps.map((x) => (x.numero === p.numero ? { ...x, avaliacaoPedida: true } : x)))}
                href={waLink(`Oi ${p.nome.split(' ')[0]}! Aqui é o Rafael 🌸 Como ficaram as flores do pedido #${p.numero}? Sua opinião (e uma foto!) me ajuda muito: ${SITE_URL}/avaliar/${p.numero}`, p.whatsapp)}
              >
                {p.avaliacaoPedida ? 'Reenviar pedido de avaliação' : 'Pedir avaliação'}
              </a>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
