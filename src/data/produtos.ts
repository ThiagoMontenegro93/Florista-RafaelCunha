export type Categoria = 'Noiva' | 'Casamento' | 'Centro Mesa' | 'Namorados' | 'Igreja' | 'Aniversário' | 'Presente';
export type Paleta = 'Branco puro' | 'Amarelo+Azul assinatura' | 'Rosa queimado' | 'Marsala' | 'Roxo orquídea' | 'Vermelho paixão';

export type Produto = {
  id: string;
  nome: string;
  categoria: Categoria;
  ocasioes: string[];
  paletas: Paleta[];
  preco: number;
  prazo: string;
  descricao: string;
  emoji: string;
  gradiente: [string, string];
  flores: string[]; // slugs de FLORES
  badge?: 'BEST SELLER' | 'Entrega a combinar' | 'Novo' | 'Sinal 50%';
  sinal?: boolean;
};

export const PRODUTOS: Produto[] = [
  { id: 'bouquet-santa-ignez', nome: 'Bouquet Santa Ignêz Voto Pureza', categoria: 'Noiva', ocasioes: ['Noiva', 'Casamento', 'Igreja'], paletas: ['Branco puro'], preco: 380, prazo: '24h', descricao: 'Rosas brancas, lisianthus e eucalipto baby blue, amarração em fita cetim marfim.', emoji: '🤍', gradiente: ['#FFFFFF', '#F5E6D3'], flores: ['rosa', 'lisianthus', 'eucalipto'], badge: 'Entrega a combinar' },
  { id: 'bouquet-solar-luz', nome: 'Bouquet Solar Luz Amanhecer', categoria: 'Noiva', ocasioes: ['Noiva', 'Casamento'], paletas: ['Amarelo+Azul assinatura'], preco: 520, prazo: '48h', descricao: 'Lírios amarelos e hortênsias azuis, inspirado no post real do Solar Real.', emoji: '💛', gradiente: ['#FBE9A6', '#CFE0F1'], flores: ['lirio-amarelo', 'hortensia-azul', 'eucalipto'], badge: 'BEST SELLER' },
  { id: 'bouquet-jardim-boho', nome: 'Bouquet Jardim Boho', categoria: 'Noiva', ocasioes: ['Noiva', 'Casamento'], paletas: ['Rosa queimado', 'Marsala'], preco: 450, prazo: '48h', descricao: 'Rosas rosa queimado, astromélias, capim-dourado e folhagens soltas.', emoji: '🌾', gradiente: ['#F7D1D1', '#F3DDA6'], flores: ['rosa', 'astromelia', 'capim-dourado'] },
  { id: 'centro-solar-real', nome: 'Centro Mesa Solar Real Lírios e Orquídeas', categoria: 'Centro Mesa', ocasioes: ['Centro Mesa', 'Casamento'], paletas: ['Amarelo+Azul assinatura', 'Roxo orquídea'], preco: 680, prazo: '2 dias', descricao: 'Para mesa de 10 pessoas: lírios amarelos, hortênsias azuis e orquídeas roxas.', emoji: '🏛️', gradiente: ['#FBE9A6', '#E3CDEB'], flores: ['lirio-amarelo', 'hortensia-azul', 'orquidea-roxa'], badge: 'Entrega a combinar' },
  { id: 'centro-santa-ignez', nome: 'Centro Mesa Santa Ignêz Branco Clássico', categoria: 'Centro Mesa', ocasioes: ['Centro Mesa', 'Casamento', 'Igreja'], paletas: ['Branco puro'], preco: 550, prazo: '2 dias', descricao: 'Rosas brancas, lisianthus e hortênsias brancas em vaso de vidro baixo.', emoji: '🕊️', gradiente: ['#FFFFFF', '#DCE5D4'], flores: ['rosa', 'lisianthus', 'hortensia-azul'] },
  { id: 'namorados-coracao', nome: 'Arranjo Dia dos Namorados Coração', categoria: 'Namorados', ocasioes: ['Namorados'], paletas: ['Vermelho paixão'], preco: 390, prazo: '24h', descricao: '12 rosas vermelhas em formato de coração + cartão escrito à mão.', emoji: '❤️', gradiente: ['#F8C9C0', '#C0504D'], flores: ['rosa'] },
  { id: 'box-namorados', nome: 'Box Namorados Rosas + Chocolate', categoria: 'Namorados', ocasioes: ['Namorados', 'Presente'], paletas: ['Vermelho paixão', 'Rosa queimado'], preco: 480, prazo: '24h', descricao: 'Caixa chapéu com rosas e trufas artesanais.', emoji: '🍫', gradiente: ['#F7D1D1', '#8B5A4A'], flores: ['rosa'], badge: 'Novo' },
  { id: 'centro-rustico', nome: 'Arranjo Centro Mesa Rústico', categoria: 'Centro Mesa', ocasioes: ['Centro Mesa', 'Casamento'], paletas: ['Rosa queimado', 'Amarelo+Azul assinatura'], preco: 420, prazo: '2 dias', descricao: 'Base de madeira de demolição, hortênsias e tango — Jardim Rústico.', emoji: '🪵', gradiente: ['#F5E6D3', '#B08D57'], flores: ['hortensia-azul', 'tango', 'eucalipto'] },
  { id: 'cascata-orquideas', nome: 'Buquê Cascata Orquídeas Roxas', categoria: 'Noiva', ocasioes: ['Noiva', 'Casamento', 'Igreja'], paletas: ['Roxo orquídea'], preco: 750, prazo: '3 dias', descricao: 'Cascata de laélias roxas com lisianthus e fitas de seda.', emoji: '💜', gradiente: ['#E3CDEB', '#8F6BA8'], flores: ['orquidea-roxa', 'lisianthus'] },
  { id: 'kit-igreja', nome: 'Kit Igreja: 2 Arranjos Altar + 10 Bancos', categoria: 'Igreja', ocasioes: ['Igreja', 'Casamento'], paletas: ['Branco puro', 'Amarelo+Azul assinatura'], preco: 2800, prazo: '5 dias', descricao: 'Decoração completa de nave: 2 arranjos de altar e 10 arranjos de banco.', emoji: '⛪', gradiente: ['#FFFFFF', '#F5E6D3'], flores: ['rosa', 'hortensia-azul', 'lisianthus', 'eucalipto'], badge: 'Sinal 50%', sinal: true },
  { id: 'aniversario-girassois', nome: 'Arranjo Aniversário Girassóis', categoria: 'Aniversário', ocasioes: ['Aniversário', 'Presente'], paletas: ['Amarelo+Azul assinatura'], preco: 290, prazo: '24h', descricao: 'Girassóis, tango e astromélias em vaso de vidro.', emoji: '🌻', gradiente: ['#FCE7A0', '#E0A63A'], flores: ['girassol', 'tango', 'astromelia'] },
  { id: 'cesta-cafe', nome: 'Cesta Café Floral', categoria: 'Presente', ocasioes: ['Aniversário', 'Presente'], paletas: ['Rosa queimado'], preco: 350, prazo: '24h', descricao: 'Café da manhã artesanal com mini arranjo de astromélias.', emoji: '☕', gradiente: ['#FFF1E8', '#D4A5A5'], flores: ['astromelia', 'eucalipto'] },
];

