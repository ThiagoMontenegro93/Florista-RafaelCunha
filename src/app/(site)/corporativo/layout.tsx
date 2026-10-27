import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Flores para empresas · plano corporativo', description: 'Arranjos frescos semanais para recepções, salas e lavabos com nota fiscal mensal.' };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
