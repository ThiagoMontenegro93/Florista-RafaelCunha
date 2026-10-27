'use client';

import { QRCodeSVG } from 'qrcode.react';
import { guiaPara, AUTOMACAO_POS_ENTREGA } from '@/data/cuidados';
import { PRODUTOS } from '@/data/produtos';
import { Icone } from './Ornamentos';
import { SITE_URL, waLink } from '@/lib/format';

export function GuiaCuidados({ produtoIds, mostrarAutomacao = true }: { produtoIds: string[]; mostrarAutomacao?: boolean }) {
  const flores = PRODUTOS.filter((p) => produtoIds.includes(p.id)).flatMap((p) => p.flores);
  const guia = guiaPara(flores);
  const principal = produtoIds[0];
  const link = `${SITE_URL}/cuidados/${principal}`;
  return (
    <section className="moldura p-6 sm:p-8 print:shadow-none">
      <p className="kicker">Seu guia de carinho pós-entrega</p>
      <h2 className="mt-1 text-4xl">Como fazer seu buquê durar <em className="texto-ouro">2x mais</em></h2>
      <p className="mt-1 text-sm text-marrom/60">Personalizado para: {guia.titulo}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {guia.passos.map((p, i) => (
          <div key={p.titulo} className="flex gap-4 rounded-2xl border border-areia bg-vidro p-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-champanhe/30 bg-gradient-to-br from-ouro/25 to-transparent text-champanhe"><Icone nome={p.icone} className="h-6 w-6" /></span>
            <div><p className="font-medium">{i + 1}. {p.titulo}</p><p className="text-sm text-marrom/70">{p.texto}</p></div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-3 rounded-2xl border border-ouro/60 bg-creme p-3">
          <span className="rounded-lg bg-[#F2E8DA] p-1.5"><QRCodeSVG value={link} size={78} fgColor="#0A0807" bgColor="#F2E8DA" /></span>
          <p className="max-w-[160px] text-xs">Este QR vai na tag dourada do seu buquê e abre o vídeo de 30s do Rafael ensinando os cuidados.</p>
        </div>
        <div className="flex flex-wrap gap-2 print:hidden">
          <a className="btn-whats" target="_blank" rel="noreferrer" href={waLink(`Olá Rafael! Quero receber o guia de cuidados: ${link}`)}>Receber guia no WhatsApp</a>
          <button className="btn-linha" onClick={() => window.print()}>Baixar PDF</button>
        </div>
      </div>
      {mostrarAutomacao && (
        <div className="mt-6 print:hidden">
          <p className="rotulo">Lembretes automáticos que você vai receber</p>
          <ol className="grid gap-2 sm:grid-cols-4">
            {AUTOMACAO_POS_ENTREGA.map((a) => (
              <li key={a.dia} className="rounded-xl bg-blush/70 p-3 text-xs"><b className="text-ouro">{a.dia}</b> · {a.mensagem.replace('{link_guia}', 'link do guia')}</li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
