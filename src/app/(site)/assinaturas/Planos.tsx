'use client';

import Link from 'next/link';
import { useState } from 'react';
import { PLANOS, precoCiclo, type Plano } from '@/data/planos';
import { useAtelie } from '@/lib/store';
import { brl, cn, waLink } from '@/lib/format';
import { Calendario } from '@/components/Calendario';

function CardPlano({ p, onEscolher, ciclo }: { p: Plano; onEscolher?: (ciclo: number) => void; ciclo?: number }) {
  const { ciclos } = useAtelie();
  const primeiro = ciclos.find((c) => c.habilitado)?.dias ?? 30;
  const [sel, setSel] = useState<number>(ciclo ?? primeiro);
  const atual = ciclos.find((c) => c.dias === sel && c.habilitado) ?? ciclos.find((c) => c.habilitado);
  return (
    <article className={cn('moldura relative flex flex-col p-8 transition duration-500 hover:-translate-y-1', p.destaque && 'shadow-brilho ring-1 ring-champanhe/60 ring-offset-4 ring-offset-creme lg:scale-[1.03]')}>
      {p.destaque && <span className="etiqueta absolute -top-3 left-1/2 -translate-x-1/2 !bg-ouro !text-tinta">Best</span>}
      <span className="text-4xl">{p.emoji}</span>
      <h3 className={cn("mt-2 text-5xl font-light", p.destaque && "texto-ouro")}>{p.nome}</h3>
      <p className="text-sm text-marrom/60">{p.publico}</p>
      <div className="mt-5 grid grid-cols-3 gap-1 rounded-full border border-areia bg-veu/40 p-1 text-[11px]">
        {ciclos.map((c) => (
          <button key={c.dias} disabled={!c.habilitado} onClick={() => setSel(c.dias)} title={c.habilitado ? c.nome : 'Indisponível'}
            className={cn('rounded-full px-2 py-1.5 transition', !c.habilitado && 'cursor-not-allowed bg-realce/[.03] text-marrom/25 line-through', c.habilitado && atual?.dias === c.dias && 'bg-gradient-to-r from-champanhe to-ouro text-tinta shadow-brilho', c.habilitado && atual?.dias !== c.dias && 'hover:bg-blush')}>
            {c.dias} dias{!c.habilitado && <span className="block text-[9px] no-underline">Indisponível</span>}
          </button>
        ))}
      </div>
      {atual ? (
        <p className="mt-4"><span className="texto-ouro font-serif text-5xl">{brl(precoCiclo(p.preco, atual.multiplicador))}</span><span className="text-sm text-marrom/60"> / {atual.dias} dias</span>{atual.nota && <span className="pill ml-2 bg-salvia/15 text-folha">{atual.nota}</span>}</p>
      ) : <p className="mt-4 text-sm text-marrom/40">Nenhum ciclo disponível no momento.</p>}
      <ul className="mt-4 flex-1 space-y-2 text-sm">{p.itens.map((i) => <li key={i} className="flex gap-2"><span className="text-salvia">✿</span>{i}</li>)}</ul>
      {onEscolher ? (
        <button disabled={!atual} className="btn-ouro mt-6" onClick={() => atual && onEscolher(atual.dias)}>Assinar {p.nome}</button>
      ) : (
        <Link href={`/assinaturas?plano=${p.id}`} className="btn-ouro mt-6">Assinar {p.nome}</Link>
      )}
    </article>
  );
}

export function PlanosResumo() {
  return (
    <section className="secao py-20">
      <div className="text-center"><p className="kicker">Assinaturas</p><h2 className="titulo-secao mt-2">Viver com flores <em className="texto-ouro">todos os dias</em></h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-marrom/70">A partir de R$ 290 por ciclo. Escolha receber a cada 30, 45 ou 60 dias.</p></div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">{PLANOS.map((p) => <CardPlano key={p.id} p={p} />)}</div>
    </section>
  );
}

const ETAPAS = ['Plano', 'Primeira entrega', 'Endereço', 'Mensagem', 'Pagamento'];

