import NoticesSection from "@/components/website/NoticesSection";
import DashboardHomeSection from "../../components/dashboard/DashboardHomeSection";
import DashboardHeroSection from "@/components/dashboard/DashboardHeroSection";

export default function DashboardHome() {
  return(
  <>
      <DashboardHeroSection />
      <NoticesSection />
    <DashboardHomeSection />;
    </>
  )
}
