import { PrismaClient } from '@prisma/client';
import { MUNICIPIOS_RJ, slugify } from '../src/data/municipios';
import { UFS } from '../src/data/ufs';
import { FLORES } from '../src/data/flores';
import { PRODUTOS } from '../src/data/produtos';
import { PLANOS, CICLOS_PADRAO } from '../src/data/planos';
import { LEADS } from '../src/data/prospeccao';
import { guiaPara } from '../src/data/cuidados';
import { PARCEIROS_INICIAIS, INDICACOES_INICIAIS, PRE_VENDAS, VENDIDOS_INICIAIS, PECAS, RESERVAS_INICIAIS, WORKSHOPS } from '../src/data/servicos';

const prisma = new PrismaClient();
const IBGE = process.env.IBGE_API ?? 'https://servicodados.ibge.gov.br/api/v1/localidades';

async function municipiosIBGE(): Promise<{ id: number; nome: string }[] | null> {
  try {
    const r = await fetch(`${IBGE}/estados/RJ/municipios`, { signal: AbortSignal.timeout(8000) });
    if (!r.ok) return null;
    return (await r.json()) as { id: number; nome: string }[];
  } catch {
    return null;
  }
}

async function main() {
  // Estados: só RJ ativo
  for (const uf of UFS) {
    await prisma.estado.upsert({
      where: { sigla: uf.sigla },
      update: {},
      create: { sigla: uf.sigla, nome: uf.nome, totalMunic: uf.municipios, ativo: uf.sigla === 'RJ' },
    });
  }
  const rj = await prisma.estado.findUniqueOrThrow({ where: { sigla: 'RJ' } });

  // 92 municípios RJ — códigos IBGE quando a API responde
  const ibge = await municipiosIBGE();
  const codigo = new Map(ibge?.map((m) => [slugify(m.nome), m.id]) ?? []);
  console.log(ibge ? `IBGE: ${ibge.length} municípios recebidos` : 'IBGE indisponível, usando lista local');
  for (const m of MUNICIPIOS_RJ) {
    const mun = await prisma.municipio.upsert({
      where: { estadoId_slug: { estadoId: rj.id, slug: m.slug } },
      update: { ibge: codigo.get(m.slug) ?? undefined, regiao: m.regiao },
      create: { nome: m.nome, slug: m.slug, regiao: m.regiao, ibge: codigo.get(m.slug), estadoId: rj.id, ativo: true },
    });
    const temArea = await prisma.areaAtendimento.findFirst({ where: { municipioId: mun.id } });
    if (!temArea) await prisma.areaAtendimento.create({ data: { municipioId: mun.id } });
  }

  // 18 flores
  for (const f of FLORES) {
    const data = {
      nome: f.nome, cientifico: f.cientifico, bioma: f.bioma, regiao: f.regiao, origem: f.origem, meses: f.meses,
      duracaoMin: f.durabilidade[0], duracaoMax: f.durabilidade[1], cores: f.cores, ocasioes: f.ocasioes,
      quandoUsar: f.quandoUsar, trabalhamos: f.trabalhamos,
    };
    await prisma.florBrasil.upsert({ where: { slug: f.slug }, update: data, create: { slug: f.slug, ...data } });
  }

  // 12 produtos + flores + guias
  for (const p of PRODUTOS) {
    const data = { nome: p.nome, categoria: p.categoria, descricao: p.descricao, preco: p.preco, prazo: p.prazo, badge: p.badge, exigeSinal: !!p.sinal };
    await prisma.produto.upsert({ where: { id: p.id }, update: data, create: { id: p.id, ...data } });
    for (const slug of p.flores) {
      const flor = await prisma.florBrasil.findUniqueOrThrow({ where: { slug } });
      await prisma.produtoFlor.upsert({
        where: { produtoId_florId: { produtoId: p.id, florId: flor.id } },
        update: {},
        create: { produtoId: p.id, florId: flor.id },
      });
    }
    await prisma.guiaConservacao.deleteMany({ where: { produtoId: p.id } });
    const g = guiaPara(p.flores);
    await prisma.guiaConservacao.create({ data: { produtoId: p.id, titulo: g.titulo, passos: g.passos } });
  }

  // 3 planos + ciclos 30/45/60 habilitáveis
  for (const c of CICLOS_PADRAO) {
    await prisma.cicloFaturamento.upsert({
      where: { dias: c.dias },
      update: {},
      create: { dias: c.dias, nome: c.nome, habilitado: c.habilitado, multiplicador: c.multiplicador },
    });
  }
  for (const pl of PLANOS) {
    const data = { nome: pl.nome, precoBase: pl.preco, destaque: !!pl.destaque, itens: pl.itens };
    await prisma.planoAssinatura.upsert({ where: { id: pl.id }, update: data, create: { id: pl.id, ...data } });
  }

  // Leads de exemplo
  for (const l of LEADS) {
    const exists = await prisma.lead.findFirst({ where: { nome: l.nome } });
    if (exists) continue;
    await prisma.lead.create({
      data: {
        nome: l.nome, nicho: l.nicho, cidade: l.cidade, responsavel: l.responsavel, email: l.email, whatsapp: l.whatsapp,
        instagram: l.instagram, cnpj: l.cnpj, fonte: l.fonte, status: l.status, score: l.score, rating: l.rating,
        ultimoContato: l.ultimoContato ? new Date(l.ultimoContato) : null,
      },
    });
  }

  // Admin
  await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL ?? 'rafaelsoaresdecor@gmail.com' },
    update: { role: 'FLORISTA' },
    create: { email: process.env.ADMIN_EMAIL ?? 'rafaelsoaresdecor@gmail.com', nome: 'Rafael Cunha', role: 'FLORISTA' },
  });

  await prisma.redeSocial.deleteMany();
  await prisma.redeSocial.create({ data: { nome: 'Instagram', url: 'https://www.instagram.com/florista.rafaelcunha/' } });

  for (const id of ['RESEND', 'WHATSAPP', 'INSTAGRAM', 'TELEGRAM', 'LINKEDIN', 'SHEETS', 'PLACES', 'IBGE']) {
    await prisma.apisConfig.upsert({ where: { id }, update: {}, create: { id, conectado: id === 'IBGE' } });
  }

  // Serviços do ateliê
  for (const p of PARCEIROS_INICIAIS) {
    await prisma.parceiro.upsert({ where: { codigo: p.codigo }, update: {}, create: { ...p, criadoEm: new Date(p.criadoEm) } });
  }
  for (const i of INDICACOES_INICIAIS) {
    const existe = await prisma.indicacao.findFirst({ where: { pedidoNum: i.pedido } });
    if (!existe) await prisma.indicacao.create({ data: { parceiroId: i.parceiro, pedidoNum: i.pedido, cliente: i.cliente, valor: i.valor, pago: i.pago, data: new Date(i.data) } });
  }
  for (const p of PRE_VENDAS) {
    await prisma.preVenda.upsert({
      where: { id: p.id },
      update: { capacidade: p.capacidade },
      create: { id: p.id, nome: p.nome, produto: p.produto, preco: p.preco, data: new Date(p.data), abreAte: new Date(p.abreAte), capacidade: p.capacidade, vendidos: VENDIDOS_INICIAIS[p.id] ?? 0 },
    });
  }
  for (const p of PECAS) {
    await prisma.pecaAluguel.upsert({ where: { id: p.id }, update: { estoque: p.estoque, preco: p.preco, caucao: p.caucao }, create: { id: p.id, nome: p.nome, preco: p.preco, caucao: p.caucao, estoque: p.estoque } });
  }
  if ((await prisma.reservaAluguel.count()) === 0) {
    for (const r of RESERVAS_INICIAIS) await prisma.reservaAluguel.create({ data: { pecaId: r.pecaId, inicio: new Date(r.inicio), fim: new Date(r.fim), qtd: r.qtd, cliente: r.cliente, pedidoNum: r.pedido } });
  }
  for (const w of WORKSHOPS) {
    await prisma.workshop.upsert({ where: { id: w.id }, update: {}, create: { id: w.id, nome: w.nome, data: new Date(w.data), hora: w.hora, duracao: w.duracao, vagas: w.vagas, preco: w.preco, descricao: w.descricao } });
  }

  const n = await prisma.municipio.count({ where: { estadoId: rj.id } });
  console.log(`Seed ok: ${n} municípios RJ, ${FLORES.length} flores, ${PRODUTOS.length} produtos, ${PLANOS.length} planos, ${PARCEIROS_INICIAIS.length} parceiros, ${PRE_VENDAS.length} pré-vendas, ${PECAS.length} peças, ${WORKSHOPS.length} workshops`);
}

main().finally(() => prisma.$disconnect());
