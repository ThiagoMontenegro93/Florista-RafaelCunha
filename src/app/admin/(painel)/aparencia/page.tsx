'use client';

import { useEffect, useState } from 'react';
import { TEMAS, TEMA_PADRAO, CHAVE_TEMA, aplicarTema, type TemaId } from '@/data/temas';
import { Titulo, Aviso } from '@/components/admin/ui';
import { cn } from '@/lib/format';

export default function AparenciaPage() {
  const [atual, setAtual] = useState<TemaId>(TEMA_PADRAO);
  useEffect(() => { setAtual((document.documentElement.dataset.tema as TemaId) || TEMA_PADRAO); }, []);
  const escolher = (id: TemaId) => { aplicarTema(id); setAtual(id); };
  return (
    <>
      <Titulo kicker="Identidade" titulo="Aparência do site" />
      <Aviso>Escolha o tema e o site inteiro muda na hora, inclusive o admin. Para fixar o tema para todos os visitantes em produção, defina <code>NEXT_PUBLIC_TEMA={atual}</code> no .env.</Aviso>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {TEMAS.map((t) => (
          <button key={t.id} onClick={() => escolher(t.id)} className={cn('group overflow-hidden rounded-2xl border text-left transition hover:-translate-y-1', atual === t.id ? 'border-ouro shadow-brilho ring-1 ring-ouro' : 'border-areia')}>
            {/* miniatura do tema */}
            <div className="relative h-40 p-5" style={{ background: `radial-gradient(circle at 80% 0%, ${t.cores[2]}33, transparent 60%), ${t.cores[0]}` }}>
              <p className="font-serif text-3xl font-light" style={{ color: t.cores[4] }}>Flores que <em style={{ color: t.cores[2] }}>guardam memórias</em></p>
              <div className="mt-4 flex items-center gap-3">
                <span className="rounded-full px-4 py-1.5 text-xs font-medium" style={{ background: 'linear-gradient(110deg,#A8844A,#EBD3A0,#C9A35F)', color: '#281C10' }}>Encomendar</span>
                <span className="rounded-full border px-4 py-1.5 text-xs" style={{ borderColor: t.cores[2], color: t.cores[4] }}>Portfólio</span>
              </div>
              <div className="absolute bottom-3 right-4 flex gap-1">{t.cores.map((c) => <span key={c} className="h-5 w-5 rounded-full border border-black/10" style={{ background: c }} />)}</div>
            </div>
            <div className="flex items-start justify-between gap-3 bg-vidro p-4">
              <div><p className="font-serif text-2xl">{t.nome}</p><p className="text-sm text-marrom/60">{t.descricao}</p></div>
              <span className={cn('pill shrink-0', atual === t.id ? 'bg-ouro text-tinta' : 'border border-areia text-marrom/50')}>{atual === t.id ? '✓ Ativo' : 'Aplicar'}</span>
            </div>
          </button>
        ))}
      </div>
      <p className="mt-4 text-xs text-marrom/50">Chave salva no navegador: {CHAVE_TEMA}</p>
    </>
  );
}
