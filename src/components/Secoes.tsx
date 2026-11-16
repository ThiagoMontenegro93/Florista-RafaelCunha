'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Icone, RetratoRafael, SeloCera, Divisor } from './Ornamentos';
import { PetalasVivas, FitaDourada } from './Oficio';
import { PORTFOLIO, REVIEWS } from '@/data/portfolio';
import { PALETAS, PRODUTOS, type Produto } from '@/data/produtos';
import { ProductCard } from './ProductCard';
import { CustomizeModal } from './CustomizeModal';
import { DATAS_BLOQUEADAS } from '@/data/produtos';
import { waLink, cn } from '@/lib/format';
import { useAtelie } from '@/lib/store';
import { InstagramEmbed } from './InstagramEmbed';
import { FotoArranjo, Revelar } from './Foto';
import { FOTOS } from '@/data/fotos';

const VIDEO = process.env.NEXT_PUBLIC_HERO_VIDEO_URL;

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* aurora dourada + grade fina */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -left-40 -top-40 h-[560px] w-[560px] animate-aurora rounded-full bg-ouro/20 blur-[120px]" />
        <div className="absolute -right-32 top-24 h-[480px] w-[480px] animate-aurora rounded-full bg-rosa/10 blur-[120px] [animation-delay:-6s]" />
        <div className="grade absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      </div>
      <PetalasVivas />
      <div className="secao relative grid items-center gap-14 pb-12 pt-10 lg:grid-cols-[1.08fr_1fr] lg:pb-20 lg:pt-16">
        <div className="animate-surgir">
          <p className="kicker">Alta floricultura · Rio de Janeiro</p>
          <h1 className="mt-6 font-serif text-[56px] font-light leading-[0.9] sm:text-[80px] xl:text-[96px]">
            Flores que <br /><em className="texto-ouro font-light">guardam memórias</em>
          </h1>
          <FitaDourada className="-mt-1 h-8 w-[min(380px,80vw)] sm:h-10 sm:w-[440px]" />
          <p className="mt-7 max-w-lg text-[16px] leading-relaxed text-marrom/70">Buquês de noiva, igrejas e mesas assinadas, feitos à mão no ateliê com flores brasileiras da estação e sem espuma floral. Do primeiro rascunho ao último laço, quem cuida é o Rafael.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/loja" className="btn-ouro !px-8 !py-3.5">Encomendar flores</Link>
            <Link href="/portfolio" className="btn-linha !py-3.5">Ver celebrações reais</Link>
          </div>
          <div className="mt-10 flex items-center gap-4 border-t border-ouro/20 pt-6">
            <RetratoRafael size={64} foto={FOTOS.rafael} />
            <div>
              <p className="font-script text-3xl leading-none text-champanhe">Rafael Cunha</p>
              <p className="mt-1 text-sm text-marrom/70">Florista oficial da Casa e Capela Santa Ignêz</p>
            </div>
            <div className="ml-auto hidden text-right sm:block">
              <p className="tracking-[0.2em] text-champanhe">★★★★★</p>
              <p className="text-xs text-marrom/60">4.9 no Google · 320 celebrações</p>
            </div>
          </div>
        </div>

        {/* janela em arco: foto/vídeo real do ateliê ou a arte do buquê assinatura */}
        <div className="relative mx-auto w-full max-w-[460px] animate-surgir [animation-delay:.15s]">
          <div className="absolute -inset-4 rounded-t-[999px] rounded-b-[40px] border border-ouro/30" aria-hidden />
          <div className="relative overflow-hidden rounded-t-[999px] rounded-b-[32px] p-[1.5px] shadow-suave">
            <div className="absolute -inset-1/2 animate-girar [background:conic-gradient(from_0deg,transparent_0%,#EED9A8_10%,transparent_25%,transparent_50%,#C9A35F_60%,transparent_75%)]" aria-hidden />
            <div className="group relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[30px]">
              {VIDEO ? (
                <video src={VIDEO} autoPlay muted loop playsInline className="h-full w-full object-cover" aria-label="Rafael decorando a Casa e Capela Santa Ignêz" />
              ) : (
                <FotoArranjo imagem={FOTOS.hero} prioridade alt="Buquê assinatura do ateliê: lírios amarelos, hortênsias azuis e eucalipto" seed="hero-assinatura" flores={['hortensia-azul', 'lirio-amarelo', 'rosa', 'eucalipto']} paleta="Amarelo+Azul assinatura" forma="buque" fundo={['#FFF8EE', '#F1DDC4']} className="h-full w-full" />
              )}
            </div>
          </div>
          <SeloCera size={84} className="absolute -right-3 top-16 rotate-12 sm:-right-8" />
          <a href="https://www.instagram.com/florista.rafaelcunha/" target="_blank" rel="noreferrer" className="moldura absolute -left-3 bottom-10 flex items-center gap-3 bg-creme/95 px-4 py-3 transition hover:-translate-y-0.5 sm:-left-10">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-ouro/30 to-transparent text-champanhe"><Icone nome="instagram" /></span>
            <span className="text-left leading-tight"><span className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-champanhe"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rosa" />Reel real</span><span className="font-serif text-lg text-marrom">Santa Ignêz · arco branco</span></span>
          </a>
          <div className="moldura absolute -right-2 bottom-24 hidden bg-creme/95 px-4 py-3 text-center sm:block lg:-right-6">
            <p className="texto-ouro font-serif text-3xl leading-none">0%</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-marrom/60">espuma floral</p>
          </div>
        </div>
      </div>
      <div className="secao relative pb-12"><ConsulteData /></div>
      <Numeros />
      <PromessasEntrega />
    </section>
  );
}

