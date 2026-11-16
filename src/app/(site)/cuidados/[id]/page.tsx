import { notFound } from 'next/navigation';
import { PRODUTOS, fotoProduto, formaProduto } from '@/data/produtos';
import { FotoArranjo } from '@/components/Foto';
import { GuiaCuidados } from '@/components/GuiaCuidados';

export function generateStaticParams() {
  return PRODUTOS.map((p) => ({ id: p.id }));
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const p = PRODUTOS.find((x) => x.id === params.id);
  return { title: p ? `Cuidados: ${p.nome}` : 'Cuidados com flores' };
}

export default function CuidadosPage({ params }: { params: { id: string } }) {
  const p = PRODUTOS.find((x) => x.id === params.id);
  if (!p) notFound();
  return (
    <div className="secao space-y-8 py-14">
      <div>
        <p className="kicker">Tag dourada · QR</p>
        <h1 className="titulo-secao mt-2">{p.nome}</h1>
      </div>
      <div className="moldura relative mx-auto aspect-[9/16] max-w-xs overflow-hidden p-2">
        <FotoArranjo imagem={fotoProduto(p)} alt={p.nome} seed={p.id} flores={p.flores} paleta={p.paletas[0]} forma={formaProduto(p)} fundo={p.gradiente} className="h-full w-full rounded-[22px]" />
        <div className="absolute inset-2 flex flex-col items-center justify-end gap-2 rounded-[22px] bg-gradient-to-t from-black/70 via-black/10 to-transparent p-6 text-center text-white">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/70 bg-white/15 text-xl backdrop-blur" aria-hidden>▶</span>
          <p className="font-serif text-2xl">Vídeo de 30s</p>
          <p className="text-xs text-white/80">Rafael ensinando os cuidados com este arranjo. Defina a URL do vídeo no admin (GuiaConservacao.videoUrl).</p>
        </div>
      </div>
      <GuiaCuidados produtoIds={[p.id]} mostrarAutomacao={false} />
    </div>
  );
}
