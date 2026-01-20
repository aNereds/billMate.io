'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Settings from '@/components/Settings/Settings';
import { authService } from '@/utils/auth';

export default function SettingsPage() {
  const router = useRouter();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/onboarding');
    }
  }, [router]);

  return <Settings />;
}