export const TAMANHOS = [
  { id: 'P', nome: 'P', desc: 'Base', mult: 1 },
  { id: 'M', nome: 'M', desc: '+30%', mult: 1.3 },
  { id: 'G', nome: 'G', desc: '+60%', mult: 1.6 },
] as const;

export const PALETAS: { nome: Paleta; cores: string[] }[] = [
  { nome: 'Branco puro', cores: ['#FFFFFF', '#F5E6D3'] },
  { nome: 'Amarelo+Azul assinatura', cores: ['#FBE9A6', '#7A9CC6'] },
  { nome: 'Rosa queimado', cores: ['#F7D1D1', '#D4A5A5'] },
  { nome: 'Marsala', cores: ['#C97B7B', '#7B2E3A'] },
  { nome: 'Roxo orquídea', cores: ['#E3CDEB', '#8F6BA8'] },
  { nome: 'Vermelho paixão', cores: ['#F8C9C0', '#C0504D'] },
];

export const EXTRAS = [
  { id: 'cartao', nome: 'Cartão escrito à mão', preco: 0 },
  { id: 'vaso', nome: 'Vaso de vidro', preco: 45 },
  { id: 'chocolate', nome: 'Chocolate artesanal', preco: 35 },
  { id: 'pelucia', nome: 'Pelúcia', preco: 60 },
];

export const CUPONS: Record<string, number> = { NOIVA10: 0.1, PRIMEIRA10: 0.1, BODAS10: 0.1 };

// Datas bloqueadas na agenda de confecção (AAAA-MM-DD)
export const DATAS_BLOQUEADAS: { data: string; motivo: string; municipio: string }[] = [
  { data: '2026-09-27', motivo: 'Casamento — Casa e Capela Santa Ignêz (arco branco)', municipio: 'Rio de Janeiro' },
  { data: '2026-10-24', motivo: 'Casamento — Solar Real', municipio: 'Rio de Janeiro' },
  { data: '2026-11-14', motivo: 'Casamento — Jardim rústico', municipio: 'Petrópolis' },
  { data: '2026-11-21', motivo: 'Igreja São Judas — decoração de nave', municipio: 'Niterói' },
  { data: '2026-12-12', motivo: 'Casamento — Santa Ignêz', municipio: 'Rio de Janeiro' },
];
