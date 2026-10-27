'use client';

import { useState } from 'react';
import { Calendario } from '@/components/Calendario';
import { ConsulteData } from '@/components/Secoes';
import { DATAS_BLOQUEADAS } from '@/data/produtos';

export default function AgendaPage() {
  const [d, setD] = useState<string>();
  return (
    <div className="secao grid gap-10 py-14 lg:grid-cols-[1fr_420px]">
      <div>
        <p className="kicker">Agenda de confecção</p>
        <h1 className="titulo-secao mt-2">Datas <em className="texto-ouro">reservadas</em></h1>
        <p className="mt-4 max-w-xl text-marrom/75">Cada celebração recebe dedicação exclusiva. Podemos atender dois eventos no mesmo dia quando são em cidades diferentes.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Calendario valor={d} onChange={setD} />
          <ul className="space-y-2 text-sm">
            {DATAS_BLOQUEADAS.map((b) => (
              <li key={b.data} className="rounded-xl border border-areia bg-vidro/80 p-3"><b className="text-ouro">{b.data.split('-').reverse().join('/')}</b> · {b.motivo}<span className="block text-xs text-marrom/50">{b.municipio}</span></li>
            ))}
          </ul>
        </div>
      </div>
      <ConsulteData />
    </div>
  );
}
