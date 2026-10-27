'use client';

import { useState } from 'react';
import { Titulo, Toggle } from '@/components/admin/ui';
import { Calendario } from '@/components/Calendario';
import { DATAS_BLOQUEADAS } from '@/data/produtos';
import { ASSINANTES } from '@/data/prospeccao';

export default function AdminAgenda() {
  const [d, setD] = useState<string>();
  const [doisEventos, setDoisEventos] = useState(true);
  return (
    <>
      <Titulo kicker="Operação" titulo="Agenda de confecção" />
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="space-y-4">
          <Calendario valor={d} onChange={setD} minDias={0} />
          <div className="card-admin flex items-center justify-between gap-3 text-sm">
            <span>Permitir 2 eventos no mesmo dia em cidades diferentes</span><Toggle on={doisEventos} onChange={setDoisEventos} />
          </div>
        </div>
        <div className="card-admin">
          <p className="mb-3 font-serif text-2xl">Eventos e entregas</p>
          <ul className="divide-y divide-areia text-sm">
            {DATAS_BLOQUEADAS.map((b) => <li key={b.data} className="flex justify-between py-2"><span><b className="text-ouro">{b.data.split('-').reverse().join('/')}</b> · {b.motivo}</span><span className="text-marrom/60">{b.municipio}</span></li>)}
            {ASSINANTES.filter((a) => a.status === 'Ativa').map((a) => <li key={a.nome} className="flex justify-between py-2"><span><b className="text-salvia">{a.proxima.split('-').reverse().join('/')}</b> · Assinatura {a.plano} · {a.nome}</span><span className="text-marrom/60">recorrência {a.ciclo}d</span></li>)}
          </ul>
        </div>
      </div>
    </>
  );
}
