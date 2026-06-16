import HeroSection from '../../components/website/HeroSection';
import NoticesSection from '../../components/website/NoticesSection';
import FeaturedModulesSection from '../../components/website/FeaturedModulesSection';
import WhyUsSection from '../../components/website/WhyUsSection';
import TestimonialsSection from '../../components/website/TestimonialsSection';
import CTASection from '../../components/website/CTASection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedModulesSection />
      <WhyUsSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
