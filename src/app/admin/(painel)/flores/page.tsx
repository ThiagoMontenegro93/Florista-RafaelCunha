'use client';

import { useState } from 'react';
import { FLORES, BIOMAS, type Flor } from '@/data/flores';
import { Titulo, Toggle } from '@/components/admin/ui';

export default function AdminFlores() {
  const [fs, setFs] = useState<Flor[]>(FLORES);
  const [nova, setNova] = useState({ nome: '', cientifico: '', bioma: 'Sudeste' as Flor['bioma'] });
  return (
    <>
      <Titulo kicker="Catálogo" titulo={`Flores do Brasil · ${fs.length}`} />
      <form className="card-admin mb-4 grid gap-2 sm:grid-cols-[1fr_1fr_160px_auto]" onSubmit={(e) => { e.preventDefault(); if (!nova.nome) return; setFs([...fs, { ...FLORES[12], slug: 'nova-' + Date.now(), nome: nova.nome, cientifico: nova.cientifico, bioma: nova.bioma, trabalhamos: false }]); setNova({ ...nova, nome: '', cientifico: '' }); }}>
        <input className="campo" placeholder="Nome popular" value={nova.nome} onChange={(e) => setNova({ ...nova, nome: e.target.value })} />
        <input className="campo italic" placeholder="Nome científico" value={nova.cientifico} onChange={(e) => setNova({ ...nova, cientifico: e.target.value })} />
        <select className="campo" value={nova.bioma} onChange={(e) => setNova({ ...nova, bioma: e.target.value as Flor['bioma'] })}>{BIOMAS.map((b) => <option key={b.nome}>{b.nome}</option>)}</select>
        <button className="btn-ouro">Cadastrar</button>
      </form>
      <div className="card-admin overflow-x-auto p-0">
        <table className="tabela w-full min-w-[720px]">
          <thead><tr><th>Flor</th><th>Científico</th><th>Bioma</th><th>Durabilidade</th><th>Trabalhamos</th></tr></thead>
          <tbody>{fs.map((f, i) => (
            <tr key={f.slug}><td>{f.emoji} {f.nome}</td><td className="italic">{f.cientifico}</td><td>{f.bioma}</td><td>{f.durabilidade[0]}–{f.durabilidade[1]} dias</td>
              <td><Toggle on={f.trabalhamos} onChange={(v) => setFs(fs.map((x, j) => (j === i ? { ...x, trabalhamos: v } : x)))} label={f.nome} /></td></tr>
          ))}</tbody>
        </table>
      </div>
    </>
  );
}
