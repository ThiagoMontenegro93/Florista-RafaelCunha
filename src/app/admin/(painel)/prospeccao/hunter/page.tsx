'use client';

import { useMemo, useState } from 'react';
import { CNAES, REPOS_GITHUB, type Lead } from '@/data/prospeccao';
import { useAtelie } from '@/lib/store';
import { Titulo, Aviso, FONTE_COR } from '@/components/admin/ui';
import { cn } from '@/lib/format';
import { MUNICIPIOS_RJ } from '@/data/municipios';

type Place = { id: string; displayName: { text: string }; formattedAddress: string; nationalPhoneNumber?: string; websiteUri?: string; rating?: number; userRatingCount?: number; location?: { latitude: number; longitude: number } };
type Empresa = { cnpj: string; razao: string; fantasia: string; endereco: string; telefone: string; email: string; cnae: string; abertura: string; capital: number; municipio?: string; situacao?: string };

const CNPJ_MOCK: Empresa[] = [
  { cnpj: '12.345.678/0001-90', razao: 'SOLAR REAL EVENTOS LTDA', fantasia: 'Solar Real', endereco: 'Estr. do Joá, 500 - Barra da Tijuca, Rio de Janeiro/RJ', telefone: '(21) 98888-1010', email: 'eventos@solarreal.com.br', cnae: '8230-0/02 Casas de festas e eventos', abertura: '2009-03-12', capital: 500000 },
  { cnpj: '45.678.901/0001-23', razao: 'BUFFET LUZ DO RIO LTDA', fantasia: 'Buffet Luz do Rio', endereco: 'R. Conde de Bonfim, 800 - Tijuca, Rio de Janeiro/RJ', telefone: '(21) 3456-7788', email: 'contato@luzdorio.com.br', cnae: '5620-1/02 Buffet', abertura: '2015-08-01', capital: 120000 },
  { cnpj: '56.789.012/0001-34', razao: 'PAROQUIA NOSSA SENHORA DA PAZ', fantasia: 'Paróquia N. Sra. da Paz', endereco: 'Praça N. Sra. da Paz - Ipanema, Rio de Janeiro/RJ', telefone: '(21) 2522-1155', email: 'secretaria@nspaz.org.br', cnae: '9491-0/00 Organizações religiosas', abertura: '1972-05-20', capital: 0 },
  { cnpj: '67.890.123/0001-45', razao: 'CASA DE SHOW NITEROI LTDA', fantasia: 'Arena Icaraí', endereco: 'R. Moreira César, 200 - Icaraí, Niterói/RJ', telefone: '(21) 2610-3030', email: 'booking@arenaicarai.com.br', cnae: '9001-9/02 Produção musical', abertura: '2018-11-10', capital: 80000 },
];

const scoreEmpresa = (e: Empresa) => Math.min(99, 50 + Math.min(30, new Date().getFullYear() - +e.abertura.slice(0, 4)) + (e.email ? 10 : 0) + (e.capital > 100000 ? 9 : 0));
const scorePlace = (p: Place) => Math.min(99, Math.round((p.rating ?? 3) * 12 + Math.min(30, Math.log10((p.userRatingCount ?? 1) + 1) * 10)));

