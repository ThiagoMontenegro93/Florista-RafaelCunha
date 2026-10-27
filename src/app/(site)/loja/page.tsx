import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LojaFiltrada } from './LojaFiltrada';
import { PRODUTOS } from '@/data/produtos';
import { jsonLdProdutos } from '@/lib/seo';

export const metadata: Metadata = { title: 'Loja de encomendas: bouquet de noiva, centro de mesa, namorados', description: 'Bouquet de noiva no Rio, centro de mesa de casamento, arranjos de Dia dos Namorados e kit igreja. Entrega a combinar em todo RJ.' };

export default function LojaPage() {
  return (
    <div className="secao py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdProdutos(PRODUTOS)) }} />
      <p className="kicker">Loja de encomendas</p>
      <h1 className="titulo-secao mt-2">Arranjos feitos <em className="texto-ouro">à mão</em></h1>
      <p className="mb-8 mt-4 max-w-2xl text-marrom/75">Investimento a partir de R$ 290. Preços sem frete: a entrega é combinada com você no WhatsApp depois do pedido.</p>
      <Suspense><LojaFiltrada /></Suspense>
    </div>
  );
}
