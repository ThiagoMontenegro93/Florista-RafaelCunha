'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAtelie, descontoCupom } from '@/lib/store';
import { CUPONS } from '@/data/produtos';
import { brl } from '@/lib/format';

export function CartDrawer() {
  const { carrinho, carrinhoAberto, abrirCarrinho, set, cupom, creditos } = useAtelie();
  const [codigo, setCodigo] = useState(cupom ?? '');
  const [erro, setErro] = useState('');
  const subtotal = carrinho.reduce((s, i) => s + i.preco, 0);
  const desconto = descontoCupom(cupom, subtotal, creditos);

  if (!carrinhoAberto) return null;
  return (
    <div className="no-print fixed inset-0 z-[65] flex justify-end bg-overlay/45 backdrop-blur-[2px]" onClick={() => abrirCarrinho(false)}>
      <aside className="flex h-full w-full max-w-md flex-col bg-creme shadow-2xl" onClick={(e) => e.stopPropagation()} aria-label="Seu Atelier">
        <div className="flex items-center justify-between border-b border-areia p-5">
          <h2 className="text-3xl">Seu Atelier</h2>
          <button onClick={() => abrirCarrinho(false)} aria-label="Fechar">✕</button>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto p-5">
          {carrinho.length === 0 && <p className="py-16 text-center text-marrom/60">Seu atelier está vazio. <Link className="text-ouro underline" href="/loja" onClick={() => abrirCarrinho(false)}>Ver a loja</Link></p>}
          {carrinho.map((i) => (
            <div key={i.uid} className="flex gap-3 rounded-2xl border border-areia bg-vidro p-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-ouro/50 bg-blush text-2xl">{i.emoji}</div>
              <div className="min-w-0 flex-1 text-sm">
                <p className="font-serif text-lg leading-tight">{i.nome}</p>
                {i.detalhe ? <p className="text-xs text-marrom/60">{i.detalhe}</p> : (
                  <>
                    <p className="text-xs text-marrom/60">Tam. {i.tamanho} · {i.paleta}{i.extras.length ? ` · ${i.extras.join(', ')}` : ''}</p>
                    <p className="text-xs text-marrom/60">{i.entrega}{i.dataDesejada ? ` · ${new Date(i.dataDesejada + 'T12:00').toLocaleDateString('pt-BR')}` : ''}</p>
                  </>
                )}
                {i.sinal && <p className="text-[11px] text-salvia">Reserva com sinal de 50%</p>}
              </div>
              <div className="text-right">
                <p className="text-ouro">{brl(i.preco)}</p>
                <button className="text-xs text-marrom/50 hover:text-rosa" onClick={() => set('carrinho', (c) => c.filter((x) => x.uid !== i.uid))}>remover</button>
              </div>
            </div>
          ))}
        </div>
        {carrinho.length > 0 && (
          <div className="space-y-3 border-t border-areia p-5 text-sm">
            <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); const c = codigo.trim().toUpperCase(); if (CUPONS[c] || creditos[c]) { set('cupom', c); setErro(''); } else setErro('Cupom inválido ou já utilizado'); }}>
              <input value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="Cupom ou crédito (ex: NOIVA10)" className="campo" />
              <button className="btn-linha">Aplicar</button>
            </form>
            {erro && <p className="text-xs text-rosa">{erro}</p>}
            <div className="flex justify-between"><span>Subtotal</span><span>{brl(subtotal)}</span></div>
            {desconto > 0 && <div className="flex justify-between text-salvia"><span>Cupom {cupom}</span><span>−{brl(desconto)}</span></div>}
            <div className="flex justify-between text-marrom/70"><span>Entrega</span><span>A combinar</span></div>
            <div className="flex justify-between font-serif text-2xl"><span>Total parcial</span><span className="text-ouro">{brl(subtotal - desconto)}</span></div>
            <p className="rounded-xl bg-blush p-3 text-xs">🌸 Entrega combinada com carinho após o pedido. Rafael fala com você no WhatsApp.</p>
            <Link href="/checkout" onClick={() => abrirCarrinho(false)} className="btn-ouro w-full">Ir para Checkout</Link>
          </div>
        )}
      </aside>
    </div>
  );
}
