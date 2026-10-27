import { PRODUTOS } from './produtos';

export type Passo = { icone: 'gota' | 'tesoura' | 'sol' | 'borrifo' | 'polen' | 'raiz' | 'vaso'; titulo: string; texto: string };

const ROSAS_EUCALIPTO: Passo[] = [
  { icone: 'tesoura', titulo: 'Corte 2cm na diagonal', texto: 'A cada 2 dias, corte as hastes em diagonal com tesoura limpa.' },
  { icone: 'gota', titulo: 'Troque a água diariamente', texto: 'Água em temperatura ambiente, vaso sempre limpo.' },
  { icone: 'sol', titulo: 'Longe de frutas e sol direto', texto: 'Frutas liberam etileno, que acelera o envelhecimento das pétalas.' },
  { icone: 'borrifo', titulo: 'Borrife as pétalas pela manhã', texto: 'Uma névoa leve devolve o frescor do ateliê.' },
];
const LIRIOS_ORQUIDEAS: Passo[] = [
  { icone: 'polen', titulo: 'Retire o pólen dos lírios', texto: 'Com um lenço, retire as anteras assim que abrirem: evita manchas e prolonga a flor.' },
  { icone: 'raiz', titulo: 'Não molhe as flores, só as raízes', texto: 'Orquídeas: água apenas no substrato, 1 a 2 vezes por semana.' },
  { icone: 'tesoura', titulo: 'Corte 2cm a cada 2 dias', texto: 'Para lírios e hortênsias de haste, corte na diagonal.' },
  { icone: 'sol', titulo: 'Luz indireta', texto: 'Claridade sem sol direto, longe do ar-condicionado.' },
];
const HORTENSIAS: Passo[] = [
  { icone: 'gota', titulo: 'Hortênsias bebem pela cabeça', texto: 'Se murcharem, mergulhe a flor em água fria por 30 minutos.' },
  { icone: 'tesoura', titulo: 'Corte e amasse 1cm da haste', texto: 'Ajuda a haste lenhosa a absorver água.' },
];
const GERAL: Passo[] = [
  { icone: 'vaso', titulo: 'Vaso limpo, água até a metade', texto: 'Troque a água a cada 2 dias.' },
  { icone: 'tesoura', titulo: 'Corte as hastes', texto: '2cm na diagonal a cada troca de água.' },
  { icone: 'sol', titulo: 'Lugar fresco', texto: 'Longe de sol direto e frutas.' },
];

export function guiaPara(flores: string[]): { titulo: string; passos: Passo[] } {
  const f = new Set(flores);
  if (f.has('lirio-amarelo') || f.has('orquidea-roxa'))
    return { titulo: 'Lírios + Orquídeas roxas', passos: [...LIRIOS_ORQUIDEAS, ...(f.has('hortensia-azul') ? HORTENSIAS : [])] };
  if (f.has('rosa') || f.has('eucalipto')) return { titulo: 'Rosas + Eucalipto', passos: [...ROSAS_EUCALIPTO, ...(f.has('hortensia-azul') ? HORTENSIAS : [])] };
  return { titulo: 'Cuidados gerais', passos: GERAL };
}

export const guiaProduto = (id: string) => guiaPara(PRODUTOS.find((p) => p.id === id)?.flores ?? []);

export const AUTOMACAO_POS_ENTREGA = [
  { dia: 'D0', canal: 'WhatsApp', mensagem: 'Suas flores chegaram! Aqui está seu guia de carinho: {link_guia}' },
  { dia: 'D2', canal: 'WhatsApp', mensagem: 'Como estão suas flores? Troque a água hoje 💧' },
  { dia: 'D5', canal: 'WhatsApp', mensagem: 'Hora de cortar as hastes 2cm na diagonal ✂️' },
  { dia: 'D10', canal: 'WhatsApp', mensagem: 'Que tal um novo carinho? Use VOLTEI10 na loja 🌸' },
];
