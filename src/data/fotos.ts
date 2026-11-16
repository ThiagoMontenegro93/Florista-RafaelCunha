/**
 * Fotos reais do ateliê.
 *
 * Coloque os arquivos em `public/fotos/` (JPG ou WebP, ~1600px no lado maior) e aponte aqui
 * pelo id do produto, do portfólio ou da seção. Também aceita URL do Cloudinary.
 * Enquanto uma chave não tiver foto, o site mostra a arte botânica desenhada com as
 * flores e a paleta daquele arranjo, então nada fica quebrado.
 *
 * Exemplo:
 *   'bouquet-solar-luz': '/fotos/produtos/bouquet-solar-luz.jpg',
 *   'santa-ignez-arco-branco': '/fotos/portfolio/santa-ignez-arco-branco.jpg',
 *   hero: '/fotos/hero.jpg',
 *   rafael: '/fotos/rafael.jpg',
 */
export const FOTOS: Record<string, string> = {
  // Fotos ilustrativas geradas por IA (Figma, nov/2026). Troque pelas fotos reais do ateliê quando houver.
  'bouquet-santa-ignez': '/fotos/produtos/bouquet-santa-ignez.webp',
  'bouquet-solar-luz': '/fotos/produtos/bouquet-solar-luz.webp',
  'bouquet-jardim-boho': '/fotos/produtos/bouquet-jardim-boho.webp',
  'centro-solar-real': '/fotos/produtos/centro-solar-real.webp',
  'centro-santa-ignez': '/fotos/produtos/centro-santa-ignez.webp',
  'namorados-coracao': '/fotos/produtos/namorados-coracao.webp',
  'box-namorados': '/fotos/produtos/box-namorados.webp',
  'centro-rustico': '/fotos/produtos/centro-rustico.webp',
  'cascata-orquideas': '/fotos/produtos/cascata-orquideas.webp',
  'kit-igreja': '/fotos/produtos/kit-igreja.webp',
  'aniversario-girassois': '/fotos/produtos/aniversario-girassois.webp',
  hero: '/fotos/hero.webp',
  'plano-essencial': '/fotos/planos/essencial.webp',
  'plano-encanto': '/fotos/planos/encanto.webp',
  'plano-eterno': '/fotos/planos/eterno.webp',
};
