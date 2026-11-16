'use client';

import { useEffect, useRef, useState } from 'react';
import { ArteArranjo, type Forma } from './Arte';
import { cn } from '@/lib/format';

type Props = {
  imagem?: string;
  alt: string;
  seed: string;
  flores: string[];
  paleta?: string;
  forma?: Forma;
  fundo?: [string, string];
  className?: string;
  /** carrega antes (imagem acima da dobra) */
  prioridade?: boolean;
};

/**
 * Foto do arranjo com zoom lento no hover. Sem foto cadastrada (ou se a foto falhar),
 * mostra a arte botânica com as mesmas flores e paleta.
 */
export function FotoArranjo({ imagem, alt, seed, flores, paleta, forma, fundo, className, prioridade }: Props) {
  const [erro, setErro] = useState(false);
  const [carregou, setCarregou] = useState(false);
  const usarFoto = imagem && !erro;
  return (
    <div className={cn('relative overflow-hidden bg-blush', className)}>
      {usarFoto ? (
        // eslint-disable-next-line @next/next/no-img-element -- fotos locais ou Cloudinary, tamanho definido pelo contêiner
        <img
          src={imagem}
          alt={alt}
          loading={prioridade ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setCarregou(true)}
          onError={() => setErro(true)}
          className={cn('h-full w-full object-cover transition-[transform,opacity,filter] duration-[1400ms] ease-out group-hover:scale-[1.06]', carregou ? 'opacity-100 blur-0' : 'opacity-0 blur-md')}
        />
      ) : (
        <ArteArranjo seed={seed} flores={flores} paleta={paleta} forma={forma} fundo={fundo} titulo={alt} className="h-full w-full transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]" />
      )}
      {/* brilho de vitrine que atravessa no hover */}
      <span aria-hidden className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(105deg,transparent_40%,rgba(255,255,255,.35)_50%,transparent_60%)] transition-transform duration-[1100ms] ease-out group-hover:translate-x-full" />
    </div>
  );
}

/** Revela o conteúdo com um leve deslizar quando entra na tela. */
export function Revelar({ children, className, atraso = 0, as: Tag = 'div' }: { children: React.ReactNode; className?: string; atraso?: number; as?: 'div' | 'section' | 'article' }) {
  const ref = useRef<HTMLElement>(null);
  const [visivel, setVisivel] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) { setVisivel(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisivel(true); io.disconnect(); } }, { rootMargin: '0px 0px -8% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      style={{ transitionDelay: `${atraso}ms` }}
      className={cn('revelar', visivel && 'revelado', className)}
    >
      {children}
    </Tag>
  );
}
