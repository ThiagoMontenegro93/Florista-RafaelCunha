'use client';

import { useState } from 'react';
import { Titulo, Barras, Aviso } from '@/components/admin/ui';

const NICHOS = [
  { n: 'Igreja', entrega: 97, abertura: 54, resposta: 31 },
  { n: 'Casa de Festa', entrega: 95, abertura: 46, resposta: 24 },
  { n: 'Hotel', entrega: 96, abertura: 38, resposta: 18 },
  { n: 'Buffet', entrega: 94, abertura: 41, resposta: 21 },
  { n: 'Empresa', entrega: 92, abertura: 29, resposta: 12 },
];
const BLOQUEIOS = [
  { contato: 'contato@lapanobre.com', motivo: 'Respondeu “não tenho interesse” · removido', quando: '01/10' },
  { contato: 'eventos@antigo-buffet.com.br', motivo: 'Hard bounce · caixa inexistente', quando: '28/09' },
  { contato: '(21) 3000-0000', motivo: 'WhatsApp sem opt-in · bloqueado pela regra', quando: '25/09' },
  { contato: 'adm@hotelx.com', motivo: 'Soft bounce · caixa cheia (3 tentativas)', quando: '22/09' },
];
const CHECK = ['Link de descadastro em todas as mensagens', 'Nunca comprar listas de contatos', 'Somente contatos B2B com interesse legítimo', 'Remover em até 24h quem pedir', 'Registrar a origem de cada lead (CNPJ, Maps, CSV)', 'Domínio com DKIM, SPF e DMARC'];

export default function RelatoriosPage() {
  const [ok, setOk] = useState<string[]>(CHECK.slice(0, 4));
  return (
    <>
      <Titulo kicker="Prospecção · só admin" titulo="Relatórios e anti-spam" />
      <div className="rounded-2xl border-2 border-ouro bg-blush/60 p-6">
        <p className="font-serif text-2xl">Para 100-400 envios/dia sem cair no spam</p>
        <ol className="mt-3 grid gap-2 text-sm sm:grid-cols-5">
          {['Domínio autenticado (DKIM/SPF/DMARC)', 'Aquecimento de 14 dias (20 → 400/dia)', 'Personalização real: {nome}, {empresa}', 'Intervalo de 3-5 min entre envios', 'Parar na hora ao receber “não tenho interesse”'].map((t, i) => (
            <li key={t} className="rounded-xl bg-vidro p-3"><span className="font-serif text-2xl text-ouro">{i + 1}</span><p>{t}</p></li>
          ))}
        </ol>
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        {(['entrega', 'abertura', 'resposta'] as const).map((k, i) => (
          <div key={k} className="card-admin">
            <p className="mb-3 font-serif text-2xl capitalize">Taxa de {k}</p>
            <Barras max={100} dados={NICHOS.map((n) => ({ rotulo: n.n, valor: n[k], cor: ['#8A9A7B', '#B08D57', '#D4A5A5'][i] }))} />
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="card-admin">
          <p className="mb-3 font-serif text-2xl">Bloqueios e bounces</p>
          <table className="tabela w-full"><thead><tr><th>Contato</th><th>Motivo</th><th>Data</th></tr></thead>
            <tbody>{BLOQUEIOS.map((b) => <tr key={b.contato}><td className="text-xs">{b.contato}</td><td className="text-xs">{b.motivo}</td><td className="text-xs">{b.quando}</td></tr>)}</tbody></table>
        </div>
        <div className="card-admin">
          <p className="mb-3 font-serif text-2xl">Checklist LGPD</p>
          {CHECK.map((c) => <label key={c} className="flex items-center gap-2 py-1 text-sm"><input type="checkbox" className="accent-ouro" checked={ok.includes(c)} onChange={() => setOk((x) => (x.includes(c) ? x.filter((y) => y !== c) : [...x, c]))} />{c}</label>)}
          {ok.length < CHECK.length && <div className="mt-3"><Aviso tom="rosa">{CHECK.length - ok.length} item(ns) pendente(s) antes de escalar o volume.</Aviso></div>}
        </div>
      </div>
    </>
  );
}
