// Teste ponta a ponta dos fluxos de cliente e admin. Uso: npm run build && npm start, depois npm run test:e2e
import { mkdirSync } from 'fs';
import { chromium } from 'playwright';
const base = process.env.BASE ?? 'http://localhost:3000';
const S = process.env.SHOTS ?? 'telas-teste/';
mkdirSync(S, { recursive: true });
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.addInitScript(() => { try { localStorage.setItem('popup-10', '1'); } catch {} window.__print = 0; window.print = () => { window.__print++; }; });
const p = await ctx.newPage();
const errs = [];
p.on('pageerror', (e) => errs.push(p.url() + ' pageerror ' + e.message));
p.on('console', (m) => m.type() === 'error' && !/Failed to load resource|instagram|ERR_|net::/i.test(m.text()) && errs.push(p.url() + ' console ' + m.text().slice(0, 200)));
const res = [];
const ok = (c, msg) => { res.push([!!c, msg]); console.log(c ? '✓' : '✗', msg); };
const st = () => p.evaluate(() => JSON.parse(localStorage.getItem('atelie-rafaelcunha-v2') || '{}'));
const go = async (path) => { await p.goto(base + path, { waitUntil: 'networkidle' }); await p.waitForTimeout(300); };
const shot = (n, full = true) => p.screenshot({ path: S + n + '.png', fullPage: full });
const fecharCarrinho = async () => { const x = p.getByRole('button', { name: 'Fechar' }); if (await x.count()) await x.first().click(); };
const calDia = async (scope) => { const btn = scope.locator('button.aspect-square:not([disabled])').first(); await btn.click(); };

async function checkout({ nome, whats = '21988887777', casamento, pag = 'Pix' }) {
  await go('/checkout');
  const campos = p.locator('input.campo');
  await campos.nth(0).fill(nome); await campos.nth(1).fill(whats); await campos.nth(2).fill(nome.split(' ')[0].toLowerCase() + '@x.com');
  if (casamento) await p.locator('input[type=date]').fill(casamento);
  await p.getByRole('button', { name: 'Continuar' }).click();
  await p.getByRole('button', { name: 'Continuar' }).click();
  await p.getByRole('button', { name: new RegExp('^' + pag) }).click();
  await shot('checkout-' + nome.split(' ')[0], false);
  await p.getByRole('button', { name: /Enviar pedido/ }).click();
  await p.waitForURL('**/pedido/**'); await p.waitForTimeout(500);
  return p.url().split('/').pop();
}

// ── 4. Consultoria ──
await go('/consultoria');
await calDia(p.locator('.moldura').last());
await p.getByRole('button', { name: '10:00' }).click();
await shot('consultoria', false);
await p.getByRole('button', { name: /Reservar consultoria/ }).click();
await p.waitForTimeout(300);
ok(await p.getByText('Consultoria de noiva com Rafael').isVisible(), 'consultoria entra no carrinho com detalhe');
await shot('carrinho-consultoria', false);
const pedConsult = await checkout({ nome: 'Ana Consultoria' });
let s = await st();
const cred = Object.keys(s.creditos ?? {})[0];
ok(cred?.startsWith('NOIVA-') && s.creditos[cred] === 250, `crédito ${cred} de R$250 gerado`);
ok(await p.locator(`[data-credito="${cred}"]`).isVisible(), 'código do crédito aparece na página do pedido');
ok(s.consultas?.length === 1 && s.consultas[0].hora === '10:00', 'consulta registrada');
await shot('pedido-consultoria');
// mesmo horário fica ocupado
await go('/consultoria');
await p.locator('button.aspect-square:not([disabled])').first().click();
ok(await p.getByRole('button', { name: '10:00' }).isDisabled(), 'horário já reservado fica indisponível');

