import { NextResponse } from 'next/server';
import { consultarCnpj } from '@/lib/cnpj';

// Público (formulário corporativo): devolve só os dados cadastrais necessários
export async function GET(_: Request, { params }: { params: { cnpj: string } }) {
  const { status, corpo } = await consultarCnpj(params.cnpj);
  if (status !== 200) return NextResponse.json(corpo, { status });
  const { cnpj, razao, fantasia, situacao, endereco, municipio, uf } = corpo;
  return NextResponse.json({ cnpj, razao, fantasia, situacao, endereco, municipio, uf });
}
