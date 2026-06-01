import HeroSection from '../../src/components/website/HeroSection';
import NoticesSection from '../../src/components/website/NoticesSection';
import FeaturedModulesSection from '../../src/components/website/FeaturedModulesSection';
import WhyUsSection from '../../src/components/website/WhyUsSection';
import TestimonialsSection from '../../src/components/website/TestimonialsSection';
import CTASection from '../../src/components/website/CTASection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <NoticesSection />
      <FeaturedModulesSection />
      <WhyUsSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
