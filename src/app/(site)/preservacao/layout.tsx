import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Preservação do buquê de noiva', description: 'Eternize o buquê do seu casamento em quadro prensado, resina cristal ou cúpula de vidro, feito à mão no ateliê.' };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
