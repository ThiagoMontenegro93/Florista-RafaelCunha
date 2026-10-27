'use client';

import { useEffect, useState } from 'react';
import { SeloCera } from './Ornamentos';

export function LeadPopup() {
  const [aberto, setAberto] = useState(false);
  const [ok, setOk] = useState(false);
  useEffect(() => {
    try { if (localStorage.getItem('popup-10')) return; } catch {}
    const t = setTimeout(() => setAberto(true), 2500);
    return () => clearTimeout(t);
  }, []);
  const fechar = () => { setAberto(false); try { localStorage.setItem('popup-10', '1'); } catch {} };
  if (!aberto) return null;
  return (
    <div className="no-print fixed inset-0 z-[60] flex items-center justify-center bg-overlay/45 p-4 backdrop-blur-sm" onClick={fechar}>
      <div className="moldura relative w-full max-w-md animate-surgir bg-creme p-8 text-center" onClick={(e) => e.stopPropagation()}>
        <button onClick={fechar} className="absolute right-4 top-4 text-marrom/50" aria-label="Fechar">✕</button>
        <SeloCera size={72} className="mx-auto" />
        {ok ? (
          <>
            <h3 className="mt-4 text-3xl">Seu presente chegou 🌸</h3>
            <p className="mt-2 text-sm">Use o cupom <b className="text-ouro">PRIMEIRA10</b> na sua primeira encomenda.</p>
          </>
        ) : (
          <>
            <p className="kicker mt-4">Boas-vindas ao ateliê</p>
            <h3 className="mt-2 text-4xl">10% na primeira encomenda</h3>
            <p className="mt-2 text-sm text-marrom/70">Receba o cupom e dicas para viver com flores todos os dias.</p>
            <form className="mt-5 flex flex-col gap-2 sm:flex-row" onSubmit={(e) => { e.preventDefault(); setOk(true); try { localStorage.setItem('popup-10', '1'); } catch {} }}>
              <input required type="email" placeholder="seu@email.com" className="campo" />
              <button className="btn-ouro whitespace-nowrap">Quero 10%</button>
            </form>
            <p className="mt-3 text-[11px] text-marrom/50">Sem spam. Descadastre quando quiser.</p>
          </>
        )}
      </div>
    </div>
  );
}
