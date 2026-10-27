'use client';

import { useAtelie, proximoAniversario } from '@/lib/store';
import { Kpi, Titulo, Aviso } from '@/components/admin/ui';
import { dataBR } from '@/data/servicos';
import { cn, SITE_URL, waLink } from '@/lib/format';

export default function AdminMemorias() {
  const { lembretes } = useAtelie();
  const lista = lembretes.map((l) => ({ ...l, prox: proximoAniversario(l.dataCasamento) })).sort((a, b) => a.prox.dias - b.prox.dias);
  const em30 = lista.filter((l) => l.prox.dias <= 30);
  return (
    <>
      <Titulo kicker="Relacionamento" titulo="Memórias · aniversários de casamento" />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Kpi rotulo="Casais acompanhados" valor={lista.length} />
        <Kpi rotulo="Aniversários em 30 dias" valor={em30.length} sub="hora de mandar mensagem" />
        <Kpi rotulo="Próximo" valor={lista[0] ? `${lista[0].prox.dias}d` : '—'} sub={lista[0]?.nome} />
      </div>
      <Aviso>Todo pedido de noiva com data do casamento informada entra aqui. Mande a mensagem 10 a 15 dias antes, com o link para recriar o buquê em versão de mesa.</Aviso>
      <div className="mt-4 space-y-3">
        {lista.map((l) => {
          const msg = l.prox.anos === 0
            ? `Oi ${l.nome.split(' ')[0]}! Aqui é o Rafael 🌸 Faltam ${l.prox.dias} dias para o seu casamento. Já estou separando as flores com todo carinho!`
            : `Oi ${l.nome.split(' ')[0]}! Aqui é o Rafael 🌸 Dia ${dataBR(l.prox.data).slice(0, 5)} faz ${l.prox.anos} ano${l.prox.anos > 1 ? 's' : ''} do seu casamento! Que tal recriar o ${l.produto} em versão de mesa para comemorar? Use o cupom BODAS10 (10% off): ${SITE_URL}/loja`;
          return (
            <div key={l.nome + l.dataCasamento} className="card-admin flex flex-wrap items-center gap-4">
              <div className={cn('flex h-14 w-14 flex-col items-center justify-center rounded-full border text-center', l.prox.dias <= 30 ? 'border-champanhe bg-ouro/15 shadow-brilho' : 'border-areia')}>
                <span className="font-serif text-xl leading-none">{l.prox.dias}</span><span className="text-[9px] uppercase">dias</span>
              </div>
              <div className="flex-1">
                <p className="font-serif text-xl">{l.nome} · {l.prox.anos === 0 ? 'casamento' : `${l.prox.anos}º aniversário`}</p>
                <p className="text-sm text-marrom/60">Casaram em {dataBR(l.dataCasamento)} · {l.produto} · {l.origem}</p>
              </div>
              <a className="btn-whats !py-2" target="_blank" rel="noreferrer" href={waLink(msg, l.whatsapp)}>Enviar parabéns</a>
            </div>
          );
        })}
      </div>
    </>
  );
}
