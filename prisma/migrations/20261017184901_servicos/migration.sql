-- CreateEnum
CREATE TYPE "TipoServico" AS ENUM ('PRODUTO', 'PRESERVACAO', 'PROPOSTA', 'ALUGUEL', 'WORKSHOP', 'PREVENDA', 'CONSULTORIA');

-- DropForeignKey
ALTER TABLE "PedidoItem" DROP CONSTRAINT "PedidoItem_produtoId_fkey";

-- AlterTable
ALTER TABLE "Pedido" ADD COLUMN     "avaliacaoPedida" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "dataCasamento" TIMESTAMP(3),
ADD COLUMN     "parceiroCodigo" TEXT;

-- AlterTable
ALTER TABLE "PedidoItem" ADD COLUMN     "detalhe" TEXT,
ADD COLUMN     "meta" JSONB,
ADD COLUMN     "refServico" TEXT,
ADD COLUMN     "tipo" "TipoServico" NOT NULL DEFAULT 'PRODUTO',
ALTER COLUMN "produtoId" DROP NOT NULL,
ALTER COLUMN "tamanho" SET DEFAULT '—',
ALTER COLUMN "paleta" SET DEFAULT '—';

-- CreateTable
CREATE TABLE "Proposta" (
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "local" TEXT,
    "linhas" JSONB NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "sinal" DECIMAL(10,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Enviada',
    "pedidoNum" TEXT,
    "criadaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Proposta_pkey" PRIMARY KEY ("codigo")
);

-- CreateTable
CREATE TABLE "Consultoria" (
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "hora" TEXT NOT NULL,
    "formato" TEXT NOT NULL DEFAULT 'No ateliê',
    "pedidoNum" TEXT NOT NULL,
    "credito" DECIMAL(10,2) NOT NULL,
    "creditoUsado" BOOLEAN NOT NULL DEFAULT false,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Consultoria_pkey" PRIMARY KEY ("codigo")
);

-- CreateTable
CREATE TABLE "Parceiro" (
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "comissao" DECIMAL(4,2) NOT NULL DEFAULT 0.10,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Parceiro_pkey" PRIMARY KEY ("codigo")
);

-- CreateTable
CREATE TABLE "Indicacao" (
    "id" SERIAL NOT NULL,
    "parceiroId" TEXT NOT NULL,
    "pedidoId" INTEGER,
    "pedidoNum" TEXT NOT NULL,
    "cliente" TEXT NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "pago" BOOLEAN NOT NULL DEFAULT false,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Indicacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PreVenda" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "produto" TEXT NOT NULL,
    "preco" DECIMAL(10,2) NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "abreAte" TIMESTAMP(3) NOT NULL,
    "capacidade" INTEGER NOT NULL,
    "vendidos" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PreVenda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListaEspera" (
    "id" SERIAL NOT NULL,
    "preVendaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "avisado" BOOLEAN NOT NULL DEFAULT false,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListaEspera_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PecaAluguel" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "preco" DECIMAL(10,2) NOT NULL,
    "caucao" DECIMAL(10,2) NOT NULL,
    "estoque" INTEGER NOT NULL,

    CONSTRAINT "PecaAluguel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReservaAluguel" (
    "id" SERIAL NOT NULL,
    "pecaId" TEXT NOT NULL,
    "inicio" TIMESTAMP(3) NOT NULL,
    "fim" TIMESTAMP(3) NOT NULL,
    "qtd" INTEGER NOT NULL,
    "cliente" TEXT,
    "pedidoNum" TEXT,
    "devolvida" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ReservaAluguel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workshop" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "hora" TEXT NOT NULL,
    "duracao" TEXT NOT NULL,
    "vagas" INTEGER NOT NULL,
    "preco" DECIMAL(10,2) NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "Workshop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inscricao" (
    "id" SERIAL NOT NULL,
    "workshopId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "qtd" INTEGER NOT NULL DEFAULT 1,
    "pedidoNum" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Inscricao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Avaliacao" (
    "id" SERIAL NOT NULL,
    "pedidoId" INTEGER,
    "nome" TEXT NOT NULL,
    "nota" INTEGER NOT NULL,
    "texto" TEXT NOT NULL,
    "fotoUrl" TEXT,
    "aprovada" BOOLEAN NOT NULL DEFAULT false,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Avaliacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContratoCorporativo" (
    "codigo" TEXT NOT NULL,
    "empresa" TEXT NOT NULL,
    "razao" TEXT,
    "cnpj" TEXT NOT NULL,
    "contato" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "frequencia" TEXT NOT NULL,
    "arranjos" JSONB NOT NULL,
    "mensal" DECIMAL(10,2) NOT NULL,
    "anual" BOOLEAN NOT NULL DEFAULT false,
    "inicio" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Proposta',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContratoCorporativo_pkey" PRIMARY KEY ("codigo")
);

-- CreateTable
CREATE TABLE "Fatura" (
    "numero" TEXT NOT NULL,
    "contratoId" TEXT NOT NULL,
    "competencia" TEXT NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "nf" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Emitida',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Fatura_pkey" PRIMARY KEY ("numero")
);

-- CreateIndex
CREATE UNIQUE INDEX "Indicacao_pedidoId_key" ON "Indicacao"("pedidoId");

-- CreateIndex
CREATE INDEX "ReservaAluguel_pecaId_inicio_fim_idx" ON "ReservaAluguel"("pecaId", "inicio", "fim");

-- CreateIndex
CREATE UNIQUE INDEX "Avaliacao_pedidoId_key" ON "Avaliacao"("pedidoId");

-- CreateIndex
CREATE UNIQUE INDEX "Fatura_contratoId_competencia_key" ON "Fatura"("contratoId", "competencia");

-- AddForeignKey
ALTER TABLE "PedidoItem" ADD CONSTRAINT "PedidoItem_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Indicacao" ADD CONSTRAINT "Indicacao_parceiroId_fkey" FOREIGN KEY ("parceiroId") REFERENCES "Parceiro"("codigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Indicacao" ADD CONSTRAINT "Indicacao_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListaEspera" ADD CONSTRAINT "ListaEspera_preVendaId_fkey" FOREIGN KEY ("preVendaId") REFERENCES "PreVenda"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservaAluguel" ADD CONSTRAINT "ReservaAluguel_pecaId_fkey" FOREIGN KEY ("pecaId") REFERENCES "PecaAluguel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscricao" ADD CONSTRAINT "Inscricao_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "Workshop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fatura" ADD CONSTRAINT "Fatura_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "ContratoCorporativo"("codigo") ON DELETE RESTRICT ON UPDATE CASCADE;
