'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MODO_DEMO } from '@/lib/demo';

/** Alternador de demonstração: Ver como Cliente / Ver como Admin. Em produção só aparece com NEXT_PUBLIC_DEMO=1. */
export function ViewToggle() {
  const path = usePathname();
  if (!MODO_DEMO) return null;
  const admin = path.startsWith('/admin');
  return (
    <div className={`no-print fixed bottom-4 z-50 ${admin ? 'right-4' : 'left-4'} flex overflow-hidden rounded-full border border-ouro/40 bg-overlay/45 text-xs shadow-suave backdrop-blur-xl`}>
      <Link href="/" className={`px-4 py-2 ${!admin ? 'bg-ouro text-tinta' : 'text-marrom'}`}>Ver como Cliente</Link>
      <Link href="/admin" className={`px-4 py-2 ${admin ? 'bg-champanhe text-tinta' : 'text-marrom/70'}`}>Ver como Admin</Link>
    </div>
  );
}
