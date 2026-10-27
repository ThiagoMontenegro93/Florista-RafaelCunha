import type { Metadata } from 'next';
import { PortfolioGrid } from '@/components/Secoes';
import { InstagramEmbed } from '@/components/InstagramEmbed';

export const metadata: Metadata = { title: 'Portfólio: Santa Ignêz, Solar Real e casamentos no Rio', description: 'Florista da Casa e Capela Santa Ignêz: arco branco, lírios e orquídeas no Solar Real, jardim rústico com hortênsias.' };

export default function PortfolioPage() {
  return (
    <div className="secao py-14">
      <p className="kicker">Portfólio real</p>
      <h1 className="titulo-secao mt-2">320 celebrações, <em className="texto-ouro">cada uma única</em></h1>
      <div className="mt-12"><PortfolioGrid /></div>
      <div className="mt-20 grid items-center gap-10 md:grid-cols-2">
        <div><p className="kicker">O post que virou assinatura</p><h2 className="mt-2 text-4xl">Lírios amarelos, hortênsias azuis e orquídeas roxas no Solar Real</h2></div>
        <InstagramEmbed />
      </div>
    </div>
  );
}
