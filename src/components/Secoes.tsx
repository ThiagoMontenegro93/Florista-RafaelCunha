'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Icone, RetratoRafael, Petalas, SeloCera, Divisor } from './Ornamentos';
import { PORTFOLIO, REVIEWS } from '@/data/portfolio';
import { PALETAS, PRODUTOS, type Produto } from '@/data/produtos';
import { ProductCard } from './ProductCard';
import { CustomizeModal } from './CustomizeModal';
import { DATAS_BLOQUEADAS } from '@/data/produtos';
import { waLink, cn } from '@/lib/format';
import { useAtelie } from '@/lib/store';
import { InstagramEmbed } from './InstagramEmbed';

const VIDEO = process.env.NEXT_PUBLIC_HERO_VIDEO_URL;

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* aurora dourada + grade futurista */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -left-40 -top-40 h-[560px] w-[560px] animate-aurora rounded-full bg-ouro/20 blur-[120px]" />
        <div className="absolute -right-32 top-24 h-[480px] w-[480px] animate-aurora rounded-full bg-rosa/10 blur-[120px] [animation-delay:-6s]" />
        <div className="grade absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      </div>
      <Petalas />
      <div className="secao relative grid items-center gap-12 py-14 lg:grid-cols-[1.3fr_1fr] lg:py-24">
        <div className="grid items-center gap-10 md:grid-cols-[230px_1fr]">
          {/* Vídeo vertical (reel real da Santa Ignêz) com anel dourado girando */}
          <div className="relative mx-auto w-56 overflow-hidden rounded-moldura p-[1.5px] shadow-brilho md:w-full">
            <div className="absolute -inset-1/2 animate-girar [background:conic-gradient(from_0deg,transparent_0%,#EED9A8_10%,transparent_25%,transparent_50%,#C9A35F_60%,transparent_75%)]" aria-hidden />
            <div className="relative aspect-[9/16] overflow-hidden rounded-[30px] bg-creme">
              {VIDEO ? (
                <video src={VIDEO} autoPlay muted loop playsInline className="h-full w-full object-cover" aria-label="Rafael decorando a Casa e Capela Santa Ignêz" />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_50%_30%,rgba(238,217,168,.25),transparent_60%),linear-gradient(180deg,rgb(var(--halo)),rgb(var(--creme)))] p-4 text-center">
                  <span className="text-6xl drop-shadow-[0_0_20px_rgba(238,217,168,.5)]">⛪</span>
                  <span className="font-serif text-lg leading-tight text-champanhe">Santa Ignêz<br /><em className="text-marrom/60">arco branco · 27/09</em></span>
                  <a href="https://www.instagram.com/florista.rafaelcunha/" target="_blank" rel="noreferrer" className="text-[11px] tracking-wider text-ouro underline underline-offset-4">ver reel no Instagram</a>
                </div>
              )}
              <span className="etiqueta absolute bottom-3 left-3"><span className="mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-rosa" />Reel real</span>
            </div>
          </div>
          <div>
            <p className="kicker">Viver com flores todos os dias</p>
            <h1 className="mt-5 font-serif text-[54px] font-light leading-[0.92] sm:text-[72px] lg:text-[84px]">
              Flores que <br /><em className="texto-ouro font-light">guardam memórias</em>
            </h1>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-marrom/65">Alta floricultura no Rio de Janeiro. Buquês de noiva, igrejas e mesas assinadas, feitos à mão no ateliê com flores brasileiras e sem espuma floral.</p>
            <div className="mt-7 flex items-center gap-4">
              <RetratoRafael size={72} />
              <div>
                <p className="font-script text-3xl text-champanhe">Rafael Cunha</p>
                <p className="text-sm text-marrom/70">320 celebrações · <span className="text-champanhe">4.9★</span> Google</p>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/loja" className="btn-ouro">Encomendar flores</Link>
              <Link href="/portfolio" className="btn-linha">Ver celebrações reais</Link>
            </div>
          </div>
        </div>
        <ConsulteData />
      </div>
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
    <form onSubmit={verificar} className="moldura relative bg-creme/95 p-7" id="consulte">
      <SeloCera size={64} className="absolute -right-4 -top-6 rotate-12" />
      <p className="kicker">Agenda {new Date().getFullYear()}/{new Date().getFullYear() + 1}</p>
      <h2 className="mt-2 text-4xl">Consulte <em className="texto-ouro">sua data</em></h2>
      <div className="mt-5 space-y-3">
        <div><label className="rotulo" htmlFor="cd-nome">Nome</label><input id="cd-nome" required className="campo" value={f.nome} onChange={(e) => setF({ ...f, nome: e.target.value })} placeholder="Como podemos te chamar?" /></div>
        <div><label className="rotulo" htmlFor="cd-data">Data do evento</label><input id="cd-data" type="date" required className="campo" value={f.data} onChange={(e) => setF({ ...f, data: e.target.value })} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="rotulo" htmlFor="cd-local">Local</label>
            <select id="cd-local" className="campo" value={f.local} onChange={(e) => setF({ ...f, local: e.target.value })}><option>Casa e Capela Santa Ignêz</option><option>Solar Real</option><option>Outro no RJ</option></select></div>
          <div><label className="rotulo" htmlFor="cd-tipo">Tipo</label>
            <select id="cd-tipo" className="campo" value={f.tipo} onChange={(e) => setF({ ...f, tipo: e.target.value })}><option>Igreja</option><option>Casamento</option><option>Namorados</option><option>Centro Mesa</option></select></div>
        </div>
      </div>
      <button className="btn-ouro mt-5 w-full">Verificar disponibilidade</button>
      {r && (
        <div className={cn('mt-4 rounded-xl p-3 text-sm', r.livre ? 'border border-salvia/30 bg-salvia/10 text-folha' : 'border border-rosa/30 bg-rosa/10 text-rosa')}>
          {r.msg}
          <a className="mt-2 block font-medium underline" target="_blank" rel="noreferrer" href={waLink(`Olá Rafael, sou ${f.nome}. Quero reservar ${f.data.split('-').reverse().join('/')} · ${f.tipo} · ${f.local}.`)}>Falar no WhatsApp →</a>
        </div>
      )}
      <p className="mt-4 text-center text-xs text-marrom/60">Mais de 300 casamentos realizados no Rio de Janeiro</p>
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
    <div className="grid gap-8 md:grid-cols-2">
      {PORTFOLIO.slice(0, limite).map((p, i) => (
        <article key={p.id} className={cn('group', i % 2 === 1 && 'md:mt-16')}>
          <div className="moldura relative aspect-[4/5] overflow-hidden p-3">
            <div className="flex h-full w-full items-center justify-center rounded-[24px] text-8xl transition duration-700 group-hover:scale-[1.04]" style={{ background: `radial-gradient(circle at 30% 25%, ${p.gradiente[0]}88, transparent 55%), radial-gradient(circle at 75% 80%, ${p.gradiente[1]}aa, transparent 60%), linear-gradient(160deg,rgb(var(--halo)),rgb(var(--creme)))` }}>
              {p.imagem ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.imagem} alt={`${p.titulo} — ${p.local}`} className="h-full w-full rounded-[24px] object-cover" />
              ) : p.emoji}
            </div>
            <div className="absolute left-6 top-6 flex flex-wrap gap-2">
              <span className="etiqueta">{p.tipo}</span><span className="etiqueta">{p.local}</span><span className="etiqueta">{p.data}</span>
            </div>
          </div>
          <h3 className="mt-5 text-3xl transition group-hover:text-champanhe">{p.titulo}</h3>
          <p className="mt-1 text-sm text-marrom/60">{p.descricao}</p>
          {'instagram' in p && p.instagram && <a href={p.instagram} target="_blank" rel="noreferrer" className="mt-1 inline-block text-sm text-ouro underline">ver post original</a>}
        </article>
      ))}
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
        {[['🌿', 'Arranjos sem espuma floral', 'Sustentável de verdade'], ['💍', '320 noivas felizes', 'Celebrações reais'], ['⏱️', 'Entrega em 3h combinada', 'No horário que você escolher'], ['🔒', 'Mercado Pago Seguro', 'Pix e cartão parcelado']].map(([e, t, d]) => (
          <div key={t} className="moldura p-5 text-center transition hover:-translate-y-1 hover:shadow-brilho">
            <span className="text-2xl">{e}</span><p className="mt-1 font-serif text-lg leading-tight">{t}</p><p className="text-xs text-marrom/60">{d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Sobre() {
  return (
    <section className="relative overflow-hidden border-y border-ouro/10 bg-[radial-gradient(ellipse_at_left,rgba(201,163,95,.12),transparent_60%)] py-24" id="sobre">
      <div className="secao grid items-center gap-10 md:grid-cols-[auto_1fr]">
        <RetratoRafael size={220} />
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
          {[['🪴', 'Blog de cuidados', '/cuidados/bouquet-solar-luz'], ['🌺', 'Flores da estação', '/flores'], ['📅', 'Agenda aberta', '/agenda']].map(([e, t, h]) => (
            <Link key={t} href={h} className="moldura p-4 text-center transition hover:-translate-y-1 hover:shadow-brilho"><span className="text-2xl">{e}</span><p className="mt-1">{t}</p></Link>
          ))}
        </div>
      </div>
      <InstagramEmbed className="mx-auto w-full max-w-md" />
    </section>
  );
}
