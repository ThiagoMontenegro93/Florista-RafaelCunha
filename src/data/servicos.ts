// Dados e regras de negócio dos serviços do ateliê (fonte única para UI, seed e admin).

// Menu "Serviços" (header, rodapé e home)
export const SERVICOS = [
  { href: '/simulador', label: 'Simulador de casamento', d: 'Monte e reserve com sinal', e: '💍' },
  { href: '/consultoria', label: 'Consultoria de noivas', d: 'Valor volta em crédito', e: '🥂' },
  { href: '/preservacao', label: 'Preservação do buquê', d: 'Quadro, resina ou cúpula', e: '💎' },
  { href: '/pre-venda', label: 'Pré-venda datas especiais', d: 'Natal, Mães, Namorados', e: '🎄' },
  { href: '/aluguel', label: 'Aluguel de peças', d: 'Arcos, candelabros, vasos', e: '🕯️' },
  { href: '/workshops', label: 'Workshops', d: 'Aprenda com Rafael', e: '✂️' },
  { href: '/corporativo', label: 'Plano corporativo', d: 'Flores na empresa', e: '🏢' },
  { href: '/parceiros', label: 'Seja parceiro', d: 'Comissão por indicação', e: '🤝' },
];

// ───────── 2. Preservação do buquê ─────────
export const PRESERVACAO = [
  { id: 'quadro-prensado', nome: 'Quadro de flores prensadas', preco: 690, prazo: '45 dias', emoji: '🖼️', descricao: 'As flores do seu buquê prensadas à mão e emolduradas em moldura dourada com vidro museu.' },
  { id: 'bloco-resina', nome: 'Bloco de resina cristal', preco: 890, prazo: '60 dias', emoji: '💎', descricao: 'Pétalas eternizadas em resina cristal com a data do casamento gravada em ouro.' },
  { id: 'cupula-seca', nome: 'Cúpula de vidro com flores secas', preco: 590, prazo: '30 dias', emoji: '🔔', descricao: 'O buquê desidratado e montado sob cúpula de vidro com base de madeira nobre.' },
];

// ───────── 3. Simulador de orçamento de casamento ─────────
export const SIMULADOR = {
  centroBaixo: 280, // por mesa
  centroAlto: 520, // por mesa
  altar: 1400, // par de arranjos
  banco: 140, // por banco
  arco: 2200,
  buque: 520,
  buqueDama: 160,
  lapela: 45,
  mesaPosta: 900, // mesa do bolo / imperial
  paletaMult: { 'Branco puro': 1, 'Amarelo+Azul assinatura': 1.05, 'Rosa queimado': 1, Marsala: 1.05, 'Roxo orquídea': 1.2 } as Record<string, number>,
  montagem: 0.12, // montagem e desmontagem sobre o subtotal
};

export type EntradaSimulador = {
  mesas: number; tipoCentro: 'baixo' | 'alto'; altar: boolean; bancos: number; arco: boolean;
  buque: boolean; damas: number; lapelas: number; mesaPosta: boolean; paleta: string;
};

export function calcularSimulacao(e: EntradaSimulador) {
  const linhas: { item: string; qtd: number; unit: number; total: number }[] = [];
  const add = (item: string, qtd: number, unit: number) => qtd > 0 && linhas.push({ item, qtd, unit, total: qtd * unit });
  add(`Centro de mesa ${e.tipoCentro}`, e.mesas, e.tipoCentro === 'alto' ? SIMULADOR.centroAlto : SIMULADOR.centroBaixo);
  add('Arranjos de altar (par)', e.altar ? 1 : 0, SIMULADOR.altar);
  add('Arranjos de banco', e.bancos, SIMULADOR.banco);
  add('Arco de entrada', e.arco ? 1 : 0, SIMULADOR.arco);
  add('Buquê da noiva', e.buque ? 1 : 0, SIMULADOR.buque);
  add('Buquê de dama/madrinha', e.damas, SIMULADOR.buqueDama);
  add('Lapelas', e.lapelas, SIMULADOR.lapela);
  add('Mesa do bolo / imperial', e.mesaPosta ? 1 : 0, SIMULADOR.mesaPosta);
  const flores = linhas.reduce((s, l) => s + l.total, 0);
  const mult = SIMULADOR.paletaMult[e.paleta] ?? 1;
  const ajustePaleta = Math.round(flores * (mult - 1));
  const montagem = Math.round((flores + ajustePaleta) * SIMULADOR.montagem);
  const total = flores + ajustePaleta + montagem;
  return { linhas, flores, ajustePaleta, montagem, total, sinal: Math.round(total / 2) };
}

