'use client';

import Link from 'next/link';
import { Kpi, Titulo, Barras } from '@/components/admin/ui';
import { useAtelie, TIMELINE_PEDIDO } from '@/lib/store';
import { STATS_PROSPECCAO, ASSINANTES } from '@/data/prospeccao';
import { DATAS_BLOQUEADAS, PRODUTOS } from '@/data/produtos';
import { brl } from '@/lib/format';
import { proximoAniversario } from '@/lib/store';
import { PRE_VENDAS, vagasPreVenda } from '@/data/servicos';

export default function Dashboard() {
  const { pedidos, lembretes, indicacoes, parceiros, contratos, avaliacoes, propostas, capacidades, vendidos } = useAtelie();
  const aniv30 = lembretes.filter((l) => proximoAniversario(l.dataCasamento).dias <= 30).length;
  const comissoes = indicacoes.filter((i) => !i.pago).reduce((s, i) => s + i.valor * (parceiros.find((p) => p.codigo === i.parceiro)?.comissao ?? 0.1), 0);
  const mrrCorp = contratos.filter((c) => c.status === 'Ativo').reduce((s, c) => s + c.mensal, 0);
  const pv = PRE_VENDAS[0];
  const receita = pedidos.reduce((s, p) => s + p.total, 0);
  return (
    <>
      <Titulo kicker="Bom dia, Rafael" titulo="Dashboard do ateliê" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi rotulo="Pedidos (demo)" valor={pedidos.length} sub={brl(receita)} />
        <Kpi rotulo="Assinaturas ativas" valor={47} sub="MRR R$ 18.500" cor="text-salvia" />
        <Kpi rotulo="Próximos eventos" valor={DATAS_BLOQUEADAS.length} sub="na agenda de confecção" />
        <Kpi rotulo="Leads B2B" valor={STATS_PROSPECCAO.totalLeads.toLocaleString('pt-BR')} sub={`${STATS_PROSPECCAO.parceriasFechadas} parcerias fechadas`} cor="text-ouro" />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        {[
          ['/admin/memorias', 'Aniversários em 30 dias', String(aniv30)],
          ['/admin/parceiros', 'Comissões a pagar', brl(comissoes)],
          ['/admin/servicos', `Vagas ${pv.nome}`, String(vagasPreVenda(pv.id, capacidades, vendidos))],
          ['/admin/servicos', 'Propostas de casamento', String(propostas.length)],
          ['/admin/avaliacoes', 'Avaliações a aprovar', String(avaliacoes.filter((a) => !a.aprovada).length)],
          ['/admin/corporativo', 'Corporativo / mês', brl(mrrCorp)],
        ].map(([href, r, v]) => (
          <Link key={r} href={href} className="card-admin !p-4 transition hover:shadow-brilho"><p className="text-[10px] uppercase tracking-wider text-marrom/60">{r}</p><p className="mt-1 font-serif text-2xl text-champanhe [font-variant-numeric:lining-nums]">{v}</p></Link>
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card-admin">
          <p className="mb-3 font-serif text-2xl">Pedidos recentes</p>
          {pedidos.length === 0 ? <p className="text-sm text-marrom/60">Faça um pedido no site (Ver como Cliente) e ele aparece aqui.</p> : (
            <ul className="divide-y divide-areia text-sm">{pedidos.slice(0, 6).map((p) => <li key={p.numero} className="flex justify-between py-2"><span>#{p.numero} · {p.nome} · {p.itens.length} item(s)</span><span className="text-marrom/60">{TIMELINE_PEDIDO[p.status]}</span></li>)}</ul>
          )}
          <Link href="/admin/pedidos" className="mt-3 inline-block text-sm text-ouro">Gerenciar pedidos →</Link>
        </div>
        <div className="card-admin">
          <p className="mb-3 font-serif text-2xl">Mais vendidos</p>
          <Barras sufixo="" dados={PRODUTOS.slice(0, 6).map((p, i) => ({ rotulo: p.nome.split(' ').slice(0, 3).join(' '), valor: [42, 31, 27, 19, 16, 12][i] }))} />
        </div>
        <div className="card-admin">
          <p className="mb-3 font-serif text-2xl">Entregas de assinatura hoje</p>
          <ul className="space-y-2 text-sm">{ASSINANTES.filter((a) => a.status === 'Ativa').slice(0, 5).map((a) => <li key={a.nome} className="flex justify-between"><span>{a.nome} · {a.plano}</span><span className="text-marrom/60">{a.ciclo} dias</span></li>)}</ul>
        </div>
        <div className="card-admin">
          <p className="mb-3 font-serif text-2xl">Prospecção hoje</p>
          <p className="text-sm">Enviados {STATS_PROSPECCAO.enviadosHoje}/{STATS_PROSPECCAO.limiteDiario}</p>
          <div className="mt-2 h-3 rounded-full bg-areia"><div className="h-3 rounded-full bg-ouro" style={{ width: `${(STATS_PROSPECCAO.enviadosHoje / STATS_PROSPECCAO.limiteDiario) * 100}%` }} /></div>
          <Link href="/admin/prospeccao" className="mt-3 inline-block text-sm text-ouro">Abrir prospecção →</Link>
        </div>
      </div>
    </>
  );
}
