-- CreateEnum
CREATE TYPE "Role" AS ENUM ('FLORISTA', 'CLIENTE');

-- CreateEnum
CREATE TYPE "StatusPedido" AS ENUM ('RECEBIDO', 'CONTATO_ENTREGA', 'EM_CONFECCAO', 'ENTREGA_COMBINADA', 'ENTREGUE');

-- CreateEnum
CREATE TYPE "StatusAssinatura" AS ENUM ('ATIVA', 'PAUSADA', 'CANCELADA');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nome" TEXT,
    "role" "Role" NOT NULL DEFAULT 'CLIENTE',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Estado" (
    "id" SERIAL NOT NULL,
    "sigla" CHAR(2) NOT NULL,
    "nome" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT false,
    "totalMunic" INTEGER NOT NULL,

    CONSTRAINT "Estado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Municipio" (
    "id" SERIAL NOT NULL,
    "ibge" INTEGER,
    "nome" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "regiao" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "estadoId" INTEGER NOT NULL,

    CONSTRAINT "Municipio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AreaAtendimento" (
    "id" SERIAL NOT NULL,
    "municipioId" INTEGER NOT NULL,
    "eventosPorDia" INTEGER NOT NULL DEFAULT 1,
    "entregaACombinar" BOOLEAN NOT NULL DEFAULT true,
    "observacao" TEXT,

    CONSTRAINT "AreaAtendimento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlorBrasil" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cientifico" TEXT NOT NULL,
    "bioma" TEXT NOT NULL,
    "regiao" TEXT NOT NULL,
    "origem" TEXT NOT NULL,
    "meses" INTEGER[],
    "duracaoMin" INTEGER NOT NULL,
    "duracaoMax" INTEGER NOT NULL,
    "cores" TEXT[],
    "ocasioes" TEXT[],
    "quandoUsar" TEXT NOT NULL,
    "trabalhamos" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "FlorBrasil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Produto" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "preco" DECIMAL(10,2) NOT NULL,
    "prazo" TEXT NOT NULL,
    "badge" TEXT,
    "exigeSinal" BOOLEAN NOT NULL DEFAULT false,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "imagem" TEXT,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProdutoFlor" (
    "produtoId" TEXT NOT NULL,
    "florId" INTEGER NOT NULL,

    CONSTRAINT "ProdutoFlor_pkey" PRIMARY KEY ("produtoId","florId")
);

-- CreateTable
CREATE TABLE "GuiaConservacao" (
    "id" SERIAL NOT NULL,
    "produtoId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "passos" JSONB NOT NULL,
    "videoUrl" TEXT,

    CONSTRAINT "GuiaConservacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pedido" (
    "id" SERIAL NOT NULL,
    "numero" TEXT NOT NULL,
    "clienteId" TEXT,
    "nome" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "bairro" TEXT,
    "cidade" TEXT,
    "referencia" TEXT,
    "retirarAtelie" BOOLEAN NOT NULL DEFAULT false,
    "combinarVia" TEXT NOT NULL DEFAULT 'WhatsApp',
    "pagamento" TEXT NOT NULL,
    "cupom" TEXT,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "desconto" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(10,2) NOT NULL,
    "status" "StatusPedido" NOT NULL DEFAULT 'RECEBIDO',
    "dataDesejada" TIMESTAMP(3),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PedidoItem" (
    "id" SERIAL NOT NULL,
    "pedidoId" INTEGER NOT NULL,
    "produtoId" TEXT NOT NULL,
    "tamanho" TEXT NOT NULL,
    "paleta" TEXT NOT NULL,
    "extras" TEXT[],
    "mensagem" TEXT,
    "localEvento" TEXT,
    "horarioContato" TEXT,
    "preco" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "PedidoItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanoAssinatura" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "precoBase" DECIMAL(10,2) NOT NULL,
    "destaque" BOOLEAN NOT NULL DEFAULT false,
    "itens" TEXT[],
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "PlanoAssinatura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CicloFaturamento" (
    "dias" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "habilitado" BOOLEAN NOT NULL DEFAULT true,
    "multiplicador" DECIMAL(4,2) NOT NULL,

    CONSTRAINT "CicloFaturamento_pkey" PRIMARY KEY ("dias")
);

-- CreateTable
CREATE TABLE "Assinatura" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "planoId" TEXT NOT NULL,
    "cicloDias" INTEGER NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "proximaEntrega" TIMESTAMP(3),
    "status" "StatusAssinatura" NOT NULL DEFAULT 'ATIVA',
    "mpPreapprovalId" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Assinatura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "nicho" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "municipioId" INTEGER,
    "responsavel" TEXT,
    "email" TEXT,
    "whatsapp" TEXT,
    "instagram" TEXT,
    "cnpj" TEXT,
    "placeId" TEXT,
    "fonte" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Novo',
    "score" INTEGER NOT NULL DEFAULT 50,
    "rating" DOUBLE PRECISION,
    "optOut" BOOLEAN NOT NULL DEFAULT false,
    "ultimoContato" TIMESTAMP(3),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campanha" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "nicho" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "canais" TEXT[],
    "anexos" TEXT[],
    "limiteDiario" INTEGER NOT NULL DEFAULT 50,
    "porHora" INTEGER NOT NULL DEFAULT 20,
    "janelaInicio" INTEGER NOT NULL DEFAULT 9,
    "janelaFim" INTEGER NOT NULL DEFAULT 18,
    "agendadaPara" TIMESTAMP(3),
    "criadaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Campanha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Envio" (
    "id" SERIAL NOT NULL,
    "campanhaId" INTEGER NOT NULL,
    "leadId" INTEGER NOT NULL,
    "canal" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'FILA',
    "motivo" TEXT,
    "enviadoEm" TIMESTAMP(3),

    CONSTRAINT "Envio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApisConfig" (
    "id" TEXT NOT NULL,
    "chave" TEXT,
    "extra" JSONB,
    "conectado" BOOLEAN NOT NULL DEFAULT false,
    "testadoEm" TIMESTAMP(3),

    CONSTRAINT "ApisConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RedeSocial" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "RedeSocial_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Estado_sigla_key" ON "Estado"("sigla");

-- CreateIndex
CREATE UNIQUE INDEX "Municipio_ibge_key" ON "Municipio"("ibge");

-- CreateIndex
CREATE UNIQUE INDEX "Municipio_estadoId_slug_key" ON "Municipio"("estadoId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "FlorBrasil_slug_key" ON "FlorBrasil"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Pedido_numero_key" ON "Pedido"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_cnpj_key" ON "Lead"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_placeId_key" ON "Lead"("placeId");

-- CreateIndex
CREATE INDEX "Lead_whatsapp_idx" ON "Lead"("whatsapp");

-- AddForeignKey
ALTER TABLE "Municipio" ADD CONSTRAINT "Municipio_estadoId_fkey" FOREIGN KEY ("estadoId") REFERENCES "Estado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AreaAtendimento" ADD CONSTRAINT "AreaAtendimento_municipioId_fkey" FOREIGN KEY ("municipioId") REFERENCES "Municipio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProdutoFlor" ADD CONSTRAINT "ProdutoFlor_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProdutoFlor" ADD CONSTRAINT "ProdutoFlor_florId_fkey" FOREIGN KEY ("florId") REFERENCES "FlorBrasil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuiaConservacao" ADD CONSTRAINT "GuiaConservacao_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoItem" ADD CONSTRAINT "PedidoItem_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoItem" ADD CONSTRAINT "PedidoItem_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assinatura" ADD CONSTRAINT "Assinatura_planoId_fkey" FOREIGN KEY ("planoId") REFERENCES "PlanoAssinatura"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assinatura" ADD CONSTRAINT "Assinatura_cicloDias_fkey" FOREIGN KEY ("cicloDias") REFERENCES "CicloFaturamento"("dias") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_municipioId_fkey" FOREIGN KEY ("municipioId") REFERENCES "Municipio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Envio" ADD CONSTRAINT "Envio_campanhaId_fkey" FOREIGN KEY ("campanhaId") REFERENCES "Campanha"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Envio" ADD CONSTRAINT "Envio_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