// ───────── 4. Consultoria de noivas ─────────
export const CONSULTORIA = { preco: 250, duracao: '1h30', horarios: ['10:00', '14:00', '16:30'], diasSemana: [2, 3, 4, 5, 6] }; // ter-sáb

// ───────── 5. Parceiros ─────────
export type Parceiro = { codigo: string; nome: string; tipo: string; email: string; whatsapp: string; comissao: number; criadoEm: string };
export const PARCEIROS_INICIAIS: Parceiro[] = [
  { codigo: 'SANTAIGNEZ', nome: 'Casa e Capela Santa Ignêz', tipo: 'Espaço', email: 'contato@santaignez.com.br', whatsapp: '5521977772020', comissao: 0.1, criadoEm: '2026-08-01' },
  { codigo: 'SOLARREAL', nome: 'Solar Real', tipo: 'Espaço', email: 'eventos@solarreal.com.br', whatsapp: '5521988881010', comissao: 0.1, criadoEm: '2026-08-15' },
  { codigo: 'MARIANACERIMONIAL', nome: 'Mariana Lopes Cerimonial', tipo: 'Cerimonialista', email: 'mariana@cerimonial.com', whatsapp: '5521966665555', comissao: 0.12, criadoEm: '2026-09-10' },
];
export const INDICACOES_INICIAIS = [
  { parceiro: 'SANTAIGNEZ', pedido: '8812', cliente: 'Juliana M.', valor: 2800, data: '2026-09-02', pago: true },
  { parceiro: 'SANTAIGNEZ', pedido: '8920', cliente: 'Carolina e Pedro', valor: 4150, data: '2026-09-21', pago: false },
  { parceiro: 'SOLARREAL', pedido: '9011', cliente: 'Fernanda R.', valor: 1360, data: '2026-10-05', pago: false },
  { parceiro: 'MARIANACERIMONIAL', pedido: '9104', cliente: 'Bianca S.', valor: 750, data: '2026-10-11', pago: false },
];

// ───────── 6. Pré-venda das datas fortes ─────────
export const PRE_VENDAS = [
  { id: 'natal-2026', nome: 'Natal 2026', data: '2026-12-24', abreAte: '2026-12-20', capacidade: 60, emoji: '🎄', produto: 'Centro de mesa Natal Dourado', preco: 420, descricao: 'Pinheiro, amarílis vermelhas, eucalipto e velas em base dourada.' },
  { id: 'maes-2027', nome: 'Dia das Mães 2027', data: '2027-05-09', abreAte: '2027-05-06', capacidade: 80, emoji: '💐', produto: 'Bouquet Mãe Jardim', preco: 360, descricao: 'Rosas rosa queimado, lisianthus e astromélias com cartão escrito à mão.' },
  { id: 'namorados-2027', nome: 'Dia dos Namorados 2027', data: '2027-06-12', abreAte: '2027-06-10', capacidade: 100, emoji: '❤️', produto: 'Box Namorados Assinatura', preco: 490, descricao: '24 rosas vermelhas em caixa chapéu preta com trufas.' },
];
export const vagasPreVenda = (id: string, capacidades: Record<string, number>, vendidos: Record<string, number>) => Math.max(0, (capacidades[id] ?? 0) - (vendidos[id] ?? 0));
export const VENDIDOS_INICIAIS: Record<string, number> = { 'natal-2026': 47, 'maes-2027': 12, 'namorados-2027': 3 };

