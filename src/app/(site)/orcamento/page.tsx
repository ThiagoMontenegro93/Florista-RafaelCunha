'use client';

import { useState } from 'react';
import { waLink } from '@/lib/format';

export default function OrcamentoPage() {
  const [f, setF] = useState({ nome: '', tipo: 'Casamento', data: '', local: '', convidados: '', paleta: '', investimento: 'R$ 2.000 a R$ 5.000', msg: '' });
  const texto = `Olá Rafael! Orçamento: ${f.tipo} · ${f.data || 'data a definir'} · ${f.local || 'local a definir'} · ${f.convidados} convidados · paleta ${f.paleta || 'aberta'} · investimento ${f.investimento}. ${f.msg} — ${f.nome}`;
  return (
    <div className="secao grid gap-10 py-14 lg:grid-cols-2">
      <div>
        <p className="kicker">Orçamento sob medida</p>
        <h1 className="titulo-secao mt-2">Conte sua <em className="texto-ouro">história</em></h1>
        <p className="mt-4 text-marrom/75">Transparência: arranjos a partir de R$ 290, buquês de noiva a partir de R$ 380 e decoração de igreja a partir de R$ 2.800. Cada projeto é desenhado para o seu espaço.</p>
        <ul className="mt-6 space-y-2 text-sm">
          <li>✿ Resposta em até 1h no horário comercial</li><li>✿ Visita técnica ao local para casamentos</li><li>✿ Sinal de 50% reserva a data</li>
        </ul>
      </div>
      <form className="moldura space-y-3 p-6" onSubmit={(e) => { e.preventDefault(); window.open(waLink(texto), '_blank'); }}>
        <div><label className="rotulo">Nome</label><input required className="campo" value={f.nome} onChange={(e) => setF({ ...f, nome: e.target.value })} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="rotulo">Tipo</label><select className="campo" value={f.tipo} onChange={(e) => setF({ ...f, tipo: e.target.value })}>{['Casamento', 'Igreja', 'Centro Mesa', 'Corporativo', 'Aniversário'].map((t) => <option key={t}>{t}</option>)}</select></div>
          <div><label className="rotulo">Data</label><input type="date" className="campo" value={f.data} onChange={(e) => setF({ ...f, data: e.target.value })} /></div>
          <div><label className="rotulo">Local</label><input className="campo" placeholder="Santa Ignêz, Solar Real…" value={f.local} onChange={(e) => setF({ ...f, local: e.target.value })} /></div>
          <div><label className="rotulo">Convidados</label><input className="campo" inputMode="numeric" value={f.convidados} onChange={(e) => setF({ ...f, convidados: e.target.value })} /></div>
        </div>
        <div><label className="rotulo">Paleta dos sonhos</label><input className="campo" placeholder="Amarelo + azul, branco puro…" value={f.paleta} onChange={(e) => setF({ ...f, paleta: e.target.value })} /></div>
        <div><label className="rotulo">Investimento previsto</label><select className="campo" value={f.investimento} onChange={(e) => setF({ ...f, investimento: e.target.value })}>{['Até R$ 1.000', 'R$ 1.000 a R$ 2.000', 'R$ 2.000 a R$ 5.000', 'R$ 5.000 a R$ 15.000', 'Acima de R$ 15.000'].map((t) => <option key={t}>{t}</option>)}</select></div>
        <div><label className="rotulo">Mensagem</label><textarea className="campo" rows={4} value={f.msg} onChange={(e) => setF({ ...f, msg: e.target.value })} /></div>
        <button className="btn-ouro w-full">Enviar pelo WhatsApp</button>
      </form>
    </div>
  );
}
