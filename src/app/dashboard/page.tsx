import NoticesSection from '@/components/website/NoticesSection';
import DashboardHomeSection from '@/components/dashboard/DashboardHomeSection';
import DashboardHeroSection from '@/components/dashboard/DashboardHeroSection';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardHeroSection />
      <NoticesSection embedded />
      <DashboardHomeSection />
    </div>
  );
}