export function Numeros() {
  const itens = [['320', 'celebrações reais'], ['4.9★', 'no Google'], ['92', 'municípios do RJ'], ['0%', 'espuma floral']];
  return (
    <div className="secao relative grid grid-cols-2 gap-px overflow-hidden rounded-moldura border border-ouro/15 bg-ouro/10 md:grid-cols-4">
      {itens.map(([n, t]) => (
        <div key={t} className="bg-creme/90 px-6 py-7 text-center backdrop-blur">
          <p className="texto-ouro font-serif text-5xl font-light">{n}</p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-marrom/50">{t}</p>
        </div>
      ))}
    </div>
  );
}

export function ConsulteData() {
  const [r, setR] = useState<null | { livre: boolean; msg: string }>(null);
  const [f, setF] = useState({ nome: '', data: '', local: 'Casa e Capela Santa Ignêz', tipo: 'Casamento' });
  const verificar = (e: React.FormEvent) => {
    e.preventDefault();
    const b = DATAS_BLOQUEADAS.find((d) => d.data === f.data);
    setR(b ? { livre: false, msg: 'Essa data já tem uma celebração reservada. Fale com o Rafael para ver se cabe mais uma em outra cidade.' } : { livre: true, msg: 'Data disponível! Reserve agora com o Rafael pelo WhatsApp.' });
  };
  return (
    <form onSubmit={verificar} className="moldura relative grid gap-6 bg-creme/95 p-6 lg:grid-cols-[230px_1fr] lg:items-center lg:p-8" id="consulte">
      <div>
        <p className="kicker">Agenda {new Date().getFullYear()}/{new Date().getFullYear() + 1}</p>
        <h2 className="mt-2 text-4xl leading-none">Consulte <em className="texto-ouro">sua data</em></h2>
        <p className="mt-2 text-xs text-marrom/60">Mais de 300 casamentos realizados no Rio de Janeiro</p>
      </div>
      <div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[1.2fr_1fr_1.2fr_1fr_auto] xl:items-end">
          <div><label className="rotulo" htmlFor="cd-nome">Nome</label><input id="cd-nome" required className="campo" value={f.nome} onChange={(e) => setF({ ...f, nome: e.target.value })} placeholder="Como podemos te chamar?" /></div>
          <div><label className="rotulo" htmlFor="cd-data">Data do evento</label><input id="cd-data" type="date" required className="campo" value={f.data} onChange={(e) => setF({ ...f, data: e.target.value })} /></div>
          <div><label className="rotulo" htmlFor="cd-local">Local</label>
            <select id="cd-local" className="campo" value={f.local} onChange={(e) => setF({ ...f, local: e.target.value })}><option>Casa e Capela Santa Ignêz</option><option>Solar Real</option><option>Outro no RJ</option></select></div>
          <div><label className="rotulo" htmlFor="cd-tipo">Tipo</label>
            <select id="cd-tipo" className="campo" value={f.tipo} onChange={(e) => setF({ ...f, tipo: e.target.value })}><option>Igreja</option><option>Casamento</option><option>Namorados</option><option>Centro Mesa</option></select></div>
          <button className="btn-ouro w-full sm:col-span-2 xl:col-span-1 xl:w-auto">Verificar disponibilidade</button>
        </div>
        {r && (
          <div className={cn('mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl p-3 text-sm animate-surgir', r.livre ? 'border border-salvia/30 bg-salvia/10 text-folha' : 'border border-rosa/30 bg-rosa/10 text-rosa')}>
            {r.msg}
            <a className="font-medium underline" target="_blank" rel="noreferrer" href={waLink(`Olá Rafael, sou ${f.nome}. Quero reservar ${f.data.split('-').reverse().join('/')} · ${f.tipo} · ${f.local}.`)}>Falar no WhatsApp →</a>
          </div>
        )}
      </div>
    </form>
  );
}

