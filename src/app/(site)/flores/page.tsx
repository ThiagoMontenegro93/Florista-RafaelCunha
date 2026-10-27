import type { Metadata } from 'next';
import { FloresExplorer } from './FloresExplorer';

export const metadata: Metadata = {
  title: 'Flores brasileiras disponíveis no Rio de Janeiro',
  description: 'Mapa das flores do Brasil por bioma: antúrio, helicônia, estrelítzia, sempre-viva, capim-dourado, orquídea roxa, lírio, hortênsia azul, lisianthus. Época de floração e durabilidade.',
};

export default function FloresPage() {
  return (
    <div className="secao py-14">
      <p className="kicker">Flores do território brasileiro</p>
      <h1 className="titulo-secao mt-2">Flores brasileiras <em className="texto-ouro">da estação</em></h1>
      <p className="mt-4 max-w-2xl text-marrom/75">Clique no mapa para ver as flores de cada bioma. As marcadas com “Trabalhamos” estão no nosso ateliê; as outras chegam sob encomenda.</p>
      <div className="mt-10"><FloresExplorer /></div>
    </div>
  );
}
