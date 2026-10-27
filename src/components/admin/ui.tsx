'use client';

import { cn } from '@/lib/format';

export function Kpi({ rotulo, valor, sub, cor = 'text-marrom' }: { rotulo: string; valor: string | number; sub?: string; cor?: string }) {
  return (
    <div className="card-admin">
      <p className="text-[11px] uppercase tracking-wider text-marrom/60">{rotulo}</p>
      <p className={cn('mt-1 font-serif text-5xl font-light', cor === 'text-marrom' ? 'texto-ouro' : cor)}>{valor}</p>
      {sub && <p className="text-xs text-marrom/60">{sub}</p>}
    </div>
  );
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)} className={cn('relative h-6 w-11 shrink-0 rounded-full transition', on ? 'bg-gradient-to-r from-ouro to-champanhe shadow-brilho' : 'bg-realce/10')}>
      <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-marrom shadow transition-all', on ? 'left-[22px]' : 'left-0.5')} />
    </button>
  );
}

export function Barras({ dados, sufixo = '%', max }: { dados: { rotulo: string; valor: number; cor?: string }[]; sufixo?: string; max?: number }) {
  const m = max ?? Math.max(...dados.map((d) => d.valor), 1);
  return (
    <div className="space-y-2">
      {dados.map((d) => (
        <div key={d.rotulo} className="grid grid-cols-[96px_1fr_48px] items-center gap-2 text-sm">
          <span className="truncate text-marrom/70">{d.rotulo}</span>
          <span className="h-3 overflow-hidden rounded-full bg-areia/60"><span className="block h-full rounded-full" style={{ width: `${(d.valor / m) * 100}%`, background: d.cor ? `linear-gradient(90deg, ${d.cor}88, ${d.cor})` : 'linear-gradient(90deg,#8C6A33,#EED9A8)', boxShadow: `0 0 12px -2px ${d.cor ?? '#EED9A8'}` }} /></span>
          <span className="text-right tabular-nums">{d.valor}{sufixo}</span>
        </div>
      ))}
    </div>
  );
}

export function Titulo({ kicker, titulo, children }: { kicker: string; titulo: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div><p className="kicker">{kicker}</p><h1 className="font-serif text-4xl">{titulo}</h1></div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export function Aviso({ tom = 'ouro', children }: { tom?: 'ouro' | 'rosa' | 'salvia'; children: React.ReactNode }) {
  const c = { ouro: 'border-ouro/30 bg-ouro/[.06] text-champanhe/90', rosa: 'border-rosa/40 bg-rosa/[.07] text-rosa', salvia: 'border-salvia/40 bg-salvia/[.07] text-folha' }[tom];
  return <div className={cn('rounded-xl border p-3 text-sm', c)}>{children}</div>;
}

export const STATUS_COR: Record<string, string> = {
  Novo: 'bg-sky-400/10 text-sky-700 dark:text-sky-300 ring-1 ring-sky-300/20', Contatado: 'bg-amber-300/10 text-amber-700 dark:text-amber-200 ring-1 ring-amber-200/20', Respondeu: 'bg-violet-400/10 text-violet-700 dark:text-violet-300 ring-1 ring-violet-300/20',
  Reunião: 'bg-cyan-400/10 text-cyan-700 dark:text-cyan-300 ring-1 ring-cyan-300/20', Fechado: 'bg-emerald-400/10 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-300/20', 'Sem interesse': 'bg-realce/5 text-marrom/40',
  Ativa: 'bg-emerald-400/10 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-300/20', Pausada: 'bg-amber-300/10 text-amber-700 dark:text-amber-200 ring-1 ring-amber-200/20', Cancelada: 'bg-realce/5 text-marrom/40',
  Aguardando: 'bg-amber-300/10 text-amber-700 dark:text-amber-200 ring-1 ring-amber-200/20',
};

export const FONTE_COR: Record<string, string> = {
  CNPJ: 'bg-champanhe/15 text-champanhe ring-1 ring-champanhe/30', 'Google Maps': 'bg-sky-400/15 text-sky-700 dark:text-sky-300 ring-1 ring-sky-300/30', GitHub: 'bg-realce/10 text-marrom ring-1 ring-marrom/20', Manual: 'bg-rosa/15 text-rosa ring-1 ring-rosa/30', CSV: 'bg-salvia/15 text-salvia ring-1 ring-salvia/30',
};
