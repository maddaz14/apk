import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import ProgressBar from '../components/ui/ProgressBar';
import { formatRupiah, formatRupiahInput, parseRupiah } from '../utils/format';

export default function Budget() {
  const { thisMonthIncome, thisMonthExpense, thisMonthTxs, categories } = useFinance();
  const [income, setIncome] = useState('');
  const [budget5020, setBudget5020] = useState(null);

  const calculate5020 = () => {
    const val = parseRupiah(income);
    if (!val) return;
    setBudget5020({
      needs: val * 0.5,
      wants: val * 0.3,
      savings: val * 0.2,
    });
  };

  // Category expense this month
  const expCats = categories
    .filter((c) => c.type === 'expense')
    .map((cat) => ({
      ...cat,
      total: thisMonthTxs.filter((t) => t.type === 'expense' && t.category === cat.name).reduce((s, t) => s + t.amount, 0),
    }))
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total);

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Smart Budgeting</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Kelola anggaran bulananmu dengan cerdas</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-4 border border-emerald-200 dark:border-emerald-800">
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium uppercase tracking-wide">Pemasukan Bulan Ini</p>
          <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">{formatRupiah(thisMonthIncome)}</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-4 border border-red-200 dark:border-red-800">
          <p className="text-xs text-red-500 font-medium uppercase tracking-wide">Pengeluaran Bulan Ini</p>
          <p className="text-xl font-bold text-red-600 dark:text-red-400 mt-1">{formatRupiah(thisMonthExpense)}</p>
        </div>
      </div>

      {/* 50/30/20 Calculator */}
      <div className="bg-white dark:bg-dark-card rounded-2xl p-5 shadow-lg">
        <h3 className="text-base font-bold text-gray-800 dark:text-white mb-1">🧮 Aturan 50/30/20</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Bagi pendapatanmu: 50% Kebutuhan · 30% Keinginan · 20% Tabungan
        </p>

        <div className="flex gap-3 mb-5">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Rp</span>
            <input
              type="text"
              inputMode="numeric"
              value={income}
              onChange={(e) => setIncome(formatRupiahInput(e.target.value))}
              placeholder="Masukkan pendapatan..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
                bg-gray-50 dark:bg-gray-800 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button
            onClick={calculate5020}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold
              rounded-xl shadow-md transition-all"
          >
            Hitung
          </button>
        </div>

        {budget5020 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: '🏠 Kebutuhan (50%)', value: budget5020.needs, color: 'blue' },
              { label: '🎯 Keinginan (30%)', value: budget5020.wants, color: 'amber' },
              { label: '💎 Tabungan (20%)', value: budget5020.savings, color: 'emerald' },
            ].map(({ label, value, color }) => (
              <div key={label} className={`bg-${color}-50 dark:bg-${color}-900/20 rounded-xl p-4 
                border border-${color}-200 dark:border-${color}-800`}>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">{label}</p>
                <p className={`text-lg font-bold text-${color}-700 dark:text-${color}-300 mt-1`}>{formatRupiah(value)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Budget progress by category */}
      <div className="bg-white dark:bg-dark-card rounded-2xl p-5 shadow-lg">
        <h3 className="text-base font-bold text-gray-800 dark:text-white mb-4">📊 Pengeluaran per Kategori Bulan Ini</h3>
        {expCats.length === 0 ? (
          <p className="text-center text-gray-400 py-6 text-sm">Belum ada pengeluaran bulan ini</p>
        ) : (
          <div className="space-y-4">
            {expCats.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{cat.emoji} {cat.name}</span>
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{formatRupiah(cat.total)}</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-emerald-500"
                      style={{ width: `${Math.min((cat.total / thisMonthExpense) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs text-gray-400 min-w-[36px] text-right">
                  {((cat.total / thisMonthExpense) * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="text-center py-2">
        <p className="text-gray-300 dark:text-gray-700 text-xs">
          Developed by <span className="text-amber-500 font-bold">Gondrong STIES (MaddazXD)</span>
        </p>
      </div>
    </div>
  );
}
