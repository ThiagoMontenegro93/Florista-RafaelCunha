import { NextResponse } from 'next/server';
import { MUNICIPIOS_RJ } from '@/data/municipios';

// GET {IBGE_API}/estados/{UF}/municipios — com fallback local para RJ.
export async function GET(_: Request, { params }: { params: { uf: string } }) {
  const uf = params.uf.toUpperCase();
  try {
    const r = await fetch(`${process.env.IBGE_API ?? 'https://servicodados.ibge.gov.br/api/v1/localidades'}/estados/${uf}/municipios`, { next: { revalidate: 604800 }, signal: AbortSignal.timeout(8000) });
    if (!r.ok) throw new Error();
    const j = (await r.json()) as { id: number; nome: string }[];
    return NextResponse.json({ fonte: 'IBGE', municipios: j.map((m) => ({ ibge: m.id, nome: m.nome })) });
  } catch {
    if (uf === 'RJ') return NextResponse.json({ fonte: 'local', municipios: MUNICIPIOS_RJ.map((m) => ({ nome: m.nome, regiao: m.regiao })) });
    return NextResponse.json({ erro: 'IBGE indisponível' }, { status: 502 });
  }
}
