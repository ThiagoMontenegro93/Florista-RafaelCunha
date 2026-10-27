'use client';

import { useAtelie } from '@/lib/store';
import { Kpi, Titulo, Aviso } from '@/components/admin/ui';
import { dataBR } from '@/data/servicos';
import { cn } from '@/lib/format';

export default function AdminAvaliacoes() {
  const { avaliacoes, set } = useAtelie();
  const media = avaliacoes.length ? (avaliacoes.reduce((s, a) => s + a.nota, 0) / avaliacoes.length).toFixed(1) : '—';
  const alterar = (pedido: string, aprovada: boolean | null) =>
    set('avaliacoes', (as) => (aprovada === null ? as.filter((a) => a.pedido !== pedido) : as.map((a) => (a.pedido === pedido ? { ...a, aprovada } : a))));
  return (
    <>
      <Titulo kicker="Reputação" titulo="Avaliações de clientes" />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Kpi rotulo="Recebidas" valor={avaliacoes.length} />
        <Kpi rotulo="Nota média" valor={media} />
        <Kpi rotulo="Publicadas no site" valor={avaliacoes.filter((a) => a.aprovada).length} />
      </div>
      <Aviso>Peça a avaliação em Pedidos quando o status for “Entregue”. Notas 4 e 5 recebem convite para avaliar também no Google. Só aparecem no site as aprovadas aqui.</Aviso>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {avaliacoes.length === 0 && <p className="card-admin text-sm text-marrom/60">Nenhuma avaliação ainda.</p>}
        {avaliacoes.map((a) => (
          <div key={a.pedido} className="card-admin flex gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element -- foto em data URL enviada pela cliente */}
            {a.foto && <img src={a.foto} alt={`Foto de ${a.nome}`} className="h-24 w-24 shrink-0 rounded-xl object-cover" />}
            <div className="min-w-0 flex-1">
              <p className="text-champanhe">{'★'.repeat(a.nota)}<span className="text-marrom/25">{'★'.repeat(5 - a.nota)}</span></p>
              <p className="mt-1 font-serif text-lg italic">“{a.texto}”</p>
              <p className="text-xs text-marrom/60">{a.nome} · pedido #{a.pedido} · {dataBR(a.data)}</p>
              <div className="mt-2 flex gap-2">
                <button className={cn('pill', a.aprovada ? 'bg-salvia/15 text-folha' : 'bg-ouro/15 text-champanhe ring-1 ring-ouro/30')} onClick={() => alterar(a.pedido, !a.aprovada)}>{a.aprovada ? 'Publicada ✓ (despublicar)' : 'Aprovar e publicar'}</button>
                <button className="pill bg-realce/5 text-marrom/50 hover:text-rosa" onClick={() => alterar(a.pedido, null)}>Excluir</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
