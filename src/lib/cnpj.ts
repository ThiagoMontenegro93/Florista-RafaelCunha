// Consulta de CNPJ na BrasilAPI (usada pelo Hunter do admin e pelo formulário corporativo público)
export async function consultarCnpj(bruto: string): Promise<{ status: number; corpo: Record<string, unknown> }> {
  const cnpj = bruto.replace(/\D/g, '');
  if (cnpj.length !== 14) return { status: 400, corpo: { erro: 'CNPJ deve ter 14 dígitos' } };
  try {
    const r = await fetch(`${process.env.BRASILAPI_URL ?? 'https://brasilapi.com.br/api'}/cnpj/v1/${cnpj}`, { next: { revalidate: 86400 }, signal: AbortSignal.timeout(10000) });
    const j = await r.json();
    if (!r.ok) return { status: r.status, corpo: { erro: j.message ?? 'Não encontrado' } };
    return {
      status: 200,
      corpo: {
        cnpj: j.cnpj, razao: j.razao_social, fantasia: j.nome_fantasia, situacao: j.descricao_situacao_cadastral,
        endereco: `${j.logradouro}, ${j.numero} - ${j.bairro}, ${j.municipio}/${j.uf}`, uf: j.uf, municipio: j.municipio,
        telefone: j.ddd_telefone_1, email: j.email, cnae: `${j.cnae_fiscal} ${j.cnae_fiscal_descricao}`, abertura: j.data_inicio_atividade, capital: j.capital_social,
      },
    };
  } catch {
    return { status: 502, corpo: { erro: 'BrasilAPI indisponível' } };
  }
}
