export interface AuthUser {
  name: string;
  email: string;
  phone: string;
  identityVerified: boolean;
  onboardingCompleted: boolean;
}

const AUTH_KEY = 'billapp_auth';
const SAMPLE_DATA_KEY = 'billapp_sample_data';

export const authService = {
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    const auth = localStorage.getItem(AUTH_KEY);
    return auth !== null;
  },

  getCurrentUser: (): AuthUser | null => {
    if (typeof window === 'undefined') return null;
    const auth = localStorage.getItem(AUTH_KEY);
    return auth ? JSON.parse(auth) : null;
  },

  login: (user: AuthUser): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  },

  completeOnboarding: (user: AuthUser): void => {
    if (typeof window === 'undefined') return;
    const updatedUser = { ...user, onboardingCompleted: true };
    localStorage.setItem(AUTH_KEY, JSON.stringify(updatedUser));
  },

  logout: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(SAMPLE_DATA_KEY);
    localStorage.removeItem('billapp_invoices');
    localStorage.removeItem('billapp_debtors');
    localStorage.removeItem('billapp_clients');
    localStorage.removeItem('billapp_payouts');
    localStorage.removeItem('billapp_notifications');
    localStorage.removeItem('billapp_integrations');
    localStorage.removeItem('billapp_security');
    localStorage.removeItem('billapp_reports');
    localStorage.clear();
  },

  isOnboardingCompleted: (): boolean => {
    const user = authService.getCurrentUser();
    return user?.onboardingCompleted === true;
  },
};

export const sampleDataService = {
  markAsSample: (id: string, type: 'invoice' | 'debtor' | 'client' | 'payout'): void => {
    if (typeof window === 'undefined') return;
    const samples = sampleDataService.getSampleIds();
    samples[type].push(id);
    localStorage.setItem(SAMPLE_DATA_KEY, JSON.stringify(samples));
  },

  getSampleIds: (): {
    invoice: string[];
    debtor: string[];
    client: string[];
    payout: string[];
  } => {
    if (typeof window === 'undefined') {
      return { invoice: [], debtor: [], client: [], payout: [] };
    }
    const samples = localStorage.getItem(SAMPLE_DATA_KEY);
    return samples
      ? JSON.parse(samples)
      : { invoice: [], debtor: [], client: [], payout: [] };
  },

  isSample: (id: string, type: 'invoice' | 'debtor' | 'client' | 'payout'): boolean => {
    const samples = sampleDataService.getSampleIds();
    return samples[type].includes(id);
  },
};
