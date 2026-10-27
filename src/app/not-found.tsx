import Link from 'next/link';

export default function NaoEncontrado() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="kicker">Erro 404</p>
      <h1 className="titulo-secao mt-2">Esta página <em className="texto-ouro">murchou</em></h1>
      <p className="mt-3 max-w-md text-marrom/70">O endereço não existe ou mudou de lugar. Que tal voltar ao jardim?</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-ouro">Página inicial</Link>
        <Link href="/loja" className="btn-linha">Ver a loja</Link>
      </div>
    </main>
  );
}