// ── 3. Simulador ──
await go('/simulador');
await p.getByPlaceholder('Juliana e Pedro').fill('Ana e Bruno');
await p.getByPlaceholder('Casa e Capela Santa Ignêz').fill('Solar Real');
await p.getByRole('button', { name: 'Próximo mês' }).click();
await calDia(p.locator('div.rounded-2xl.border.border-areia.bg-vidro.p-3'));
const totalTxt = await p.locator('#proposta span.texto-ouro').first().innerText();
ok(/R\$/.test(totalTxt), 'simulador calcula total ' + totalTxt);
await p.getByRole('button', { name: /Gerar proposta em PDF/ }).click(); await p.waitForTimeout(200);
ok((await p.evaluate(() => window.__print)) === 1, 'gerar proposta chama impressão (PDF)');
s = await st(); ok(s.propostas?.length === 1, 'proposta salva ' + s.propostas?.[0]?.codigo);
await shot('simulador');
await p.emulateMedia({ media: 'print' }); await shot('simulador-print'); await p.emulateMedia({ media: 'screen' });
await p.getByRole('button', { name: /Reservar data com sinal/ }).click(); await p.waitForTimeout(300);
s = await st(); const prop = s.propostas[0];
ok(s.carrinho.some((i) => i.tipo === 'proposta' && i.preco === prop.sinal), 'sinal da proposta no carrinho');
await fecharCarrinho();
// buquê da loja + crédito da consultoria
await go('/loja');
await p.getByRole('button', { name: 'Personalizar e Encomendar' }).first().click();
for (let i = 0; i < 4; i++) await p.getByRole('button', { name: 'Continuar' }).click();
await p.getByRole('button', { name: 'Adicionar ao Atelier' }).click();
await p.fill('input[placeholder^="Cupom"]', cred.toLowerCase()); await p.getByRole('button', { name: 'Aplicar' }).click();
await p.waitForTimeout(200);
ok(await p.getByText(`Cupom ${cred}`).isVisible() && await p.getByText('−R$ 250,00').isVisible(), 'crédito da consultoria abate R$250 no carrinho');
await shot('carrinho-credito', false);
await p.getByRole('link', { name: 'Ir para Checkout' }).click();
const pedCasamento = await checkout({ nome: 'Ana Noiva', casamento: '2025-10-30', pag: 'Pix' });
s = await st();
ok(s.propostas[0].status === 'Sinal pago', 'proposta marcada como Sinal pago');
ok(!s.creditos[cred] && s.consultas[0].creditoUsado, 'crédito consumido (uso único)');
ok(s.lembretes.some((l) => l.nome === 'Ana Noiva' && l.dataCasamento === '2025-10-30'), 'lembrete de aniversário criado');
ok(s.pedidos[0].itens.some((i) => i.tipo === 'proposta') && s.pedidos[0].pagamento === 'Pix', 'sinal da proposta pago via Pix');
ok(await p.getByText('Eternize o seu').isVisible(), 'upsell de preservação no pedido de noiva');
await shot('pedido-casamento');
// cupom já usado é recusado
await go('/preservacao');
await p.locator('input[type=date]').fill('2026-10-24'); await p.getByPlaceholder('J & P · 25.10.2026').fill('A & B');
await p.getByRole('button', { name: 'Eternizar meu buquê' }).nth(1).click(); await p.waitForTimeout(200);
s = await st(); ok(s.carrinho.some((i) => i.tipo === 'preservacao' && /A & B/.test(i.detalhe)), 'preservação no carrinho com gravação');
await p.fill('input[placeholder^="Cupom"]', cred); await p.getByRole('button', { name: 'Aplicar' }).click();
ok(await p.getByText(/Cupom inválido ou já utilizado/).isVisible(), 'crédito não pode ser usado duas vezes');
await shot('preservacao', false);
await fecharCarrinho();
await checkout({ nome: 'Bia Preserva' });

