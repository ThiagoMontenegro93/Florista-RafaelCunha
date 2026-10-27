'use client';

import { useSearchParams } from 'next/navigation';
import { PRODUTOS } from '@/data/produtos';
import { LojaGrid, BuscaInteligente } from '@/components/Secoes';

export function LojaFiltrada() {
  const sp = useSearchParams();
  const ocasiao = sp.get('ocasiao') ?? '';
  const paleta = sp.get('paleta') ?? '';
  const max = Number(sp.get('max') ?? 0) || Infinity;
  const lista = PRODUTOS.filter((p) => (!ocasiao || p.ocasioes.includes(ocasiao) || p.categoria === ocasiao) && (!paleta || p.paletas.includes(paleta as never)) && p.preco <= max);
  return (
    <>
      <BuscaInteligente compacta />
      {(ocasiao || paleta || max !== Infinity) && <p className="mt-4 text-sm text-marrom/60">{lista.length} arranjos para {[ocasiao, paleta, max !== Infinity && `até R$ ${max}`].filter(Boolean).join(' · ')}</p>}
      <div className="mt-8"><LojaGrid produtos={lista} /></div>
    </>
  );
}
