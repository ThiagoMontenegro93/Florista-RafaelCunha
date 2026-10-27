import type { Metadata } from 'next';
import './globals.css';
import { AtelieProvider } from '@/lib/store';
import { ViewToggle } from '@/components/ViewToggle';
import { SITE_URL } from '@/lib/format';
import { jsonLdFlorist } from '@/lib/seo';
import { scriptTema, TEMA_PADRAO } from '@/data/temas';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Rafael Cunha Ateliê Floral · Florista da Casa e Capela Santa Ignêz · Rio de Janeiro', template: '%s · Rafael Cunha Ateliê Floral' },
  description: 'Bouquet de noiva, centro de mesa de casamento e decoração de igreja no Rio de Janeiro. 320 celebrações, 4.9★ Google. Entrega a combinar em todo RJ.',
  keywords: ['florista santa ignez', 'bouquet noiva rio', 'centro de mesa casamento rio', 'flores brasileiras disponíveis rio', 'bouquet dia dos namorados rio'],
  openGraph: { type: 'website', locale: 'pt_BR', siteName: 'Rafael Cunha Ateliê Floral' },
  icons: { icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌸</text></svg>" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" data-tema={TEMA_PADRAO} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptTema }} />
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFlorist()) }} />
        <AtelieProvider>
          {children}
          <ViewToggle />
        </AtelieProvider>
      </body>
    </html>
  );
}
