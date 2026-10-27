'use client';

import { useState } from 'react';
import { useAtelie } from '@/lib/store';
import { PLANOS, precoCiclo } from '@/data/planos';
import { ASSINANTES } from '@/data/prospeccao';
import { Kpi, Titulo, Toggle, Aviso, STATUS_COR, Barras } from '@/components/admin/ui';
import { brl, cn, waLink } from '@/lib/format';

export default function AdminAssinaturas() {
  const { ciclos, set } = useAtelie();
  const [planos, setPlanos] = useState(PLANOS);
  const [filtro, setFiltro] = useState('');
  const lista = ASSINANTES.filter((a) => !filtro || a.status === filtro);
  const hoje = new Date();
  const diasMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate();

  return (
    <>
      <Titulo kicker="Recorrência" titulo="Assinaturas" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi rotulo="Ativas" valor={47} cor="text-salvia" />
        <Kpi rotulo="MRR" valor="R$ 18.500" cor="text-ouro" />
        <Kpi rotulo="Churn" valor="3%" sub="últimos 30 dias" />
        <Kpi rotulo="Entregas hoje" valor={5} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="card-admin">
          <p className="font-serif text-2xl">Configuração de faturamento</p>
          <p className="mb-3 text-sm text-marrom/60">Ligue ou desligue cada ciclo. Desligado, aparece “Indisponível” em cinza no site.</p>
          <table className="tabela w-full">
            <thead><tr><th>Ciclo</th><th>Multiplicador</th><th>Exemplo (Essencial)</th><th>Habilitado</th></tr></thead>
            <tbody>
              {ciclos.map((c) => (
                <tr key={c.dias} className={cn(!c.habilitado && 'opacity-50')}>
                  <td className="font-medium">{c.nome}</td>
                  <td><input type="number" step="0.1" className="campo w-20 !py-1" value={c.multiplicador} onChange={(e) => set('ciclos', (cs) => cs.map((x) => (x.dias === c.dias ? { ...x, multiplicador: +e.target.value } : x)))} /></td>
                  <td>{brl(precoCiclo(290, c.multiplicador))}</td>
                  <td><Toggle on={c.habilitado} label={`Ciclo ${c.dias} dias`} onChange={(v) => {
                    if (!v && ciclos.filter((x) => x.habilitado).length === 1) return alert('Mantenha ao menos um ciclo habilitado.');
                    set('ciclos', (cs) => cs.map((x) => (x.dias === c.dias ? { ...x, habilitado: v } : x)));
                  }} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card-admin">
          <p className="mb-3 font-serif text-2xl">Planos</p>
          <div className="space-y-2">
            {planos.map((p, i) => (
              <div key={p.id} className="grid grid-cols-[1fr_120px] items-center gap-2 rounded-xl border border-areia p-3">
                <div><p className="font-medium">{p.emoji} {p.nome} {p.destaque && <span className="etiqueta ml-1">Best</span>}</p><p className="text-xs text-marrom/60">{p.itens.slice(0, 2).join(' · ')}</p></div>
                <input type="number" className="campo !py-1" value={p.preco} onChange={(e) => setPlanos(planos.map((x, j) => (j === i ? { ...x, preco: +e.target.value } : x)))} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card-admin mt-6 overflow-x-auto">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="font-serif text-2xl">Assinantes</p>
          <div className="flex gap-1 text-xs">{['', 'Ativa', 'Pausada', 'Cancelada'].map((s) => <button key={s} onClick={() => setFiltro(s)} className={cn('rounded-full border px-3 py-1', filtro === s ? 'border-ouro bg-blush' : 'border-areia')}>{s || 'Todos'}</button>)}</div>
        </div>
        <table className="tabela w-full min-w-[720px]">
          <thead><tr><th>Nome</th><th>Plano</th><th>Ciclo</th><th>Próxima entrega</th><th>Status</th><th>Valor</th><th></th></tr></thead>
          <tbody>{lista.map((a) => (
            <tr key={a.nome}><td>{a.nome}</td><td>{a.plano}</td><td>{a.ciclo} dias</td><td>{a.proxima.split('-').reverse().join('/')}</td>
              <td><span className={cn('pill', STATUS_COR[a.status])}>{a.status}</span></td><td>{brl(a.valor)}</td>
              <td><a className="text-sm text-[#128C4A] underline underline-offset-4" target="_blank" rel="noreferrer" href={waLink(`Olá ${a.nome.split(' ')[0]}! Aqui é o Rafael. Vamos combinar a entrega da sua assinatura ${a.plano}?`, a.whatsapp)}>Entrega a combinar · WhatsApp</a></td></tr>
          ))}</tbody>
        </table>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="card-admin">
          <p className="mb-3 font-serif text-2xl">Calendário de recorrência · {hoje.toLocaleDateString('pt-BR', { month: 'long' })}</p>
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {Array.from({ length: diasMes }).map((_, i) => {
              const n = [3, 7, 10, 14, 17, 18, 21, 25, 28].includes(i + 1) ? ((i * 7) % 4) + 1 : 0;
              return <div key={i} className={cn('rounded-lg border p-1.5', n ? 'border-ouro bg-blush' : 'border-areia')}>{i + 1}{n > 0 && <span className="block text-[10px] text-ouro">{n} entr.</span>}</div>;
            })}
          </div>
          <p className="mt-2 text-xs text-marrom/60">Integrado à agenda de confecção: dias com evento grande recebem alerta de capacidade.</p>
        </div>
        <div className="card-admin">
          <p className="mb-3 font-serif text-2xl">Relatórios</p>
          <div className="mb-4 grid grid-cols-3 gap-3 text-center">
            <div><p className="text-xs text-marrom/60">MRR</p><p className="font-serif text-2xl">R$ 18,5k</p></div>
            <div><p className="text-xs text-marrom/60">LTV médio</p><p className="font-serif text-2xl">R$ 4.920</p></div>
            <div><p className="text-xs text-marrom/60">Churn</p><p className="font-serif text-2xl">3%</p></div>
          </div>
          <Barras sufixo="" dados={[{ rotulo: 'Essencial', valor: 21, cor: '#D4A5A5' }, { rotulo: 'Encanto', valor: 19, cor: '#B08D57' }, { rotulo: 'Eterno', valor: 7, cor: '#5A6B4F' }]} />
          <Aviso tom="salvia"><span className="text-xs">Cobrança recorrente via Mercado Pago (preapproval) com Pix e cartão. Configure MERCADOPAGO_ACCESS_TOKEN.</span></Aviso>
        </div>
      </div>
    </>
  );
}
