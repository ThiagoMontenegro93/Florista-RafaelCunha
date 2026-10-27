'use client';

import { useMemo, useState } from 'react';
import { useAtelie, type Contrato } from '@/lib/store';
import { CORPORATIVO, calcularCorporativo, codigo, hojeISO } from '@/data/servicos';
import { brl, cn, waLink } from '@/lib/format';

const mascaraCnpj = (v: string) => v.replace(/\D/g, '').slice(0, 14).replace(/^(\d{2})(\d)/, '$1.$2').replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3').replace(/\.(\d{3})(\d)/, '.$1/$2').replace(/(\d{4})(\d)/, '$1-$2');

export default function CorporativoPage() {
  const { set } = useAtelie();
  const [qtd, setQtd] = useState<Record<string, number>>({ recepcao: 1, mesa: 2, banheiro: 2, sala: 0 });
  const [freq, setFreq] = useState('semanal');
  const [anual, setAnual] = useState(true);
  const [f, setF] = useState({ cnpj: '', empresa: '', razao: '', contato: '', email: '', inicio: '' });
  const [busca, setBusca] = useState<'' | 'buscando' | 'ok' | 'erro'>('');
  const [msgBusca, setMsgBusca] = useState('');
  const [contrato, setContrato] = useState<Contrato | null>(null);
  const r = useMemo(() => calcularCorporativo(qtd, freq, anual), [qtd, freq, anual]);

  const buscar = async () => {
    setBusca('buscando');
    try {
      const res = await fetch(`/api/cnpj/${f.cnpj.replace(/\D/g, '')}`);
      const j = await res.json();
      if (!res.ok) throw new Error(j.erro);
      setF((x) => ({ ...x, razao: j.razao ?? '', empresa: x.empresa || j.fantasia || j.razao || '' }));
      setMsgBusca(`${j.situacao ?? ''} · ${j.municipio ?? ''}/${j.uf ?? ''}`);
      setBusca('ok');
    } catch (e) {
      setMsgBusca(`${(e as Error).message || 'Não foi possível consultar'}. Preencha a razão social manualmente.`);
      setBusca('erro');
    }
  };

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    const c: Contrato = { codigo: codigo('CORP'), empresa: f.empresa, cnpj: f.cnpj, razao: f.razao, contato: f.contato, email: f.email, frequencia: freq, arranjos: qtd, mensal: r.mensal, anual, inicio: f.inicio || hojeISO(), status: 'Proposta' };
    set('contratos', (cs) => [c, ...cs]);
    setContrato(c);
  };

  if (contrato)
    return (
      <div className="secao max-w-2xl py-20 text-center">
        <p className="kicker">Proposta {contrato.codigo}</p>
        <h1 className="titulo-secao mt-2">Proposta enviada, <em className="texto-ouro">{contrato.empresa}</em></h1>
        <p className="mt-3 text-marrom/75">{brl(contrato.mensal)}/mês · {CORPORATIVO.frequencia[contrato.frequencia].nome} · {contrato.anual ? 'contrato anual (8% off)' : 'mensal sem fidelidade'}. Rafael entra em contato para a visita técnica e o contrato.</p>
        <a className="btn-whats mt-6" target="_blank" rel="noreferrer" href={waLink(`Olá Rafael! Sou ${contrato.contato}, da ${contrato.empresa} (CNPJ ${contrato.cnpj}). Enviei a proposta corporativa ${contrato.codigo} de ${brl(contrato.mensal)}/mês.`)}>Falar agora no WhatsApp</a>
      </div>
    );

  return (
    <div className="secao py-14">
      <p className="kicker">Plano corporativo</p>
      <h1 className="titulo-secao mt-2">Flores frescas na empresa, <em className="texto-ouro">toda semana</em></h1>
      <p className="mt-3 max-w-2xl text-marrom/75">Recepções, salas de reunião e lavabos sempre floridos. Troca programada, nota fiscal mensal e um só contato. Ideal para escritórios, clínicas, hotéis e restaurantes.</p>
      <form className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]" onSubmit={enviar}>
        <div className="space-y-6">
          <div className="moldura space-y-3 p-6">
            <p className="kicker">Ambientes</p>
            {Object.entries(CORPORATIVO.rotulos).map(([k, l]) => (
              <div key={k} className="flex flex-wrap items-center justify-between gap-3 border-b border-areia pb-2">
                <span>{l} <span className="text-xs text-marrom/50">· {brl(CORPORATIVO.porArranjo[k])}/arranjo</span></span>
                <div className="flex items-center gap-2">
                  <button type="button" className="h-8 w-8 rounded-full border border-areia" aria-label={`Menos ${l}`} onClick={() => setQtd({ ...qtd, [k]: Math.max(0, qtd[k] - 1) })}>−</button>
                  <span className="w-6 text-center tabular-nums">{qtd[k]}</span>
                  <button type="button" className="h-8 w-8 rounded-full border border-areia" aria-label={`Mais ${l}`} onClick={() => setQtd({ ...qtd, [k]: qtd[k] + 1 })}>+</button>
                </div>
              </div>
            ))}
            <div className="flex flex-wrap gap-2 pt-2">{Object.entries(CORPORATIVO.frequencia).map(([k, v]) => <button type="button" key={k} onClick={() => setFreq(k)} className={cn('rounded-full border px-4 py-2 text-sm', freq === k ? 'border-ouro bg-blush' : 'border-areia bg-vidro')}>Troca {v.nome.toLowerCase()}</button>)}</div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="h-5 w-5 accent-ouro" checked={anual} onChange={(e) => setAnual(e.target.checked)} /> Contrato anual com 8% de desconto</label>
          </div>
          <div className="moldura grid gap-3 p-6 sm:grid-cols-2">
            <p className="kicker sm:col-span-2">Empresa</p>
            <div className="sm:col-span-2"><label className="rotulo">CNPJ</label>
              <div className="flex gap-2"><input required className="campo" inputMode="numeric" placeholder="00.000.000/0000-00" value={f.cnpj} onChange={(e) => setF({ ...f, cnpj: mascaraCnpj(e.target.value) })} /><button type="button" className="btn-linha !px-4" disabled={f.cnpj.replace(/\D/g, '').length !== 14 || busca === 'buscando'} onClick={buscar}>{busca === 'buscando' ? '…' : 'Buscar'}</button></div>
              {msgBusca && <p className={cn('mt-1 text-xs', busca === 'ok' ? 'text-salvia' : 'text-rosa')}>{msgBusca}</p>}
            </div>
            <div><label className="rotulo">Razão social</label><input required className="campo" value={f.razao} onChange={(e) => setF({ ...f, razao: e.target.value })} /></div>
            <div><label className="rotulo">Nome fantasia</label><input required className="campo" value={f.empresa} onChange={(e) => setF({ ...f, empresa: e.target.value })} /></div>
            <div><label className="rotulo">Responsável</label><input required className="campo" value={f.contato} onChange={(e) => setF({ ...f, contato: e.target.value })} /></div>
            <div><label className="rotulo">Email financeiro</label><input required type="email" className="campo" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
            <div><label className="rotulo">Início desejado</label><input type="date" min={hojeISO()} className="campo" value={f.inicio} onChange={(e) => setF({ ...f, inicio: e.target.value })} /></div>
          </div>
        </div>
        <aside className="moldura h-fit space-y-2 p-6 text-sm lg:sticky lg:top-32">
          <p className="kicker">Investimento</p>
          <div className="flex justify-between"><span>Por visita</span><span>{brl(r.porVisita)}</span></div>
          <div className="flex justify-between"><span>Visitas/mês</span><span>{CORPORATIVO.frequencia[freq].vezes.toLocaleString('pt-BR')}</span></div>
          {anual && <div className="flex justify-between text-salvia"><span>Anual −8%</span><span>−{brl(r.mensalBruto - r.mensal)}</span></div>}
          <div className="flex justify-between pt-2 font-serif text-3xl"><span>Mensal</span><span className="texto-ouro" data-mensal={r.mensal}>{brl(r.mensal)}</span></div>
          <p className="text-xs text-marrom/60">Nota fiscal de serviço emitida todo mês. Vasos e reposição inclusos.</p>
          <button className="btn-ouro mt-3 w-full" disabled={r.porVisita === 0}>Solicitar proposta</button>
        </aside>
      </form>
    </div>
  );
}
