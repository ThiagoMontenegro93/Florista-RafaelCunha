'use client';

import { useEffect } from 'react';

declare global {
  interface Window { instgrm?: { Embeds: { process: () => void } } }
}

/** Embed oficial do Instagram (media_refs: shortcode do post). */
export function InstagramEmbed({ shortcode = 'Dal14zbFCE9', className = '' }: { shortcode?: string; className?: string }) {
  useEffect(() => {
    if (window.instgrm) return window.instgrm.Embeds.process();
    const s = document.createElement('script');
    s.src = 'https://www.instagram.com/embed.js';
    s.async = true;
    document.body.appendChild(s);
  }, [shortcode]);

  const url = `https://www.instagram.com/p/${shortcode}/`;
  return (
    <div className={className}>
      <blockquote className="instagram-media" data-instgrm-permalink={`${url}?utm_source=ig_embed`} data-instgrm-version="14" style={{ background: 'linear-gradient(160deg,rgb(var(--halo)),rgb(var(--creme)))', border: '1px solid rgba(201,163,95,.35)', borderRadius: 24, margin: 0, maxWidth: 540, minWidth: 280, width: '100%' }}>
        <a href={url} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-2 p-8 text-center text-sm text-marrom/80">
          <span className="text-3xl">💛💙💜</span>
          Lírios amarelos, hortênsias azuis e orquídeas roxas no Solar Real
          <span className="text-ouro">Ver no Instagram @florista.rafaelcunha</span>
        </a>
      </blockquote>
    </div>
  );
}
