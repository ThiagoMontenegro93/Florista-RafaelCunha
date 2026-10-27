'use client';

import { useState } from 'react';
import { EXTRAS, PALETAS, TAMANHOS, type Produto } from '@/data/produtos';
import { useAtelie } from '@/lib/store';
import { brl, cn } from '@/lib/format';
import { Calendario } from './Calendario';

const PASSOS = ['Tamanho', 'Paleta', 'Extras', 'Entrega', 'Cartão'];
const ENTREGAS = [
  { id: 'retirada', nome: 'Retirada no Ateliê', desc: 'Grátis · horário a combinar' },
  { id: 'padrao', nome: 'Entrega a combinar', desc: 'Após o pedido, Rafael entra em contato via WhatsApp em até 1h para combinar horário, local e valor com cuidado.' },
  { id: 'evento', nome: 'Entrega na Igreja / Local do Evento', desc: 'A combinar · informe o local da cerimônia' },
];

export function CustomizeModal({ produto, onClose }: { produto: Produto; onClose: () => void }) {
  const { set, abrirCarrinho } = useAtelie();
  const [passo, setPasso] = useState(0);
  const [tamanho, setTamanho] = useState<(typeof TAMANHOS)[number]['id']>('P');
  const [paleta, setPaleta] = useState<string>(produto.paletas[0]);
  const [extras, setExtras] = useState<string[]>(['cartao']);
  const [entrega, setEntrega] = useState('padrao');
  const [local, setLocal] = useState('Casa e Capela Santa Ignêz');
  const [data, setData] = useState<string>();
  const [horario, setHorario] = useState('tarde');
  const [mensagem, setMensagem] = useState('');

  const mult = TAMANHOS.find((t) => t.id === tamanho)!.mult;
  const total = Math.round(produto.preco * mult) + EXTRAS.filter((e) => extras.includes(e.id)).reduce((s, e) => s + e.preco, 0);

  const adicionar = () => {
    set('carrinho', (c) => [
      ...c,
      {
        uid: crypto.randomUUID(), produtoId: produto.id, nome: produto.nome, emoji: produto.emoji, tamanho, paleta,
        extras: EXTRAS.filter((e) => extras.includes(e.id)).map((e) => e.nome), entrega: ENTREGAS.find((e) => e.id === entrega)!.nome,
        localEvento: entrega === 'evento' ? local : undefined, dataDesejada: data, horario, mensagem, preco: total, sinal: produto.sinal,
      },
    ]);
    onClose();
    abrirCarrinho(true);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-overlay/45 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose} role="dialog" aria-modal aria-label={`Personalizar ${produto.nome}`}>
      <div className="moldura flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden bg-creme animate-surgir" onClick={(e) => e.stopPropagation()}>
        <div className="border-b border-areia p-6 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="kicker">Personalizar</p>
              <h3 className="text-3xl">{produto.emoji} {produto.nome}</h3>
            </div>
            <button onClick={onClose} aria-label="Fechar" className="text-marrom/50">✕</button>
          </div>
          <ol className="mt-4 flex gap-1">
            {PASSOS.map((p, i) => (
              <li key={p} className="flex-1">
                <button onClick={() => setPasso(i)} className={cn('w-full border-t-2 pt-1 text-left text-[11px]', i <= passo ? 'border-ouro text-ouro' : 'border-areia text-marrom/40')}>
                  {i + 1}. {p}
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {passo === 0 && (
            <div className="grid grid-cols-3 gap-3">
              {TAMANHOS.map((t) => (
                <button key={t.id} onClick={() => setTamanho(t.id)} className={cn('rounded-2xl border p-4 text-center transition', tamanho === t.id ? 'border-ouro bg-blush' : 'border-areia bg-vidro')}>
                  <span className="block font-serif text-4xl">{t.nome}</span>
                  <span className="text-xs text-marrom/60">{t.desc}</span>
                  <span className="mt-1 block text-sm text-ouro">{brl(Math.round(produto.preco * t.mult))}</span>
                </button>
              ))}
            </div>
          )}
          {passo === 1 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {PALETAS.map((p) => (
                <button key={p.nome} onClick={() => setPaleta(p.nome)} className={cn('flex flex-col items-center gap-2 rounded-2xl border p-4 transition', paleta === p.nome ? 'border-ouro bg-blush' : 'border-areia bg-vidro')}>
                  <span className="flex">
                    {p.cores.map((c, i) => (
                      <span key={c} className="h-10 w-10 rounded-full border border-champanhe/40 shadow" style={{ background: `radial-gradient(circle at 35% 35%, #fff8, ${c})`, marginLeft: i ? -10 : 0 }} />
                    ))}
                  </span>
                  <span className="text-xs">{p.nome}</span>
                </button>
              ))}
              <p className="col-span-full text-xs text-marrom/60">Nota honesta: cada arranjo é único. Você pode não receber uma cópia exata da foto, mas sempre a mesma paleta e o mesmo frescor.</p>
            </div>
          )}
          {passo === 2 && (
            <div className="space-y-2">
              {EXTRAS.map((e) => (
                <label key={e.id} className="flex cursor-pointer items-center justify-between rounded-xl border border-areia bg-vidro px-4 py-3">
                  <span className="flex items-center gap-3">
                    <input type="checkbox" className="accent-ouro" checked={extras.includes(e.id)} onChange={() => setExtras((x) => (x.includes(e.id) ? x.filter((i) => i !== e.id) : [...x, e.id]))} />
                    {e.nome}
                  </span>
                  <span className="text-sm text-ouro">{e.preco ? `+${brl(e.preco)}` : 'Grátis'}</span>
                </label>
              ))}
            </div>
          )}
          {passo === 3 && (
            <div className="space-y-4">
              {ENTREGAS.map((e) => (
                <label key={e.id} className={cn('block cursor-pointer rounded-xl border p-4', entrega === e.id ? 'border-ouro bg-blush' : 'border-areia bg-vidro')}>
                  <span className="flex items-center gap-3 font-medium">
                    <input type="radio" name="entrega" className="accent-ouro" checked={entrega === e.id} onChange={() => setEntrega(e.id)} />
                    {e.nome} <span className="etiqueta">A combinar</span>
                  </span>
                  <span className="mt-1 block pl-6 text-xs text-marrom/70">{e.desc}</span>
                </label>
              ))}
              {entrega === 'evento' && (
                <div>
                  <label className="rotulo">Local da cerimônia</label>
                  <select className="campo" value={local} onChange={(e) => setLocal(e.target.value)}>
                    <option>Casa e Capela Santa Ignêz</option><option>Solar Real</option><option>Outro local no RJ</option>
                  </select>
                </div>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="rotulo">Data desejada</label>
                  <Calendario valor={data} onChange={setData} />
                </div>
                <div>
                  <label className="rotulo">Melhor horário para contato</label>
                  <div className="flex gap-2">
                    {['manhã', 'tarde', 'noite'].map((h) => (
                      <button key={h} onClick={() => setHorario(h)} className={cn('flex-1 rounded-full border px-3 py-2 text-sm capitalize', horario === h ? 'border-ouro bg-blush' : 'border-areia bg-vidro')}>{h}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {passo === 4 && (
            <div>
              <label className="rotulo">Mensagem do cartão</label>
              <textarea value={mensagem} onChange={(e) => setMensagem(e.target.value)} rows={6} maxLength={300} placeholder="Escreva com o coração…" className="campo font-display text-lg italic leading-8" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #F5E6D3 32px)' }} />
              <p className="mt-1 text-right text-xs text-marrom/50">{mensagem.length}/300 · escrito à mão por Rafael</p>
            </div>
          )}
        </div>

        <div className="border-t border-areia bg-vidro/80 p-5">
          <div className="mb-3 flex items-end justify-between text-sm">
            <div>
              <p className="text-marrom/60">Entrega: a combinar via WhatsApp</p>
              <p className="text-xs text-marrom/50">Preço sem frete</p>
            </div>
            <p className="font-display text-3xl text-ouro">{brl(total)}</p>
          </div>
          <div className="flex gap-2">
            {passo > 0 && <button className="btn-linha" onClick={() => setPasso(passo - 1)}>Voltar</button>}
            {passo < 4 ? (
              <button className="btn-ouro flex-1" onClick={() => setPasso(passo + 1)}>Continuar</button>
            ) : (
              <button className="btn-ouro flex-1" onClick={adicionar}>Adicionar ao Atelier</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
