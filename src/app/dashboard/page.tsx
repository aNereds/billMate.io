'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/utils/auth';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/onboarding');
    } else {
      router.push('/dashboard/analytics');
    }
  }, [router]);

  return null;
}
