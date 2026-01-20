// Authentication utilities with localStorage

export interface AuthUser {
  name: string;
  email: string;
  phone: string;
  identityVerified: boolean;
  onboardingCompleted: boolean;
}

const AUTH_KEY = 'billmate_auth';
const SAMPLE_DATA_KEY = 'billmate_sample_data';

export const authService = {
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    const auth = localStorage.getItem(AUTH_KEY);
    return auth !== null;
  },

  // Get current user
  getCurrentUser: (): AuthUser | null => {
    if (typeof window === 'undefined') return null;
    const auth = localStorage.getItem(AUTH_KEY);
    return auth ? JSON.parse(auth) : null;
  },

  // Login user
  login: (user: AuthUser): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  },

  // Complete onboarding
  completeOnboarding: (user: AuthUser): void => {
    if (typeof window === 'undefined') return;
    const updatedUser = { ...user, onboardingCompleted: true };
    localStorage.setItem(AUTH_KEY, JSON.stringify(updatedUser));
  },

  // Logout - clear all localStorage data to restore default state
  logout: (): void => {
    if (typeof window === 'undefined') return;
    // Clear all localStorage keys used by the application
    // This will restore all mock data on next login
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(SAMPLE_DATA_KEY);
    localStorage.removeItem('billmate_invoices');
    localStorage.removeItem('billmate_debtors');
    localStorage.removeItem('billmate_clients');
    localStorage.removeItem('billmate_payouts');
    localStorage.removeItem('billmate_notifications');
    localStorage.removeItem('billmate_integrations');
    localStorage.removeItem('billmate_security');
    localStorage.removeItem('billmate_reports');
    
    // Clear all localStorage to ensure complete reset
    localStorage.clear();
  },

  // Check if onboarding is completed
  isOnboardingCompleted: (): boolean => {
    const user = authService.getCurrentUser();
    return user?.onboardingCompleted === true;
  },
};

// Sample data protection - mark sample items
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
