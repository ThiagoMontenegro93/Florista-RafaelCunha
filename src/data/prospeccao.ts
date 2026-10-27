export type StatusLead = 'Novo' | 'Contatado' | 'Respondeu' | 'Reunião' | 'Fechado' | 'Sem interesse';
export type Nicho = 'Casa de Show' | 'Casa de Festa' | 'Igreja' | 'Empresa' | 'Hotel' | 'Buffet';
export type Fonte = 'CNPJ' | 'Google Maps' | 'GitHub' | 'Manual' | 'CSV';

export type Lead = {
  id: number; nome: string; nicho: Nicho; cidade: string; responsavel: string; email: string;
  whatsapp: string; instagram: string; status: StatusLead; ultimoContato: string | null; score: number;
  fonte: Fonte; cnpj?: string; rating?: number;
};

const base: Omit<Lead, 'id'>[] = [
  { nome: 'Solar Real', nicho: 'Casa de Festa', cidade: 'Rio de Janeiro', responsavel: 'Marcela Duarte', email: 'eventos@solarreal.com.br', whatsapp: '(21) 98888-1010', instagram: '@solarreal', status: 'Fechado', ultimoContato: '2026-10-10', score: 96, fonte: 'CNPJ', cnpj: '12.345.678/0001-90', rating: 4.9 },
  { nome: 'Casa e Capela Santa Ignêz', nicho: 'Igreja', cidade: 'Rio de Janeiro', responsavel: 'Pe. Antônio', email: 'contato@santaignez.com.br', whatsapp: '(21) 97777-2020', instagram: '@santaignez', status: 'Respondeu', ultimoContato: '2026-10-16', score: 94, fonte: 'Google Maps', rating: 4.8 },
  { nome: 'Villa Rica', nicho: 'Casa de Festa', cidade: 'Rio de Janeiro', responsavel: 'Bruno Lima', email: 'comercial@villarica.com.br', whatsapp: '(21) 96666-3030', instagram: '@villaricarj', status: 'Reunião', ultimoContato: '2026-10-15', score: 88, fonte: 'Google Maps', rating: 4.7 },
  { nome: 'Igreja São Judas Tadeu', nicho: 'Igreja', cidade: 'Niterói', responsavel: 'Secretaria', email: 'secretaria@saojudasniteroi.org', whatsapp: '(21) 95555-4040', instagram: '@saojudasnit', status: 'Contatado', ultimoContato: '2026-10-14', score: 81, fonte: 'CNPJ', rating: 4.6 },
  { nome: 'Empresa XYZ Eventos', nicho: 'Empresa', cidade: 'Rio de Janeiro', responsavel: 'Carla Souza', email: 'carla@xyzeventos.com', whatsapp: '(21) 94444-5050', instagram: '@xyzeventos', status: 'Novo', ultimoContato: null, score: 63, fonte: 'CSV' },
  { nome: 'Hotel Serra Verde', nicho: 'Hotel', cidade: 'Petrópolis', responsavel: 'Ricardo Alves', email: 'eventos@serraverde.com.br', whatsapp: '(24) 99999-6060', instagram: '@hotelserraverde', status: 'Novo', ultimoContato: null, score: 77, fonte: 'Google Maps', rating: 4.5 },
  { nome: 'Casa de Show Lapa Nobre', nicho: 'Casa de Show', cidade: 'Rio de Janeiro', responsavel: 'Diego Prado', email: 'booking@lapanobre.com', whatsapp: '(21) 93333-7070', instagram: '@lapanobre', status: 'Sem interesse', ultimoContato: '2026-10-01', score: 40, fonte: 'GitHub' },
  { nome: 'Buffet Encanto Real', nicho: 'Buffet', cidade: 'Duque de Caxias', responsavel: 'Sônia Reis', email: 'sonia@encantoreal.com.br', whatsapp: '(21) 92222-8080', instagram: '@buffetencantoreal', status: 'Contatado', ultimoContato: '2026-10-12', score: 72, fonte: 'CNPJ', cnpj: '23.456.789/0001-01' },
  { nome: 'Espaço Jardim Búzios', nicho: 'Casa de Festa', cidade: 'Armação dos Búzios', responsavel: 'Luana Melo', email: 'luana@jardimbuzios.com', whatsapp: '(22) 99111-9090', instagram: '@jardimbuzios', status: 'Novo', ultimoContato: null, score: 85, fonte: 'Google Maps', rating: 4.9 },
  { nome: 'Igreja Santa Clara', nicho: 'Igreja', cidade: 'Rio de Janeiro', responsavel: 'Paróquia', email: 'paroquia@santaclararj.org', whatsapp: '(21) 3333-1212', instagram: '@santaclararj', status: 'Novo', ultimoContato: null, score: 79, fonte: 'Google Maps', rating: 4.8 },
  { nome: 'Hotel Mar de Cabo Frio', nicho: 'Hotel', cidade: 'Cabo Frio', responsavel: 'Fábio Nunes', email: 'eventos@hotelmar.com.br', whatsapp: '(22) 98111-1313', instagram: '@hotelmarcf', status: 'Respondeu', ultimoContato: '2026-10-13', score: 74, fonte: 'Manual' },
  { nome: 'Casa Teresópolis Eventos', nicho: 'Casa de Festa', cidade: 'Teresópolis', responsavel: 'Helena Costa', email: 'helena@casatere.com.br', whatsapp: '(21) 97111-1414', instagram: '@casatere', status: 'Novo', ultimoContato: null, score: 70, fonte: 'CNPJ', cnpj: '34.567.890/0001-12' },
];

