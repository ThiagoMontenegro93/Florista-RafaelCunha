import type { MetadataRoute } from 'next';
import { MUNICIPIOS_RJ } from '@/data/municipios';
import { PRODUTOS } from '@/data/produtos';
import { SITE_URL } from '@/lib/format';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = ['', '/portfolio', '/flores', '/loja', '/assinaturas', '/agenda', '/orcamento', '/sobre', '/simulador', '/consultoria', '/preservacao', '/pre-venda', '/aluguel', '/workshops', '/corporativo', '/parceiros'].map((p) => ({ url: SITE_URL + p, changeFrequency: 'weekly' as const, priority: p ? 0.8 : 1 }));
  const cuidados = PRODUTOS.map((p) => ({ url: `${SITE_URL}/cuidados/${p.id}`, priority: 0.4 }));
  const locais = MUNICIPIOS_RJ.flatMap((m) => ['igrejas', 'casas-de-festa', 'bouquet-noiva', 'centro-de-mesa'].map((c) => ({ url: `${SITE_URL}/${m.slug}/${c}`, priority: m.regiao === 'Metropolitana' ? 0.7 : 0.5 })));
  return [...base, ...cuidados, ...locais];
}
