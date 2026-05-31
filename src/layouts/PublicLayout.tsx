import { Outlet } from 'react-router-dom';
import PublicHeader from '../components/shared/PublicHeader';
import Footer from '../components/shared/Footer';
import WhatsAppButton from '../components/shared/WhatsAppButton';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
