'use client';

import { useState } from 'react';
import { PRODUTOS } from '@/data/produtos';
import { Titulo, Toggle } from '@/components/admin/ui';
import { brl } from '@/lib/format';

export default function AdminLoja() {
  const [ps, setPs] = useState(PRODUTOS.map((p) => ({ ...p, ativo: true })));
  return (
    <>
      <Titulo kicker="Catálogo" titulo="Loja · 12 produtos"><button className="btn-ouro">+ Novo produto</button></Titulo>
      <div className="card-admin overflow-x-auto p-0">
        <table className="tabela w-full min-w-[720px]">
          <thead><tr><th></th><th>Produto</th><th>Categoria</th><th>Preço</th><th>Prazo</th><th>Badge</th><th>Ativo</th></tr></thead>
          <tbody>
            {ps.map((p, i) => (
              <tr key={p.id}>
                <td className="text-2xl">{p.emoji}</td><td className="font-medium">{p.nome}</td><td>{p.categoria}</td>
                <td><input className="campo w-28 !py-1" type="number" value={p.preco} onChange={(e) => setPs(ps.map((x, j) => (j === i ? { ...x, preco: +e.target.value } : x)))} /> <span className="text-xs text-marrom/50">{brl(p.preco)}</span></td>
                <td>{p.prazo}</td><td>{p.badge ?? '—'}</td>
                <td><Toggle on={p.ativo} onChange={(v) => setPs(ps.map((x, j) => (j === i ? { ...x, ativo: v } : x)))} label={`Ativar ${p.nome}`} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