export function FluxoAssinatura({ planoInicial }: { planoInicial?: string }) {
  const { ciclos, assinatura, set } = useAtelie();
  const [etapa, setEtapa] = useState(planoInicial ? 1 : 0);
  const [plano, setPlano] = useState<Plano | undefined>(PLANOS.find((p) => p.id === planoInicial));
  const [ciclo, setCiclo] = useState<number>(ciclos.find((c) => c.habilitado)?.dias ?? 30);
  const [data, setData] = useState<string>();
  const [end, setEnd] = useState({ bairro: '', cidade: 'Rio de Janeiro', ref: '' });
  const [msg, setMsg] = useState('');
  const [pag, setPag] = useState<'pix' | 'cartao'>('pix');
  const mult = ciclos.find((c) => c.dias === ciclo)?.multiplicador ?? 1;
  const valor = plano ? precoCiclo(plano.preco, mult) : 0;

  if (assinatura && assinatura.status !== 'Cancelada') {
    const passos = ['Assinatura ativa', 'Próxima entrega', 'Em confecção', 'Entregue'];
    const prox = new Date(assinatura.primeiraEntrega + 'T12:00');
    return (
      <div className="moldura mx-auto max-w-2xl p-8">
        <p className="kicker">Sua assinatura</p>
        <h2 className="text-4xl">{assinatura.plano} · a cada {assinatura.ciclo} dias</h2>
        <p className="mt-1 text-marrom/70">{brl(assinatura.valor)} por ciclo · Cobrança a cada {assinatura.ciclo} dias · entrega a combinar via WhatsApp</p>
        <ol className="mt-6 grid grid-cols-4 gap-2 text-center text-xs">
          {passos.map((p, i) => <li key={p} className={cn('rounded-xl border p-3', i <= (assinatura.status === 'Pausada' ? 0 : 1) ? 'border-ouro bg-blush' : 'border-areia')}>{p}</li>)}
        </ol>
        <p className="mt-4 text-sm">Próxima entrega: <b>{prox.toLocaleDateString('pt-BR')}</b> {assinatura.status === 'Pausada' && <span className="pill bg-areia">Pausada</span>}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          <button className="btn-linha" onClick={() => set('assinatura', { ...assinatura, status: assinatura.status === 'Pausada' ? 'Ativa' : 'Pausada' })}>{assinatura.status === 'Pausada' ? 'Retomar' : 'Pausar'}</button>
          <button className="btn-linha !border-rosa" onClick={() => confirm('Cancelar a assinatura?') && set('assinatura', { ...assinatura, status: 'Cancelada' })}>Cancelar</button>
          <a className="btn-whats" target="_blank" rel="noreferrer" href={waLink(`Olá Rafael, sou assinante ${assinatura.plano}. Quero combinar a próxima entrega.`)}>Combinar entrega</a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ol className="flex gap-1">{ETAPAS.map((e, i) => <li key={e} className={cn('flex-1 border-t-2 pt-1 text-xs', i <= etapa ? 'border-ouro text-ouro' : 'border-areia text-marrom/40')}>{i + 1}. {e}</li>)}</ol>
      {etapa === 0 && <div className="grid gap-6 md:grid-cols-3">{PLANOS.map((p) => <CardPlano key={p.id} p={p} onEscolher={(c) => { setPlano(p); setCiclo(c); setEtapa(1); }} />)}</div>}
      {etapa > 0 && plano && (
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="moldura p-6">
            {etapa === 1 && (<>
              <h3 className="text-3xl">Data da primeira entrega</h3>
              <div className="mt-2 flex gap-2 text-xs">{ciclos.filter((c) => c.habilitado).map((c) => <button key={c.dias} onClick={() => setCiclo(c.dias)} className={cn('rounded-full border px-3 py-1', ciclo === c.dias ? 'border-ouro bg-blush' : 'border-areia')}>{c.nome}</button>)}</div>
              <div className="mt-4 max-w-sm"><Calendario valor={data} onChange={setData} minDias={2} /></div>
            </>)}
            {etapa === 2 && (<>
              <h3 className="text-3xl">Endereço (a combinar)</h3>
              <p className="text-sm text-marrom/60">Sem CEP obrigatório: combinamos os detalhes no WhatsApp.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div><label className="rotulo">Bairro</label><input className="campo" value={end.bairro} onChange={(e) => setEnd({ ...end, bairro: e.target.value })} /></div>
                <div><label className="rotulo">Cidade</label><input className="campo" value={end.cidade} onChange={(e) => setEnd({ ...end, cidade: e.target.value })} /></div>
                <div className="sm:col-span-2"><label className="rotulo">Referência (opcional)</label><input className="campo" value={end.ref} onChange={(e) => setEnd({ ...end, ref: e.target.value })} /></div>
              </div>
            </>)}
            {etapa === 3 && (<>
              <h3 className="text-3xl">Mensagem do cartão</h3>
              <textarea className="campo mt-4 font-display italic" rows={5} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Para lembrar que todo dia merece flores…" />
            </>)}
            {etapa === 4 && (<>
              <h3 className="text-3xl">Pagamento recorrente</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[['pix', 'Pix recorrente', 'Mercado Pago · autorização única'], ['cartao', 'Cartão de crédito', 'Cobrança automática no ciclo']].map(([id, t, d]) => (
                  <button key={id} onClick={() => setPag(id as 'pix' | 'cartao')} className={cn('rounded-2xl border p-4 text-left', pag === id ? 'border-ouro bg-blush' : 'border-areia bg-vidro')}><p className="font-medium">{t}</p><p className="text-xs text-marrom/60">{d}</p></button>
                ))}
              </div>
              <p className="mt-4 rounded-xl bg-blush p-3 text-sm">Cobrança a cada {ciclo} dias · entrega a combinar via WhatsApp</p>
            </>)}
            <div className="mt-6 flex gap-2">
              <button className="btn-linha" onClick={() => setEtapa(etapa - 1)}>Voltar</button>
              {etapa < 4 ? (
                <button className="btn-ouro flex-1" disabled={etapa === 1 && !data} onClick={() => setEtapa(etapa + 1)}>Continuar</button>
              ) : (
                <button className="btn-ouro flex-1" onClick={() => set('assinatura', { plano: plano.nome, ciclo, valor, primeiraEntrega: data!, status: 'Ativa' })}>Ativar assinatura</button>
              )}
            </div>
          </div>
          <aside className="moldura h-fit p-6 text-sm">
            <p className="kicker">Resumo</p>
            <p className="mt-2 font-serif text-3xl">{plano.emoji} {plano.nome}</p>
            <p>Ciclo: {ciclo} dias</p>
            {data && <p>1ª entrega: {new Date(data + 'T12:00').toLocaleDateString('pt-BR')}</p>}
            <p className="mt-3 font-display text-3xl text-ouro">{brl(valor)}</p>
            <p className="text-xs text-marrom/60">por ciclo · entrega a combinar</p>
          </aside>
        </div>
      )}
    </div>
  );
}
