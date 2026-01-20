// LocalStorage utilities for CRUD operations

export interface StorageData<T> {
  items: T[];
  lastUpdated: string;
}

export const storageService = {
  // Get items from localStorage
  getItems: <T>(key: string): T[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(key);
    if (!data) return [];
    try {
      const parsed: StorageData<T> = JSON.parse(data);
      return parsed.items || [];
    } catch {
      return [];
    }
  },

  // Save items to localStorage
  saveItems: <T>(key: string, items: T[]): void => {
    if (typeof window === 'undefined') return;
    const data: StorageData<T> = {
      items,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(key, JSON.stringify(data));
  },

  // Add item
  addItem: <T>(key: string, item: T): void => {
    const items = storageService.getItems<T>(key);
    items.push(item);
    storageService.saveItems(key, items);
  },

  // Remove item by ID
  removeItem: <T extends { id: string }>(key: string, id: string): boolean => {
    const items = storageService.getItems<T>(key);
    const filtered = items.filter((item) => item.id !== id);
    storageService.saveItems(key, filtered);
    return filtered.length < items.length;
  },

  // Update item
  updateItem: <T extends { id: string }>(
    key: string,
    id: string,
    updates: Partial<T>
  ): boolean => {
    const items = storageService.getItems<T>(key);
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return false;
    items[index] = { ...items[index], ...updates } as T;
    storageService.saveItems(key, items);
    return true;
  },
};

// Storage keys
export const STORAGE_KEYS = {
  INVOICES: 'billmate_invoices',
  DEBTORS: 'billmate_debtors',
  CLIENTS: 'billmate_clients',
  PAYOUTS: 'billmate_payouts',
};
