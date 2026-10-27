import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Programa de parceiros', description: 'Cerimonialistas, espaços e fotógrafos ganham comissão por indicação com link e painel próprios.' };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
