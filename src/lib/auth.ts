import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export type Papel = 'FLORISTA' | 'CLIENTE';

const PRODUCAO = process.env.NODE_ENV === 'production';
const SENHA_DEMO = 'atelier2026';

// Mesmo segredo no middleware e no NextAuth. Em produção não há fallback: sem NEXTAUTH_SECRET o NextAuth recusa tudo.
export const AUTH_SECRET = process.env.NEXTAUTH_SECRET ?? (PRODUCAO ? undefined : 'dev-secret-troque-em-producao');

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL ?? 'rafaelsoaresdecor@gmail.com').toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? (PRODUCAO ? undefined : SENHA_DEMO);
// Em produção a senha precisa existir, ter 10+ caracteres e não ser a senha de demonstração.
const SENHA_VALIDA = !!ADMIN_PASSWORD && (!PRODUCAO || (ADMIN_PASSWORD.length >= 10 && ADMIN_PASSWORD !== SENHA_DEMO));
if (PRODUCAO && !SENHA_VALIDA) console.error('[auth] ADMIN_PASSWORD ausente, curta ou igual à de demonstração: login do admin bloqueado.');

// RBAC: só o email do ateliê recebe o papel FLORISTA. Qualquer outro login é CLIENTE e nunca vê /admin.
export const authOptions: NextAuthOptions = {
  secret: AUTH_SECRET,
  session: { strategy: 'jwt' },
  pages: { signIn: '/admin/login' },
  providers: [
    CredentialsProvider({
      name: 'Ateliê',
      credentials: { email: { label: 'Email', type: 'email' }, password: { label: 'Senha', type: 'password' } },
      async authorize(c) {
        if (!SENHA_VALIDA || !c?.email || !c.password) return null;
        if (c.email.toLowerCase() === ADMIN_EMAIL && c.password === ADMIN_PASSWORD)
          return { id: 'rafael', email: ADMIN_EMAIL, name: 'Rafael Cunha', role: 'FLORISTA' as Papel };
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as { role?: Papel }).role ?? 'CLIENTE';
      return token;
    },
    async session({ session, token }) {
      (session.user as { role?: Papel }).role = (token.role as Papel) ?? 'CLIENTE';
      return session;
    },
  },
};
