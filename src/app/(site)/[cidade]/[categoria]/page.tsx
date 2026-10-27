import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { MUNICIPIOS_RJ } from '@/data/municipios';
import { PRODUTOS } from '@/data/produtos';
import { LojaGrid } from '@/components/Secoes';
import { jsonLdFlorist } from '@/lib/seo';

// Landing pages SEO locais: 92 municípios RJ × 4 intenções de busca.
const CATEGORIAS: Record<string, { titulo: string; filtro: string[]; texto: string }> = {
  igrejas: { titulo: 'Decoração floral de igrejas', filtro: ['Igreja'], texto: 'arranjos de altar, bancos e arcos para cerimônias religiosas' },
  'casas-de-festa': { titulo: 'Flores para casas de festa', filtro: ['Centro Mesa', 'Casamento'], texto: 'centros de mesa, mesa imperial e ambientação de salões' },
  'bouquet-noiva': { titulo: 'Bouquet de noiva', filtro: ['Noiva'], texto: 'buquês de noiva com flores brasileiras da estação' },
  'centro-de-mesa': { titulo: 'Centro de mesa para casamento', filtro: ['Centro Mesa'], texto: 'centros de mesa baixos e altos para recepções' },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return MUNICIPIOS_RJ.flatMap((m) => Object.keys(CATEGORIAS).map((c) => ({ cidade: m.slug, categoria: c })));
}

export function generateMetadata({ params }: { params: { cidade: string; categoria: string } }): Metadata {
  const m = MUNICIPIOS_RJ.find((x) => x.slug === params.cidade);
  const c = CATEGORIAS[params.categoria];
  if (!m || !c) return {};
  return { title: `${c.titulo} em ${m.nome} RJ`, description: `Florista em ${m.nome}: ${c.texto}. Rafael Cunha, 320 celebrações, entrega a combinar.`, alternates: { canonical: `/${m.slug}/${params.categoria}` } };
}

export default function LandingLocal({ params }: { params: { cidade: string; categoria: string } }) {
  const m = MUNICIPIOS_RJ.find((x) => x.slug === params.cidade);
  const c = CATEGORIAS[params.categoria];
  if (!m || !c) notFound();
  const produtos = PRODUTOS.filter((p) => p.ocasioes.some((o) => c.filtro.includes(o)));
  const vizinhos = MUNICIPIOS_RJ.filter((x) => x.regiao === m.regiao && x.slug !== m.slug).slice(0, 8);
  return (
    <div className="secao py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFlorist(m.nome)) }} />
      <p className="kicker">{m.regiao} · Rio de Janeiro</p>
      <h1 className="titulo-secao mt-2">{c.titulo} em <em className="texto-ouro">{m.nome}</em></h1>
      <p className="mt-4 max-w-2xl text-marrom/75">Rafael Cunha Ateliê Floral atende {m.nome} com {c.texto}. Florista oficial da Casa e Capela Santa Ignêz, 320 celebrações e entrega a combinar pelo WhatsApp.</p>
      <div className="mt-10"><LojaGrid produtos={produtos} /></div>
      <div className="mt-14">
        <p className="kicker mb-3">Também atendemos</p>
        <div className="flex flex-wrap gap-2">{vizinhos.map((v) => <Link key={v.slug} href={`/${v.slug}/${params.categoria}`} className="pill border border-ouro/40 bg-vidro/80">{v.nome}</Link>)}</div>
      </div>
    </div>
  );
}
