import { notFound } from 'next/navigation';
import { PRODUTOS } from '@/data/produtos';
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
        <h1 className="titulo-secao mt-2">{p.emoji} {p.nome}</h1>
      </div>
      <div className="moldura mx-auto flex aspect-[9/16] max-w-xs flex-col items-center justify-center gap-3 bg-gradient-to-b from-blush to-areia p-6 text-center">
        <span className="text-6xl">🎬</span>
        <p className="font-serif text-2xl">Vídeo de 30s</p>
        <p className="text-sm text-marrom/70">Rafael ensinando os cuidados com este arranjo. Defina a URL do vídeo no admin (GuiaConservacao.videoUrl).</p>
      </div>
      <GuiaCuidados produtoIds={[p.id]} mostrarAutomacao={false} />
    </div>
  );
}
