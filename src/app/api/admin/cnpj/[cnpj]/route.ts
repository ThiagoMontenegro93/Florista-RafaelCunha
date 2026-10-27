import { NextResponse } from 'next/server';
import { consultarCnpj } from '@/lib/cnpj';

// Hunter CNPJ: GET https://brasilapi.com.br/api/cnpj/v1/{cnpj}
export async function GET(_: Request, { params }: { params: { cnpj: string } }) {
  const { status, corpo } = await consultarCnpj(params.cnpj);
  return NextResponse.json(corpo, { status });
}
