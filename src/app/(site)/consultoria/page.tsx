'use client';

import { useState } from 'react';
import { useAtelie } from '@/lib/store';
import { itemServico } from '@/lib/servico';
import { CONSULTORIA, dataBR } from '@/data/servicos';
import { Calendario } from '@/components/Calendario';
import { RetratoRafael } from '@/components/Ornamentos';
import { brl, cn } from '@/lib/format';

export default function ConsultoriaPage() {
  const { set, abrirCarrinho, consultas, carrinho } = useAtelie();
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [formato, setFormato] = useState('No ateliê');
  const ocupados = (d: string) => [...consultas.filter((c) => c.data === d).map((c) => c.hora), ...carrinho.filter((i) => i.tipo === 'consultoria' && i.meta?.data === d).map((i) => String(i.meta?.hora))];
  const lotados = Array.from(new Set(consultas.map((c) => c.data))).filter((d) => ocupados(d).length >= CONSULTORIA.horarios.length);

  const reservar = () => {
    set('carrinho', (c) => [...c, itemServico({ tipo: 'consultoria', id: `consultoria-${data}-${hora}`, nome: 'Consultoria de noiva com Rafael', emoji: '🥂', preco: CONSULTORIA.preco, detalhe: `${dataBR(data)} às ${hora} · ${formato} · ${CONSULTORIA.duracao}`, data, meta: { data, hora, formato } })]);
    setData(''); setHora('');
    abrirCarrinho(true);
  };

  return (
    <div className="secao grid gap-10 py-14 lg:grid-cols-[1fr_440px]">
      <div>
        <p className="kicker">Consultoria de noivas</p>
        <h1 className="titulo-secao mt-2">Uma tarde com Rafael, <em className="texto-ouro">e o valor volta para você</em></h1>
        <p className="mt-4 text-marrom/75">{CONSULTORIA.duracao} para desenhar a paleta, escolher flores da estação, ver amostras reais e entender o investimento do seu casamento. Espumante e mesa de amostras inclusos.</p>
        <div className="moldura mt-6 flex items-center gap-5 p-5">
          <RetratoRafael size={90} />
          <div>
            <p className="texto-ouro font-serif text-4xl">{brl(CONSULTORIA.preco)}</p>
            <p className="text-sm text-marrom/70">100% convertido em crédito. Após a consultoria você recebe um código <strong>NOIVA-XXXX</strong> para abater no pedido do casamento.</p>
          </div>
        </div>
        <ul className="mt-6 space-y-2 text-sm">
          <li>✿ Paleta e moodboard enviados por WhatsApp no mesmo dia</li>
          <li>✿ Amostra física do buquê e de um centro de mesa</li>
          <li>✿ Proposta detalhada com o simulador do ateliê</li>
          <li>✿ Atendimento de terça a sábado</li>
        </ul>
      </div>
      <div className="moldura space-y-4 p-6">
        <p className="kicker">Escolha o dia</p>
        <Calendario valor={data} onChange={(d) => { setData(d); setHora(''); }} minDias={2} diasSemana={CONSULTORIA.diasSemana} extrasBloqueados={lotados} semBloqueioAgenda />
        {data && (
          <div>
            <p className="rotulo">Horário em {dataBR(data)}</p>
            <div className="flex flex-wrap gap-2">{CONSULTORIA.horarios.map((h) => { const oc = ocupados(data).includes(h); return <button key={h} disabled={oc} onClick={() => setHora(h)} className={cn('rounded-full border px-4 py-2 text-sm', hora === h ? 'border-ouro bg-blush' : 'border-areia bg-vidro', oc && 'cursor-not-allowed line-through opacity-40')}>{h}</button>; })}</div>
          </div>
        )}
        <div className="flex flex-wrap gap-2">{['No ateliê', 'Videochamada'].map((f) => <button key={f} onClick={() => setFormato(f)} className={cn('rounded-full border px-4 py-2 text-sm', formato === f ? 'border-ouro bg-blush' : 'border-areia bg-vidro')}>{f}</button>)}</div>
        <button className="btn-ouro w-full" disabled={!data || !hora} onClick={reservar}>Reservar consultoria · {brl(CONSULTORIA.preco)}</button>
      </div>
    </div>
  );
}
