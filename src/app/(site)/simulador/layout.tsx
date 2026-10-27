import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Simulador de decoração de casamento', description: 'Monte a decoração floral do seu casamento item a item, veja o investimento na hora e reserve a data com sinal.' };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
