// Mock data for BillMate.io application

export interface User {
  name: string;
  email: string;
  phone: string;
  identityVerified: boolean;
}

export interface Company {
  id: string;
  name: string;
  regNumber: string;
  country: string;
}

export interface Debtor {
  id: string;
  companyName: string;
  country: string;
  registrationNumber: string;
  creditLimit: number;
}

export interface Invoice {
  id: string;
  invoiceId: string;
  company: string;
  dueDate: string;
  amount: number;
  status: 'approved' | 'processing' | 'pending' | 'paid' | 'rejected' | 'blocked';
  date?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  country: string;
  creditLimit: number;
  status: 'pending' | 'active' | 'suspended';
}

export interface Payout {
  id: string;
  payoutId: string;
  client: string;
  invoiceId: string;
  amount: number;
  date: string;
  status: 'pending' | 'completed' | 'processing';
}

export const mockUser: User = {
  name: 'John Anderson',
  email: 'john@example.com',
  phone: '+371 2123 4567', // Latvia phone number
  identityVerified: true,
};

export const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'A-Z Corporation OÜ',
    regNumber: '12345678',
    country: 'Estonia',
  },
  {
    id: '2',
    name: 'Baltic Trading OÜ',
    regNumber: '87654321',
    country: 'Estonia',
  },
  {
    id: '3',
    name: 'Baltic Awesome Solutions OÜ',
    regNumber: '11223344',
    country: 'Estonia',
  },
];

export const mockDebtors: Debtor[] = [
  {
    id: '1',
    companyName: 'Acme Corporation',
    country: 'Latvia',
    registrationNumber: 'LV12345678',
    creditLimit: 25000,
  },
  {
    id: '2',
    companyName: 'TechStart Ltd',
    country: 'Estonia',
    registrationNumber: 'EE87654321',
    creditLimit: 15000,
  },
  {
    id: '3',
    companyName: 'Global Imports',
    country: 'Lithuania',
    registrationNumber: 'LT11223344',
    creditLimit: 30000,
  },
];

export const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceId: 'INV-001',
    company: 'ABC Corporation',
    dueDate: '2024-02-15',
    amount: 12500,
    status: 'approved',
    date: '2024-01-15',
  },
  {
    id: '2',
    invoiceId: 'INV-002',
    company: 'Nordic Trading OU',
    dueDate: '2024-02-14',
    amount: 8750,
    status: 'processing',
    date: '2024-01-14',
  },
  {
    id: '3',
    invoiceId: 'INV-003',
    company: 'Baltic Solutions',
    dueDate: '2024-02-13',
    amount: 15000,
    status: 'pending',
    date: '2024-01-13',
  },
  {
    id: '4',
    invoiceId: 'INV-004',
    company: 'Scandinavian Imports',
    dueDate: '2024-02-12',
    amount: 22000,
    status: 'paid',
    date: '2024-01-12',
  },
  {
    id: '5',
    invoiceId: 'INV-005',
    company: 'ABC Corporation',
    dueDate: '2024-02-11',
    amount: 9500,
    status: 'approved',
    date: '2024-01-11',
  },
  {
    id: '6',
    invoiceId: 'INV-006',
    company: 'Nordic Trading OÜ',
    dueDate: '2024-02-10',
    amount: 11200,
    status: 'processing',
    date: '2024-01-10',
  },
  {
    id: '7',
    invoiceId: 'INV-007',
    company: 'Baltic Solutions',
    dueDate: '2024-02-09',
    amount: 18500,
    status: 'rejected',
    date: '2024-01-09',
  },
  {
    id: '8',
    invoiceId: 'INV-008',
    company: 'ABC Corporation',
    dueDate: '2024-02-08',
    amount: 7800,
    status: 'paid',
    date: '2024-01-08',
  },
  {
    id: '9',
    invoiceId: 'INV-009',
    company: 'Scandinavian Imports',
    dueDate: '2024-02-07',
    amount: 31000,
    status: 'approved',
    date: '2024-01-07',
  },
  {
    id: '10',
    invoiceId: 'INV-010',
    company: 'Nordic Trading OU',
    dueDate: '2024-02-06',
    amount: 14200,
    status: 'pending',
    date: '2024-01-06',
  },
];

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'Scandinavian Imports',
    email: 'admin@scandi.se',
    country: 'Sweden',
    creditLimit: 150000,
    status: 'pending',
  },
  {
    id: '2',
    name: 'Baltic Ventures',
    email: 'hello@baltic.com',
    country: 'Latvia',
    creditLimit: 95000,
    status: 'pending',
  },
  {
    id: '3',
    name: 'ABC Corporation',
    email: 'contact@abc.com',
    country: 'Estonia',
    creditLimit: 50000,
    status: 'active',
  },
  {
    id: '4',
    name: 'Nordic Trading OÜ',
    email: 'info@nordic.ee',
    country: 'Estonia',
    creditLimit: 75000,
    status: 'active',
  },
  {
    id: '5',
    name: 'Baltic Solutions',
    email: 'sales@baltic.lv',
    country: 'Latvia',
    creditLimit: 100000,
    status: 'active',
  },
  {
    id: '6',
    name: 'Finnish Exports Ltd',
    email: 'export@finnish.fi',
    country: 'Finland',
    creditLimit: 80000,
    status: 'suspended',
  },
];

export const mockAdminInvoices: Invoice[] = [
  {
    id: '1',
    invoiceId: 'INV-1001',
    company: 'ABC Corporation',
    dueDate: '2024-02-15',
    amount: 12500,
    status: 'pending',
    date: '2024-01-15',
  },
  {
    id: '2',
    invoiceId: 'INV-1002',
    company: 'Nordic Trading OU',
    dueDate: '2024-02-16',
    amount: 8300,
    status: 'approved',
    date: '2024-01-16',
  },
  {
    id: '3',
    invoiceId: 'INV-1003',
    company: 'Baltic Solutions',
    dueDate: '2024-02-17',
    amount: 15700,
    status: 'pending',
    date: '2024-01-17',
  },
  {
    id: '4',
    invoiceId: 'INV-1004',
    company: 'Scandinavian Imports',
    dueDate: '2024-02-18',
    amount: 22000,
    status: 'rejected',
    date: '2024-01-18',
  },
  {
    id: '5',
    invoiceId: 'INV-1005',
    company: 'Finnish Exports Ltd',
    dueDate: '2024-02-19',
    amount: 9500,
    status: 'approved',
    date: '2024-01-19',
  },
];

export const mockPayouts: Payout[] = [
  {
    id: '1',
    payoutId: 'PAY-501',
    client: 'ABC Corporation',
    invoiceId: 'INV-1002',
    amount: 11875,
    date: '2024-01-20',
    status: 'pending',
  },
  {
    id: '2',
    payoutId: 'PAY-502',
    client: 'Nordic Trading OÜ',
    invoiceId: 'INV-998',
    amount: 7885,
    date: '2024-01-19',
    status: 'completed',
  },
  {
    id: '3',
    payoutId: 'PAY-503',
    client: 'Baltic Solutions',
    invoiceId: 'INV-995',
    amount: 14915,
    date: '2024-01-18',
    status: 'completed',
  },
  {
    id: '4',
    payoutId: 'PAY-504',
    client: 'Finnish Exports Ltd',
    invoiceId: 'INV-1005',
    amount: 9025,
    date: '2024-01-21',
    status: 'processing',
  },
  {
    id: '5',
    payoutId: 'PAY-505',
    client: 'ABC Corporation',
    invoiceId: 'INV-988',
    amount: 18700,
    date: '2024-01-17',
    status: 'completed',
  },
];
