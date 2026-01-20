'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminPanel from '@/components/AdminPanel/AdminPanel';
import { authService } from '@/utils/auth';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/onboarding');
    }
  }, [router]);

  return <AdminPanel />;
}
