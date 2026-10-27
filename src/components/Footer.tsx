'use client';

import Link from 'next/link';
import { useAtelie } from '@/lib/store';
import { Divisor, SeloCera } from './Ornamentos';
import { EMAIL, INSTAGRAM, TELEFONE } from '@/lib/format';
import { InstagramEmbed } from './InstagramEmbed';

const ICONES: Record<string, string> = { Instagram: '📸', TikTok: '🎵', Pinterest: '📌', YouTube: '▶️', Facebook: '👍', LinkedIn: '💼' };

export function Footer() {
  const { redes } = useAtelie();
  return (
    <footer className="relative mt-28 overflow-hidden border-t border-ouro/15 bg-[radial-gradient(ellipse_at_top,rgba(201,163,95,.12),transparent_60%)]">
      <Divisor className="-mt-5" />
      <div className="secao grid gap-10 py-14 md:grid-cols-3">
        <div className="space-y-4">
          <SeloCera size={84} />
          <p className="font-serif text-3xl font-light">Arquitetura emocional <em className="texto-ouro">com flores.</em></p>
          <p className="font-script text-4xl text-champanhe">Rafael Cunha</p>
          <p className="text-sm text-marrom/70">Arranjos sem espuma floral · Entrega a combinar em todo RJ</p>
        </div>
        <div className="space-y-3 text-sm">
          <p className="kicker">Contato</p>
          <a className="block hover:text-ouro" href={`mailto:${EMAIL}`}>{EMAIL}</a>
          <a className="block hover:text-ouro" href={`tel:${TELEFONE.replace(/\D/g, '')}`}>{TELEFONE}</a>
          <p className="kicker pt-4">Redes</p>
          <ul className="flex flex-wrap gap-2">
            {redes.map((r) => (
              <li key={r.url}>
                <a href={r.url} target="_blank" rel="noreferrer" className="pill border border-ouro/40 bg-vidro/80 hover:bg-ouro/10">{ICONES[r.nome] ?? '🔗'} {r.nome}</a>
              </li>
            ))}
          </ul>
          <p className="kicker pt-4">Explorar</p>
          <div className="grid grid-cols-2 gap-1 text-marrom/80">
            <Link href="/loja">Loja</Link><Link href="/assinaturas">Assinaturas</Link>
            <Link href="/flores">Flores do Brasil</Link><Link href="/sobre">Sobre</Link>
            <Link href="/simulador">Simulador de casamento</Link><Link href="/consultoria">Consultoria de noivas</Link>
            <Link href="/preservacao">Preservação do buquê</Link><Link href="/workshops">Workshops</Link>
            <Link href="/corporativo">Plano corporativo</Link><Link href="/parceiros">Seja parceiro</Link>
            <Link href="/rio-de-janeiro/igrejas">Igrejas no Rio</Link><Link href="/niteroi/casas-de-festa">Casas de festa Niterói</Link>
          </div>
        </div>
        <div>
          <p className="kicker mb-3">Instagram @{INSTAGRAM}</p>
          <InstagramEmbed />
        </div>
      </div>
      <div className="secao flex items-center justify-between border-t border-ouro/20 py-4 text-xs text-marrom/50">
        <span>© {new Date().getFullYear()} Rafael Cunha Ateliê Floral</span>
        {/* Acesso discreto: a rota /admin exige login FLORISTA (middleware). */}
        <Link href="/admin/login" className="opacity-40 transition hover:opacity-100" aria-label="Área do ateliê">·</Link>
      </div>
    </footer>
  );
}
