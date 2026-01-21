export interface StorageData<T> {
  items: T[];
  lastUpdated: string;
}

export const storageService = {
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

  saveItems: <T>(key: string, items: T[]): void => {
    if (typeof window === 'undefined') return;
    const data: StorageData<T> = {
      items,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(key, JSON.stringify(data));
  },

  addItem: <T>(key: string, item: T): void => {
    const items = storageService.getItems<T>(key);
    items.push(item);
    storageService.saveItems(key, items);
  },

  removeItem: <T extends { id: string }>(key: string, id: string): boolean => {
    const items = storageService.getItems<T>(key);
    const filtered = items.filter((item) => item.id !== id);
    storageService.saveItems(key, filtered);
    return filtered.length < items.length;
  },

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

export const STORAGE_KEYS = {
  INVOICES: 'billapp_invoices',
  DEBTORS: 'billapp_debtors',
  CLIENTS: 'billapp_clients',
  PAYOUTS: 'billapp_payouts',
};
