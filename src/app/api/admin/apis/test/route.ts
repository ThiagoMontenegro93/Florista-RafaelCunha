import { NextResponse } from 'next/server';

// Testa uma integração. Sem chave real configurada, responde em modo demonstração.
export async function POST(req: Request) {
  const { id, chave } = (await req.json()) as { id: string; chave?: string };
  const k = chave?.trim();
  const placeholder = !k || k.endsWith('_AQUI') || k === 'LINKEDIN_COOKIE';
  try {
    if (id === 'IBGE') {
      const r = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados/RJ', { signal: AbortSignal.timeout(6000) });
      return NextResponse.json({ ok: r.ok, msg: r.ok ? 'IBGE respondeu' : 'IBGE fora do ar' });
    }
    if (placeholder) return NextResponse.json({ ok: true, demo: true, msg: 'Conectado (modo demonstração: cole a chave real para testar de verdade)' });
    if (id === 'RESEND') {
      const r = await fetch('https://api.resend.com/domains', { headers: { Authorization: `Bearer ${k}` } });
      return NextResponse.json({ ok: r.ok, msg: r.ok ? 'Resend autenticado' : 'Chave Resend inválida' });
    }
    if (id === 'TELEGRAM') {
      const r = await fetch(`https://api.telegram.org/bot${k}/getMe`);
      return NextResponse.json({ ok: r.ok, msg: r.ok ? 'Bot Telegram ok' : 'Token inválido' });
    }
    return NextResponse.json({ ok: true, msg: 'Chave salva. Teste ao vivo disponível após configurar o provedor.' });
  } catch {
    return NextResponse.json({ ok: false, msg: 'Falha de rede ao testar' }, { status: 502 });
  }
}