// ───────── 7. Aluguel de peças ─────────
export const PECAS = [
  { id: 'arco-dourado', nome: 'Arco circular dourado 2,2m', preco: 450, caucao: 300, estoque: 2, emoji: '⭕' },
  { id: 'arco-madeira', nome: 'Arco rústico de madeira', preco: 380, caucao: 250, estoque: 1, emoji: '🪵' },
  { id: 'candelabro', nome: 'Candelabro de cristal 5 braços', preco: 80, caucao: 60, estoque: 20, emoji: '🕯️' },
  { id: 'vaso-alto', nome: 'Vaso de vidro alto 70cm', preco: 35, caucao: 25, estoque: 40, emoji: '🏺' },
  { id: 'base-madeira', nome: 'Base de madeira de demolição', preco: 25, caucao: 15, estoque: 30, emoji: '🟫' },
  { id: 'cupula-vidro', nome: 'Cúpula de vidro com base', preco: 45, caucao: 30, estoque: 25, emoji: '🔔' },
];
export type ReservaAluguel = { pecaId: string; inicio: string; fim: string; qtd: number; pedido?: string; cliente?: string };
export const RESERVAS_INICIAIS: ReservaAluguel[] = [
  { pecaId: 'arco-dourado', inicio: '2026-10-24', fim: '2026-10-25', qtd: 1, pedido: '9150', cliente: 'Solar Real' },
  { pecaId: 'candelabro', inicio: '2026-10-24', fim: '2026-10-25', qtd: 15, pedido: '9150', cliente: 'Solar Real' },
];
export const diasEntre = (a: string, b: string) => Math.max(1, Math.round((+new Date(b + 'T12:00') - +new Date(a + 'T12:00')) / 86400000) + 1);
const sobrepoe = (a1: string, a2: string, b1: string, b2: string) => a1 <= b2 && b1 <= a2;
export function disponivel(pecaId: string, inicio: string, fim: string, reservas: ReservaAluguel[]) {
  const peca = PECAS.find((p) => p.id === pecaId)!;
  const usados = reservas.filter((r) => r.pecaId === pecaId && sobrepoe(inicio, fim, r.inicio, r.fim)).reduce((s, r) => s + r.qtd, 0);
  return Math.max(0, peca.estoque - usados);
}

// ───────── 8. Workshops ─────────
export const WORKSHOPS = [
  { id: 'buque-noiva-out', nome: 'Buquê de noiva com Rafael', data: '2026-10-31', hora: '14:00', duracao: '3h', vagas: 8, preco: 380, emoji: '💐', descricao: 'Técnica espiral, amarração em cetim e escolha de paleta. Você leva seu buquê.' },
  { id: 'mesa-posta-nov', nome: 'Centro de mesa e mesa posta', data: '2026-11-14', hora: '10:00', duracao: '3h', vagas: 10, preco: 340, emoji: '🕯️', descricao: 'Montagem sem espuma floral, base de vidro e harmonização com louças.' },
  { id: 'guirlanda-dez', nome: 'Guirlanda de Natal dourada', data: '2026-12-05', hora: '15:00', duracao: '2h30', vagas: 12, preco: 290, emoji: '🎄', descricao: 'Guirlanda com eucalipto, pinhas e fitas de seda. Espumante incluso.' },
];
export const INSCRITOS_INICIAIS: Record<string, number> = { 'buque-noiva-out': 6, 'mesa-posta-nov': 3, 'guirlanda-dez': 1 };

// ───────── 10. Plano corporativo ─────────
export const CORPORATIVO = {
  porArranjo: { recepcao: 420, mesa: 160, banheiro: 90, sala: 220 } as Record<string, number>,
  rotulos: { recepcao: 'Recepção / hall', mesa: 'Mesas de reunião', banheiro: 'Lavabos', sala: 'Salas da diretoria' } as Record<string, string>,
  frequencia: { semanal: { nome: 'Semanal', vezes: 4.33 }, quinzenal: { nome: 'Quinzenal', vezes: 2.17 } } as Record<string, { nome: string; vezes: number }>,
  descontoAnual: 0.08,
};
export function calcularCorporativo(qtd: Record<string, number>, freq: string, anual: boolean) {
  const porVisita = Object.entries(qtd).reduce((s, [k, n]) => s + n * (CORPORATIVO.porArranjo[k] ?? 0), 0);
  const mensalBruto = Math.round(porVisita * (CORPORATIVO.frequencia[freq]?.vezes ?? 4.33));
  const mensal = anual ? Math.round(mensalBruto * (1 - CORPORATIVO.descontoAnual)) : mensalBruto;
  return { porVisita, mensalBruto, mensal };
}

// ───────── Utilidades ─────────
export const codigo = (prefixo: string) => `${prefixo}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
export const hojeISO = () => new Date().toISOString().slice(0, 10);
export const dataBR = (iso?: string) => (iso ? iso.slice(0, 10).split('-').reverse().join('/') : '—');
