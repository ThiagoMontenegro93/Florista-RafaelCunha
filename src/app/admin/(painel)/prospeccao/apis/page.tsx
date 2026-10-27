'use client';

import { useState } from 'react';
import { Titulo, Aviso } from '@/components/admin/ui';
import { cn } from '@/lib/format';

const APIS = [
  { id: 'RESEND', nome: 'Email · Resend / Amazon SES / Gmail SMTP', env: 'RESEND_API_KEY', ph: 'RESEND_API_KEY_AQUI', extra: 'FROM_EMAIL = rafaelsoaresdecor@gmail.com', aviso: 'Para 100-400/dia você precisa de domínio próprio autenticado (DKIM + SPF + DMARC) e aquecimento de 14 dias começando com 20/dia. Gmail pessoal não serve para envio em massa.', tutorial: 'https://resend.com/docs/dashboard/domains/introduction' },
  { id: 'WHATSAPP', nome: 'WhatsApp · Z-API / Twilio', env: 'WHATSAPP_API_TOKEN', ph: 'WHATSAPP_API_TOKEN_AQUI', extra: 'Número: +55 21 9xxxx-xxxx', aviso: 'WhatsApp exige opt-in: só envie depois do primeiro contato por email. Limite 50/dia.', tutorial: 'https://developer.z-api.io/' },
  { id: 'INSTAGRAM', nome: 'Instagram', env: 'INSTAGRAM_ACCESS_TOKEN', ph: 'INSTAGRAM_ACCESS_TOKEN_AQUI', aviso: 'A API oficial não permite DM em massa. Use envio manual ou ManyChat, até 20/dia.', tutorial: 'https://developers.facebook.com/docs/instagram-platform' },
  { id: 'TELEGRAM', nome: 'Telegram Bot', env: 'TELEGRAM_BOT_TOKEN', ph: 'TELEGRAM_BOT_TOKEN_AQUI', aviso: 'Crie o bot com @BotFather (/newbot) e cole o token aqui.', tutorial: 'https://core.telegram.org/bots/tutorial' },
  { id: 'LINKEDIN', nome: 'LinkedIn', env: 'LINKEDIN_COOKIE', ph: 'LINKEDIN_COOKIE', aviso: 'Automação por cookie viola os termos do LinkedIn e pode bloquear a conta. Limite 25 conexões/dia, prefira manual.', tutorial: 'https://www.linkedin.com/help/linkedin/answer/a1342443' },
  { id: 'SHEETS', nome: 'Google Sheets · importar leads', env: 'GOOGLE_SHEETS_ID', ph: 'ID_DA_PLANILHA', aviso: 'Compartilhe a planilha com a conta de serviço e cole o ID.', tutorial: 'https://developers.google.com/sheets/api/quickstart/nodejs' },
  { id: 'PLACES', nome: 'Google Places API (New)', env: 'GOOGLE_PLACES_API_KEY', ph: 'GOOGLE_PLACES_API_KEY_AQUI', aviso: 'Ative “Places API (New)” no Google Cloud e restrinja a chave por IP/referer. ~US$ 35/1.000 buscas.', tutorial: 'https://developers.google.com/maps/documentation/places/web-service/text-search' },
  { id: 'IBGE', nome: 'IBGE Localidades', env: 'IBGE_API', ph: 'https://servicodados.ibge.gov.br/api/v1/localidades', aviso: 'API pública, sem chave.', tutorial: 'https://servicodados.ibge.gov.br/api/docs/localidades' },
];

export default function ApisPage() {
  const [chaves, setChaves] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Record<string, { ok: boolean; msg: string } | 'testando'>>({ IBGE: { ok: true, msg: 'API pública' } });
  const testar = async (id: string) => {
    setStatus((s) => ({ ...s, [id]: 'testando' }));
    const r = await fetch('/api/admin/apis/test', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, chave: chaves[id] }) });
    const j = await r.json();
    setStatus((s) => ({ ...s, [id]: { ok: j.ok, msg: j.msg } }));
  };
  return (
    <>
      <Titulo kicker="Integrações" titulo="Central de APIs" />
      <Aviso>As chaves ficam no servidor (.env / tabela ApisConfig), nunca no navegador do cliente.</Aviso>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {APIS.map((a) => {
          const st = status[a.id];
          const ok = st && st !== 'testando' && st.ok;
          return (
            <div key={a.id} className="card-admin space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div><p className="font-serif text-xl">{a.nome}</p><code className="text-[11px] text-marrom/50">{a.env}</code></div>
                <span className={cn('pill text-[11px]', ok ? 'bg-emerald-400/10 text-emerald-700 dark:text-emerald-300' : 'bg-realce/5 text-marrom/40')}>● {ok ? 'Conectado' : 'Desconectado'}</span>
              </div>
              <input className="campo font-mono text-xs" type={a.id === 'IBGE' ? 'text' : 'password'} placeholder={a.ph} value={chaves[a.id] ?? ''} onChange={(e) => setChaves({ ...chaves, [a.id]: e.target.value })} />
              {a.extra && <p className="text-xs text-marrom/60">{a.extra}</p>}
              <p className="rounded-lg bg-areia/40 p-2 text-xs">{a.aviso}</p>
              <div className="flex items-center gap-2">
                <button className="btn-ouro !py-1.5 text-xs" onClick={() => testar(a.id)} disabled={st === 'testando'}>{st === 'testando' ? 'Testando…' : 'Testar conexão'}</button>
                <a className="text-xs text-ouro underline" href={a.tutorial} target="_blank" rel="noreferrer">Tutorial</a>
                {st && st !== 'testando' && <span className={cn('text-xs', st.ok ? 'text-salvia' : 'text-rosa')}>{st.msg}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
