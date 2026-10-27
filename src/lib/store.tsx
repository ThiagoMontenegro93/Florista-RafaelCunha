'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { CICLOS_PADRAO, type Ciclo } from '@/data/planos';
import { LEADS, type Lead } from '@/data/prospeccao';
import { CUPONS } from '@/data/produtos';
import {
  PARCEIROS_INICIAIS, INDICACOES_INICIAIS, VENDIDOS_INICIAIS, RESERVAS_INICIAIS, INSCRITOS_INICIAIS, PRE_VENDAS,
  codigo, hojeISO, type Parceiro, type ReservaAluguel,
} from '@/data/servicos';

export type TipoItem = 'produto' | 'preservacao' | 'proposta' | 'aluguel' | 'workshop' | 'prevenda' | 'consultoria';

export type ItemCarrinho = {
  uid: string;
  tipo?: TipoItem;
  produtoId: string;
  nome: string;
  emoji: string;
  tamanho: string;
  paleta: string;
  extras: string[];
  entrega: string;
  detalhe?: string; // linha descritiva para itens de serviço
  meta?: Record<string, string | number>;
  localEvento?: string;
  dataDesejada?: string;
  horario?: string;
  mensagem?: string;
  preco: number;
  sinal?: boolean;
};

export type Pedido = {
  numero: string;
  data: string;
  itens: ItemCarrinho[];
  total: number;
  nome: string;
  whatsapp?: string;
  pagamento: string;
  status: number; // índice na timeline
  ref?: string; // parceiro que indicou
  dataCasamento?: string; // para o lembrete de aniversário
  avaliacaoPedida?: boolean;
};

export type AssinaturaCliente = { plano: string; ciclo: number; valor: number; primeiraEntrega: string; status: 'Ativa' | 'Pausada' | 'Cancelada' };
export type Rede = { nome: string; url: string };
export type Indicacao = { parceiro: string; pedido: string; cliente: string; valor: number; data: string; pago: boolean };
export type Consulta = { codigo: string; nome: string; whatsapp: string; data: string; hora: string; pedido: string; creditoUsado: boolean };
export type Proposta = { codigo: string; nome: string; data: string; local: string; total: number; sinal: number; linhas: { item: string; qtd: number; unit: number; total: number }[]; criadaEm: string; status: 'Enviada' | 'Sinal pago' };
export type Avaliacao = { pedido: string; nome: string; nota: number; texto: string; foto?: string; data: string; aprovada: boolean };
export type Contrato = { codigo: string; empresa: string; cnpj: string; razao?: string; contato: string; email: string; frequencia: string; arranjos: Record<string, number>; mensal: number; anual: boolean; inicio: string; status: 'Proposta' | 'Ativo' | 'Pausado' };
export type Fatura = { numero: string; contrato: string; competencia: string; valor: number; nf: string; status: 'Emitida' | 'Paga' };
export type Espera = { prevenda: string; nome: string; whatsapp: string; data: string };
export type Lembrete = { nome: string; whatsapp: string; dataCasamento: string; produto: string; produtoId: string; origem: string };

type Estado = {
  carrinho: ItemCarrinho[];
  pedidos: Pedido[];
  ciclos: Ciclo[];
  redes: Rede[];
  ufsAtivas: string[];
  municipiosOff: string[];
  leads: Lead[];
  assinatura: AssinaturaCliente | null;
  cupom: string | null;
  // serviços
  ref: string | null;
  parceiros: Parceiro[];
  indicacoes: Indicacao[];
  creditos: Record<string, number>; // cupom de valor fixo (ex.: crédito da consultoria)
  consultas: Consulta[];
  propostas: Proposta[];
  vendidos: Record<string, number>;
  capacidades: Record<string, number>;
  espera: Espera[];
  reservas: ReservaAluguel[];
  inscritos: Record<string, number>;
  avaliacoes: Avaliacao[];
  contratos: Contrato[];
  faturas: Fatura[];
  lembretes: Lembrete[];
};

