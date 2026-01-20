'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Reports from '@/components/Reports/Reports';
import { authService } from '@/utils/auth';

export default function ReportsPage() {
  const router = useRouter();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/onboarding');
    }
  }, [router]);

  return <Reports />;
}
