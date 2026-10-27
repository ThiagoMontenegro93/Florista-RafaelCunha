'use client';

import { useState } from 'react';
import { useAtelie } from '@/lib/store';
import { hojeISO } from '@/data/servicos';
import { SeloCera } from '@/components/Ornamentos';
import { cn, GOOGLE_REVIEW_URL } from '@/lib/format';

/** Reduz a foto para caber no armazenamento do navegador (máx. 640px, JPEG). */
function reduzirFoto(file: File): Promise<string> {
  return new Promise((ok, erro) => {
    const r = new FileReader();
    r.onerror = erro;
    r.onload = () => {
      const img = new Image();
      img.onerror = erro;
      img.onload = () => {
        const k = Math.min(1, 640 / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
        ok(c.toDataURL('image/jpeg', 0.8));
      };
      img.src = String(r.result);
    };
    r.readAsDataURL(file);
  });
}

export default function AvaliarPage({ params }: { params: { numero: string } }) {
  const { pedidos, avaliacoes, set, pronto } = useAtelie();
  const pedido = pedidos.find((p) => p.numero === params.numero);
  const existente = avaliacoes.find((a) => a.pedido === params.numero);
  const [nota, setNota] = useState(0);
  const [hover, setHover] = useState(0);
  const [nome, setNome] = useState('');
  const [texto, setTexto] = useState('');
  const [foto, setFoto] = useState<string>();
  const [enviada, setEnviada] = useState(false);

  if (!pronto) return <div className="secao py-24" />;
  const notaFinal = enviada ? nota : existente?.nota ?? 0;

  if (enviada || existente)
    return (
      <div className="secao max-w-2xl py-20 text-center">
        <SeloCera size={90} className="mx-auto" />
        <h1 className="titulo-secao mt-4">Obrigado pelo <em className="texto-ouro">carinho</em></h1>
        <p className="mt-3 text-marrom/75">Sua avaliação do pedido #{params.numero} foi recebida e aparece no site depois da aprovação do ateliê.</p>
        {notaFinal >= 4 && (
          <div className="moldura mt-8 p-6">
            <p className="font-serif text-2xl">Pode nos ajudar no Google também?</p>
            <p className="mt-1 text-sm text-marrom/70">Leva 30 segundos e faz o ateliê chegar a mais noivas.</p>
            <a className="btn-ouro mt-4" href={GOOGLE_REVIEW_URL} target="_blank" rel="noreferrer">Avaliar no Google ★★★★★</a>
          </div>
        )}
      </div>
    );

  return (
    <div className="secao max-w-2xl py-14">
      <p className="kicker text-center">Pedido #{params.numero}</p>
      <h1 className="titulo-secao mt-2 text-center">Como foram <em className="texto-ouro">suas flores?</em></h1>
      {pedido && <p className="mt-2 text-center text-sm text-marrom/60">{pedido.itens.map((i) => i.nome).join(', ')}</p>}
      <form className="moldura mt-8 space-y-4 p-6" onSubmit={(e) => {
        e.preventDefault();
        set('avaliacoes', (as) => [{ pedido: params.numero, nome: pedido?.nome ?? nome, nota, texto, foto, data: hojeISO(), aprovada: false }, ...as]);
        setEnviada(true);
      }}>
        <div className="flex justify-center gap-1" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button type="button" key={n} aria-label={`${n} estrela${n > 1 ? 's' : ''}`} onMouseEnter={() => setHover(n)} onClick={() => setNota(n)} className={cn('text-5xl transition', n <= (hover || nota) ? 'text-champanhe drop-shadow' : 'text-areia')}>★</button>
          ))}
        </div>
        {!pedido && <div><label className="rotulo">Seu nome</label><input required className="campo" value={nome} onChange={(e) => setNome(e.target.value)} /></div>}
        <div><label className="rotulo">Conte como foi</label><textarea required minLength={10} className="campo" rows={4} value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="O buquê chegou perfeito, durou mais de uma semana…" /></div>
        <div>
          <label className="rotulo">Foto das flores (opcional)</label>
          <input type="file" accept="image/*" className="campo" onChange={async (e) => { const f = e.target.files?.[0]; if (f) setFoto(await reduzirFoto(f)); }} />
          {/* eslint-disable-next-line @next/next/no-img-element -- foto em data URL enviada pela cliente */}
          {foto && <img src={foto} alt="Prévia da foto enviada" className="mt-3 max-h-56 rounded-2xl border border-areia" />}
        </div>
        <button className="btn-ouro w-full" disabled={nota === 0}>Enviar avaliação</button>
      </form>
    </div>
  );
}