export default function HunterPage() {
  const { leads, set } = useAtelie();
  const [aba, setAba] = useState<'cnpj' | 'maps' | 'github' | 'unificado'>('cnpj');
  const [msg, setMsg] = useState('');

  const importar = (novos: Omit<Lead, 'id'>[]) => {
    let add = 0, dup = 0;
    set('leads', (ls) => {
      const r = [...ls];
      for (const n of novos) {
        const tel = n.whatsapp.replace(/\D/g, '');
        if (r.some((l) => (n.cnpj && l.cnpj === n.cnpj) || (tel && l.whatsapp.replace(/\D/g, '') === tel))) { dup++; continue; }
        r.push({ ...n, id: Date.now() + add }); add++;
      }
      return r;
    });
    setMsg(`${add} lead(s) importado(s), ${dup} duplicado(s) ignorado(s) por CNPJ/telefone.`);
  };

  return (
    <>
      <Titulo kicker="Prospecção · só admin" titulo="Hunter automático" />
      <div className="mb-4 flex flex-wrap gap-1">{[['cnpj', 'CNPJ · BrasilAPI'], ['maps', 'Google Maps · Places API'], ['github', 'GitHub · open-source'], ['unificado', 'Leads encontrados']].map(([v, t]) => <button key={v} onClick={() => setAba(v as typeof aba)} className={cn('rounded-full border px-4 py-2 text-sm', aba === v ? 'border-champanhe bg-gradient-to-r from-champanhe to-ouro text-tinta shadow-brilho' : 'border-areia bg-vidro hover:border-ouro/50')}>{t}</button>)}</div>
      {msg && <Aviso tom="salvia">{msg}</Aviso>}
      <div className="mt-4">
        {aba === 'cnpj' && <HunterCNPJ onImport={(es) => importar(es.map((e) => ({ nome: e.fantasia || e.razao, nicho: e.cnae.startsWith('9491') ? 'Igreja' : e.cnae.startsWith('5620') ? 'Buffet' : e.cnae.startsWith('9001') ? 'Casa de Show' : 'Casa de Festa', cidade: e.municipio ?? e.endereco.split(',').at(-1)?.split('/')[0].split('-').at(-1)?.trim() ?? 'Rio de Janeiro', responsavel: '', email: e.email, whatsapp: e.telefone, instagram: '', status: 'Novo', ultimoContato: null, score: scoreEmpresa(e), fonte: 'CNPJ', cnpj: e.cnpj })))} />}
        {aba === 'maps' && <HunterMaps onImport={(ps) => importar(ps.map((p) => ({ nome: p.displayName.text, nicho: /igreja|paróquia/i.test(p.displayName.text) ? 'Igreja' : 'Casa de Festa', cidade: 'Rio de Janeiro', responsavel: '', email: p.websiteUri ? `contato@${new URL(p.websiteUri).hostname.replace('www.', '')}` : '', whatsapp: p.nationalPhoneNumber ?? '', instagram: '', status: 'Novo', ultimoContato: null, score: scorePlace(p), fonte: 'Google Maps', rating: p.rating })))} />}
        {aba === 'github' && <HunterGitHub />}
        {aba === 'unificado' && <Unificado leads={leads} />}
      </div>
    </>
  );
}

