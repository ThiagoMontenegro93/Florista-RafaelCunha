import type { Metadata } from 'next';
import { FluxoAssinatura } from './Planos';

export const metadata: Metadata = { title: 'Assinatura de flores no Rio de Janeiro', description: 'Planos Essencial, Encanto e Eterno com entrega a cada 30, 45 ou 60 dias em todo o RJ.' };

export default function AssinaturasPage({ searchParams }: { searchParams: { plano?: string } }) {
  return (
    <div className="secao py-14">
      <p className="kicker">Assinaturas</p>
      <h1 className="titulo-secao mt-2">Flores frescas, <em className="texto-ouro">no seu ritmo</em></h1>
      <p className="mt-4 max-w-2xl text-marrom/75">Escolha o plano, o ciclo e a data da primeira entrega. Pause ou cancele quando quiser.</p>
      <div className="mt-10"><FluxoAssinatura planoInicial={searchParams.plano} /></div>
    </div>
  );
}
