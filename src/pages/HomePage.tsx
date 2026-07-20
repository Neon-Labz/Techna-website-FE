import HeroSection from '../components/website/HeroSection';
import FeaturedModulesSection from '../components/website/FeaturedModulesSection';
import WhyUsSection from '../components/website/WhyUsSection';
import TopAchieversSection from '../components/website/TopAchieversSection';
import TestimonialsSection from '../components/website/TestimonialsSection';
import CTASection from '../components/website/CTASection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      {/* <NoticesSection /> */}
      <FeaturedModulesSection />
      <WhyUsSection />
      <TopAchieversSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
