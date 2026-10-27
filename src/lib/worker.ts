// Rode com: npm run worker  (precisa de REDIS_URL)
import { Worker } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import { Resend } from 'resend';
import type { JobEnvio } from './queue';

const prisma = new PrismaClient();
const resend = process.env.RESEND_API_KEY?.startsWith('re_') ? new Resend(process.env.RESEND_API_KEY) : null;

new Worker<JobEnvio>(
  'envios',
  async (job) => {
    const envio = await prisma.envio.findUnique({ where: { id: job.data.envioId }, include: { lead: true, campanha: true } });
    if (!envio) return;
    if (envio.lead.optOut || envio.lead.status === 'Sem interesse') {
      await prisma.envio.update({ where: { id: envio.id }, data: { status: 'BLOQUEADO', motivo: 'opt-out / sem interesse' } });
      return;
    }
    const corpo = envio.campanha.template
      .replaceAll('{nome}', envio.lead.responsavel ?? envio.lead.nome)
      .replaceAll('{empresa}', envio.lead.nome)
      .replaceAll('{igreja}', envio.lead.nome)
      .replaceAll('{nicho}', envio.lead.nicho)
      .replaceAll('{portfolio_link}', `${process.env.NEXT_PUBLIC_SITE_URL}/portfolio`);

    if (job.data.canal === 'Email' && resend && envio.lead.email) {
      await resend.emails.send({
        from: `Rafael Cunha Ateliê Floral <${process.env.FROM_EMAIL}>`,
        to: envio.lead.email,
        subject: `Parceria floral para ${envio.lead.nome}`,
        text: corpo,
        headers: { 'List-Unsubscribe': `<mailto:${process.env.FROM_EMAIL}?subject=SAIR>` },
      });
    }
    // WhatsApp (Z-API), Telegram etc. seguem o mesmo padrão; Instagram/LinkedIn são manuais por política das plataformas.
    await prisma.envio.update({ where: { id: envio.id }, data: { status: 'ENVIADO', enviadoEm: new Date() } });
    await prisma.lead.update({ where: { id: envio.leadId }, data: { status: 'Contatado', ultimoContato: new Date() } });
  },
  { connection: { url: process.env.REDIS_URL ?? 'redis://localhost:6379' }, concurrency: 1 },
);
console.log('Worker de envios ativo (3-5 min entre envios, 20/h, 9h-18h)');
