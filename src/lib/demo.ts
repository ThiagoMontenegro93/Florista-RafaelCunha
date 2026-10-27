// Modo demonstração: ligado em desenvolvimento; em produção só com NEXT_PUBLIC_DEMO=1.
export const MODO_DEMO =
  process.env.NEXT_PUBLIC_DEMO === '1' || (process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_DEMO !== '0');
