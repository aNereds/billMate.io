'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Debtors from '@/components/Debtors/Debtors';
import { authService } from '@/utils/auth';

export default function DebtorsPage() {
  const router = useRouter();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/onboarding');
    }
  }, [router]);

  return <Debtors />;
}
