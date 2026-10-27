'use client';

import { useMemo, useRef, useState } from 'react';
import { useAtelie } from '@/lib/store';
import type { Lead, Nicho, StatusLead } from '@/data/prospeccao';
import { Titulo, Aviso, STATUS_COR, FONTE_COR } from '@/components/admin/ui';
import { cn } from '@/lib/format';

const NICHOS: Nicho[] = ['Casa de Show', 'Casa de Festa', 'Igreja', 'Empresa', 'Hotel', 'Buffet'];
const STATUS: StatusLead[] = ['Novo', 'Contatado', 'Respondeu', 'Reunião', 'Fechado', 'Sem interesse'];

export default function LeadsPage() {
  const { leads, set } = useAtelie();
  const [f, setF] = useState({ nicho: '', cidade: '', status: '', nunca: false, q: '' });
  const [sel, setSel] = useState<number[]>([]);
  const [manual, setManual] = useState(false);
  const [msg, setMsg] = useState('');
  const arquivo = useRef<HTMLInputElement>(null);
  const cidades = Array.from(new Set(leads.map((l) => l.cidade))).sort();
  const lista = useMemo(() => leads.filter((l) => (!f.nicho || l.nicho === f.nicho) && (!f.cidade || l.cidade === f.cidade) && (!f.status || l.status === f.status) && (!f.nunca || !l.ultimoContato) && (!f.q || l.nome.toLowerCase().includes(f.q.toLowerCase()))), [leads, f]);

  const importarCSV = async (file: File) => {
    const linhas = (await file.text()).split(/\r?\n/).filter(Boolean);
    const cab = linhas.shift()!.split(/[;,]/).map((c) => c.trim().toLowerCase());
    const idx = (k: string) => cab.findIndex((c) => c.includes(k));
    let n = 0;
    set('leads', (ls) => {
      const novos = [...ls];
      for (const linha of linhas) {
        const c = linha.split(/[;,]/);
        const tel = c[idx('telefone')] ?? c[idx('whats')] ?? '';
        if (tel && novos.some((l) => l.whatsapp.replace(/\D/g, '') === tel.replace(/\D/g, ''))) continue; // deduplicação
        novos.push({ id: Date.now() + n, nome: c[idx('nome')] ?? 'Sem nome', nicho: 'Casa de Festa', cidade: c[idx('cidade')] ?? 'Rio de Janeiro', responsavel: '', email: c[idx('email')] ?? '', whatsapp: tel, instagram: '', status: 'Novo', ultimoContato: null, score: 50, fonte: 'CSV' });
        n++;
      }
      return novos;
    });
    setMsg(`${n} leads importados (duplicados ignorados).`);
  };

  return (
    <>
      <Titulo kicker="Prospecção · só admin" titulo={`Leads · ${leads.length}`}>
        <button className="btn-linha" onClick={() => arquivo.current?.click()}>Importar CSV</button>
        <input ref={arquivo} type="file" accept=".csv" hidden onChange={(e) => e.target.files?.[0] && importarCSV(e.target.files[0])} />
        <button className="btn-linha" onClick={() => setManual(!manual)}>Adicionar manual</button>
        <button className="btn-linha" onClick={() => { set('leads', (ls) => ls.map((l) => (sel.includes(l.id) && !l.instagram ? { ...l, instagram: '@' + l.nome.toLowerCase().replace(/[^a-z]/g, '').slice(0, 14) } : l))); setMsg('Enriquecimento: Instagram buscado nos sites dos selecionados (demo).'); }}>Enriquecer (Instagram)</button>
      </Titulo>
      <Aviso tom="salvia">🔒 LGPD: apenas contatos com interesse legítimo B2B (empresas, igrejas, casas de festa). Toda mensagem leva opção de opt-out e quem pedir sai da lista na hora.</Aviso>
      {msg && <p className="mt-3 text-sm text-salvia">{msg}</p>}
      {manual && <FormManual onAdd={(l) => { set('leads', (ls) => [...ls, l]); setManual(false); }} />}

      <div className="mt-4 flex flex-wrap items-end gap-2">
        <input className="campo w-48" placeholder="Buscar nome" value={f.q} onChange={(e) => setF({ ...f, q: e.target.value })} />
        <select className="campo w-40" value={f.nicho} onChange={(e) => setF({ ...f, nicho: e.target.value })}><option value="">Todos os nichos</option>{NICHOS.map((n) => <option key={n}>{n}</option>)}</select>
        <select className="campo w-44" value={f.cidade} onChange={(e) => setF({ ...f, cidade: e.target.value })}><option value="">Todas as cidades</option>{cidades.map((n) => <option key={n}>{n}</option>)}</select>
        <select className="campo w-40" value={f.status} onChange={(e) => setF({ ...f, status: e.target.value })}><option value="">Todos status</option>{STATUS.map((n) => <option key={n}>{n}</option>)}</select>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-ouro" checked={f.nunca} onChange={(e) => setF({ ...f, nunca: e.target.checked })} />Nunca contatado</label>
        <div className="ml-auto flex items-center gap-2">
          <button className="btn-linha !py-2" onClick={() => setSel(lista.slice(0, 50).map((l) => l.id))}>Selecionar 50</button>
          <button className="btn-ouro !py-2" disabled={!sel.length} onClick={() => { localStorage.setItem('campanha-leads', JSON.stringify(sel)); window.location.href = '/admin/prospeccao/campanhas'; }}>Adicionar à campanha ({sel.length})</button>
        </div>
      </div>

      <div className="card-admin mt-4 overflow-x-auto p-0">
        <table className="tabela w-full min-w-[1100px]">
          <thead><tr><th><input type="checkbox" className="accent-ouro" checked={sel.length > 0 && sel.length === lista.length} onChange={(e) => setSel(e.target.checked ? lista.map((l) => l.id) : [])} /></th><th>Nome</th><th>Nicho</th><th>Cidade</th><th>Responsável</th><th>Email</th><th>WhatsApp</th><th>Instagram</th><th>Status</th><th>Último contato</th><th>Score</th><th>Fonte</th></tr></thead>
          <tbody>{lista.map((l) => (
            <tr key={l.id} className={cn(sel.includes(l.id) && 'bg-blush/50')}>
              <td><input type="checkbox" className="accent-ouro" checked={sel.includes(l.id)} onChange={() => setSel((s) => (s.includes(l.id) ? s.filter((x) => x !== l.id) : [...s, l.id]))} /></td>
              <td className="font-medium">{l.nome}</td><td>{l.nicho}</td><td>{l.cidade}</td><td>{l.responsavel}</td><td className="text-xs">{l.email}</td><td className="text-xs">{l.whatsapp}</td><td className="text-xs">{l.instagram}</td>
              <td><select value={l.status} onChange={(e) => set('leads', (ls) => ls.map((x) => (x.id === l.id ? { ...x, status: e.target.value as StatusLead } : x)))} className={cn('rounded-full border-0 px-2 py-1 text-xs', STATUS_COR[l.status])}>{STATUS.map((s) => <option key={s}>{s}</option>)}</select></td>
              <td className="text-xs">{l.ultimoContato?.split('-').reverse().join('/') ?? '—'}</td>
              <td><span className={cn('font-semibold', l.score >= 80 ? 'text-salvia' : l.score >= 60 ? 'text-ouro' : 'text-marrom/50')}>{l.score}</span></td>
              <td><span className={cn('pill text-[10px]', FONTE_COR[l.fonte])}>{l.fonte}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </>
  );
}

function FormManual({ onAdd }: { onAdd: (l: Lead) => void }) {
  const [l, setL] = useState({ nome: '', nicho: 'Igreja' as Nicho, cidade: 'Rio de Janeiro', responsavel: '', email: '', whatsapp: '', instagram: '' });
  return (
    <form className="card-admin mt-4 grid gap-2 sm:grid-cols-4" onSubmit={(e) => { e.preventDefault(); onAdd({ ...l, id: Date.now(), status: 'Novo', ultimoContato: null, score: 60, fonte: 'Manual' }); }}>
      <input required className="campo" placeholder="Nome" value={l.nome} onChange={(e) => setL({ ...l, nome: e.target.value })} />
      <select className="campo" value={l.nicho} onChange={(e) => setL({ ...l, nicho: e.target.value as Nicho })}>{NICHOS.map((n) => <option key={n}>{n}</option>)}</select>
      <input className="campo" placeholder="Cidade" value={l.cidade} onChange={(e) => setL({ ...l, cidade: e.target.value })} />
      <input className="campo" placeholder="Responsável" value={l.responsavel} onChange={(e) => setL({ ...l, responsavel: e.target.value })} />
      <input className="campo" placeholder="Email" value={l.email} onChange={(e) => setL({ ...l, email: e.target.value })} />
      <input className="campo" placeholder="WhatsApp" value={l.whatsapp} onChange={(e) => setL({ ...l, whatsapp: e.target.value })} />
      <input className="campo" placeholder="@instagram" value={l.instagram} onChange={(e) => setL({ ...l, instagram: e.target.value })} />
      <button className="btn-ouro">Salvar lead</button>
    </form>
  );
}
