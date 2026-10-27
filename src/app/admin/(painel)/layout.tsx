'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SessionProvider, signOut } from 'next-auth/react';
import { useState } from 'react';
import { cn } from '@/lib/format';

const MENU = [
  { href: '/admin', label: 'Dashboard', i: '◈' },
  { href: '/admin/portfolio', label: 'Portfólio', i: '❖' },
  { href: '/admin/loja', label: 'Loja', i: '✿' },
  { href: '/admin/flores', label: 'Flores Brasil', i: '❀' },
  { href: '/admin/pedidos', label: 'Pedidos', i: '✉' },
  { href: '/admin/assinaturas', label: 'Assinaturas', i: '↻' },
  { href: '/admin/agenda', label: 'Agenda', i: '▦' },
  { href: '/admin/servicos', label: 'Serviços', i: '✦' },
  { href: '/admin/memorias', label: 'Memórias', i: '♡' },
  { href: '/admin/parceiros', label: 'Parceiros', i: '⚭' },
  { href: '/admin/avaliacoes', label: 'Avaliações', i: '★' },
  { href: '/admin/corporativo', label: 'Corporativo', i: '▣' },
  { href: '/admin/redes', label: 'Redes Sociais', i: '◎' },
  { href: '/admin/aparencia', label: 'Aparência', i: '◐' },
];
const PROSP = [
  { href: '/admin/prospeccao', label: 'Dashboard' },
  { href: '/admin/prospeccao/leads', label: 'Leads · Nichos' },
  { href: '/admin/prospeccao/campanhas', label: 'Campanhas' },
  { href: '/admin/prospeccao/inbox', label: 'Caixa de entrada' },
  { href: '/admin/prospeccao/hunter', label: 'Hunter automático' },
  { href: '/admin/prospeccao/estados', label: 'Estados e municípios' },
  { href: '/admin/prospeccao/apis', label: 'Central de APIs' },
  { href: '/admin/prospeccao/relatorios', label: 'Relatórios · Anti-spam' },
];

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [aberto, setAberto] = useState(false);
  const item = (href: string, label: string, i?: string) => (
    <Link key={href} href={href} onClick={() => setAberto(false)} className={cn('flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition', path === href ? 'bg-realce/10 text-champanhe ring-1 ring-champanhe/40 shadow-brilho' : 'text-marrom/60 hover:bg-realce/5 hover:text-champanhe')}>
      {i && <span className="w-4 text-center opacity-70">{i}</span>}{label}
    </Link>
  );
  return (
    <SessionProvider>
      <div className="min-h-screen bg-[radial-gradient(1000px_500px_at_100%_0%,rgba(201,163,95,.10),transparent_60%)] lg:grid lg:grid-cols-[250px_1fr]">
        <aside className={cn('fixed inset-y-0 left-0 z-40 w-[250px] overflow-y-auto border-r border-ouro/15 bg-veu/80 p-4 text-marrom backdrop-blur-xl transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0', aberto ? 'translate-x-0' : '-translate-x-full')}>
          <Link href="/" className="mb-6 block px-3">
            <span className="texto-ouro whitespace-nowrap font-serif text-lg tracking-[0.18em]">RAFAEL CUNHA</span>
            <span className="block text-[10px] tracking-[0.4em] text-ouro">ATELIÊ · ADMIN</span>
          </Link>
          <nav className="space-y-0.5">{MENU.map((m) => item(m.href, m.label, m.i))}</nav>
          <div className="mt-6 rounded-xl border border-ouro/25 bg-ouro/[.04] p-2">
            <p className="flex items-center justify-between px-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-ouro">Prospecção <span className="rounded bg-ouro/20 px-1.5 text-[9px]">só admin</span></p>
            <nav className="space-y-0.5">{PROSP.map((m) => item(m.href, m.label))}</nav>
          </div>
          <button onClick={() => signOut({ callbackUrl: '/' })} className="mt-6 w-full rounded-lg px-3 py-2 text-left text-sm text-marrom/50 hover:bg-realce/5">Sair</button>
        </aside>
        {aberto && <div className="fixed inset-0 z-30 bg-overlay/30 lg:hidden" onClick={() => setAberto(false)} />}
        <div className="min-w-0">
          <div className="sticky top-0 z-20 flex items-center justify-between border-b border-areia bg-veu/80 px-4 py-3 backdrop-blur lg:hidden">
            <button onClick={() => setAberto(true)} aria-label="Menu">☰</button><span className="font-serif text-lg">Admin</span><span />
          </div>
          <main className="p-4 pb-24 sm:p-8">{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}
