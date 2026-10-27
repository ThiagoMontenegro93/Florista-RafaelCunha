# Rafael Cunha Ateliê Floral

Site público + admin escondido de prospecção para **@florista.rafaelcunha** (rafaelsoaresdecor@gmail.com).

Stack: Next.js 14 (App Router) · Tailwind · Prisma/Postgres · NextAuth (RBAC FLORISTA/CLIENTE) · BullMQ (fila anti-spam) · Resend · Z-API · Google Places API (New) · BrasilAPI · IBGE · Mercado Pago · QR Code.

## Instalar

```bash
npm install
cp .env.example .env            # ajuste DATABASE_URL (as outras chaves são opcionais em dev)
npx prisma generate
npx prisma migrate dev          # cria as tabelas (migração inicial incluída)
npx prisma db seed              # 92 municípios RJ (códigos via IBGE), 18 flores, 12 produtos, 3 planos, ciclos 30/45/60
npm run dev                     # http://localhost:3000
```

Admin: `/admin` → login `rafaelsoaresdecor@gmail.com` + `ADMIN_PASSWORD`. Em desenvolvimento a senha padrão é `atelier2026`; em produção o login só funciona com uma senha própria de 10+ caracteres.
Fila de envios (opcional, precisa de Redis): `npm run worker`.

## Os 2 modos

| | Público (cliente) | Admin (só FLORISTA) |
|---|---|---|
| Rotas | `/`, `/portfolio`, `/flores`, `/loja`, `/assinaturas`, `/agenda`, `/orcamento`, `/checkout`, `/pedido/[n]`, `/cuidados/[id]`, `/conta`, `/[cidade]/[categoria]`, serviços: `/simulador`, `/consultoria`, `/preservacao`, `/pre-venda`, `/aluguel`, `/workshops`, `/corporativo`, `/parceiros`, `/avaliar/[n]` | `/admin/*` e `/api/admin/*` |
| Proteção | — | `src/middleware.ts` bloqueia quem não tem `role=FLORISTA`. O código da prospecção nem é enviado ao navegador do cliente. |

O botão flutuante **Ver como Cliente / Ver como Admin** e a dica de senha no login são de demonstração: aparecem em `npm run dev` e ficam escondidos em produção (para mostrar em produção, `NEXT_PUBLIC_DEMO=1`).

## Implantação (produção)

Testado do zero com `npm ci` → `prisma migrate deploy` → seed → `npm run build` → `npm start` e as 62 verificações automáticas.

**1. Banco Postgres** (Neon, Supabase, Railway ou o seu servidor). Copie a URL de conexão.

**2. Variáveis obrigatórias** (no painel da hospedagem ou no `.env` do servidor):

| Variável | Valor |
|---|---|
| `DATABASE_URL` | URL do Postgres |
| `NEXTAUTH_URL` | endereço público, ex. `https://florista-rafaelcunha.com.br` |
| `NEXTAUTH_SECRET` | gere com `openssl rand -base64 32` |
| `ADMIN_EMAIL` | `rafaelsoaresdecor@gmail.com` |
| `ADMIN_PASSWORD` | senha nova, 10+ caracteres (a de demo `atelier2026` é recusada em produção) |
| `NEXT_PUBLIC_SITE_URL` | o mesmo endereço público (canonical, sitemap, links de avaliação) |
| `NEXT_PUBLIC_WHATSAPP` / `NEXT_PUBLIC_TELEFONE` | número real do ateliê |

As demais (Resend, Z-API, Places, Mercado Pago, Cloudinary, Redis, NFS-e) são opcionais: sem elas o recurso fica em modo demonstração.

**3a. Vercel:** importe a pasta (ou o repositório), cadastre as variáveis acima, e use como *Build Command* `npx prisma migrate deploy && npm run build`. Depois, uma única vez, rode `npx prisma db seed` apontando para o banco de produção. Ligue o domínio em *Settings › Domains*.

**3b. Servidor próprio (VPS, Node 18.17+):**

```bash
npm ci
npx prisma migrate deploy
npx prisma db seed              # só na primeira vez
npm run build
npm start                       # porta 3000; use PORT=8080 npm start para outra
```

Coloque um proxy com HTTPS na frente (Nginx/Caddy) e mantenha o processo vivo com `pm2 start npm --name florista -- start`. Para a fila de envios: `pm2 start npm --name florista-worker -- run worker` (precisa de `REDIS_URL`).

**4. Conferir:** abra o site, `/admin` deve pedir login, e `BASE=https://seu-dominio ADMIN_PASSWORD=... npm run test:e2e` roda o teste completo contra produção (cria pedidos de teste só no navegador do teste).

Já vem configurado: cabeçalhos de segurança (anti-iframe, nosniff, HSTS, Referrer/Permissions-Policy), `/admin` com `noindex` e sem cache, `robots.txt` bloqueando `/admin` e `/api`, sitemap com as 368 páginas.

## Visual e temas

Cinco temas, todos com o dourado como assinatura. O padrão é **Rosé & Azul Pérola**: rosé #B86B7E em toda a tela, letras azuis (#0D33B3 nos cartões pérola, azul-marinho direto sobre o rosé para manter a leitura), detalhes em ouro. Troque em **Admin › Aparência** (vale para o seu navegador) ou fixe para todos os visitantes com `NEXT_PUBLIC_TEMA=rose-azul|perola|rose|salvia|onix` no `.env`.

