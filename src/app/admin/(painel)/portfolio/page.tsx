'use client';

import { useState } from 'react';
import { PORTFOLIO } from '@/data/portfolio';
import { Titulo } from '@/components/admin/ui';

export default function AdminPortfolio() {
  const [itens, setItens] = useState(PORTFOLIO);
  const up = (i: number, k: string, v: string) => setItens((x) => x.map((p, j) => (j === i ? { ...p, [k]: v } : p)));
  return (
    <>
      <Titulo kicker="Conteúdo" titulo="Portfólio"><button className="btn-ouro" onClick={() => setItens([...itens, { ...PORTFOLIO[0], id: 'novo-' + Date.now(), titulo: 'Novo projeto', imagem: '' }])}>+ Novo projeto</button></Titulo>
      <div className="grid gap-4 md:grid-cols-2">
        {itens.map((p, i) => (
          <div key={p.id} className="card-admin space-y-2">
            <div className="flex h-28 items-center justify-center rounded-xl text-5xl" style={{ background: `linear-gradient(135deg, ${p.gradiente[0]}, ${p.gradiente[1]})` }}>{p.emoji}</div>
            <input className="campo" value={p.titulo} onChange={(e) => up(i, 'titulo', e.target.value)} />
            <div className="grid grid-cols-3 gap-2"><input className="campo" value={p.tipo} onChange={(e) => up(i, 'tipo', e.target.value)} /><input className="campo" value={p.local} onChange={(e) => up(i, 'local', e.target.value)} /><input className="campo" value={p.data} onChange={(e) => up(i, 'data', e.target.value)} /></div>
            <input className="campo" placeholder="URL da foto (Cloudinary)" value={p.imagem} onChange={(e) => up(i, 'imagem', e.target.value)} />
          </div>
        ))}
      </div>
    </>
  );
}