function HunterCNPJ({ onImport }: { onImport: (e: Empresa[]) => void }) {
  const [cnaes, setCnaes] = useState(CNAES.map((c) => c.codigo));
  const [cnpj, setCnpj] = useState('');
  const [res, setRes] = useState<Empresa[]>(CNPJ_MOCK);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const buscar = async () => {
    setCarregando(true); setErro('');
    const r = await fetch(`/api/admin/cnpj/${cnpj.replace(/\D/g, '')}`);
    const j = await r.json();
    setCarregando(false);
    if (!r.ok) return setErro(j.erro);
    if (j.uf !== 'RJ') return setErro(`Empresa em ${j.uf}: fora da área ativa (filtro UF=RJ automático).`);
    setRes((x) => [j, ...x]);
  };
  const filtrado = res.filter((e) => cnaes.some((c) => e.cnae.startsWith(c)));
  return (
    <div className="space-y-4">
      <div className="card-admin grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div>
          <p className="rotulo">CNAEs alvo</p>
          {CNAES.map((c) => <label key={c.codigo} className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-ouro" checked={cnaes.includes(c.codigo)} onChange={() => setCnaes((x) => (x.includes(c.codigo) ? x.filter((y) => y !== c.codigo) : [...x, c.codigo]))} /><code className="text-xs">{c.codigo}</code> {c.nome}</label>)}
          <p className="mt-2 text-xs text-marrom/60">Filtros fixos: Situação Ativa · UF RJ (estados ativos) · Cidade Rio de Janeiro e municípios ativos.</p>
        </div>
        <div>
          <p className="rotulo">Consultar CNPJ (BrasilAPI ao vivo)</p>
          <div className="flex gap-2"><input className="campo" placeholder="00.000.000/0001-00" value={cnpj} onChange={(e) => setCnpj(e.target.value)} /><button className="btn-ouro !py-2" onClick={buscar} disabled={carregando}>{carregando ? '…' : 'Buscar'}</button></div>
          {erro && <p className="mt-1 text-xs text-rosa">{erro}</p>}
          <pre className="mt-3 overflow-x-auto rounded-xl border border-areia bg-veu/60 p-3 font-mono text-[11px] text-champanhe/80">{`// Exemplo
const r = await fetch('https://brasilapi.com.br/api/cnpj/v1/' + cnpj);
const { razao_social, nome_fantasia, cnae_fiscal, uf } = await r.json();
// Busca em massa por CNAE: Econodata / ReceitaWS (planos pagos)`}</pre>
        </div>
      </div>
      <div className="card-admin overflow-x-auto p-0">
        <div className="flex items-center justify-between p-4"><p className="font-serif text-xl">{filtrado.length} empresas</p><button className="btn-ouro !py-2" onClick={() => onImport(filtrado)}>Importar para Leads + enriquecer</button></div>
        <table className="tabela w-full min-w-[1000px]"><thead><tr><th>CNPJ</th><th>Razão</th><th>Fantasia</th><th>Endereço</th><th>Telefone</th><th>Email</th><th>CNAE</th><th>Abertura</th><th>Capital</th><th>Score</th></tr></thead>
          <tbody>{filtrado.map((e) => <tr key={e.cnpj}><td className="text-xs">{e.cnpj}</td><td className="text-xs">{e.razao}</td><td className="font-medium">{e.fantasia}</td><td className="text-xs">{e.endereco}</td><td className="text-xs">{e.telefone}</td><td className="text-xs">{e.email}</td><td className="text-xs">{e.cnae}</td><td className="text-xs">{e.abertura}</td><td className="text-xs">{e.capital?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td><td className="font-semibold text-salvia">{scoreEmpresa(e)}</td></tr>)}</tbody></table>
      </div>
    </div>
  );
}

function HunterMaps({ onImport }: { onImport: (p: Place[]) => void }) {
  const { municipiosOff } = useAtelie();
  const ativos = MUNICIPIOS_RJ.filter((m) => !municipiosOff.includes(m.slug));
  const [q, setQ] = useState('casa de festas');
  const [cidade, setCidade] = useState('Rio de Janeiro');
  const [raio, setRaio] = useState(15);
  const [limite, setLimite] = useState(60);
  const [res, setRes] = useState<Place[]>([]);
  const [mock, setMock] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const buscar = async () => {
    setCarregando(true);
    const r = await fetch('/api/admin/places', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ textQuery: `${q} em ${cidade} RJ`, raioKm: raio, limite }) });
    const j = await r.json();
    setRes(j.places ?? []); setMock(!!j.mock); setCarregando(false);
  };
  const bounds = useMemo(() => {
    const pts = res.filter((p) => p.location).map((p) => p.location!);
    if (!pts.length) return null;
    const lat = pts.map((p) => p.latitude), lng = pts.map((p) => p.longitude);
    return { minLat: Math.min(...lat) - 0.01, maxLat: Math.max(...lat) + 0.01, minLng: Math.min(...lng) - 0.01, maxLng: Math.max(...lng) + 0.01 };
  }, [res]);
  return (
    <div className="space-y-4">
      <Aviso>⚖️ Use a Places API (New) oficial, cerca de US$ 35 por 1.000 buscas. Scraping direto do Google Maps viola os Termos de Uso.</Aviso>
      <div className="card-admin grid gap-3 md:grid-cols-[1fr_200px_140px_140px_auto] md:items-end">
        <div><label className="rotulo">Busca (textQuery)</label><select className="campo" value={q} onChange={(e) => setQ(e.target.value)}><option>casa de festas</option><option>igrejas para casamento</option><option>buffet de casamento</option><option>hotel para eventos</option></select></div>
        <div><label className="rotulo">Município ativo</label><select className="campo" value={cidade} onChange={(e) => setCidade(e.target.value)}>{ativos.map((m) => <option key={m.slug}>{m.nome}</option>)}</select></div>
        <div><label className="rotulo">Raio {raio} km</label><input type="range" min={1} max={50} value={raio} onChange={(e) => setRaio(+e.target.value)} className="w-full accent-ouro" /></div>
        <div><label className="rotulo">Limite</label><input type="number" className="campo" value={limite} onChange={(e) => setLimite(+e.target.value)} /></div>
        <button className="btn-ouro" onClick={buscar} disabled={carregando}>{carregando ? 'Buscando…' : 'Buscar'}</button>
      </div>
      <pre className="overflow-x-auto rounded-xl border border-areia bg-veu/60 p-3 font-mono text-[11px] text-champanhe/80">{`POST https://places.googleapis.com/v1/places:searchText
X-Goog-Api-Key: GOOGLE_PLACES_API_KEY_AQUI
X-Goog-FieldMask: places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.rating
{ "textQuery": "${q} em ${cidade} RJ", "locationBias": { "circle": { "center": {...}, "radius": ${raio * 1000} } } }`}</pre>
      {res.length > 0 && (
        <>
          {mock && <p className="text-xs text-marrom/60">Resultados de demonstração: configure GOOGLE_PLACES_API_KEY na Central de APIs para buscas reais.</p>}
          <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
            <div className="grid gap-3 sm:grid-cols-2">
              {res.map((p) => (
                <div key={p.id} className="card-admin text-sm">
                  <p className="font-serif text-xl">{p.displayName.text}</p>
                  <p className="text-xs text-marrom/60">{p.formattedAddress}</p>
                  <p className="mt-1">⭐ {p.rating} <span className="text-marrom/50">({p.userRatingCount} reviews)</span> · {p.nationalPhoneNumber}</p>
                  {p.websiteUri && <a className="text-xs text-ouro underline" href={p.websiteUri} target="_blank" rel="noreferrer">{p.websiteUri}</a>}
                  <p className="text-[10px] text-marrom/40">Place ID {p.id}</p>
                </div>
              ))}
            </div>
            <div className="card-admin">
              <p className="rotulo">Mini mapa</p>
              <svg viewBox="0 0 100 100" className="aspect-square w-full rounded-xl border border-areia bg-[radial-gradient(circle,rgb(var(--halo)),rgb(var(--creme)))]">
                <path d="M0 70 C 30 60, 50 80, 100 65" stroke="#8A9A7B" fill="none" strokeWidth=".5" />
                {bounds && res.filter((p) => p.location).map((p) => {
                  const x = ((p.location!.longitude - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 90 + 5;
                  const y = (1 - (p.location!.latitude - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * 90 + 5;
                  return <g key={p.id}><circle cx={x} cy={y} r="2.6" fill="rgb(var(--ouro))" stroke="rgb(var(--creme))" style={{ filter: 'drop-shadow(0 0 4px #EED9A8)' }} strokeWidth=".6" /><title>{p.displayName.text}</title></g>;
                })}
              </svg>
              <button className="btn-ouro mt-3 w-full" onClick={() => onImport(res)}>Importar + enriquecer (email no site)</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function HunterGitHub() {
  const [aberto, setAberto] = useState<string | null>(null);
  return (
    <div className="space-y-4">
      <Aviso>Ferramentas de terceiros: revise o código e os termos de uso antes de usar. Exporte o CSV e use “Importar CSV” em Leads.</Aviso>
      <div className="grid gap-4 md:grid-cols-2">
        {REPOS_GITHUB.map((r) => (
          <div key={r.repo} className="card-admin">
            <div className="flex items-center justify-between"><p className="font-mono text-sm font-semibold">{r.repo}</p><span className="text-xs text-marrom/60">★ {r.estrelas.toLocaleString('pt-BR')}</span></div>
            <p className="mt-1 text-sm text-marrom/70">{r.descricao}</p>
            <div className="mt-3 flex gap-2">
              <a className="btn-linha !py-1.5 text-xs" href={`https://github.com/${r.repo}`} target="_blank" rel="noreferrer">Ver no GitHub</a>
              <button className="btn-ouro !py-1.5 text-xs" onClick={() => setAberto(aberto === r.repo ? null : r.repo)}>Importar lógica</button>
            </div>
            {aberto === r.repo && <pre className="mt-3 overflow-x-auto rounded-xl border border-areia bg-veu/60 p-3 font-mono text-[11px] text-champanhe/80">{r.snippet}</pre>}
          </div>
        ))}
      </div>
    </div>
  );
}

function Unificado({ leads }: { leads: Lead[] }) {
  const [fonte, setFonte] = useState('');
  const lista = leads.filter((l) => !fonte || l.fonte === fonte).sort((a, b) => b.score - a.score);
  return (
    <div className="card-admin overflow-x-auto p-0">
      <div className="flex flex-wrap items-center justify-between gap-2 p-4">
        <div className="flex gap-1 text-xs">{['', 'CNPJ', 'Google Maps', 'GitHub', 'CSV', 'Manual'].map((f) => <button key={f} onClick={() => setFonte(f)} className={cn('rounded-full border px-3 py-1', fonte === f ? 'border-ouro bg-blush' : 'border-areia')}>{f || 'Todas'}</button>)}</div>
        <a href="/admin/prospeccao/campanhas" className="btn-ouro !py-2" onClick={() => localStorage.setItem('campanha-leads', JSON.stringify(lista.slice(0, 100).map((l) => l.id)))}>Prospecção em massa (100) →</a>
      </div>
      <p className="px-4 pb-2 text-xs text-marrom/60">Deduplicação automática por CNPJ e telefone. Score: avaliação no Maps + tempo de empresa no CNPJ.</p>
      <table className="tabela w-full min-w-[760px]"><thead><tr><th>Empresa</th><th>Nicho</th><th>Fonte</th><th>Telefone</th><th>Email</th><th>Score</th></tr></thead>
        <tbody>{lista.map((l) => <tr key={l.id}><td className="font-medium">{l.nome}</td><td>{l.nicho}</td><td><span className={cn('pill text-[10px]', FONTE_COR[l.fonte])}>{l.fonte}</span></td><td className="text-xs">{l.whatsapp}</td><td className="text-xs">{l.email}</td><td className="font-semibold text-salvia">{l.score}</td></tr>)}</tbody></table>
    </div>
  );
}
