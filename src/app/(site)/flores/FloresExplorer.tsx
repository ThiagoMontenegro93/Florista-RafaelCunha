'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { BIOMAS, FLORES, type Bioma, type Flor } from '@/data/flores';
import { MapaBrasil } from '@/components/MapaBrasil';
import { MESES, cn } from '@/lib/format';

function CardFlor({ f }: { f: Flor }) {
  return (
    <article className="moldura overflow-hidden">
      <div className="relative flex h-36 items-center justify-center text-6xl" style={{ background: `radial-gradient(90% 90% at 30% 20%, ${f.aquarela[0]}55, transparent 60%), radial-gradient(80% 80% at 80% 80%, ${f.aquarela[1]}66, transparent 70%), rgb(var(--halo))` }}>
        {f.emoji}
        <span className={cn('pill absolute right-3 top-3 text-[10px]', f.trabalhamos ? 'bg-salvia text-tinta' : 'border border-ouro/50 bg-vidro/80 text-ouro')}>{f.trabalhamos ? 'Trabalhamos' : 'Sob encomenda'}</span>
      </div>
      <div className="space-y-2 p-5 text-sm">
        <h3 className="font-serif text-2xl leading-tight">{f.nome}</h3>
        <p className="italic text-marrom/60">{f.cientifico}</p>
        <p><b className="font-medium">Origem:</b> {f.origem}</p>
        <p><b className="font-medium">Durabilidade:</b> {f.durabilidade[0]}–{f.durabilidade[1]} dias</p>
        <p><b className="font-medium">Quando usar:</b> {f.quandoUsar}</p>
        <div className="flex gap-0.5 pt-1" aria-label="Meses de floração">
          {MESES.map((m, i) => (
            <span key={m} title={m} className={cn('flex h-5 flex-1 items-center justify-center rounded text-[8px]', f.meses.includes(i + 1) ? 'bg-gradient-to-b from-champanhe to-ouro text-tinta' : 'bg-realce/5 text-marrom/30')}>{m[0]}</span>
          ))}
        </div>
      </div>
    </article>
  );
}

export function FloresExplorer() {
  const [bioma, setBioma] = useState<Bioma | null>(null);
  const [cor, setCor] = useState('');
  const [dur, setDur] = useState(0);
  const [ocasiao, setOcasiao] = useState('');
  const [mes, setMes] = useState<number | null>(null);
  const cores = Array.from(new Set(FLORES.flatMap((f) => f.cores))).sort();
  const ocasioes = Array.from(new Set(FLORES.flatMap((f) => f.ocasioes))).sort();
  const lista = useMemo(
    () => FLORES.filter((f) => (!bioma || f.bioma === bioma) && (!cor || f.cores.includes(cor)) && f.durabilidade[1] >= dur && (!ocasiao || f.ocasioes.includes(ocasiao)) && (!mes || f.meses.includes(mes))),
    [bioma, cor, dur, ocasiao, mes],
  );
  return (
    <div className="space-y-12">
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.2fr]">
        <MapaBrasil selecionado={bioma} onSelect={(b) => setBioma(bioma === b ? null : (b as Bioma))} className="mx-auto w-full max-w-md" />
        <div className="space-y-3">
          {BIOMAS.map((b) => (
            <button key={b.nome} onClick={() => setBioma(bioma === b.nome ? null : b.nome)} className={cn('flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition', bioma === b.nome ? 'border-ouro bg-blush' : 'border-areia bg-vidro/80 hover:bg-ouro/10')}>
              <span><span className="font-serif text-xl">{b.nome}</span><span className="ml-2 text-xs text-marrom/60">{b.regiao}</span></span>
              <span className="text-xs text-marrom/60">{FLORES.filter((f) => f.bioma === b.nome).map((f) => f.nome.split(' ')[0]).join(' · ')}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="moldura p-5">
        <p className="kicker mb-3">Calendário de sazonalidade</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr><th className="pb-2 text-left font-normal text-marrom/60">Flor</th>{MESES.map((m, i) => (
                <th key={m} className="pb-2"><button onClick={() => setMes(mes === i + 1 ? null : i + 1)} className={cn('rounded-full px-2 py-0.5 text-xs', mes === i + 1 ? 'bg-ouro text-tinta' : 'text-marrom/60 hover:bg-blush')}>{m}</button></th>
              ))}</tr>
            </thead>
            <tbody>
              {FLORES.map((f) => (
                <tr key={f.slug} className={cn(!lista.includes(f) && 'opacity-30')}>
                  <td className="py-1 pr-2 font-serif">{f.nome.split(' (')[0]}</td>
                  {MESES.map((m, i) => <td key={m} className="text-center">{f.meses.includes(i + 1) ? <span className="inline-block h-2.5 w-2.5 rounded-full bg-gradient-to-br from-champanhe to-ouro shadow-[0_0_8px_rgba(238,217,168,.7)]" /> : <span className="inline-block h-1 w-1 rounded-full bg-areia" />}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div><label className="rotulo">Cor</label><select className="campo" value={cor} onChange={(e) => setCor(e.target.value)}><option value="">Todas</option>{cores.map((c) => <option key={c}>{c}</option>)}</select></div>
        <div><label className="rotulo">Ocasião</label><select className="campo" value={ocasiao} onChange={(e) => setOcasiao(e.target.value)}><option value="">Todas</option>{ocasioes.map((c) => <option key={c}>{c}</option>)}</select></div>
        <div><label className="rotulo">Durabilidade mínima</label><select className="campo" value={dur} onChange={(e) => setDur(+e.target.value)}><option value={0}>Qualquer</option><option value={7}>7+ dias</option><option value={10}>10+ dias</option><option value={14}>14+ dias</option></select></div>
        {(bioma || cor || ocasiao || dur || mes) ? <button className="btn-linha" onClick={() => { setBioma(null); setCor(''); setOcasiao(''); setDur(0); setMes(null); }}>Limpar filtros</button> : null}
        <p className="ml-auto text-sm text-marrom/60">{lista.length} flores</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{lista.map((f) => <CardFlor key={f.slug} f={f} />)}</div>
    </div>
  );
}

export function FlorTeaser() {
  const sudeste = FLORES.filter((f) => f.bioma === 'Sudeste').slice(0, 4);
  return (
    <section className="bg-blush/40 py-20">
      <div className="secao grid items-center gap-10 lg:grid-cols-2">
        <MapaBrasil className="mx-auto w-full max-w-sm" selecionado="Sudeste" />
        <div>
          <p className="kicker">Flores do território brasileiro</p>
          <h2 className="titulo-secao mt-2">Da Amazônia à <em className="texto-ouro">Mata Atlântica</em></h2>
          <p className="mt-4 text-marrom/75">18 flores brasileiras com época de floração, durabilidade e quando usar. A nossa assinatura vem da Mata Atlântica: orquídeas roxas, lírios, hortênsias azuis, rosas e lisianthus.</p>
          <div className="mt-6 flex flex-wrap gap-2">{sudeste.map((f) => <span key={f.slug} className="pill border border-ouro/40 bg-vidro/80">{f.emoji} {f.nome}</span>)}</div>
          <Link href="/flores" className="btn-ouro mt-6">Explorar o mapa</Link>
        </div>
      </div>
    </section>
  );
}