// ── 5. Parceiros ──
await go('/parceiros');
const f = p.locator('form').first();
await f.locator('input').nth(0).fill('Flávia Assessoria'); await f.locator('select').selectOption('Assessoria');
await f.locator('input[type=email]').fill('flavia@x.com'); await f.locator('input').nth(2).fill('21977776666');
await p.getByRole('button', { name: 'Gerar meu link de parceiro' }).click();
ok(await p.getByText('?ref=FLAVIAASSESSOR').isVisible(), 'parceiro recebe código e link');
await shot('parceiro-painel');
await p.goto(base + '/?ref=FLAVIAASSESSOR', { waitUntil: 'networkidle' }); await p.waitForTimeout(400);
s = await st(); ok(s.ref === 'FLAVIAASSESSOR', 'ref do parceiro capturado pela URL');

// ── 8. Workshops (comprado por indicação) ──
await go('/workshops');
const insc0 = s.inscritos['mesa-posta-nov'];
const card = p.locator('article').nth(1);
await card.locator('select').selectOption('2'); await card.getByRole('button', { name: 'Comprar ingresso' }).click(); await p.waitForTimeout(200);
await fecharCarrinho();
ok((await card.locator('[data-vagas]').getAttribute('data-vagas')) === String(10 - insc0 - 2), 'vagas descontam ingressos no carrinho');
await shot('workshops');
const pedWork = await checkout({ nome: 'Carla Workshop' });
s = await st();
ok(s.inscritos['mesa-posta-nov'] === insc0 + 2, 'inscritos +2 após o pedido');
ok(s.indicacoes.some((i) => i.parceiro === 'FLAVIAASSESSOR' && i.pedido === pedWork), 'indicação registrada para o parceiro');
await go('/parceiros');
await p.locator('form').nth(1).locator('input').fill('flaviaassessor'); await p.getByRole('button', { name: 'Abrir meu painel' }).click();
ok(await p.getByText(`#${pedWork}`).isVisible(), 'painel do parceiro mostra a indicação com comissão');
await shot('parceiro-indicacao');

// ── 6. Pré-venda ──
await go('/pre-venda');
const natal = p.locator('article').first();
const v0 = +(await natal.locator('[data-vagas]').getAttribute('data-vagas'));
await natal.locator('select').selectOption('2'); await natal.getByRole('button', { name: 'Garantir o meu' }).click(); await p.waitForTimeout(200); await fecharCarrinho();
ok(+(await natal.locator('[data-vagas]').getAttribute('data-vagas')) === v0 - 2, `vagas da pré-venda ${v0} → ${v0 - 2}`);
await shot('pre-venda');

// ── 7. Aluguel ──
await go('/aluguel');
const datas = p.locator('input[type=date]');
await datas.nth(0).fill('2026-10-24'); await datas.nth(1).fill('2026-10-25');
const arco = p.locator('article').first();
ok((await arco.locator('[data-livre]').getAttribute('data-livre')) === '1', 'arco dourado: 1 livre (outro já reservado)');
await arco.getByRole('button', { name: /Reservar/ }).click(); await p.waitForTimeout(200); await fecharCarrinho();
ok((await arco.locator('[data-livre]').getAttribute('data-livre')) === '0', 'após reservar, arco fica indisponível na data');
await shot('aluguel');
const pedMix = await checkout({ nome: 'Duda Mix', pag: 'Cartão' });
s = await st();
ok(s.vendidos['natal-2026'] === 47 + 2, 'pré-venda vendidos +2');
ok(s.reservas.some((r) => r.pecaId === 'arco-dourado' && r.pedido === pedMix), 'reserva de aluguel gravada');