- **Rosé & Azul Pérola** (padrão): rosé requintado com letras azul perolado.
- **Pérola & Ouro**: marfim, ouro e verde-folha. Claro e delicado.
- **Rosé & Champanhe**: blush rosado com ouro rosé. Romântico, para noivas.
- **Sálvia & Ouro**: verde sálvia e ouro velho. Botânico.
- **Ônix & Champanhe**: o tema escuro de luxo da versão anterior.

As cores ficam em variáveis CSS (`src/app/globals.css`) e o Tailwind lê essas variáveis, então qualquer tela nova herda o tema.

## As 10 ideias de negócio

| # | Ideia | Cliente | Admin |
|---|---|---|---|
| 1 | Aniversário de casamento | Data do casamento no checkout; aparece em Minha conta | **Memórias**: contagem regressiva e mensagem pronta com cupom `BODAS10` |
| 2 | Preservação do buquê | `/preservacao` (quadro, resina, cúpula) + oferta no pedido da noiva | Serviços › Preservação |
| 3 | Simulador de casamento | `/simulador`: total na hora, proposta em PDF, reserva da data com sinal de 50% | Serviços › Propostas |
| 4 | Consultoria de noivas | `/consultoria` R$ 250, dia e horário; gera crédito `NOIVA-XXXX` de uso único | Serviços › Consultorias |
| 5 | Parceiros | `/parceiros`: cadastro, link `/?ref=CODIGO`, QR e painel de comissões | **Parceiros**: % por parceiro, marcar comissão paga |
| 6 | Pré-venda de datas fortes | `/pre-venda`: vagas restantes, contagem regressiva, lista de espera | Serviços › Pré-venda: capacidade e fila |
| 7 | Aluguel de peças | `/aluguel`: período, disponibilidade por data, caução | Serviços › Aluguel: estoque por dia, reservas |
| 8 | Workshops | `/workshops`: ingressos limitados por vagas | Serviços › Workshops: inscritos e receita |
| 9 | Avaliação pós-entrega | `/avaliar/[n]`: estrelas, texto e foto; nota 4–5 convida para o Google | Pedidos › Pedir avaliação; **Avaliações**: aprovar e publicar na home |
| 10 | Plano corporativo | `/corporativo`: CNPJ (BrasilAPI), ambientes, frequência, −8% anual | **Corporativo**: status, faturas mensais com NF |

Todos os serviços passam pelo mesmo carrinho e checkout. Os efeitos (vagas, estoque, crédito, comissão, lembrete) são aplicados ao finalizar o pedido em `finalizarPedido` (`src/lib/store.tsx`). Regras e preços ficam em `src/data/servicos.ts`, que também alimenta o seed.

## O que é demo e o que é real

- **Funciona de verdade:** build, rotas, RBAC, Prisma + seed, BrasilAPI (CNPJ), IBGE, Places API (quando a chave existe), teste de Resend/Telegram, QR Code, 368 landing pages SEO + sitemap + JSON-LD (Florist, LocalBusiness, Product, Review).
- **Mockado no navegador (localStorage):** carrinho, pedidos, assinatura do cliente, toggles de ciclos, redes sociais, leads, estados ativos e todos os serviços (parceiros, créditos, vagas, reservas, avaliações, contratos). O schema Prisma já tem as tabelas para trocar por chamadas ao banco.
- **Nota fiscal corporativa:** o número exibido é de demonstração. Para NFS-e real use um provedor (ex.: Focus NFe) com `NFSE_TOKEN`.
- **Fotos de avaliação:** reduzidas e guardadas no navegador; em produção envie ao Cloudinary (`CLOUDINARY_URL`).
- **Pagamentos:** Pix QR e cartão são de demonstração. Ligue o Mercado Pago (`MERCADOPAGO_ACCESS_TOKEN`) para cobrança real e recorrente.
- **Fotos e vídeo:** os cards usam gradientes/emoji. Coloque URLs do Cloudinary em `src/data/portfolio.ts` e o reel em `NEXT_PUBLIC_HERO_VIDEO_URL`. O post `Dal14zbFCE9` é incorporado com o embed oficial do Instagram.
- **Números de vitrine** (1.247 leads, MRR R$ 18.500, 4.9★ etc.) vêm do briefing e são estáticos.

## Teste automático

Com o site rodando (`npm run build && npm start`), rode `npm run test:e2e` (em produção passe `ADMIN_PASSWORD=...`). Ele percorre como cliente e como admin todos os fluxos (loja, consultoria, simulador, parceiros, pré-venda, aluguel, workshops, preservação, avaliação, corporativo, memórias), confere 62 regras e tira prints em `telas-teste/`. Na primeira vez rode `npx playwright install chromium`. Para outro endereço: `BASE=https://seu-site npm run test:e2e`.

## Avisos de compliance (já exibidos no admin)

Instagram e LinkedIn não permitem envio em massa pela API: o sistema trata esses canais como manuais, com limites diários. WhatsApp só após opt-in. Email em volume exige domínio próprio com DKIM/SPF/DMARC e aquecimento de 14 dias. Scraping do Google Maps viola os termos: use a Places API oficial. Os repositórios GitHub listados no Hunter são de terceiros e devem ser revisados antes de usar.

## Estrutura

```
prisma/          schema.prisma, seed.ts, migrations/
src/data/        municípios RJ, UFs, flores, produtos, planos, cuidados, prospecção, serviços, temas (fonte única para UI e seed)
src/lib/         store (estado demo), auth (NextAuth/RBAC), seo, queue/worker (BullMQ), plano-envios
src/components/  ornamentos (ramo eucalipto, selo de cera, pétalas), loja, modal 5 passos, carrinho, mapa, guia de cuidados
src/app/(site)/  site público
src/app/admin/   painel + prospecção
```
