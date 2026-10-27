'use client';

import { useAtelie } from '@/lib/store';
import { Kpi, Titulo } from '@/components/admin/ui';
import { dataBR } from '@/data/servicos';
import { brl, cn, SITE_URL, waLink } from '@/lib/format';

export default function AdminParceiros() {
  const { parceiros, indicacoes, set } = useAtelie();
  const comissao = (cod: string) => parceiros.find((p) => p.codigo === cod)?.comissao ?? 0.1;
  const aPagar = indicacoes.filter((i) => !i.pago).reduce((s, i) => s + i.valor * comissao(i.parceiro), 0);
  const vendido = indicacoes.reduce((s, i) => s + i.valor, 0);
  return (
    <>
      <Titulo kicker="Crescimento" titulo="Parceiros e indicações" />
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <Kpi rotulo="Parceiros" valor={parceiros.length} />
        <Kpi rotulo="Indicações" valor={indicacoes.length} />
        <Kpi rotulo="Vendido por indicação" valor={brl(vendido)} />
        <Kpi rotulo="Comissões a pagar" valor={brl(aPagar)} />
      </div>
      <div className="card-admin mb-6 overflow-x-auto">
        <table className="tabela">
          <thead><tr><th>Parceiro</th><th>Tipo</th><th>Código / link</th><th>Comissão</th><th>Indicações</th><th>A pagar</th><th /></tr></thead>
          <tbody>
            {parceiros.map((p) => {
              const ind = indicacoes.filter((i) => i.parceiro === p.codigo);
              const pagar = ind.filter((i) => !i.pago).reduce((s, i) => s + i.valor * p.comissao, 0);
              return (
                <tr key={p.codigo}>
                  <td>{p.nome}<br /><span className="text-xs text-marrom/50">{p.email}</span></td>
                  <td>{p.tipo}</td>
                  <td className="text-xs"><strong className="text-champanhe">{p.codigo}</strong><br />{SITE_URL.replace('https://', '')}/?ref={p.codigo}</td>
                  <td>
                    <select className="campo !w-20 !py-1" value={p.comissao} onChange={(e) => set('parceiros', (ps) => ps.map((x) => (x.codigo === p.codigo ? { ...x, comissao: +e.target.value } : x)))}>
                      {[0.08, 0.1, 0.12, 0.15].map((c) => <option key={c} value={c}>{c * 100}%</option>)}
                    </select>
                  </td>
                  <td>{ind.length}</td>
                  <td>{brl(pagar)}</td>
                  <td><a className="text-xs text-champanhe underline" target="_blank" rel="noreferrer" href={waLink(`Olá ${p.nome}! Seu link de parceiro do ateliê: ${SITE_URL}/?ref=${p.codigo}`, p.whatsapp)}>Enviar link</a></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="card-admin overflow-x-auto">
        <p className="kicker mb-2">Indicações</p>
        <table className="tabela">
          <thead><tr><th>Data</th><th>Parceiro</th><th>Pedido</th><th>Cliente</th><th>Valor</th><th>Comissão</th><th>Status</th></tr></thead>
          <tbody>
            {indicacoes.map((i) => (
              <tr key={i.pedido + i.parceiro}>
                <td>{dataBR(i.data)}</td><td>{i.parceiro}</td><td>#{i.pedido}</td><td>{i.cliente}</td><td>{brl(i.valor)}</td><td>{brl(i.valor * comissao(i.parceiro))}</td>
                <td>
                  <button onClick={() => set('indicacoes', (is) => is.map((x) => (x === i ? { ...x, pago: !x.pago } : x)))} className={cn('pill', i.pago ? 'bg-salvia/15 text-folha' : 'bg-ouro/15 text-champanhe ring-1 ring-ouro/30')}>
                    {i.pago ? 'Pago ✓' : 'Marcar pago'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
