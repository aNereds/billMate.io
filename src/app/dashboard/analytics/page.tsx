'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Analytics from '@/components/Analytics/Analytics';
import { authService } from '@/utils/auth';

export default function AnalyticsPage() {
  const router = useRouter();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/onboarding');
    }
  }, [router]);

  return <Analytics />;
}
