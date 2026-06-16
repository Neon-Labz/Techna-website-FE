import PublicRoute from '../../src/components/auth/PublicRoute';
import RegisterSection from '../../src/components/website/RegisterSection';

export default function RegisterPage() {
  return (
    <PublicRoute>
      <RegisterSection />
    </PublicRoute>
  );
}