export const LEADS: Lead[] = base.map((l, i) => ({ id: i + 1, ...l }));

export const STATS_PROSPECCAO = {
  totalLeads: 1247, enviadosHoje: 87, limiteDiario: 400, taxaResposta: 23, parceriasFechadas: 12,
  porCanal: [
    { canal: 'Email', pct: 45 }, { canal: 'WhatsApp', pct: 30 }, { canal: 'Instagram', pct: 15 },
    { canal: 'Telegram', pct: 5 }, { canal: 'LinkedIn', pct: 5 },
  ],
};

export const TEMPLATES = [
  { id: 'igrejas', nome: 'Parceria Igrejas (romântico)', texto: 'Olá {nome}, sou Rafael Cunha, designer floral com 320 celebrações na Casa e Capela Santa Ignêz e no Solar Real. Vi que a {empresa} recebe casamentos lindos e adoraria apresentar meu portfólio: {portfolio_link}. Posso enviar uma proposta de parceria para noivas da {empresa}?\n\nCom carinho,\nRafael Cunha · Ateliê Floral\n\nSe não quiser receber mensagens, responda SAIR.' },
  { id: 'casas-festa', nome: 'Casas de Festa (proposta)', texto: 'Oi {nome}! Aqui é o Rafael Cunha, florista oficial da Casa e Capela Santa Ignêz. Trabalho com {nicho} em todo o RJ e tenho uma proposta de comissão para indicações da {empresa}. Portfólio: {portfolio_link}\n\nPara não receber mais, responda SAIR.' },
  { id: 'empresas', nome: 'Empresas (assinatura corporativa)', texto: 'Olá {nome}, tudo bem? Sou Rafael Cunha, designer floral. Recepções com flores frescas toda semana mudam a percepção de quem chega à {empresa}. Nosso plano Eterno inclui consultoria de harmonização. Posso mandar fotos? {portfolio_link}\n\nDescadastro: responda SAIR.' },
];

export const CNAES = [
  { codigo: '8230-0/02', nome: 'Casas de festas e eventos' },
  { codigo: '5620-1/02', nome: 'Serviços de alimentação para eventos (Buffet)' },
  { codigo: '9491-0/00', nome: 'Atividades de organizações religiosas (Igrejas)' },
  { codigo: '9001-9/02', nome: 'Produção musical (casas de show)' },
  { codigo: '8230-0/01', nome: 'Organização de feiras, congressos e exposições' },
];