const INICIAL: Estado = {
  carrinho: [],
  pedidos: [],
  ciclos: CICLOS_PADRAO,
  redes: [{ nome: 'Instagram', url: 'https://www.instagram.com/florista.rafaelcunha/' }],
  ufsAtivas: ['RJ'],
  municipiosOff: [],
  leads: LEADS,
  assinatura: null,
  cupom: null,
  ref: null,
  parceiros: PARCEIROS_INICIAIS,
  indicacoes: INDICACOES_INICIAIS,
  creditos: {},
  consultas: [],
  propostas: [],
  vendidos: VENDIDOS_INICIAIS,
  capacidades: Object.fromEntries(PRE_VENDAS.map((p) => [p.id, p.capacidade])),
  espera: [],
  reservas: RESERVAS_INICIAIS,
  inscritos: INSCRITOS_INICIAIS,
  avaliacoes: [],
  contratos: [],
  faturas: [],
  lembretes: [
    { nome: 'Juliana M.', whatsapp: '5521988887777', dataCasamento: '2025-10-25', produto: 'Bouquet Santa Ignêz Voto Pureza', produtoId: 'bouquet-santa-ignez', origem: 'Casamento Santa Ignêz' },
    { nome: 'Carolina e Pedro', whatsapp: '5521988886666', dataCasamento: '2025-11-08', produto: 'Centro Mesa Solar Real Lírios Orquídeas', produtoId: 'centro-solar-real', origem: 'Casamento Solar Real' },
    { nome: 'Bianca S.', whatsapp: '5521988885555', dataCasamento: '2025-12-13', produto: 'Buquê Cascata Orquídeas Roxas', produtoId: 'cascata-orquideas', origem: 'Casamento Jardim' },
  ],
};

/** Desconto de um cupom: percentual (CUPONS) ou crédito de valor fixo (consultoria). */
export function descontoCupom(cupom: string | null, subtotal: number, creditos: Record<string, number>) {
  if (!cupom) return 0;
  if (CUPONS[cupom]) return Math.round(subtotal * CUPONS[cupom]);
  if (creditos[cupom]) return Math.min(subtotal, creditos[cupom]);
  return 0;
}

type Ctx = Estado & {
  set: <K extends keyof Estado>(k: K, v: Estado[K] | ((prev: Estado[K]) => Estado[K])) => void;
  carrinhoAberto: boolean;
  abrirCarrinho: (v: boolean) => void;
  pronto: boolean;
  finalizarPedido: (d: { nome: string; whatsapp: string; total: number; pagamento: string; dataCasamento?: string }) => string;
};

const AtelieCtx = createContext<Ctx | null>(null);
const KEY = 'atelie-rafaelcunha-v2';

