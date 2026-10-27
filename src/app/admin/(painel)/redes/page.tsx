'use client';

import { useState } from 'react';
import { useAtelie } from '@/lib/store';
import { Titulo, Aviso } from '@/components/admin/ui';

const OPCOES = ['Instagram', 'TikTok', 'Pinterest', 'YouTube', 'Facebook', 'LinkedIn'];

export default function AdminRedes() {
  const { redes, set } = useAtelie();
  const [nome, setNome] = useState('TikTok');
  const [url, setUrl] = useState('');
  return (
    <>
      <Titulo kicker="Presença" titulo="Redes sociais" />
      <Aviso>As redes adicionadas aqui aparecem na hora no rodapé do site público.</Aviso>
      <form className="card-admin mt-4 grid gap-2 sm:grid-cols-[180px_1fr_auto]" onSubmit={(e) => { e.preventDefault(); if (!url.startsWith('http')) return; set('redes', (r) => [...r, { nome, url }]); setUrl(''); }}>
        <select className="campo" value={nome} onChange={(e) => setNome(e.target.value)}>{OPCOES.map((o) => <option key={o}>{o}</option>)}</select>
        <input className="campo" placeholder="https://www.tiktok.com/@florista.rafaelcunha" value={url} onChange={(e) => setUrl(e.target.value)} />
        <button className="btn-ouro">Adicionar</button>
      </form>
      <ul className="mt-4 space-y-2">
        {redes.map((r) => (
          <li key={r.url} className="card-admin flex items-center justify-between"><span><b>{r.nome}</b> · <span className="text-sm text-marrom/60">{r.url}</span></span>
            <button className="text-sm text-rosa" onClick={() => set('redes', (x) => x.filter((y) => y.url !== r.url))}>remover</button></li>
        ))}
      </ul>
    </>
  );
}
