'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { SeloCera } from '@/components/Ornamentos';
import { MODO_DEMO } from '@/lib/demo';

export default function LoginAdmin() {
  const [email, setEmail] = useState('rafaelsoaresdecor@gmail.com');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const demo = MODO_DEMO;
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form
        className="moldura w-full max-w-sm space-y-4 bg-creme p-8 text-center"
        onSubmit={async (e) => {
          e.preventDefault();
          setCarregando(true);
          const r = await signIn('credentials', { email, password: senha, redirect: false });
          setCarregando(false);
          if (r?.ok) window.location.href = '/admin';
          else setErro('Email ou senha incorretos');
        }}
      >
        <SeloCera size={72} className="mx-auto" />
        <h1 className="text-3xl">Área do ateliê</h1>
        <input className="campo" type="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Email" />
        <input className="campo" type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} aria-label="Senha" />
        {erro && <p className="text-sm text-rosa">{erro}</p>}
        <button className="btn-ouro w-full" disabled={carregando}>{carregando ? 'Entrando…' : 'Entrar'}</button>
        {demo && <p className="text-xs text-marrom/50">Demo: senha padrão em ADMIN_PASSWORD (.env), “atelier2026”.</p>}
      </form>
    </div>
  );
}