// Demo sem banco: estado persistido no navegador. Em produção, estes dados vêm do Prisma (ver prisma/schema.prisma).
export function AtelieProvider({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<Estado>(INICIAL);
  const [pronto, setPronto] = useState(false);
  const [carrinhoAberto, abrirCarrinho] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setEstado({ ...INICIAL, ...JSON.parse(raw) });
    } catch {}
    // link de parceiro: /?ref=CODIGO
    const ref = new URLSearchParams(window.location.search).get('ref');
    if (ref) setEstado((e) => ({ ...e, ref: ref.toUpperCase() }));
    setPronto(true);
  }, []);

  useEffect(() => {
    if (!pronto) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(estado));
    } catch {}
  }, [estado, pronto]);

  const set: Ctx['set'] = (k, v) =>
    setEstado((prev) => ({ ...prev, [k]: typeof v === 'function' ? (v as (p: unknown) => unknown)(prev[k]) : v }));

  /** Cria o pedido e aplica os efeitos de cada tipo de item (vagas, estoque, crédito, comissão, lembrete). */
  const finalizarPedido: Ctx['finalizarPedido'] = (d) => {
    const numero = String(1000 + Math.floor(Math.random() * 9000));
    setEstado((e) => {
      const n = { ...e };
      const itens = e.carrinho;
      n.pedidos = [{ numero, data: new Date().toISOString(), itens, total: d.total, nome: d.nome, whatsapp: d.whatsapp, pagamento: d.pagamento, status: 0, ref: e.ref ?? undefined, dataCasamento: d.dataCasamento }, ...e.pedidos];
      n.vendidos = { ...e.vendidos };
      n.inscritos = { ...e.inscritos };
      n.reservas = [...e.reservas];
      n.consultas = [...e.consultas];
      n.creditos = { ...e.creditos };
      n.propostas = [...e.propostas];
      for (const i of itens) {
        const qtd = Number(i.meta?.qtd ?? 1);
        if (i.tipo === 'prevenda') n.vendidos[i.produtoId] = (n.vendidos[i.produtoId] ?? 0) + qtd;
        if (i.tipo === 'workshop') n.inscritos[i.produtoId] = (n.inscritos[i.produtoId] ?? 0) + qtd;
        if (i.tipo === 'aluguel') n.reservas.push({ pecaId: i.produtoId, inicio: String(i.meta!.inicio), fim: String(i.meta!.fim), qtd, pedido: numero, cliente: d.nome });
        if (i.tipo === 'consultoria') {
          const cod = codigo('NOIVA');
          n.consultas.push({ codigo: cod, nome: d.nome, whatsapp: d.whatsapp, data: String(i.meta!.data), hora: String(i.meta!.hora), pedido: numero, creditoUsado: false });
          n.creditos[cod] = i.preco;
        }
        if (i.tipo === 'proposta') n.propostas = n.propostas.map((p) => (p.codigo === i.produtoId ? { ...p, status: 'Sinal pago' } : p));
      }
      // crédito de consultoria é de uso único
      if (e.cupom && e.creditos[e.cupom]) {
        delete n.creditos[e.cupom];
        n.consultas = n.consultas.map((c) => (c.codigo === e.cupom ? { ...c, creditoUsado: true } : c));
      }
      if (e.ref && e.parceiros.some((p) => p.codigo === e.ref)) n.indicacoes = [{ parceiro: e.ref, pedido: numero, cliente: d.nome, valor: d.total, data: hojeISO(), pago: false }, ...e.indicacoes];
      const noiva = itens.find((i) => i.tipo !== 'consultoria' && /Noiva|Bouquet|Buquê|Casamento|Centro/i.test(i.nome));
      if (d.dataCasamento && noiva) n.lembretes = [{ nome: d.nome, whatsapp: d.whatsapp, dataCasamento: d.dataCasamento, produto: noiva.nome, produtoId: noiva.produtoId, origem: `Pedido #${numero}` }, ...e.lembretes];
      n.carrinho = [];
      n.cupom = null;
      return n;
    });
    return numero;
  };

  return <AtelieCtx.Provider value={{ ...estado, set, carrinhoAberto, abrirCarrinho, pronto, finalizarPedido }}>{children}</AtelieCtx.Provider>;
}

export function useAtelie() {
  const c = useContext(AtelieCtx);
  if (!c) throw new Error('useAtelie fora do AtelieProvider');
  return c;
}

export const TIMELINE_PEDIDO = ['Recebido', 'Contato para combinar entrega', 'Em confecção', 'Entrega combinada', 'Entregue'];

/** Próximo aniversário (AAAA-MM-DD) a partir de hoje e quantos anos de casados. */
export function proximoAniversario(dataCasamento: string, hoje = new Date()) {
  const [a, m, d] = dataCasamento.split('-').map(Number);
  let ano = hoje.getFullYear();
  let prox = new Date(ano, m - 1, d);
  const h = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  if (prox < h) prox = new Date(++ano, m - 1, d);
  const dias = Math.round((+prox - +h) / 86400000);
  return { data: `${ano}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`, anos: ano - a, dias };
}
