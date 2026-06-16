import PublicRoute from '../../src/components/auth/PublicRoute';
import LoginSection from '../../src/components/website/LoginSection';

export default function LoginPage() {
  return (
    <PublicRoute>
      <LoginSection />
    </PublicRoute>
  );
}
