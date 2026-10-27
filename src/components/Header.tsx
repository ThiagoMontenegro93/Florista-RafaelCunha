'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAtelie } from '@/lib/store';
import { RamoEucalipto } from './Ornamentos';
import { TELEFONE, cn } from '@/lib/format';
import { UFS } from '@/data/ufs';
import { SERVICOS } from '@/data/servicos';

const NAV = [
  { href: '/', label: 'Início' },
  { href: '/portfolio', label: 'Portfólio' },
  { href: '/flores', label: 'Flores do Brasil' },
  { href: '/loja', label: 'Loja' },
  { href: '/assinaturas', label: 'Assinaturas' },
  { href: '/agenda', label: 'Agenda' },
  { href: '/orcamento', label: 'Orçamento' },
];


export function AreaAtendimentoPill() {
  const { ufsAtivas } = useAtelie();
  const total = UFS.filter((u) => ufsAtivas.includes(u.sigla)).reduce((s, u) => s + u.municipios, 0);
  const label = ufsAtivas.length === 1 && ufsAtivas[0] === 'RJ' ? `todo RJ · 92 municípios` : `${ufsAtivas.join(' + ')} · ${total} municípios`;
  return <span className="pill border border-ouro/30 bg-ouro/10 text-champanhe">🚚 Entrega a combinar em {label}</span>;
}

export function Header() {
  const path = usePathname();
  const { carrinho, abrirCarrinho } = useAtelie();
  const [menu, setMenu] = useState(false);
  return (
    <header className="sticky top-0 z-40">
      <div className="border-b border-ouro/15 bg-blush/90 text-champanhe backdrop-blur">
        <div className="secao flex flex-wrap items-center justify-center gap-x-4 gap-y-1 py-2 text-[11px] sm:justify-between sm:text-xs">
          <p className="font-display italic tracking-wide"><span className="mr-2 text-ouro">✦</span>O Florista Oficial da Casa e Capela Santa Ignêz</p>
          <div className="flex items-center gap-3">
            <a href={`tel:${TELEFONE.replace(/\D/g, '')}`} className="tracking-wider hover:text-champanhe">{TELEFONE}</a>
            <span className="hidden sm:inline"><AreaAtendimentoPill /></span>
          </div>
        </div>
      </div>
      <div className="border-b border-ouro/15 bg-creme/60 backdrop-blur-xl backdrop-saturate-150">
        <div className="secao flex items-center justify-between gap-4 py-3">
          <Link href="/" className="group flex flex-col leading-none">
            <span className="texto-ouro whitespace-nowrap font-serif text-lg font-normal tracking-[0.2em] sm:text-2xl sm:tracking-[0.32em]">RAFAEL CUNHA</span>
            <span className="flex items-center gap-2 text-[10px] tracking-[0.5em] text-ouro">
              FLORISTA <RamoEucalipto className="h-3 w-16" />
            </span>
          </Link>
          <nav className="hidden items-center gap-6 lg:flex">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} aria-current={path === n.href ? 'page' : undefined} className={cn('relative text-[13px] tracking-wide transition hover:text-champanhe after:absolute after:-bottom-1.5 after:left-1/2 after:h-px after:-translate-x-1/2 after:bg-gradient-to-r after:from-transparent after:via-champanhe after:to-transparent after:transition-all', path === n.href ? 'text-champanhe after:w-full' : 'text-marrom/70 after:w-0 hover:after:w-full')}>
                {n.label}
              </Link>
            ))}
            <div className="group relative">
              <button className={cn('text-[13px] tracking-wide transition hover:text-champanhe', SERVICOS.some((x) => x.href === path) ? 'text-champanhe' : 'text-marrom/70')} aria-haspopup="true">Serviços ▾</button>
              <div className="invisible absolute right-0 top-full z-50 w-[520px] pt-4 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                <div className="rounded-moldura bg-creme"><div className="moldura grid grid-cols-2 gap-1 p-3 shadow-suave">
                  {SERVICOS.map((x) => (
                    <Link key={x.href} href={x.href} className="flex items-start gap-3 rounded-xl p-2 transition hover:bg-blush">
                      <span className="text-xl">{x.e}</span><span><span className="block text-sm text-marrom">{x.label}</span><span className="text-[11px] text-marrom/55">{x.d}</span></span>
                    </Link>
                  ))}
                </div></div>
              </div>
            </div>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/conta" className="hidden text-sm text-marrom/70 hover:text-ouro sm:block">Minha conta</Link>
            <button onClick={() => abrirCarrinho(true)} className="relative whitespace-nowrap rounded-full border border-ouro/40 bg-realce/[.03] px-4 py-2 text-sm text-champanhe transition hover:border-champanhe hover:shadow-brilho" aria-label="Abrir Atelier (carrinho)">
              🌸 Atelier
              {carrinho.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ouro text-[10px] text-tinta">{carrinho.length}</span>
              )}
            </button>
            <button className="rounded-full border border-ouro/40 px-3 py-2 lg:hidden" onClick={() => setMenu(!menu)} aria-label="Menu">☰</button>
          </div>
        </div>
        {menu && (
          <nav className="secao grid grid-cols-2 gap-2 pb-4 lg:hidden">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setMenu(false)} className="rounded-xl border border-areia bg-vidro/80 px-3 py-2 text-sm">{n.label}</Link>
            ))}
            <Link href="/conta" onClick={() => setMenu(false)} className="rounded-xl border border-areia bg-vidro/80 px-3 py-2 text-sm">Minha conta</Link>
            <p className="kicker col-span-2 mt-2">Serviços</p>
            {SERVICOS.map((x) => (
              <Link key={x.href} href={x.href} onClick={() => setMenu(false)} className="rounded-xl border border-ouro/25 bg-blush/60 px-3 py-2 text-sm">{x.e} {x.label}</Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
