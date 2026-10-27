import type { ItemCarrinho, TipoItem } from './store';

/** Monta um item de carrinho para serviços (preservação, aluguel, workshop, pré-venda, consultoria, proposta). */
export function itemServico(d: { tipo: TipoItem; id: string; nome: string; emoji: string; preco: number; detalhe: string; meta?: ItemCarrinho['meta']; sinal?: boolean; data?: string }): ItemCarrinho {
  return {
    uid: `${d.tipo}-${d.id}-${Date.now()}`,
    tipo: d.tipo,
    produtoId: d.id,
    nome: d.nome,
    emoji: d.emoji,
    tamanho: '—',
    paleta: '—',
    extras: [],
    entrega: 'A combinar',
    detalhe: d.detalhe,
    meta: d.meta,
    dataDesejada: d.data,
    preco: d.preco,
    sinal: d.sinal,
  };
}
