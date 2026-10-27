'use client';

import { useState } from 'react';
import { useAtelie } from '@/lib/store';
import { itemServico } from '@/lib/servico';
import { PRESERVACAO } from '@/data/servicos';
import { Divisor } from '@/components/Ornamentos';
import { brl, cn } from '@/lib/format';

export default function PreservacaoPage() {
  const { set, abrirCarrinho } = useAtelie();
  const [dataCasamento, setDataCasamento] = useState('');
  const [gravacao, setGravacao] = useState('');
  const [add, setAdd] = useState<string | null>(null);

  const adicionar = (p: (typeof PRESERVACAO)[number]) => {
    const detalhe = [`Prazo ${p.prazo}`, dataCasamento && `Casamento ${dataCasamento.split('-').reverse().join('/')}`, gravacao && `Gravação “${gravacao}”`].filter(Boolean).join(' · ');
    set('carrinho', (c) => [...c, itemServico({ tipo: 'preservacao', id: p.id, nome: p.nome, emoji: p.emoji, preco: p.preco, detalhe, meta: { gravacao, dataCasamento } })]);
    setAdd(p.id);
    abrirCarrinho(true);
  };

  return (
    <div className="secao py-14">
      <div className="mx-auto max-w-3xl text-center">
        <p className="kicker">Preservação do buquê</p>
        <h1 className="titulo-secao mt-2">O buquê do seu sim, <em className="texto-ouro">para sempre</em></h1>
        <p className="mt-4 text-marrom/75">Depois da festa, buscamos o buquê em até 48h e eternizamos as flores em uma peça feita à mão no ateliê. Cada peça é única, como a sua história.</p>
      </div>
      <Divisor className="my-10" />
      <div className="moldura mx-auto grid max-w-3xl gap-3 p-5 sm:grid-cols-2">
        <div><label className="rotulo">Data do casamento</label><input type="date" className="campo" value={dataCasamento} onChange={(e) => setDataCasamento(e.target.value)} /></div>
        <div><label className="rotulo">Gravação (iniciais ou frase curta)</label><input className="campo" maxLength={30} placeholder="J & P · 25.10.2026" value={gravacao} onChange={(e) => setGravacao(e.target.value)} /></div>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {PRESERVACAO.map((p) => (
          <article key={p.id} className="moldura flex flex-col p-6 text-center transition hover:-translate-y-1 hover:shadow-brilho">
            <span className="text-5xl">{p.emoji}</span>
            <h2 className="mt-3 font-serif text-2xl">{p.nome}</h2>
            <p className="mt-2 flex-1 text-sm text-marrom/70">{p.descricao}</p>
            <p className="mt-3 text-xs uppercase tracking-widest text-marrom/50">Pronto em {p.prazo}</p>
            <p className="texto-ouro mt-1 font-serif text-3xl">{brl(p.preco)}</p>
            <button className={cn('mt-4', add === p.id ? 'btn-linha' : 'btn-ouro')} onClick={() => adicionar(p)}>{add === p.id ? 'Adicionado ✓' : 'Eternizar meu buquê'}</button>
          </article>
        ))}
      </div>
      <ol className="mx-auto mt-14 grid max-w-4xl gap-4 text-sm sm:grid-cols-4">
        {[['1', 'Reserve aqui', 'Antes ou depois do casamento'], ['2', 'Buscamos o buquê', 'Em até 48h após a festa'], ['3', 'Arte no ateliê', 'Secagem, prensa ou resina'], ['4', 'Entrega', 'Embalado para presente']].map(([n, t, d]) => (
          <li key={n} className="rounded-2xl border border-areia bg-vidro p-4 text-center"><span className="texto-ouro font-serif text-3xl">{n}</span><p className="font-medium">{t}</p><p className="text-xs text-marrom/60">{d}</p></li>
        ))}
      </ol>
    </div>
  );
}
