'use client';

import { useMemo, useState } from 'react';
import { useAtelie } from '@/lib/store';
import { UFS } from '@/data/ufs';
import { MUNICIPIOS_RJ, PRINCIPAIS_RJ, REGIOES } from '@/data/municipios';
import { MapaBrasil } from '@/components/MapaBrasil';
import { Titulo, Toggle, Aviso, Kpi } from '@/components/admin/ui';
import { cn } from '@/lib/format';

const EXPANSAO = [
  { uf: 'SP', municipios: 645, estimativa: 3200, custo: 120, fase: 'Fase 2 · Q1 2027' },
  { uf: 'MG', municipios: 853, estimativa: 2100, custo: 85, fase: 'Fase 3' },
  { uf: 'ES', municipios: 78, estimativa: 420, custo: 18, fase: 'Fase 3' },
];

export default function EstadosPage() {
  const { ufsAtivas, set, municipiosOff } = useAtelie();
  const [modal, setModal] = useState<string | null>(null);
  const [regiao, setRegiao] = useState('');
  const [busca, setBusca] = useState('');
  const [verTodos, setVerTodos] = useState(false);
  const [simulado, setSimulado] = useState<string | null>(null);
  const [ibgeMsg, setIbgeMsg] = useState('');
  const [aviso, setAviso] = useState(false);

  const lista = useMemo(() => MUNICIPIOS_RJ.filter((m) => (!regiao || m.regiao === regiao) && (!busca || m.nome.toLowerCase().includes(busca.toLowerCase()))), [regiao, busca]);
  const ativosRJ = 92 - municipiosOff.length;
  const toggleMun = (slug: string) => {
    if (!municipiosOff.includes(slug)) setAviso(true);
    set('municipiosOff', (off) => (off.includes(slug) ? off.filter((s) => s !== slug) : [...off, slug]));
  };
  const ativarUF = (uf: string, on: boolean) => set('ufsAtivas', (u) => (on ? Array.from(new Set([...u, uf])) : u.filter((x) => x !== uf)));
  const importarIBGE = async () => {
    const r = await fetch('/api/admin/ibge/RJ');
    const j = await r.json();
    setIbgeMsg(r.ok ? `${j.municipios.length} municípios recebidos (fonte: ${j.fonte}).` : 'IBGE indisponível.');
  };

  return (
    <>
      <Titulo kicker="Área de atendimento" titulo="Estados e municípios" />
      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <div className="card-admin">
          <MapaBrasil modo="ufs" ufsAtivas={ufsAtivas} onSelect={(uf) => (ufsAtivas.includes(uf) ? null : setModal(uf))} className="w-full" />
          <p className="text-center text-xs text-marrom/60">Clique num estado com contorno tracejado para + Adicionar</p>
        </div>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Kpi rotulo="Municípios RJ ativos" valor={ativosRJ} sub="de 92" cor="text-ouro" />
            <Kpi rotulo="População" valor="17M" sub="IBGE 2022" />
            <Kpi rotulo="Área" valor="43.750 km²" />
          </div>
          <div className="card-admin">
            <p className="rotulo">12 principais</p>
            <div className="flex flex-wrap gap-2">{PRINCIPAIS_RJ.map((p) => <span key={p} className="pill border border-ouro/40 bg-blush/60">{p}</span>)}<button className="text-sm text-ouro underline" onClick={() => setVerTodos(true)}>ver todos</button></div>
          </div>
          <Aviso tom="salvia">
            <b>Impacto automático:</b> badge da loja “Entregamos em {ufsAtivas.join(' + ')}” · Hunter CNPJ filtra UF={ufsAtivas.join(',')} · Hunter Maps busca “casa de festas em &lt;município&gt;” para cada município ativo · SEO gera landing pages /&lt;cidade&gt;/igrejas · Agenda bloqueia por município.
          </Aviso>
        </div>
      </div>

      <div className="card-admin mt-6 overflow-x-auto p-0">
        <p className="p-4 font-serif text-2xl">Configurar estados</p>
        <table className="tabela w-full min-w-[620px]"><thead><tr><th>UF</th><th>Estado</th><th>Região</th><th>Municípios</th><th>Status</th><th></th></tr></thead>
          <tbody>{UFS.map((u) => {
            const on = ufsAtivas.includes(u.sigla);
            return (
              <tr key={u.sigla}><td className="font-semibold">{u.sigla}</td><td>{u.nome}</td><td>{u.regiao}</td><td>{u.sigla === 'RJ' ? `${ativosRJ}/92` : u.municipios}</td>
                <td><span className={cn('pill', on ? 'bg-emerald-400/10 text-emerald-700 dark:text-emerald-300' : 'bg-realce/5 text-marrom/40')}>{on ? 'Ativo' : 'Inativo'}</span></td>
                <td className="flex items-center gap-2">
                  <Toggle on={on} label={u.nome} onChange={(v) => (v ? setModal(u.sigla) : u.sigla === 'RJ' ? alert('RJ é a base do ateliê.') : ativarUF(u.sigla, false))} />
                  <button className="text-xs text-ouro underline" onClick={() => (u.sigla === 'RJ' ? setVerTodos(true) : setModal(u.sigla))}>{on ? 'Configurar' : 'Ativar'}</button>
                </td></tr>
            );
          })}</tbody></table>
      </div>

      {(verTodos || regiao || busca) && (
        <div className="card-admin mt-6">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <p className="mr-auto font-serif text-2xl">Municípios RJ · {lista.length}</p>
            <input className="campo w-48" placeholder="Buscar (ex: Niterói)" value={busca} onChange={(e) => setBusca(e.target.value)} />
            <select className="campo w-44" value={regiao} onChange={(e) => setRegiao(e.target.value)}><option value="">Todas as regiões</option>{REGIOES.map((r) => <option key={r}>{r}</option>)}</select>
            <button className="btn-linha !py-2" onClick={() => set('municipiosOff', [])}>Marcar todos</button>
            <button className="btn-linha !py-2" onClick={() => { setAviso(true); set('municipiosOff', MUNICIPIOS_RJ.map((m) => m.slug)); }}>Desmarcar todos</button>
            <button className="btn-ouro !py-2" onClick={importarIBGE}>Importar lista IBGE</button>
          </div>
          {ibgeMsg && <p className="mb-2 text-xs text-salvia">{ibgeMsg} GET servicodados.ibge.gov.br/api/v1/localidades/estados/RJ/municipios</p>}
          {aviso && <Aviso tom="rosa">Ao desmarcar um município, os leads dele ficam pausados (não são apagados).</Aviso>}
          <div className="mt-3 grid gap-1 sm:grid-cols-2 lg:grid-cols-4">
            {lista.map((m) => (
              <label key={m.slug} className="flex items-center gap-2 rounded-lg px-2 py-1 text-sm hover:bg-blush/50">
                <input type="checkbox" className="accent-ouro" checked={!municipiosOff.includes(m.slug)} onChange={() => toggleMun(m.slug)} />
                {m.nome}<span className="ml-auto text-[10px] text-marrom/40">{m.regiao}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      {!verTodos && !regiao && !busca && <button className="btn-linha mt-4" onClick={() => setVerTodos(true)}>Ver os 92 municípios do RJ</button>}

      <div className="mt-6">
        <p className="mb-3 font-serif text-2xl">Expansão futura</p>
        <div className="mb-4 flex items-center gap-2 text-xs">
          {['RJ · Fase 1 (agora)', 'SP · Fase 2 (Q1 2027)', 'MG + ES · Fase 3'].map((f, i) => <span key={f} className={cn('flex items-center gap-2', i > 0 && "before:h-px before:w-8 before:bg-ouro before:content-['']")}><span className={cn('pill', i === 0 ? 'bg-ouro text-tinta' : 'border border-ouro/50')}>{f}</span></span>)}
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {EXPANSAO.map((e) => (
            <div key={e.uf} className="card-admin">
              <p className="font-serif text-3xl">{e.uf} <span className="text-sm text-marrom/60">{e.municipios} municípios</span></p>
              <p className="text-xs text-marrom/60">{e.fase}</p>
              <button className="btn-linha mt-3 !py-1.5 text-xs" onClick={() => setSimulado(e.uf)}>Simular expansão</button>
              {simulado === e.uf && (
                <div className="mt-3 rounded-xl bg-blush/60 p-3 text-sm">
                  ~{e.estimativa.toLocaleString('pt-BR')} casas de festa e igrejas (CNPJ + Maps)<br />
                  Custo Places API: <b>~US$ {e.custo}/mês</b> (+{e.municipios} municípios)
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-veu/30 p-4" onClick={() => setModal(null)}>
          <div className="card-admin w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <p className="font-serif text-2xl">Ativar {UFS.find((u) => u.sigla === modal)?.nome}</p>
            <div className="mt-4 space-y-2">
              {['Todo o estado', 'Selecionar municípios', 'Apenas capital e região metropolitana'].map((o) => (
                <button key={o} className="w-full rounded-xl border border-areia p-3 text-left text-sm hover:border-ouro hover:bg-blush" onClick={() => { ativarUF(modal, true); setModal(null); }}>{o}</button>
              ))}
            </div>
            <p className="mt-3 text-xs text-marrom/60">Lista oficial via IBGE_API: /estados/{modal}/municipios</p>
          </div>
        </div>
      )}
    </>
  );
}
