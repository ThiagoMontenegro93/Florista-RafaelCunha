export const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP ?? '5521999999999';
export const TELEFONE = process.env.NEXT_PUBLIC_TELEFONE ?? '(21) 99999-9999';
export const EMAIL = 'rafaelsoaresdecor@gmail.com';
export const INSTAGRAM = 'florista.rafaelcunha';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://florista-rafaelcunha.com.br';
export const GOOGLE_REVIEW_URL = process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL ?? 'https://www.google.com/search?q=Rafael+Cunha+Florista+avalia%C3%A7%C3%B5es';

export const waLink = (texto: string, numero = WHATSAPP) => `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;

export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');

export const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
