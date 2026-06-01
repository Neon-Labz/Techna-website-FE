'use client';
import PublicHeader from '../../src/components/shared/PublicHeader';
import Footer from '../../src/components/shared/Footer';
import WhatsAppButton from '../../src/components/shared/WhatsAppButton';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
