'use client';

import Link from 'next/link';
import { useAtelie, TIMELINE_PEDIDO } from '@/lib/store';
import { GuiaCuidados } from '@/components/GuiaCuidados';
import { SeloCera } from '@/components/Ornamentos';
import { brl, cn, waLink } from '@/lib/format';
import { PRESERVACAO, dataBR } from '@/data/servicos';

export default function PedidoPage({ params }: { params: { numero: string } }) {
  const { pedidos, pronto, consultas, propostas } = useAtelie();
  const p = pedidos.find((x) => x.numero === params.numero);
  if (!pronto) return <div className="secao py-24" />;
  if (!p) return <div className="secao py-24 text-center"><h1 className="text-4xl">Pedido não encontrado</h1><Link className="btn-ouro mt-6" href="/conta">Minha conta</Link></div>;
  const consulta = consultas.find((c) => c.pedido === p.numero);
  const itemConsultoria = p.itens.find((i) => i.tipo === 'consultoria');
  const proposta = propostas.find((x) => p.itens.some((i) => i.tipo === 'proposta' && i.produtoId === x.codigo));
  const noiva = p.itens.some((i) => i.tipo !== 'preservacao' && /Noiva|Bouquet|Buquê|Casamento|proposta/i.test(i.nome + (i.tipo ?? '')));
  const nomes = p.itens.map((i) => i.nome.replace(/^(Bouquet|Buquê) /, 'Bouquet ')).join(', ');
  return (
    <div className="secao space-y-10 py-14">
      <div className="text-center">
        <SeloCera size={90} className="mx-auto" />
        <p className="kicker mt-4">Pedido #{p.numero}</p>
        <h1 className="titulo-secao mt-2">Pedido enviado! <em className="texto-ouro">Vamos combinar sua entrega</em></h1>
        <p className="mt-3 text-marrom/70">{p.nome}, recebemos seu pedido de {brl(p.total)}. Rafael fala com você no WhatsApp em até 1h.</p>
      </div>
      <ol className="mx-auto grid max-w-4xl grid-cols-5 gap-2 text-center text-[11px] sm:text-xs">
        {TIMELINE_PEDIDO.map((t, i) => (
          <li key={t} className="flex flex-col items-center gap-2">
            <span className={cn('flex h-9 w-9 items-center justify-center rounded-full border', i <= p.status ? 'border-champanhe bg-gradient-to-br from-champanhe to-ouro text-tinta shadow-brilho' : 'border-areia bg-vidro text-marrom/40')}>{i + 1}</span>{t}
          </li>
        ))}
      </ol>
      <div className="text-center">
        <a className="btn-whats" target="_blank" rel="noreferrer" href={waLink(`Olá Rafael, fiz o pedido #${p.numero} - ${nomes}. Quero combinar a entrega.`)}>Abrir conversa no WhatsApp</a>
      </div>
      {consulta && (
        <div className="moldura mx-auto max-w-2xl p-6 text-center">
          <p className="kicker">Consultoria agendada · {dataBR(consulta.data)} às {consulta.hora}</p>
          <p className="mt-2 font-serif text-2xl">Seu crédito de {brl(itemConsultoria?.preco ?? 0)}</p>
          <p className="texto-ouro mt-1 font-serif text-4xl tracking-widest" data-credito={consulta.codigo}>{consulta.codigo}</p>
          <p className="mt-2 text-sm text-marrom/70">{consulta.creditoUsado ? 'Crédito já utilizado.' : 'Use este código como cupom no pedido do seu casamento.'}</p>
        </div>
      )}
      {proposta && <p className="text-center text-sm text-salvia">Data reservada ✓ Proposta {proposta.codigo} com sinal pago.</p>}
      {noiva && (
        <section className="moldura mx-auto max-w-4xl p-6">
          <p className="kicker text-center">Depois do sim</p>
          <h2 className="mt-1 text-center font-serif text-3xl">Eternize o seu <em className="texto-ouro">buquê</em></h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {PRESERVACAO.map((x) => <Link key={x.id} href="/preservacao" className="rounded-2xl border border-areia bg-vidro p-4 text-center transition hover:border-ouro"><span className="text-3xl">{x.emoji}</span><p className="font-serif text-lg leading-tight">{x.nome}</p><p className="text-champanhe">{brl(x.preco)}</p></Link>)}
          </div>
        </section>
      )}
      <GuiaCuidados produtoIds={p.itens.map((i) => i.produtoId)} />
    </div>
  );
}
