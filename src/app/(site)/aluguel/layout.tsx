import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Aluguel de arcos, candelabros e vasos', description: 'Aluguel das peças de decoração do ateliê com disponibilidade por data e caução devolvida.' };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
