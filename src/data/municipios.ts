// 92 municípios do Estado do Rio de Janeiro agrupados por região.
// O seed tenta buscar a lista oficial (com código IBGE) em IBGE_API e usa esta lista como fallback.
export type RegiaoRJ =
  | 'Metropolitana' | 'Baixada' | 'Serrana' | 'Lagos' | 'Norte'
  | 'Noroeste' | 'Médio Paraíba' | 'Centro-Sul' | 'Costa Verde';

const porRegiao: Record<RegiaoRJ, string[]> = {
  Metropolitana: ['Rio de Janeiro', 'Niterói', 'São Gonçalo', 'Itaboraí', 'Maricá', 'Tanguá', 'Rio Bonito', 'Cachoeiras de Macacu'],
  Baixada: ['Duque de Caxias', 'Nova Iguaçu', 'Belford Roxo', 'São João de Meriti', 'Nilópolis', 'Mesquita', 'Queimados', 'Japeri', 'Magé', 'Guapimirim', 'Seropédica', 'Itaguaí', 'Paracambi'],
  Serrana: ['Petrópolis', 'Teresópolis', 'Nova Friburgo', 'Areal', 'Bom Jardim', 'Cantagalo', 'Carmo', 'Cordeiro', 'Duas Barras', 'Macuco', 'Santa Maria Madalena', 'São José do Vale do Rio Preto', 'São Sebastião do Alto', 'Sumidouro', 'Trajano de Moraes'],
  Lagos: ['Araruama', 'Armação dos Búzios', 'Arraial do Cabo', 'Cabo Frio', 'Casimiro de Abreu', 'Iguaba Grande', 'Rio das Ostras', 'São Pedro da Aldeia', 'Saquarema', 'Silva Jardim'],
  Norte: ['Campos dos Goytacazes', 'Macaé', 'Carapebus', 'Cardoso Moreira', 'Conceição de Macabu', 'Quissamã', 'São Fidélis', 'São Francisco de Itabapoana', 'São João da Barra'],
  Noroeste: ['Itaperuna', 'Aperibé', 'Bom Jesus do Itabapoana', 'Cambuci', 'Italva', 'Itaocara', 'Laje do Muriaé', 'Miracema', 'Natividade', 'Porciúncula', 'Santo Antônio de Pádua', 'São José de Ubá', 'Varre-Sai'],
  'Médio Paraíba': ['Volta Redonda', 'Barra Mansa', 'Resende', 'Barra do Piraí', 'Itatiaia', 'Pinheiral', 'Piraí', 'Porto Real', 'Quatis', 'Rio Claro', 'Rio das Flores', 'Valença'],
  'Centro-Sul': ['Três Rios', 'Vassouras', 'Comendador Levy Gasparian', 'Engenheiro Paulo de Frontin', 'Mendes', 'Miguel Pereira', 'Paraíba do Sul', 'Paty do Alferes', 'Sapucaia'],
  'Costa Verde': ['Angra dos Reis', 'Paraty', 'Mangaratiba'],
};

export const slugify = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const MUNICIPIOS_RJ = (Object.entries(porRegiao) as [RegiaoRJ, string[]][]).flatMap(([regiao, nomes]) =>
  nomes.map((nome) => ({ nome, regiao, slug: slugify(nome) })),
);

export const REGIOES = Object.keys(porRegiao) as RegiaoRJ[];

export const PRINCIPAIS_RJ = ['Rio de Janeiro', 'Niterói', 'São Gonçalo', 'Duque de Caxias', 'Nova Iguaçu', 'Petrópolis', 'Teresópolis', 'Angra dos Reis', 'Armação dos Búzios', 'Cabo Frio', 'Macaé', 'Volta Redonda'];

if (MUNICIPIOS_RJ.length !== 92) throw new Error(`Esperado 92 municípios RJ, encontrado ${MUNICIPIOS_RJ.length}`);
