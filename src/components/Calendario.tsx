'use client';

import { useState } from 'react';
import { DATAS_BLOQUEADAS } from '@/data/produtos';
import { cn } from '@/lib/format';

const DIAS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** Calendário com datas bloqueadas pela agenda de confecção. */
export function Calendario({ valor, onChange, minDias = 1, extrasBloqueados = [], diasSemana, semBloqueioAgenda = false }: { valor?: string; onChange: (d: string) => void; minDias?: number; extrasBloqueados?: string[]; diasSemana?: number[]; semBloqueioAgenda?: boolean }) {
  const hoje = new Date();
  const [mes, setMes] = useState(() => (valor ? new Date(valor + 'T12:00') : new Date(hoje.getFullYear(), hoje.getMonth(), 1)));
  const inicio = new Date(mes.getFullYear(), mes.getMonth(), 1);
  const diasNoMes = new Date(mes.getFullYear(), mes.getMonth() + 1, 0).getDate();
  const min = new Date(hoje); min.setDate(min.getDate() + minDias); min.setHours(0, 0, 0, 0);
  const bloqueadas = new Map(semBloqueioAgenda ? [] : DATAS_BLOQUEADAS.map((b) => [b.data, b.motivo]));
  extrasBloqueados.forEach((d) => bloqueadas.set(d, 'Agenda cheia'));

  return (
    <div className="rounded-2xl border border-areia bg-vidro p-3">
      <div className="mb-2 flex items-center justify-between">
        <button type="button" className="px-2 text-ouro" onClick={() => setMes(new Date(mes.getFullYear(), mes.getMonth() - 1, 1))} aria-label="Mês anterior">‹</button>
        <span className="font-serif text-lg">{(() => { const t = mes.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }); return t[0].toUpperCase() + t.slice(1); })()}</span>
        <button type="button" className="px-2 text-ouro" onClick={() => setMes(new Date(mes.getFullYear(), mes.getMonth() + 1, 1))} aria-label="Próximo mês">›</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px]">
        {DIAS.map((d, i) => <span key={i} className="py-1 text-marrom/50">{d}</span>)}
        {Array.from({ length: inicio.getDay() }).map((_, i) => <span key={'v' + i} />)}
        {Array.from({ length: diasNoMes }).map((_, i) => {
          const d = new Date(mes.getFullYear(), mes.getMonth(), i + 1);
          const k = iso(d);
          const bloq = bloqueadas.get(k);
          const passado = d < min || (!!diasSemana && !diasSemana.includes(d.getDay()));
          return (
            <button
              type="button"
              key={k}
              disabled={!!bloq || passado}
              title={bloq ?? undefined}
              onClick={() => onChange(k)}
              className={cn(
                'aspect-square rounded-full text-xs transition',
                valor === k && 'bg-gradient-to-br from-champanhe to-ouro font-medium text-tinta shadow-brilho',
                bloq && 'cursor-not-allowed bg-rosa/10 text-rosa/70 line-through',
                passado && !bloq && 'cursor-not-allowed text-marrom/25',
                !bloq && !passado && valor !== k && 'hover:bg-ouro/15 hover:text-champanhe',
              )}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-[11px] text-marrom/60"><span className="mr-1 inline-block h-2 w-2 rounded-full bg-rosa/50" />Datas riscadas já estão reservadas na agenda de confecção.</p>
    </div>
  );
}