export function PromessasEntrega() {
  const itens = [
    { i: 'tesoura' as const, t: 'Feito sob encomenda', d: 'Flores frescas, cortadas para você' },
    { i: 'caminhao' as const, t: 'Entrega a combinar', d: 'Horário e local pelo WhatsApp' },
    { i: 'camera' as const, t: 'Foto antes de entregar', d: 'Você aprova antes de sair' },
    { i: 'cadeado' as const, t: 'Pagamento seguro', d: 'Pix, cartão ou sinal 50%' },
  ];
  return (
    <div className="mt-10 border-y border-ouro/15 bg-veu/30 backdrop-blur">
      <div className="secao grid grid-cols-2 gap-6 py-6 md:grid-cols-4">
        {itens.map((x) => (
          <div key={x.t} className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-champanhe/30 bg-gradient-to-br from-ouro/20 to-transparent text-champanhe shadow-brilho"><Icone nome={x.i} /></span>
            <div><p className="text-sm font-medium">{x.t}</p><p className="text-xs text-marrom/60">{x.d}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BuscaInteligente({ compacta = false }: { compacta?: boolean }) {
  const router = useRouter();
  const [o, setO] = useState('');
  const [p, setP] = useState('');
  const [max, setMax] = useState(800);
  const ir = () => router.push(`/loja?ocasiao=${encodeURIComponent(o)}&paleta=${encodeURIComponent(p)}&max=${max}`);
  return (
    <div className={cn('moldura grid gap-4 p-5 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end', compacta && 'shadow-none')}>
      <div><label className="rotulo">Ocasião</label>
        <select className="campo" value={o} onChange={(e) => setO(e.target.value)}><option value="">Todas</option>{['Namorados', 'Noiva', 'Centro Mesa', 'Casamento', 'Igreja', 'Aniversário'].map((x) => <option key={x}>{x}</option>)}</select></div>
      <div><label className="rotulo">Paleta</label>
        <select className="campo" value={p} onChange={(e) => setP(e.target.value)}><option value="">Todas</option>{PALETAS.map((x) => <option key={x.nome}>{x.nome}</option>)}</select></div>
      <div><label className="rotulo">Orçamento até R$ {max}</label>
        <input type="range" min={150} max={3000} step={50} value={max} onChange={(e) => setMax(+e.target.value)} className="w-full accent-ouro" /></div>
      <button className="btn-ouro" onClick={ir}>Encontrar flores</button>
    </div>
  );
}

export function PortfolioGrid({ limite }: { limite?: number }) {
  return (
    <div className="grid gap-x-10 gap-y-14 md:grid-cols-2">
      {PORTFOLIO.slice(0, limite).map((p, i) => {
        const foto = p.imagem || FOTOS[p.id];
        return (
          <Revelar as="article" key={p.id} atraso={(i % 2) * 120} className={cn('group', i % 2 === 1 && 'md:mt-24')}>
            <div className="moldura relative overflow-hidden p-2.5">
              <FotoArranjo imagem={foto} alt={`${p.titulo} — ${p.local}`} seed={p.id} flores={p.flores} paleta={p.paleta} forma={p.forma} fundo={p.gradiente as [string, string]} className="aspect-[4/5] rounded-[26px]" />
              <div className="pointer-events-none absolute inset-x-2.5 bottom-2.5 rounded-b-[26px] bg-gradient-to-t from-overlay/60 via-overlay/15 to-transparent p-6 pt-20 text-white">
                <p className="text-[10px] uppercase tracking-[0.35em] text-white/85">{p.tipo} · {p.data}</p>
                <p className="mt-1 font-serif text-2xl text-white">{p.local}</p>
              </div>
              {!foto && <span className="etiqueta absolute right-5 top-5" title="A foto real deste evento entra aqui">Ilustração</span>}
            </div>
            <div className="mt-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-3xl transition group-hover:text-champanhe">{p.titulo}</h3>
                <p className="mt-1 max-w-md text-sm text-marrom/60">{p.descricao}</p>
              </div>
              <span className="font-serif text-4xl text-ouro/40">{String(i + 1).padStart(2, '0')}</span>
            </div>
            {'instagram' in p && p.instagram && <a href={p.instagram} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm text-ouro underline underline-offset-4">ver post original</a>}
          </Revelar>
        );
      })}
    </div>
  );
}

export function LojaGrid({ produtos = PRODUTOS }: { produtos?: Produto[] }) {
  const [sel, setSel] = useState<Produto | null>(null);
  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {produtos.map((p) => <ProductCard key={p.id} p={p} onPersonalizar={setSel} />)}
      </div>
      {produtos.length === 0 && <p className="py-16 text-center text-marrom/60">Nenhum arranjo com esses filtros. Que tal pedir um sob medida no <Link href="/orcamento" className="text-ouro underline">orçamento</Link>?</p>}
      {sel && <CustomizeModal produto={sel} onClose={() => setSel(null)} />}
    </>
  );
}

export function Confianca() {
  const { avaliacoes } = useAtelie();
  // avaliações aprovadas no admin entram no carrossel junto com as do Google
  const lista = [...avaliacoes.filter((a) => a.aprovada).map((a) => ({ nome: a.nome, nota: a.nota, texto: a.texto, quando: `Pedido #${a.pedido}`, foto: a.foto })), ...REVIEWS.map((r) => ({ ...r, foto: undefined as string | undefined }))];
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((x) => (x + 1) % lista.length), 5000); return () => clearInterval(t); }, [lista.length]);
  const r = lista[i % lista.length];
  return (
    <section className="secao py-20">
      <p className="kicker text-center">Quem confia no ateliê</p>
      <div className="relative mt-8 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
        <div className="flex w-max animate-marquee gap-14 whitespace-nowrap font-serif text-3xl font-light tracking-[0.3em] text-marrom/40">
          {[0, 1].map((k) => (
            <div key={k} className="flex gap-14">{['SANTA IGNÊZ', 'SOLAR REAL', 'VILLA RICA', 'SÃO JUDAS', 'JARDIM BÚZIOS', 'HOTEL SERRA VERDE'].map((v) => <span key={v} className="flex items-center gap-14">{v}<span className="text-ouro">✦</span></span>)}</div>
          ))}
        </div>
      </div>
      <Divisor className="my-10" />
      <div className="mx-auto max-w-2xl text-center">
        <p className="tracking-[0.3em] text-champanhe">{'★'.repeat(r.nota)}{'☆'.repeat(5 - r.nota)} <span className="text-sm text-marrom/60">· Google 4.9 · 300+ casamentos</span></p>
        <blockquote key={i} className="mt-5 animate-surgir font-serif text-3xl font-light italic leading-snug text-marrom/90 sm:text-4xl">“{r.texto}”</blockquote>
        {/* eslint-disable-next-line @next/next/no-img-element -- foto em data URL enviada pela cliente */}
        {r.foto && <img src={r.foto} alt={`Flores de ${r.nome}`} className="mx-auto mt-4 h-28 w-28 rounded-full border border-ouro/40 object-cover" />}
        <p className="mt-3 text-sm text-marrom/70">{r.nome} · {r.quando}</p>
        <div className="mt-4 flex justify-center gap-2">
          {lista.map((_, k) => <button key={k} onClick={() => setI(k)} aria-label={`Avaliação ${k + 1}`} className={cn('h-1.5 w-1.5 rounded-full transition-all', k === i ? 'w-6 bg-champanhe' : 'bg-realce/15')} />)}
        </div>
      </div>
      <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
        {([['folha', 'Arranjos sem espuma floral', 'Sustentável de verdade'], ['aneis', '320 noivas felizes', 'Celebrações reais'], ['relogio', 'Entrega em 3h combinada', 'No horário que você escolher'], ['cadeado', 'Mercado Pago Seguro', 'Pix e cartão parcelado']] as const).map(([e, t, d], k) => (
          <Revelar key={t} atraso={k * 90} className="moldura p-6 text-center transition hover:-translate-y-1 hover:shadow-brilho">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-champanhe/30 bg-gradient-to-br from-ouro/20 to-transparent text-champanhe"><Icone nome={e} className="h-6 w-6" /></span>
            <p className="mt-3 font-serif text-xl leading-tight">{t}</p><p className="mt-1 text-xs text-marrom/60">{d}</p>
          </Revelar>
        ))}
      </div>
    </section>
  );
}

export function Sobre() {
  return (
    <section className="relative overflow-hidden border-y border-ouro/10 bg-[radial-gradient(ellipse_at_left,rgba(201,163,95,.12),transparent_60%)] py-24" id="sobre">
      <div className="secao grid items-center gap-10 md:grid-cols-[auto_1fr]">
        <RetratoRafael size={220} foto={FOTOS.rafael} />
        <div>
          <p className="kicker">Sobre o ateliê</p>
          <h2 className="titulo-secao mt-3">Arquitetura emocional <em className="texto-ouro">com flores</em></h2>
          <p className="mt-4 max-w-2xl text-marrom/80">Cada celebração começa com uma conversa. Eu escuto a história do casal, a luz da capela, o tom da toalha, e desenho flores que guardam aquele momento. Foram 320 celebrações reais, da Casa e Capela Santa Ignêz ao Solar Real, sempre com flores brasileiras da estação e sem espuma floral.</p>
          <p className="mt-4 font-script text-5xl text-champanhe">Rafael Cunha</p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <a className="btn-linha" href="mailto:rafaelsoaresdecor@gmail.com">rafaelsoaresdecor@gmail.com</a>
            <a className="btn-whats" target="_blank" rel="noreferrer" href={waLink('Olá Rafael! Vim pelo site do ateliê.')}>WhatsApp</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function InstagramVivo() {
  return (
    <section className="secao grid items-center gap-10 py-20 md:grid-cols-2">
      <div>
        <p className="kicker">Instagram ao vivo</p>
        <h2 className="titulo-secao mt-2">@florista.rafaelcunha</h2>
        <p className="mt-4 text-marrom/75">Lírios amarelos, hortênsias azuis e orquídeas roxas: a paleta assinatura nasceu deste post no Solar Real. Acompanhe os bastidores de cada celebração.</p>
        <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
          {([['regador', 'Blog de cuidados', '/cuidados/bouquet-solar-luz'], ['flor', 'Flores da estação', '/flores'], ['calendario', 'Agenda aberta', '/agenda']] as const).map(([e, t, h]) => (
            <Link key={t} href={h} className="moldura p-4 text-center transition hover:-translate-y-1 hover:shadow-brilho"><Icone nome={e} className="mx-auto h-6 w-6 text-champanhe" /><p className="mt-2">{t}</p></Link>
          ))}
        </div>
      </div>
      <InstagramEmbed className="mx-auto w-full max-w-md" />
    </section>
  );
}
