'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Invoices from '@/components/Invoices/Invoices';
import { authService } from '@/utils/auth';

export default function InvoicesPage() {
  const router = useRouter();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/onboarding');
    }
  }, [router]);

  return <Invoices />;
}
