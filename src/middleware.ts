import { withAuth } from 'next-auth/middleware';
import { AUTH_SECRET } from '@/lib/auth';

// RBAC: /admin e /api/admin só para o papel FLORISTA. Clientes nunca chegam a essas rotas.
export default withAuth({
  secret: AUTH_SECRET,
  callbacks: { authorized: ({ token, req }) => req.nextUrl.pathname === '/admin/login' || token?.role === 'FLORISTA' },
  pages: { signIn: '/admin/login' },
});

export const config = { matcher: ['/admin/:path*', '/api/admin/:path*'] };
