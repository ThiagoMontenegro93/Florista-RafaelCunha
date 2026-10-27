import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { LeadPopup } from '@/components/LeadPopup';
import { WhatsFlutuante } from '@/components/WhatsFlutuante';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <CartDrawer />
      <LeadPopup />
      <WhatsFlutuante />
    </>
  );
}
