'use client';

import Link from 'next/link';
import { Kpi, Titulo, Barras, Aviso, STATUS_COR } from '@/components/admin/ui';
import { STATS_PROSPECCAO as S, INBOX } from '@/data/prospeccao';
import { useAtelie } from '@/lib/store';
import { cn } from '@/lib/format';

const CORES = ['#B08D57', '#25D366', '#D4A5A5', '#2AABEE', '#0A66C2'];

export default function ProspeccaoDashboard() {
  const { leads } = useAtelie();
  const fila = leads.filter((l) => l.status === 'Novo').slice(0, 6);
  const pct = (S.enviadosHoje / S.limiteDiario) * 100;
  return (
    <>
      <Titulo kicker="Prospecção · só admin" titulo="Dashboard de prospecção">
        <Link href="/admin/prospeccao/campanhas" className="btn-ouro">Nova campanha</Link>
      </Titulo>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi rotulo="Total de leads" valor={S.totalLeads.toLocaleString('pt-BR')} />
        <div className="card-admin">
          <p className="text-[11px] uppercase tracking-wider text-marrom/60">Enviados hoje</p>
          <p className="mt-1 font-serif text-4xl">{S.enviadosHoje}<span className="text-xl text-marrom/50">/{S.limiteDiario}</span></p>
          <div className="mt-2 h-2.5 rounded-full bg-areia"><div className="h-2.5 rounded-full bg-ouro" style={{ width: `${pct}%` }} /></div>
        </div>
        <Kpi rotulo="Taxa de resposta" valor={`${S.taxaResposta}%`} cor="text-salvia" />
        <Kpi rotulo="Parcerias fechadas" valor={S.parceriasFechadas} cor="text-ouro" />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="card-admin">
          <p className="mb-3 font-serif text-2xl">Envios por canal</p>
          <Barras dados={S.porCanal.map((c, i) => ({ rotulo: c.canal, valor: c.pct, cor: CORES[i] }))} max={100} />
        </div>
        <div className="card-admin xl:col-span-2">
          <div className="mb-3 flex items-center justify-between"><p className="font-serif text-2xl">Fila do dia</p><span className="text-xs text-marrom/60">intervalo 3-5 min · 20/h · 9h-18h</span></div>
          <Aviso tom="rosa">⚠️ Anti-spam: você está em {Math.round(pct)}% do limite diário. Com domínio em aquecimento (dia 6 de 14), o recomendado hoje é até 120 envios.</Aviso>
          <ul className="mt-3 divide-y divide-areia text-sm">
            {fila.map((l, i) => <li key={l.id} className="flex justify-between py-2"><span>{l.nome} · <span className="text-marrom/60">{l.nicho} · {l.cidade}</span></span><span className="text-marrom/60">{String(9 + Math.floor((i * 4) / 60) + 5).padStart(2, '0')}:{String((i * 4) % 60).padStart(2, '0')} · Email</span></li>)}
          </ul>
        </div>
      </div>
      <div className="card-admin mt-6">
        <p className="mb-3 font-serif text-2xl">Últimos contatos</p>
        <ul className="divide-y divide-areia text-sm">
          {INBOX.map((m) => <li key={m.id} className="flex flex-wrap items-center justify-between gap-2 py-2"><span><b>{m.de}</b> · {m.canal} · <span className="text-marrom/60">{m.trecho}</span></span><span className={cn('pill', STATUS_COR[m.status])}>{m.status === 'Aguardando' ? 'enviou portfólio · aguardando' : m.status}</span></li>)}
        </ul>
      </div>
    </>
  );
}
