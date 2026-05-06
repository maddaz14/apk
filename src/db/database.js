import Dexie from 'dexie';

export const db = new Dexie('DanaHematDB');

db.version(1).stores({
  transactions: '++id, type, category, date, amount, note, createdAt',
  categories: '++id, name, emoji, type, isDefault',
  budgets: '++id, category, limit, month',
  settings: 'key',
});

// Seed default categories
export const DEFAULT_CATEGORIES = [
  { name: 'Gaji', emoji: '💰', type: 'income', isDefault: true },
  { name: 'Freelance', emoji: '💻', type: 'income', isDefault: true },
  { name: 'Investasi', emoji: '📈', type: 'income', isDefault: true },
  { name: 'Bonus', emoji: '🎁', type: 'income', isDefault: true },
  { name: 'Makan & Minum', emoji: '🍜', type: 'expense', isDefault: true },
  { name: 'Transportasi', emoji: '🚗', type: 'expense', isDefault: true },
  { name: 'Belanja', emoji: '🛒', type: 'expense', isDefault: true },
  { name: 'Kesehatan', emoji: '🏥', type: 'expense', isDefault: true },
  { name: 'Hiburan', emoji: '🎮', type: 'expense', isDefault: true },
  { name: 'Tagihan', emoji: '📃', type: 'expense', isDefault: true },
  { name: 'Pendidikan', emoji: '📚', type: 'expense', isDefault: true },
  { name: 'Tabungan', emoji: '🏦', type: 'expense', isDefault: true },
];

export async function initDB() {
  const count = await db.categories.count();
  if (count === 0) {
    await db.categories.bulkAdd(DEFAULT_CATEGORIES);
  }
}