// ── 10. Corporativo ──
await go('/corporativo');
ok((await p.locator('[data-mensal]').getAttribute('data-mensal')) === '3665', 'corporativo: R$ 3.665/mês (920 × 4,33 − 8%)');
await p.getByPlaceholder('00.000.000/0000-00').fill('11222333000181');
await p.getByRole('button', { name: 'Buscar' }).click(); await p.waitForTimeout(3000);
const msgCnpj = await p.locator('p.text-xs.text-salvia, p.text-xs.text-rosa').first().innerText().catch(() => '');
ok(msgCnpj.length > 0, 'consulta de CNPJ responde: ' + msgCnpj.slice(0, 60));
const cf = p.locator('form input.campo');
if (!(await cf.nth(1).inputValue())) await cf.nth(1).fill('Clínica Bela Vida Ltda');
if (!(await cf.nth(2).inputValue())) await cf.nth(2).fill('Clínica Bela Vida');
await cf.nth(3).fill('Marta'); await cf.nth(4).fill('fin@belavida.com');
await shot('corporativo');
await p.getByRole('button', { name: 'Solicitar proposta' }).click(); await p.waitForTimeout(300);
s = await st(); ok(s.contratos?.length === 1 && s.contratos[0].mensal === 3665, 'contrato corporativo criado');

// ── Admin ──
await go('/admin/login');
await p.locator('input[type=email]').fill('rafaelsoaresdecor@gmail.com'); await p.locator('input[type=password]').fill(process.env.ADMIN_PASSWORD ?? 'atelier2026');
await p.getByRole('button', { name: /Entrar/ }).click(); await p.waitForURL(base + '/admin'); await p.waitForTimeout(500);
await shot('admin-dashboard');
// 9. avaliação
await go('/admin/pedidos');
const linha = p.locator('.card-admin', { hasText: `#${pedCasamento}` });
await linha.locator('select').selectOption({ label: 'Entregue' });
const linkAval = linha.getByRole('link', { name: 'Pedir avaliação' });
ok(decodeURIComponent(await linkAval.getAttribute('href')).includes(`/avaliar/${pedCasamento}`), 'WhatsApp com link de avaliação');
const [popup] = await Promise.all([ctx.waitForEvent('page'), linkAval.click()]);
await popup.close();
s = await st(); ok(s.pedidos.find((x) => x.numero === pedCasamento).avaliacaoPedida, 'pedido marcado como avaliação pedida');
await shot('admin-pedidos');
await go(`/avaliar/${pedCasamento}`);
await p.getByRole('button', { name: '5 estrelas' }).click();
await p.locator('textarea').fill('Buquê perfeito, durou dez dias e todo mundo elogiou!');
await p.locator('input[type=file]').setInputFiles(new URL('./flor.png', import.meta.url).pathname); await p.waitForTimeout(500);
ok(await p.getByAltText('Prévia da foto enviada').isVisible(), 'foto carregada com prévia');
await shot('avaliar');
await p.getByRole('button', { name: 'Enviar avaliação' }).click(); await p.waitForTimeout(300);
ok(await p.getByRole('link', { name: /Avaliar no Google/ }).isVisible(), 'nota 5 recebe convite para o Google');
await shot('avaliar-obrigado', false);
await go('/admin/avaliacoes');
await p.getByRole('button', { name: 'Aprovar e publicar' }).click();
await shot('admin-avaliacoes');
await go('/');
await p.getByRole('button', { name: 'Avaliação 1', exact: true }).click(); await p.waitForTimeout(300);
ok(await p.getByText('Buquê perfeito, durou dez dias').isVisible(), 'avaliação aprovada aparece no carrossel da home');
await p.getByText('Muito além do').scrollIntoViewIfNeeded(); await shot('home-servicos', false);
// 1. memórias
await go('/admin/memorias');
ok(await p.getByText('Ana Noiva').isVisible(), 'memórias lista o aniversário da Ana');
await shot('admin-memorias');
// 5. parceiros admin
await go('/admin/parceiros');
const ind = p.locator('tr', { hasText: `#${pedWork}` });
await ind.getByRole('button', { name: 'Marcar pago' }).click();
s = await st(); ok(s.indicacoes.find((i) => i.pedido === pedWork).pago, 'comissão marcada como paga');
await shot('admin-parceiros');
// 6. capacidade e lista de espera
await go('/admin/servicos');
await p.getByLabel('Capacidade Natal 2026').fill('49'); await p.waitForTimeout(200);
s = await st(); ok(s.capacidades['natal-2026'] === 49, 'capacidade ajustada no admin');
await go('/pre-venda');
const natal2 = p.locator('article').first();
ok(await natal2.getByText('Esgotado').isVisible(), 'pré-venda esgota quando capacidade = vendidos');
await natal2.getByRole('button', { name: 'Entrar na lista de espera' }).click();
await natal2.getByPlaceholder('Seu nome').fill('Elisa Espera'); await natal2.getByPlaceholder('WhatsApp').fill('21966665555');
await natal2.getByRole('button', { name: 'Avise-me se abrir vaga' }).click();
ok(await p.getByText(/Você está na lista/).isVisible(), 'entrou na lista de espera');
await shot('pre-venda-esgotado', false);
await go('/admin/servicos');
ok(await p.getByText('1. Elisa Espera').isVisible(), 'admin vê a lista de espera');
await shot('admin-servicos-prevenda');
const esperado = { Aluguel: 'Duda Mix', Workshops: 'Carla Workshop', Consultorias: 'Ana Consultoria', Propostas: 'Ana e Bruno', 'Preservação': 'Bloco de resina cristal' };
for (const [aba, txt] of Object.entries(esperado)) {
  await p.getByRole('button', { name: aba, exact: true }).click(); await p.waitForTimeout(150);
  await shot('admin-servicos-' + aba.normalize('NFD').replace(/[^a-zA-Z]/g, '').toLowerCase());
  ok(await p.getByText(txt).first().isVisible(), `admin serviços › ${aba} mostra ${txt}`);
}
// 10. corporativo admin
await go('/admin/corporativo');
await p.getByLabel('Status do contrato').selectOption('Ativo');
await p.getByRole('button', { name: 'Emitir fatura' }).click(); await p.waitForTimeout(200);
s = await st(); ok(s.faturas?.length === 1 && /^NFS-e/.test(s.faturas[0].nf), 'fatura emitida com NF ' + s.faturas?.[0]?.nf);
ok(await p.getByRole('button', { name: 'Faturado no mês ✓' }).isDisabled(), 'não fatura duas vezes no mês');
await shot('admin-corporativo');
await go('/admin/aparencia'); await shot('admin-aparencia');
// conta
await go('/conta');
ok(await p.getByText(/aniversário de casamento em/).isVisible(), 'minha conta mostra o aniversário de casamento');
await shot('conta');

