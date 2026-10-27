import Link from 'next/link';
import { Hero, BuscaInteligente, PortfolioGrid, LojaGrid, Confianca, Sobre, InstagramVivo } from '@/components/Secoes';
import { Divisor } from '@/components/Ornamentos';
import { PreVendaBanner, ServicosAtelie } from '@/components/Servicos';
import { PRODUTOS } from '@/data/produtos';
import { FlorTeaser } from './flores/FloresExplorer';
import { PlanosResumo } from './assinaturas/Planos';
import { jsonLdProdutos } from '@/lib/seo';

export default function Home() {
  const destaques = PRODUTOS.filter((p) => ['bouquet-solar-luz', 'bouquet-santa-ignez', 'centro-solar-real', 'namorados-coracao', 'cascata-orquideas', 'kit-igreja'].includes(p.id));
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdProdutos(destaques)) }} />
      <Hero />
      <PreVendaBanner />

      <section className="secao -mt-2 py-12">
        <BuscaInteligente />
      </section>

      <section className="secao py-16">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div><p className="kicker">Portfólio real</p><h2 className="titulo-secao mt-2">Celebrações que <em className="texto-ouro">aconteceram</em></h2></div>
          <Link href="/portfolio" className="btn-linha">Ver todo o portfólio</Link>
        </div>
        <PortfolioGrid />
      </section>

      <Divisor />

      <section className="secao py-16">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="kicker">Loja de encomendas</p>
            <h2 className="titulo-secao mt-2">Escolha, personalize, <em className="texto-ouro">receba</em></h2>
            <p className="mt-3 max-w-xl text-sm text-marrom/70">Investimento a partir de R$ 290. Nota honesta: cada arranjo é único, você recebe a mesma paleta e o mesmo frescor, não uma cópia exata da foto.</p>
          </div>
          <Link href="/loja" className="btn-linha">Ver os 12 arranjos</Link>
        </div>
        <LojaGrid produtos={destaques} />
      </section>

      <ServicosAtelie />
      <FlorTeaser />
      <PlanosResumo />
      <Confianca />
      <Sobre />
      <InstagramVivo />
    </>
  );
}
