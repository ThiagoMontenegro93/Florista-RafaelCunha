'use client';

import { useEffect, useMemo, useState } from 'react';
import { TEMPLATES } from '@/data/prospeccao';
import { useAtelie } from '@/lib/store';
import { Titulo, Aviso } from '@/components/admin/ui';
import { cn } from '@/lib/format';
import { planejarEnvios } from '@/lib/plano-envios';

const CANAIS = [
  { id: 'Email', nota: 'via rafaelsoaresdecor@gmail.com / domínio autenticado' },
  { id: 'WhatsApp', nota: 'só após primeiro contato · máx 50/dia' },
  { id: 'Instagram DM', nota: 'manual · máx 20/dia' },
  { id: 'Telegram', nota: 'bot' },
  { id: 'LinkedIn', nota: 'máx 25 conexões/dia' },
];
const VARS = ['{nome}', '{empresa}', '{igreja}', '{nicho}', '{portfolio_link}'];

export default function CampanhasPage() {
  const { leads } = useAtelie();
  const [nome, setNome] = useState('Parceria Igrejas Dezembro Casamentos');
  const [nicho, setNicho] = useState('Igreja');
  const [tpl, setTpl] = useState(TEMPLATES[0].id);
  const [texto, setTexto] = useState(TEMPLATES[0].texto);
  const [anexos, setAnexos] = useState(['Portfólio PDF', 'Link Instagram']);
  const [canais, setCanais] = useState(['Email']);
  const [modo, setModo] = useState<'agora' | 'agendar'>('agendar');
  const [limite, setLimite] = useState(50);
  const [selecionados, setSelecionados] = useState<number[]>([]);
  const [criada, setCriada] = useState<Date[] | null>(null);

  useEffect(() => { try { setSelecionados(JSON.parse(localStorage.getItem('campanha-leads') ?? '[]')); } catch {} }, []);
  const alvo = selecionados.length ? leads.filter((l) => selecionados.includes(l.id)) : leads.filter((l) => l.nicho === nicho && l.status !== 'Sem interesse');
  const exemplo = alvo[0] ?? leads[0];
  const preview = useMemo(() => texto.replaceAll('{nome}', exemplo.responsavel || exemplo.nome).replaceAll('{empresa}', exemplo.nome).replaceAll('{igreja}', exemplo.nome).replaceAll('{nicho}', exemplo.nicho.toLowerCase()).replaceAll('{portfolio_link}', 'florista-rafaelcunha.com.br/portfolio'), [texto, exemplo]);

  return (
    <>
      <Titulo kicker="Prospecção · só admin" titulo="Campanhas" />
      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <form className="card-admin space-y-4" onSubmit={(e) => { e.preventDefault(); setCriada(planejarEnvios(alvo.length * canais.length, { limiteDiario: limite, agora: modo === 'agora' ? new Date() : undefined })); }}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><label className="rotulo">Nome da campanha</label><input className="campo" value={nome} onChange={(e) => setNome(e.target.value)} /></div>
            <div><label className="rotulo">Nicho alvo</label><select className="campo" value={nicho} onChange={(e) => setNicho(e.target.value)}>{['Igreja', 'Casa de Festa', 'Casa de Show', 'Empresa', 'Hotel', 'Buffet'].map((n) => <option key={n}>{n}</option>)}</select></div>
          </div>
          <p className="text-xs text-marrom/60">{alvo.length} leads {selecionados.length ? 'selecionados na tabela' : `do nicho ${nicho}`} {selecionados.length > 0 && <button type="button" className="text-ouro underline" onClick={() => { setSelecionados([]); localStorage.removeItem('campanha-leads'); }}>limpar seleção</button>}</p>
          <div><label className="rotulo">Template</label>
            <select className="campo" value={tpl} onChange={(e) => { setTpl(e.target.value); setTexto(TEMPLATES.find((t) => t.id === e.target.value)!.texto); }}>{TEMPLATES.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}</select></div>
          <div>
            <div className="mb-1 flex flex-wrap gap-1">{VARS.map((v) => <button type="button" key={v} onClick={() => setTexto(texto + ' ' + v)} className="rounded-full bg-areia px-2 py-0.5 text-xs">{v}</button>)}</div>
            <textarea className="campo font-mono text-xs" rows={9} value={texto} onChange={(e) => setTexto(e.target.value)} />
            {!/sair|descadastr/i.test(texto) && <p className="mt-1 text-xs text-rosa">⚠️ Inclua uma opção de descadastro (LGPD).</p>}
          </div>
          <div><label className="rotulo">Anexos</label>
            <div className="flex flex-wrap gap-3 text-sm">{['Portfólio PDF', 'Link Instagram', 'Link do site'].map((a) => <label key={a} className="flex items-center gap-1.5"><input type="checkbox" className="accent-ouro" checked={anexos.includes(a)} onChange={() => setAnexos((x) => (x.includes(a) ? x.filter((y) => y !== a) : [...x, a]))} />{a}</label>)}</div></div>
          <div><label className="rotulo">Canais</label>
            <div className="grid gap-2 sm:grid-cols-2">{CANAIS.map((c) => (
              <label key={c.id} className={cn('flex cursor-pointer items-start gap-2 rounded-xl border p-2.5 text-sm', canais.includes(c.id) ? 'border-ouro bg-blush' : 'border-areia')}>
                <input type="checkbox" className="mt-0.5 accent-ouro" checked={canais.includes(c.id)} onChange={() => setCanais((x) => (x.includes(c.id) ? x.filter((y) => y !== c.id) : [...x, c.id]))} />
                <span>{c.id}<span className="block text-[11px] text-marrom/60">{c.nota}</span></span></label>
            ))}</div></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><label className="rotulo">Agendamento</label>
              <div className="flex gap-2">{[['agora', 'Enviar agora'], ['agendar', 'Distribuição inteligente']].map(([v, t]) => <button type="button" key={v} onClick={() => setModo(v as 'agora' | 'agendar')} className={cn('flex-1 rounded-full border px-3 py-2 text-xs', modo === v ? 'border-ouro bg-blush' : 'border-areia')}>{t}</button>)}</div>
              <p className="mt-1 text-[11px] text-marrom/60">20 por hora, das 9h às 18h, 3-5 min entre envios.</p></div>
            <div><label className="rotulo">Limite diário: {limite}</label>
              <input type="range" min={100} max={400} step={10} value={Math.max(limite, 100)} onChange={(e) => setLimite(+e.target.value)} className="w-full accent-ouro" />
              <button type="button" className="text-[11px] text-ouro underline" onClick={() => setLimite(50)}>usar 50/dia (aquecimento)</button></div>
          </div>
          <Aviso tom="rosa">Recomendado começar com 50/dia e aquecer o domínio por 14 dias antes de chegar a 100-400/dia.</Aviso>
          <button className="btn-ouro w-full" disabled={!canais.length || !alvo.length}>Criar campanha “{nome}”</button>
          {criada && (
            <Aviso tom="salvia">
              ✅ {criada.length} envios na fila BullMQ. Primeiro: {criada[0]?.toLocaleString('pt-BR')} · último: {criada.at(-1)?.toLocaleString('pt-BR')}.
            </Aviso>
          )}
        </form>
        <div className="card-admin h-fit">
          <p className="rotulo">Prévia para {exemplo.nome}</p>
          <div className="whitespace-pre-wrap rounded-xl border border-areia bg-creme p-4 text-sm leading-relaxed">{preview}</div>
          <p className="mt-2 text-xs text-marrom/60">Anexos: {anexos.join(', ') || 'nenhum'}</p>
        </div>
      </div>
    </>
  );
}
