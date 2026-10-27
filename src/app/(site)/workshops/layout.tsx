import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Workshops de arranjos florais', description: 'Aulas de buquê, centro de mesa e guirlanda com Rafael Cunha no ateliê. Vagas limitadas.' };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
