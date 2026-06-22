import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import TeacherProfileSection from '../../../../components/website/TeacherProfileSection';

export default function TeacherProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        </div>
      }
    >
      <TeacherProfileSection />
    </Suspense>
  );
}