// mobile: sem rolagem horizontal
const m = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
await m.addInitScript(() => { try { localStorage.setItem('popup-10', '1'); } catch {} });
const mp = await m.newPage();
mp.on('pageerror', (e) => errs.push(mp.url() + ' pageerror ' + e.message));
for (const path of ['/', '/simulador', '/consultoria', '/preservacao', '/pre-venda', '/aluguel', '/workshops', '/parceiros', '/corporativo', '/avaliar/1234', '/checkout', '/conta']) {
  await mp.goto(base + path, { waitUntil: 'networkidle' }); await mp.waitForTimeout(200);
  const sw = await mp.evaluate(() => document.documentElement.scrollWidth);
  ok(sw <= 390, `mobile ${path} largura ${sw}`);
}
await mp.goto(base + '/', { waitUntil: 'networkidle' }); await mp.getByRole('button', { name: 'Menu' }).click(); await mp.screenshot({ path: S + 'mobile-menu.png' });
await mp.goto(base + '/simulador', { waitUntil: 'networkidle' }); await mp.screenshot({ path: S + 'mobile-simulador.png', fullPage: true });
// desktop: dropdown de serviços
await go('/'); await p.getByRole('button', { name: 'Serviços ▾' }).hover(); await p.waitForTimeout(300); await shot('menu-servicos', false);

console.log('\nERROS:', errs.length ? errs.join('\n') : 'nenhum');
const falhas = res.filter((r) => !r[0]);
console.log(`\n${res.length - falhas.length}/${res.length} verificações ok`);
await b.close();
process.exit(falhas.length || errs.length ? 1 : 0);
