'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useAtelie } from '@/lib/store';
import { dataBR, hojeISO } from '@/data/servicos';
import { brl, cn, SITE_URL } from '@/lib/format';

const TIPOS = ['Cerimonialista', 'Espaço', 'Fotógrafo', 'Buffet', 'Assessoria', 'Influenciador'];

export default function ParceirosPage() {
  const { parceiros, indicacoes, set } = useAtelie();
  const [f, setF] = useState({ nome: '', tipo: 'Cerimonialista', email: '', whatsapp: '' });
  const [cod, setCod] = useState('');
  const [painel, setPainel] = useState<string | null>(null);
  const [erro, setErro] = useState('');
  const [copiado, setCopiado] = useState(false);

  const p = parceiros.find((x) => x.codigo === painel);
  const minhas = indicacoes.filter((i) => i.parceiro === painel);
  const vendido = minhas.reduce((s, i) => s + i.valor, 0);
  const aReceber = minhas.filter((i) => !i.pago).reduce((s, i) => s + i.valor * (p?.comissao ?? 0), 0);
  const recebido = minhas.filter((i) => i.pago).reduce((s, i) => s + i.valor * (p?.comissao ?? 0), 0);
  const link = p ? `${SITE_URL}/?ref=${p.codigo}` : '';

  const cadastrar = (e: React.FormEvent) => {
    e.preventDefault();
    const base = f.nome.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 14) || 'PARCEIRO';
    let c = base; let n = 2;
    while (parceiros.some((x) => x.codigo === c)) c = `${base}${n++}`;
    set('parceiros', (ps) => [...ps, { codigo: c, nome: f.nome, tipo: f.tipo, email: f.email, whatsapp: f.whatsapp.replace(/\D/g, ''), comissao: f.tipo === 'Cerimonialista' || f.tipo === 'Assessoria' ? 0.12 : 0.1, criadoEm: hojeISO() }]);
    setPainel(c);
  };

  return (
    <div className="secao py-14">
      <div className="mx-auto max-w-3xl text-center">
        <p className="kicker">Programa de parceiros</p>
        <h1 className="titulo-secao mt-2">Indique o ateliê e <em className="texto-ouro">ganhe com cada sim</em></h1>
        <p className="mt-4 text-marrom/75">Cerimonialistas, espaços, fotógrafos e assessorias recebem de 10% a 12% de comissão sobre cada pedido que chega pelo seu link. Painel em tempo real e pagamento mensal via Pix.</p>
      </div>

      {!p && (
        <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
          <form className="moldura space-y-3 p-6" onSubmit={cadastrar}>
            <p className="kicker">Quero ser parceiro</p>
            <div><label className="rotulo">Nome ou empresa</label><input required className="campo" value={f.nome} onChange={(e) => setF({ ...f, nome: e.target.value })} /></div>
            <div><label className="rotulo">Atuação</label><select className="campo" value={f.tipo} onChange={(e) => setF({ ...f, tipo: e.target.value })}>{TIPOS.map((t) => <option key={t}>{t}</option>)}</select></div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div><label className="rotulo">Email</label><input required type="email" className="campo" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
              <div><label className="rotulo">WhatsApp</label><input required className="campo" inputMode="tel" value={f.whatsapp} onChange={(e) => setF({ ...f, whatsapp: e.target.value })} /></div>
            </div>
            <button className="btn-ouro w-full">Gerar meu link de parceiro</button>
          </form>
          <form className="moldura space-y-3 p-6" onSubmit={(e) => { e.preventDefault(); const c = cod.trim().toUpperCase(); if (parceiros.some((x) => x.codigo === c)) { setPainel(c); setErro(''); } else setErro('Código não encontrado'); }}>
            <p className="kicker">Já sou parceiro</p>
            <div><label className="rotulo">Seu código</label><input className="campo uppercase" placeholder="SANTAIGNEZ" value={cod} onChange={(e) => setCod(e.target.value)} /></div>
            {erro && <p className="text-xs text-rosa">{erro}</p>}
            <button className="btn-linha w-full">Abrir meu painel</button>
            <ul className="space-y-1 pt-2 text-sm text-marrom/70"><li>✿ 10% para espaços, fotógrafos e buffets</li><li>✿ 12% para cerimonialistas e assessorias</li><li>✿ A noiva indicada ganha atendimento prioritário</li></ul>
          </form>
        </div>
      )}

      {p && (
        <div className="mx-auto mt-10 max-w-5xl space-y-6">
          <div className="moldura flex flex-wrap items-center gap-6 p-6">
            <span className="rounded-xl bg-white p-2"><QRCodeSVG value={link} size={110} fgColor="#3A2A1C" bgColor="#FFFFFF" /></span>
            <div className="min-w-0 flex-1">
              <p className="kicker">{p.tipo} · comissão {Math.round(p.comissao * 100)}%</p>
              <h2 className="font-serif text-3xl">{p.nome}</h2>
              <p className="mt-2 break-all text-sm">Seu link: <strong className="text-champanhe">{link}</strong></p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button className="btn-ouro !py-2" onClick={() => { navigator.clipboard?.writeText(link); setCopiado(true); }}>{copiado ? 'Link copiado ✓' : 'Copiar link'}</button>
                <button className="btn-linha !py-2" onClick={() => setPainel(null)}>Sair do painel</button>
              </div>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-4">
            {[['Indicações', String(minhas.length)], ['Vendido', brl(vendido)], ['A receber', brl(aReceber)], ['Recebido', brl(recebido)]].map(([t, v]) => (
              <div key={t} className="moldura p-5 text-center"><p className="text-xs uppercase tracking-widest text-marrom/60">{t}</p><p className="texto-ouro mt-1 font-serif text-3xl">{v}</p></div>
            ))}
          </div>
          <div className="moldura overflow-x-auto p-4">
            <table className="tabela">
              <thead><tr><th>Data</th><th>Pedido</th><th>Cliente</th><th>Valor</th><th>Comissão</th><th>Status</th></tr></thead>
              <tbody>
                {minhas.length === 0 && <tr><td colSpan={6} className="py-6 text-center text-marrom/60">Nenhuma indicação ainda. Compartilhe seu link!</td></tr>}
                {minhas.map((i) => <tr key={i.pedido}><td>{dataBR(i.data)}</td><td>#{i.pedido}</td><td>{i.cliente}</td><td>{brl(i.valor)}</td><td>{brl(i.valor * p.comissao)}</td><td><span className={cn('pill', i.pago ? 'bg-salvia/15 text-folha' : 'bg-ouro/15 text-champanhe')}>{i.pago ? 'Pago' : 'A receber'}</span></td></tr>)}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
