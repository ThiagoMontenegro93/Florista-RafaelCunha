'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useAtelie, descontoCupom } from '@/lib/store';
import { brl, cn } from '@/lib/format';

const ETAPAS = ['Seus dados', 'Entrega', 'Pagamento'];

export default function CheckoutPage() {
  const { carrinho, cupom, creditos, pronto, finalizarPedido, ref } = useAtelie();
  const router = useRouter();
  const [etapa, setEtapa] = useState(0);
  const [d, setD] = useState({ nome: '', whatsapp: '', email: '', bairro: '', cidade: 'Rio de Janeiro', referencia: '', via: 'WhatsApp', retirar: false, dataCasamento: '' });
  const [pag, setPag] = useState<'pix' | 'cartao' | 'sinal'>('pix');
  const [parcelas, setParcelas] = useState(1);
  const [enviado, setEnviado] = useState(false);

  const subtotal = carrinho.reduce((s, i) => s + i.preco, 0);
  const desc = descontoCupom(cupom, subtotal, creditos);
  const noiva = carrinho.some((i) => i.tipo !== 'consultoria' && /Noiva|Bouquet|Buquê|Casamento|Centro/i.test(i.nome));
  const base = subtotal - desc;
  const temSinal = carrinho.some((i) => i.sinal);
  const total = pag === 'pix' ? Math.round(base * 0.95) : base;
  const agora = pag === 'sinal' ? Math.round(total * 0.5) : total;

  if (enviado) return <div className="secao py-24 text-center"><p className="kicker">Enviando seu pedido…</p></div>;
  if (pronto && carrinho.length === 0)
    return <div className="secao py-24 text-center"><h1 className="text-4xl">Seu atelier está vazio</h1><Link href="/loja" className="btn-ouro mt-6">Ver a loja</Link></div>;

  const enviar = () => {
    setEnviado(true);
    const numero = finalizarPedido({ nome: d.nome, whatsapp: d.whatsapp.replace(/\D/g, ''), total, pagamento: pag === 'sinal' ? `Sinal 50% (${brl(agora)})` : pag === 'pix' ? 'Pix' : `Cartão ${parcelas}x`, dataCasamento: d.dataCasamento || undefined });
    router.push(`/pedido/${numero}`);
  };

  const valido = etapa === 0 ? d.nome && d.whatsapp.replace(/\D/g, '').length >= 10 && /\S+@\S+/.test(d.email) : true;

  return (
    <div className="secao grid gap-10 py-14 lg:grid-cols-[1fr_380px]">
      <div>
        <p className="kicker">Checkout</p>
        <h1 className="titulo-secao mt-2">Quase lá, <em className="texto-ouro">com carinho</em></h1>
        <ol className="mt-6 flex gap-1">{ETAPAS.map((e, i) => <li key={e} className={cn('flex-1 border-t-2 pt-1 text-xs', i <= etapa ? 'border-ouro text-ouro' : 'border-areia text-marrom/40')}>{i + 1}. {e}</li>)}</ol>
        <div className="moldura mt-6 p-6">
          {etapa === 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2"><label className="rotulo">Nome</label><input className="campo" value={d.nome} onChange={(e) => setD({ ...d, nome: e.target.value })} /></div>
              <div><label className="rotulo">WhatsApp</label><input className="campo" inputMode="tel" placeholder="(21) 9..." value={d.whatsapp} onChange={(e) => setD({ ...d, whatsapp: e.target.value })} /></div>
              <div><label className="rotulo">Email</label><input className="campo" type="email" value={d.email} onChange={(e) => setD({ ...d, email: e.target.value })} /></div>
              {noiva && (
                <div className="sm:col-span-2"><label className="rotulo">Data do casamento (opcional)</label><input className="campo" type="date" value={d.dataCasamento} onChange={(e) => setD({ ...d, dataCasamento: e.target.value })} />
                  <p className="mt-1 text-xs text-marrom/60">💍 No aniversário de casamento, Rafael te avisa para recriar o buquê em versão de mesa.</p></div>
              )}
              {ref && <p className="text-xs text-salvia sm:col-span-2">Indicação de parceiro: {ref}</p>}
            </div>
          )}
          {etapa === 1 && (
            <div className="space-y-4">
              <p className="rounded-xl bg-blush p-3 text-sm">Flores são delicadas e merecem entrega com cuidado. Por isso combinamos cada detalhe.</p>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-ouro" checked={d.retirar} onChange={(e) => setD({ ...d, retirar: e.target.checked })} /> Retirar no ateliê</label>
              {!d.retirar && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div><label className="rotulo">Bairro</label><input className="campo" value={d.bairro} onChange={(e) => setD({ ...d, bairro: e.target.value })} /></div>
                  <div><label className="rotulo">Cidade</label><input className="campo" value={d.cidade} onChange={(e) => setD({ ...d, cidade: e.target.value })} /></div>
                  <div className="sm:col-span-2"><label className="rotulo">Referência (opcional)</label><input className="campo" value={d.referencia} onChange={(e) => setD({ ...d, referencia: e.target.value })} /></div>
                </div>
              )}
              <div><label className="rotulo">Como prefere combinar a entrega?</label>
                <div className="flex gap-2">{['WhatsApp', 'Ligação'].map((v) => <button key={v} onClick={() => setD({ ...d, via: v })} className={cn('rounded-full border px-4 py-2 text-sm', d.via === v ? 'border-ouro bg-blush' : 'border-areia bg-vidro')}>{v}</button>)}</div>
              </div>
            </div>
          )}
          {etapa === 2 && (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                {([['pix', 'Pix', '5% off'], ['cartao', 'Cartão', 'até 6x sem juros'], ...(temSinal ? [['sinal', 'Sinal 50%', 'Reserva da data']] : [])] as [typeof pag, string, string][]).map(([id, t, s]) => (
                  <button key={id} onClick={() => setPag(id)} className={cn('rounded-2xl border p-4 text-left', pag === id ? 'border-ouro bg-blush' : 'border-areia bg-vidro')}><p className="font-medium">{t}</p><p className="text-xs text-salvia">{s}</p></button>
                ))}
              </div>
              {pag === 'pix' && (
                <div className="flex items-center gap-4 rounded-2xl border border-areia bg-vidro p-4">
                  <span className="rounded-xl bg-[#F2E8DA] p-2"><QRCodeSVG value={`00020126PIX-MOCK-ATELIE-RAFAELCUNHA-${total}`} size={112} fgColor="#0A0807" bgColor="#F2E8DA" /></span>
                  <div className="text-sm"><p className="font-medium">Pix copia e cola (demonstração)</p><p className="text-marrom/60">Em produção este QR é gerado pelo Mercado Pago.</p></div>
                </div>
              )}
              {pag === 'cartao' && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <input className="campo sm:col-span-2" placeholder="Número do cartão" /><input className="campo" placeholder="Validade" /><input className="campo" placeholder="CVV" />
                  <select className="campo sm:col-span-2" value={parcelas} onChange={(e) => setParcelas(+e.target.value)}>{[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}x de {brl(total / n)}</option>)}</select>
                </div>
              )}
              {pag === 'sinal' && <p className="rounded-xl bg-blush p-3 text-sm">Pague 50% agora ({brl(agora)}) para reservar a data e o restante até 5 dias antes do evento.</p>}
              <p className="text-sm text-marrom/70">Entrega a combinar · valor informado no WhatsApp.</p>
            </div>
          )}
          <div className="mt-6 flex gap-2">
            {etapa > 0 && <button className="btn-linha" onClick={() => setEtapa(etapa - 1)}>Voltar</button>}
            {etapa < 2 ? <button className="btn-ouro flex-1" disabled={!valido} onClick={() => setEtapa(etapa + 1)}>Continuar</button>
              : <button className="btn-ouro flex-1" onClick={enviar}>Enviar pedido e combinar entrega no WhatsApp</button>}
          </div>
        </div>
      </div>
      <aside className="moldura h-fit p-6 text-sm lg:sticky lg:top-32">
        <p className="kicker mb-3">Resumo</p>
        {carrinho.map((i) => <div key={i.uid} className="flex justify-between border-b border-areia py-2"><span>{i.emoji} {i.nome} <span className="text-marrom/50">({i.detalhe ?? i.tamanho})</span></span><span>{brl(i.preco)}</span></div>)}
        <div className="mt-3 space-y-1">
          <div className="flex justify-between"><span>Subtotal</span><span>{brl(subtotal)}</span></div>
          {desc > 0 && <div className="flex justify-between text-salvia"><span>Cupom {cupom}</span><span>−{brl(desc)}</span></div>}
          {pag === 'pix' && <div className="flex justify-between text-salvia"><span>Pix 5% off</span><span>−{brl(base - total)}</span></div>}
          <div className="flex justify-between text-marrom/70"><span>Entrega</span><span>A combinar</span></div>
          <div className="flex justify-between pt-2 font-serif text-2xl"><span>Total</span><span className="text-ouro">{brl(total)}</span></div>
          {pag === 'sinal' && <div className="flex justify-between"><span>Agora (sinal)</span><span>{brl(agora)}</span></div>}
        </div>
      </aside>
    </div>
  );
}
