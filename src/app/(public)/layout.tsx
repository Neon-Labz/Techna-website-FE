'use client';
import PublicHeader from '../../components/shared/PublicHeader';
import Footer from '../../components/shared/Footer';
import WhatsAppButton from '../../components/shared/WhatsAppButton';

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
