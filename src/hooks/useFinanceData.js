import { useState, useEffect, useCallback } from 'react';
import { db, initDB } from '../db/database';

export function useFinanceData() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    await initDB();
    const txs = await db.transactions.orderBy('date').reverse().toArray();
    const cats = await db.categories.toArray();
    setTransactions(txs);
    setCategories(cats);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const addTransaction = useCallback(async (tx) => {
    const id = await db.transactions.add({ ...tx, createdAt: new Date().toISOString() });
    const newTx = await db.transactions.get(id);
    setTransactions((prev) => [newTx, ...prev]);
    return newTx;
  }, []);

  const deleteTransaction = useCallback(async (id) => {
    await db.transactions.delete(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addCategory = useCallback(async (cat) => {
    const id = await db.categories.add(cat);
    const newCat = await db.categories.get(id);
    setCategories((prev) => [...prev, newCat]);
    return newCat;
  }, []);

  const deleteCategory = useCallback(async (id) => {
    await db.categories.delete(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // Computed values
  const totalIncome = transactions.reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum, 0);
  const totalExpense = transactions.reduce((sum, t) => t.type === 'expense' ? sum + t.amount : sum, 0);
  const netWorth = totalIncome - totalExpense;

  // This month
  const now = new Date();
  const thisMonthTxs = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  // Last month
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthTxs = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === lastMonth.getMonth() && d.getFullYear() === lastMonth.getFullYear();
  });

  const thisMonthIncome = thisMonthTxs.reduce((s, t) => t.type === 'income' ? s + t.amount : s, 0);
  const thisMonthExpense = thisMonthTxs.reduce((s, t) => t.type === 'expense' ? s + t.amount : s, 0);
  const lastMonthExpense = lastMonthTxs.reduce((s, t) => t.type === 'expense' ? s + t.amount : s, 0);

  // Last 7 days chart data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const label = d.toLocaleDateString('id-ID', { weekday: 'short' });
    const dayTxs = transactions.filter((t) => {
      const td = new Date(t.date);
      return td.toDateString() === d.toDateString();
    });
    return {
      name: label,
      pemasukan: dayTxs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0),
      pengeluaran: dayTxs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    };
  });

  // Category breakdown this month (expense)
  const expenseByCategory = categories
    .filter((c) => c.type === 'expense')
    .map((cat) => {
      const total = thisMonthTxs.filter((t) => t.type === 'expense' && t.category === cat.name)
        .reduce((s, t) => s + t.amount, 0);
      return { name: `${cat.emoji} ${cat.name}`, value: total, emoji: cat.emoji };
    })
    .filter((c) => c.value > 0);

  return {
    transactions,
    categories,
    loading,
    addTransaction,
    deleteTransaction,
    addCategory,
    deleteCategory,
    totalIncome,
    totalExpense,
    netWorth,
    thisMonthIncome,
    thisMonthExpense,
    lastMonthExpense,
    last7Days,
    expenseByCategory,
    thisMonthTxs,
    reload: loadData,
  };
}
