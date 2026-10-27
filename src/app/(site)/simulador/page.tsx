'use client';

import { useMemo, useState } from 'react';
import { useAtelie, type Proposta } from '@/lib/store';
import { itemServico } from '@/lib/servico';
import { calcularSimulacao, codigo, dataBR, hojeISO, SIMULADOR, type EntradaSimulador } from '@/data/servicos';
import { Calendario } from '@/components/Calendario';
import { brl, cn, EMAIL, TELEFONE, waLink } from '@/lib/format';

const Contador = ({ v, set, max = 60 }: { v: number; set: (n: number) => void; max?: number }) => (
  <div className="flex items-center gap-2">
    <button type="button" className="h-8 w-8 rounded-full border border-areia" onClick={() => set(Math.max(0, v - 1))} aria-label="Menos">−</button>
    <span className="w-8 text-center tabular-nums">{v}</span>
    <button type="button" className="h-8 w-8 rounded-full border border-areia" onClick={() => set(Math.min(max, v + 1))} aria-label="Mais">+</button>
  </div>
);

export default function SimuladorPage() {
  const { set, abrirCarrinho, propostas } = useAtelie();
  const [e, setE] = useState<EntradaSimulador>({ mesas: 12, tipoCentro: 'baixo', altar: true, bancos: 8, arco: false, buque: true, damas: 4, lapelas: 6, mesaPosta: true, paleta: 'Branco puro' });
  const [nome, setNome] = useState('');
  const [local, setLocal] = useState('');
  const [data, setData] = useState('');
  const [proposta, setProposta] = useState<Proposta | null>(null);
  const r = useMemo(() => calcularSimulacao(e), [e]);
  const up = <K extends keyof EntradaSimulador>(k: K, v: EntradaSimulador[K]) => { setE({ ...e, [k]: v }); setProposta(null); };

  const gerar = () => {
    const p: Proposta = { codigo: codigo('PROP'), nome, data, local, total: r.total, sinal: r.sinal, linhas: [...r.linhas, ...(r.ajustePaleta ? [{ item: `Ajuste paleta ${e.paleta}`, qtd: 1, unit: r.ajustePaleta, total: r.ajustePaleta }] : []), { item: 'Montagem e desmontagem', qtd: 1, unit: r.montagem, total: r.montagem }], criadaEm: hojeISO(), status: 'Enviada' };
    set('propostas', (ps) => [p, ...ps]);
    setProposta(p);
    return p;
  };

  const reservar = () => {
    const p = proposta ?? gerar();
    set('carrinho', (c) => [...c.filter((i) => i.tipo !== 'proposta'), itemServico({ tipo: 'proposta', id: p.codigo, nome: `Sinal · Casamento ${dataBR(p.data)}`, emoji: '💍', preco: p.sinal, detalhe: `Proposta ${p.codigo} · total ${brl(p.total)} · ${p.local || 'local a definir'}`, data: p.data, meta: { total: p.total } })]);
    abrirCarrinho(true);
  };

  const pronto = nome.trim() && data;

  return (
    <div className="secao py-14">
      <div className="no-print">
        <p className="kicker">Simulador de casamento</p>
        <h1 className="titulo-secao mt-2">Seu casamento <em className="texto-ouro">em números</em></h1>
        <p className="mt-3 max-w-2xl text-marrom/75">Monte a decoração floral item a item e veja o investimento na hora. Gere a proposta em PDF e reserve a data com 50% de sinal.</p>
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="no-print space-y-6">
          <div className="moldura space-y-4 p-6">
            <p className="kicker">Recepção</p>
            <div className="flex flex-wrap items-center justify-between gap-3"><span>Mesas de convidados</span><Contador v={e.mesas} set={(n) => up('mesas', n)} /></div>
            <div className="flex flex-wrap gap-2">{(['baixo', 'alto'] as const).map((t) => <button key={t} type="button" onClick={() => up('tipoCentro', t)} className={cn('rounded-full border px-4 py-2 text-sm', e.tipoCentro === t ? 'border-ouro bg-blush' : 'border-areia bg-vidro')}>Centro {t} · {brl(t === 'alto' ? SIMULADOR.centroAlto : SIMULADOR.centroBaixo)}</button>)}</div>
            <label className="flex items-center justify-between gap-2"><span>Mesa do bolo / imperial ({brl(SIMULADOR.mesaPosta)})</span><input type="checkbox" className="h-5 w-5 accent-ouro" checked={e.mesaPosta} onChange={(x) => up('mesaPosta', x.target.checked)} /></label>
            <label className="flex items-center justify-between gap-2"><span>Arco de entrada ({brl(SIMULADOR.arco)})</span><input type="checkbox" className="h-5 w-5 accent-ouro" checked={e.arco} onChange={(x) => up('arco', x.target.checked)} /></label>
          </div>
          <div className="moldura space-y-4 p-6">
            <p className="kicker">Cerimônia</p>
            <label className="flex items-center justify-between gap-2"><span>Arranjos de altar, par ({brl(SIMULADOR.altar)})</span><input type="checkbox" className="h-5 w-5 accent-ouro" checked={e.altar} onChange={(x) => up('altar', x.target.checked)} /></label>
            <div className="flex flex-wrap items-center justify-between gap-3"><span>Arranjos de banco ({brl(SIMULADOR.banco)})</span><Contador v={e.bancos} set={(n) => up('bancos', n)} /></div>
          </div>
          <div className="moldura space-y-4 p-6">
            <p className="kicker">Noiva e cortejo</p>
            <label className="flex items-center justify-between gap-2"><span>Buquê da noiva ({brl(SIMULADOR.buque)})</span><input type="checkbox" className="h-5 w-5 accent-ouro" checked={e.buque} onChange={(x) => up('buque', x.target.checked)} /></label>
            <div className="flex flex-wrap items-center justify-between gap-3"><span>Buquês de damas e madrinhas ({brl(SIMULADOR.buqueDama)})</span><Contador v={e.damas} set={(n) => up('damas', n)} /></div>
            <div className="flex flex-wrap items-center justify-between gap-3"><span>Lapelas ({brl(SIMULADOR.lapela)})</span><Contador v={e.lapelas} set={(n) => up('lapelas', n)} /></div>
          </div>
          <div className="moldura space-y-3 p-6">
            <p className="kicker">Paleta</p>
            <div className="flex flex-wrap gap-2">{Object.entries(SIMULADOR.paletaMult).map(([p, m]) => <button key={p} type="button" onClick={() => up('paleta', p)} className={cn('rounded-full border px-4 py-2 text-sm', e.paleta === p ? 'border-ouro bg-blush' : 'border-areia bg-vidro')}>{p}{m > 1 ? ` +${Math.round((m - 1) * 100)}%` : ''}</button>)}</div>
          </div>
          <div className="moldura grid gap-4 p-6 sm:grid-cols-2">
            <div className="space-y-3">
              <div><label className="rotulo">Nome do casal</label><input className="campo" placeholder="Juliana e Pedro" value={nome} onChange={(x) => { setNome(x.target.value); setProposta(null); }} /></div>
              <div><label className="rotulo">Local</label><input className="campo" placeholder="Casa e Capela Santa Ignêz" value={local} onChange={(x) => { setLocal(x.target.value); setProposta(null); }} /></div>
              <p className="text-sm">Data escolhida: <strong>{data ? dataBR(data) : '—'}</strong></p>
            </div>
            <Calendario valor={data} minDias={30} onChange={(d) => { setData(d); setProposta(null); }} />
          </div>
        </div>

        <aside className="moldura h-fit p-6 text-sm lg:sticky lg:top-32" id="proposta">
          <div className="mb-4 hidden border-b border-ouro/30 pb-3 print:block">
            <p className="texto-ouro font-serif text-2xl tracking-[0.3em]">RAFAEL CUNHA</p>
            <p className="text-[10px] tracking-[0.4em] text-ouro">ATELIÊ FLORAL · {EMAIL} · {TELEFONE}</p>
          </div>
          <p className="kicker">Proposta {proposta?.codigo ?? '(prévia)'}</p>
          <h2 className="mt-1 font-serif text-2xl">{nome || 'Seu casamento'}</h2>
          <p className="text-marrom/60">{data ? dataBR(data) : 'Data a escolher'} · {local || 'local a definir'} · Paleta {e.paleta}</p>
          <table className="mt-4 w-full">
            <tbody>
              {r.linhas.map((l) => <tr key={l.item} className="border-b border-areia"><td className="py-1.5">{l.qtd > 1 ? `${l.qtd}× ` : ''}{l.item}</td><td className="text-right tabular-nums">{brl(l.total)}</td></tr>)}
              {r.ajustePaleta > 0 && <tr className="border-b border-areia"><td className="py-1.5">Ajuste paleta</td><td className="text-right">{brl(r.ajustePaleta)}</td></tr>}
              <tr className="border-b border-areia"><td className="py-1.5">Montagem e desmontagem (12%)</td><td className="text-right">{brl(r.montagem)}</td></tr>
            </tbody>
          </table>
          <div className="mt-3 flex justify-between font-serif text-3xl"><span>Total</span><span className="texto-ouro">{brl(r.total)}</span></div>
          <div className="flex justify-between text-salvia"><span>Sinal para reservar (50%)</span><span>{brl(r.sinal)}</span></div>
          <p className="mt-3 text-xs text-marrom/60">Proposta válida por 15 dias. Valores estimados. A proposta final é confirmada após visita técnica ao local, sem custo.</p>
          <div className="no-print mt-5 grid gap-2">
            <button className="btn-ouro" disabled={!pronto || r.total === 0} onClick={reservar}>Reservar data com sinal de {brl(r.sinal)}</button>
            <button className="btn-linha" disabled={!pronto} onClick={() => { if (!proposta) gerar(); setTimeout(() => window.print(), 50); }}>Gerar proposta em PDF</button>
            <a className="btn-whats" target="_blank" rel="noreferrer" href={waLink(`Olá Rafael! Simulei meu casamento: ${nome || ''} em ${data ? dataBR(data) : 'data a definir'} (${local || 'local a definir'}). Total estimado ${brl(r.total)}. ${proposta ? `Proposta ${proposta.codigo}.` : ''}`)}>Conversar com Rafael</a>
            {!pronto && <p className="text-center text-xs text-marrom/60">Informe o nome do casal e escolha a data para gerar a proposta.</p>}
            {proposta && <p className="text-center text-xs text-salvia">Proposta {proposta.codigo} salva ✓</p>}
            {propostas.length > 0 && <p className="text-center text-[11px] text-marrom/50">{propostas.length} proposta(s) já geradas neste navegador</p>}
          </div>
        </aside>
      </div>
    </div>
  );
}
