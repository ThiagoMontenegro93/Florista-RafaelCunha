'use client';

import { useState } from 'react';
import { INBOX } from '@/data/prospeccao';
import { Titulo, STATUS_COR } from '@/components/admin/ui';
import { cn } from '@/lib/format';

const RAPIDAS = [
  'Que alegria! Posso te ligar amanhã às 10h para conversarmos?',
  'Segue o portfólio completo: florista-rafaelcunha.com.br/portfolio. Qual a data do próximo evento?',
  'Obrigado pelo retorno! Removi seu contato da lista. Sucesso sempre 🌸',
];
const ICONE: Record<string, string> = { Email: '✉️', WhatsApp: '💬', Instagram: '📸', Telegram: '✈️', LinkedIn: '💼' };

export default function InboxPage() {
  const [canal, setCanal] = useState('');
  const [aberta, setAberta] = useState(INBOX[0]);
  const [resposta, setResposta] = useState('');
  const [enviadas, setEnviadas] = useState<Record<number, string[]>>({});
  const lista = INBOX.filter((m) => !canal || m.canal === canal);
  return (
    <>
      <Titulo kicker="Prospecção · só admin" titulo="Caixa de entrada unificada" />
      <div className="mb-3 flex flex-wrap gap-1 text-xs">{['', 'Email', 'WhatsApp', 'Instagram', 'Telegram', 'LinkedIn'].map((c) => <button key={c} onClick={() => setCanal(c)} className={cn('rounded-full border px-3 py-1', canal === c ? 'border-ouro bg-blush' : 'border-areia bg-vidro')}>{c ? `${ICONE[c]} ${c}` : 'Todos'}</button>)}</div>
      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <ul className="card-admin divide-y divide-areia p-0">
          {lista.map((m) => (
            <li key={m.id}><button onClick={() => setAberta(m)} className={cn('w-full p-4 text-left', aberta.id === m.id && 'bg-blush/60')}>
              <p className="flex justify-between text-sm"><b>{ICONE[m.canal]} {m.de}</b><span className="text-xs text-marrom/50">{m.quando}</span></p>
              <p className="truncate text-xs text-marrom/60">{m.trecho}</p>
              <span className={cn('pill mt-1 text-[10px]', STATUS_COR[m.status])}>{m.status}</span>
            </button></li>
          ))}
        </ul>
        <div className="card-admin flex flex-col">
          <p className="font-serif text-2xl">{aberta.de}</p>
          <p className="text-xs text-marrom/60">{aberta.canal}{aberta.assunto && ` · ${aberta.assunto}`}</p>
          <div className="my-4 flex-1 space-y-2">
            <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-areia/60 p-3 text-sm">{aberta.trecho}</div>
            {(enviadas[aberta.id] ?? []).map((r, i) => <div key={i} className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-ouro p-3 text-sm text-tinta">{r}</div>)}
          </div>
          <div className="mb-2 flex flex-wrap gap-1">{RAPIDAS.map((r) => <button key={r} onClick={() => setResposta(r)} className="rounded-full border border-areia px-2 py-1 text-[11px] hover:bg-blush">{r.slice(0, 34)}…</button>)}</div>
          <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (!resposta) return; setEnviadas({ ...enviadas, [aberta.id]: [...(enviadas[aberta.id] ?? []), resposta] }); setResposta(''); }}>
            <input className="campo" value={resposta} onChange={(e) => setResposta(e.target.value)} placeholder="Responder…" />
            <button className="btn-ouro">Enviar</button>
          </form>
        </div>
      </div>
    </>
  );
}