export const REPOS_GITHUB = [
  { repo: 'brightmore/geoleadscraper', estrelas: 412, descricao: 'Extensão Chrome gratuita que exporta leads do Google Maps em CSV/Excel, sem API key.', snippet: 'git clone https://github.com/brightmore/geoleadscraper\n# carregue a pasta em chrome://extensions (modo desenvolvedor)\n# exporte o CSV e use "Importar CSV" em Leads' },
  { repo: 'gmapsscraper/google-maps-scraper', estrelas: 1830, descricao: 'Scraper com mais de 30 campos para Chrome/Edge, gratuito.', snippet: 'git clone https://github.com/gmapsscraper/google-maps-scraper\nnpm install\nnpm run export -- --format csv' },
  { repo: 'hamzadams/gmapprospect', estrelas: 267, descricao: 'Scraper do Google Maps com mini CRM estilo swipe.', snippet: 'git clone https://github.com/hamzadams/gmapprospect\nnpm install && npm start\n# Export > CSV > Importar em Leads' },
  { repo: 'plasdigital/prospeccao-kit-aluno', estrelas: 158, descricao: 'Kit com tutorial de ativação da Places API (New).', snippet: 'git clone https://github.com/plasdigital/prospeccao-kit-aluno\n# siga o README para ativar a Places API (New)' },
];

export const INBOX = [
  { id: 1, canal: 'Email', de: 'Casa e Capela Santa Ignêz', assunto: 'Re: Portfólio Rafael Cunha', trecho: 'Recebemos o portfólio, vamos avaliar com o padre e retornamos.', status: 'Aguardando', quando: 'há 2h' },
  { id: 2, canal: 'WhatsApp', de: 'Villa Rica', assunto: '', trecho: 'Podemos marcar uma reunião quinta às 15h?', status: 'Reunião', quando: 'há 5h' },
  { id: 3, canal: 'Instagram', de: '@jardimbuzios', assunto: '', trecho: 'Amamos seu trabalho! Qual o valor do arco?', status: 'Respondeu', quando: 'ontem' },
  { id: 4, canal: 'Email', de: 'Hotel Mar de Cabo Frio', assunto: 'Parceria', trecho: 'Temos 4 casamentos em dezembro, podemos conversar?', status: 'Respondeu', quando: 'ontem' },
  { id: 5, canal: 'Telegram', de: 'Lapa Nobre', assunto: '', trecho: 'Não temos interesse no momento.', status: 'Sem interesse', quando: 'há 3 dias' },
];

export const ASSINANTES = [
  { nome: 'Marina Torres', plano: 'Encanto', ciclo: 30, proxima: '2026-10-18', status: 'Ativa', valor: 480, whatsapp: '5521988880001' },
  { nome: 'Escritório Duarte Advogados', plano: 'Eterno', ciclo: 30, proxima: '2026-10-17', status: 'Ativa', valor: 750, whatsapp: '5521988880002' },
  { nome: 'Ana Paula Ribeiro', plano: 'Essencial', ciclo: 45, proxima: '2026-10-25', status: 'Ativa', valor: 406, whatsapp: '5521988880003' },
  { nome: 'Igreja São Judas', plano: 'Eterno', ciclo: 60, proxima: '2026-11-02', status: 'Ativa', valor: 1350, whatsapp: '5521988880004' },
  { nome: 'Clara Mendes', plano: 'Encanto', ciclo: 60, proxima: '—', status: 'Pausada', valor: 864, whatsapp: '5521988880005' },
  { nome: 'Rodrigo Farias', plano: 'Essencial', ciclo: 30, proxima: '—', status: 'Cancelada', valor: 290, whatsapp: '5521988880006' },
];
