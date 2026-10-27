'use client';

import { useAtelie } from '@/lib/store';
import { Kpi, Titulo, Aviso } from '@/components/admin/ui';
import { CORPORATIVO, dataBR, hojeISO } from '@/data/servicos';
import { brl, cn, waLink } from '@/lib/format';

export default function AdminCorporativo() {
  const { contratos, faturas, set } = useAtelie();
  const ativos = contratos.filter((c) => c.status === 'Ativo');
  const competencia = hojeISO().slice(0, 7);
  const emitir = (cod: string, valor: number) => {
    const numero = `FAT-${String(faturas.length + 1).padStart(4, '0')}`;
    // NF de demonstração: em produção, enviar para o provedor de NFS-e (ex.: Focus NFe) com NFSE_TOKEN do .env
    const nf = `NFS-e ${new Date().getFullYear()}${String(Math.floor(Math.random() * 1e6)).padStart(6, '0')}`;
    set('faturas', (fs) => [{ numero, contrato: cod, competencia, valor, nf, status: 'Emitida' }, ...fs]);
  };
  return (
    <>
      <Titulo kicker="B2B" titulo="Contratos corporativos" />
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <Kpi rotulo="Propostas" valor={contratos.filter((c) => c.status === 'Proposta').length} />
        <Kpi rotulo="Contratos ativos" valor={ativos.length} />
        <Kpi rotulo="Receita recorrente" valor={brl(ativos.reduce((s, c) => s + c.mensal, 0))} sub="por mês" />
        <Kpi rotulo="Faturas em aberto" valor={faturas.filter((f) => f.status === 'Emitida').length} />
      </div>
      <Aviso>Faturas e números de NF aqui são de demonstração. Para emitir NFS-e real, configure um provedor (ex.: Focus NFe) e o token NFSE_TOKEN no .env.</Aviso>
      <div className="mt-4 space-y-3">
        {contratos.length === 0 && <p className="card-admin text-sm text-marrom/60">Nenhum contrato ainda. As propostas enviadas em /corporativo aparecem aqui.</p>}
        {contratos.map((c) => {
          const jaFaturado = faturas.some((f) => f.contrato === c.codigo && f.competencia === competencia);
          return (
            <div key={c.codigo} className="card-admin flex flex-wrap items-center gap-4">
              <div className="flex-1">
                <p className="font-serif text-xl">{c.empresa} <span className="text-sm text-marrom/50">· {c.codigo}</span></p>
                <p className="text-sm text-marrom/60">{c.razao} · CNPJ {c.cnpj} · {c.contato} ({c.email})</p>
                <p className="text-xs text-marrom/50">{Object.entries(c.arranjos).filter(([, n]) => n > 0).map(([k, n]) => `${n}× ${CORPORATIVO.rotulos[k]}`).join(' · ')} · {CORPORATIVO.frequencia[c.frequencia]?.nome} · {c.anual ? 'anual' : 'mensal'} · início {dataBR(c.inicio)}</p>
              </div>
              <p className="font-serif text-2xl">{brl(c.mensal)}<span className="text-xs">/mês</span></p>
              <select className="campo !w-32 !py-1" aria-label="Status do contrato" value={c.status} onChange={(e) => set('contratos', (cs) => cs.map((x) => (x.codigo === c.codigo ? { ...x, status: e.target.value as typeof c.status } : x)))}>
                {['Proposta', 'Ativo', 'Pausado'].map((s) => <option key={s}>{s}</option>)}
              </select>
              <button className="btn-ouro !py-2" disabled={c.status !== 'Ativo' || jaFaturado} onClick={() => emitir(c.codigo, c.mensal)}>{jaFaturado ? 'Faturado no mês ✓' : 'Emitir fatura'}</button>
              <a className="btn-whats !py-2" target="_blank" rel="noreferrer" href={waLink(`Olá ${c.contato}! Aqui é o Rafael. Recebi a proposta ${c.codigo} da ${c.empresa}. Podemos agendar a visita técnica?`)}>Contato</a>
            </div>
          );
        })}
      </div>
      {faturas.length > 0 && (
        <div className="card-admin mt-6 overflow-x-auto">
          <p className="kicker mb-2">Faturas</p>
          <table className="tabela"><thead><tr><th>Fatura</th><th>Contrato</th><th>Competência</th><th>Valor</th><th>Nota fiscal</th><th>Status</th></tr></thead>
            <tbody>{faturas.map((f) => (
              <tr key={f.numero}><td>{f.numero}</td><td>{contratos.find((c) => c.codigo === f.contrato)?.empresa ?? f.contrato}</td><td>{f.competencia.split('-').reverse().join('/')}</td><td>{brl(f.valor)}</td><td>{f.nf}</td>
                <td><button className={cn('pill', f.status === 'Paga' ? 'bg-salvia/15 text-folha' : 'bg-ouro/15 text-champanhe ring-1 ring-ouro/30')} onClick={() => set('faturas', (fs) => fs.map((x) => (x.numero === f.numero ? { ...x, status: x.status === 'Paga' ? ('Emitida' as const) : ('Paga' as const) } : x)))}>{f.status === 'Paga' ? 'Paga ✓' : 'Marcar paga'}</button></td></tr>
            ))}</tbody></table>
        </div>
      )}
    </>
  );
}
