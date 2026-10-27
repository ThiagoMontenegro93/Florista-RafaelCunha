// Fila anti-spam (BullMQ): distribui envios em 20/h dentro da janela 9h-18h,
// com intervalo aleatório de 3-5 minutos e teto diário configurável (100-400).
import { Queue } from 'bullmq';
import { planejarEnvios } from './plano-envios';

export { planejarEnvios };

export type JobEnvio = { envioId: number; leadId: number; canal: 'Email' | 'WhatsApp' | 'Instagram' | 'Telegram' | 'LinkedIn' };

export const LIMITES_CANAL: Record<JobEnvio['canal'], number> = { Email: 400, WhatsApp: 50, Instagram: 20, Telegram: 100, LinkedIn: 25 };

let fila: Queue<JobEnvio> | null = null;
export function filaEnvios() {
  if (!fila) fila = new Queue<JobEnvio>('envios', { connection: { url: process.env.REDIS_URL ?? 'redis://localhost:6379' } });
  return fila;
}

export async function agendarCampanha(jobs: JobEnvio[], opts?: Parameters<typeof planejarEnvios>[1]) {
  const horarios = planejarEnvios(jobs.length, opts);
  const q = filaEnvios();
  await Promise.all(jobs.map((j, i) => q.add('envio', j, { delay: Math.max(0, horarios[i].getTime() - Date.now()), attempts: 2 })));
  return horarios;
}
