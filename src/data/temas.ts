export type TemaId = 'rose-azul' | 'perola' | 'rose' | 'salvia' | 'onix';

export const TEMAS: { id: TemaId; nome: string; descricao: string; cores: string[] }[] = [
  { id: 'rose-azul', nome: 'Rosé & Azul Pérola', descricao: 'Rosé #B86B7E em toda a tela, letras azuis (#0D33B3 nos painéis pérola) e detalhes em ouro.', cores: ['#B86B7E', '#FFF7F8', '#0D33B3', '#3D63D0', '#B8924F'] },
  { id: 'perola', nome: 'Pérola & Ouro', descricao: 'Marfim luminoso com ouro velho. Clássico, claro e delicado como uma noiva.', cores: ['#FDFAF5', '#FAF1EA', '#B8924F', '#C48484', '#48382B'] },
  { id: 'rose', nome: 'Rosé Champanhe', descricao: 'Blush rosado com ouro rosé. Romântico, feminino e leve.', cores: ['#FFF8F6', '#FCEAE7', '#C49476', '#CE8084', '#5C3A3E'] },
  { id: 'salvia', nome: 'Jardim Sálvia', descricao: 'Branco botânico, verde sálvia e ouro. Fresco como um jardim pela manhã.', cores: ['#F8FAF4', '#EEF3E8', '#B08D57', '#68825C', '#303C2C'] },
  { id: 'onix', nome: 'Ônix & Champanhe', descricao: 'Preto quente com ouro champanhe. Noturno, futurista e glamouroso.', cores: ['#0A0807', '#1E1813', '#C9A35F', '#EED9A8', '#F2E8DA'] },
];

export const TEMA_PADRAO: TemaId = (process.env.NEXT_PUBLIC_TEMA as TemaId) || 'rose-azul';
export const CHAVE_TEMA = 'atelie-tema';

/** Aplica o tema salvo antes da primeira pintura (sem piscar). */
export const scriptTema = `(function(){try{var t=localStorage.getItem('${CHAVE_TEMA}');document.documentElement.dataset.tema=t||'${TEMA_PADRAO}';}catch(e){document.documentElement.dataset.tema='${TEMA_PADRAO}';}})();`;

export function aplicarTema(id: TemaId) {
  document.documentElement.dataset.tema = id;
  try { localStorage.setItem(CHAVE_TEMA, id); } catch {}
}
