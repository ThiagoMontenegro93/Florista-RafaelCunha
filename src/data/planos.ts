export type Ciclo = { dias: 30 | 45 | 60; nome: string; multiplicador: number; habilitado: boolean; nota?: string };

export const CICLOS_PADRAO: Ciclo[] = [
  { dias: 30, nome: 'Mensal (30 dias)', multiplicador: 1, habilitado: true },
  { dias: 45, nome: '1,5 mês (45 dias)', multiplicador: 1.4, habilitado: true },
  { dias: 60, nome: 'Bimestral (60 dias)', multiplicador: 1.8, habilitado: true, nota: 'economia de 10%' },
];

export type Plano = { id: string; nome: string; preco: number; destaque?: boolean; publico: string; itens: string[]; emoji: string };

export const PLANOS: Plano[] = [
  { id: 'essencial', nome: 'Essencial', preco: 290, publico: 'Para viver com flores todos os dias', emoji: '🌷', itens: ['1 buquê da estação (astromélias, tango, eucalipto)', 'Entrega a combinar em todo RJ (92 municípios)', 'Cartão escrito à mão', 'Guia de cuidados com QR Code'] },
  { id: 'encanto', nome: 'Encanto', preco: 480, destaque: true, publico: 'O favorito de quem ama receber', emoji: '💛', itens: ['1 arranjo grande de flores nobres', 'Lírios amarelos, hortênsias azuis e rosas', 'Vaso de vidro incluso', 'Foto antes de entregar', '10% off na loja'] },
  { id: 'eterno', nome: 'Eterno', preco: 750, publico: 'Luxo para empresas, igrejas e casas de festa', emoji: '👑', itens: ['2 arranjos ou 1 super luxo', 'Orquídeas roxas e antúrios', 'Consultoria de harmonização', '15% off na loja', 'Prioridade de agenda Santa Ignêz e Solar Real'] },
];

export const precoCiclo = (base: number, mult: number) => Math.round(base * mult);
