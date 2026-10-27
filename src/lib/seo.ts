import { SITE_URL, EMAIL, TELEFONE } from './format';
import { REVIEWS } from '@/data/portfolio';
import type { Produto } from '@/data/produtos';

export function jsonLdFlorist(cidade = 'Rio de Janeiro') {
  return {
    '@context': 'https://schema.org',
    '@type': ['Florist', 'LocalBusiness'],
    name: 'Rafael Cunha Ateliê Floral',
    url: SITE_URL,
    email: EMAIL,
    telephone: TELEFONE,
    sameAs: ['https://www.instagram.com/florista.rafaelcunha/'],
    address: { '@type': 'PostalAddress', addressLocality: cidade, addressRegion: 'RJ', addressCountry: 'BR' },
    areaServed: { '@type': 'State', name: 'Rio de Janeiro' },
    priceRange: 'R$150-R$2800',
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '320' },
    review: REVIEWS.map((r) => ({ '@type': 'Review', author: { '@type': 'Person', name: r.nome }, reviewBody: r.texto, reviewRating: { '@type': 'Rating', ratingValue: r.nota } })),
  };
}

export function jsonLdProdutos(ps: Produto[]) {
  return ps.map((p) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.nome,
    description: p.descricao,
    category: p.categoria,
    brand: { '@type': 'Brand', name: 'Rafael Cunha Ateliê Floral' },
    offers: { '@type': 'Offer', priceCurrency: 'BRL', price: p.preco, availability: 'https://schema.org/PreOrder', url: `${SITE_URL}/loja#${p.id}` },
  }));
}
