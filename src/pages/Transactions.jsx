import { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import TransactionForm from '../components/ui/TransactionForm';
import { formatRupiah, exportToCSV } from '../utils/format';

export default function Transactions() {
  const { transactions, deleteTransaction } = useFinance();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortDir, setSortDir] = useState('desc');

  const filtered = useMemo(() => {
    let res = [...transactions];
    if (search) res = res.filter((t) => (t.note || '').toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()));
    if (typeFilter !== 'all') res = res.filter((t) => t.type === typeFilter);
    if (monthFilter) res = res.filter((t) => t.date.startsWith(monthFilter));
    res.sort((a, b) => {
      let va = sortField === 'amount' ? a.amount : new Date(a.date);
      let vb = sortField === 'amount' ? b.amount : new Date(b.date);
      return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });
    return res;
  }, [transactions, search, typeFilter, monthFilter, sortField, sortDir]);

  const toggleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDir('desc'); }
  };

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Riwayat Transaksi</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{transactions.length} transaksi total</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportToCSV(filtered)}
            className="px-4 py-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400
              border border-emerald-600 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
          >
            📥 Export CSV
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700
              rounded-xl shadow-md transition-all"
          >
            + Tambah
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-dark-card rounded-2xl p-4 shadow-md grid grid-cols-2 lg:grid-cols-4 gap-3">
        <input
          type="text"
          placeholder="🔍 Cari catatan / kategori..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="col-span-2 lg:col-span-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700
            bg-gray-50 dark:bg-gray-800 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700
            bg-gray-50 dark:bg-gray-800 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="all">Semua Tipe</option>
          <option value="income">Pemasukan</option>
          <option value="expense">Pengeluaran</option>
        </select>
        <input
          type="month"
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700
            bg-gray-50 dark:bg-gray-800 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          onClick={() => { setSearch(''); setTypeFilter('all'); setMonthFilter(''); }}
          className="px-4 py-2 rounded-xl text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          ✕ Reset
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th
                  onClick={() => toggleSort('date')}
                  className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-300 cursor-pointer hover:text-emerald-600 select-none"
                >
                  Tanggal {sortField === 'date' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">Tipe</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">Kategori</th>
                <th
                  onClick={() => toggleSort('amount')}
                  className="text-right px-5 py-3 font-semibold text-gray-600 dark:text-gray-300 cursor-pointer hover:text-emerald-600 select-none"
                >
                  Nominal {sortField === 'amount' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-300 hidden lg:table-cell">Catatan</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">Tidak ada transaksi ditemukan</td>
                </tr>
              ) : (
                filtered.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                      {new Date(tx.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                        ${tx.type === 'income'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                          : 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400'}`}>
                        {tx.type === 'income' ? '💰 Masuk' : '💸 Keluar'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-700 dark:text-gray-300">{tx.category}</td>
                    <td className={`px-5 py-3 text-right font-bold
                      ${tx.type === 'income' ? 'text-emerald-600' : 'text-red-500'}`}>
                      {tx.type === 'income' ? '+' : '-'}{formatRupiah(tx.amount)}
                    </td>
                    <td className="px-5 py-3 text-gray-400 hidden lg:table-cell">{tx.note || '-'}</td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => { if (confirm('Hapus transaksi ini?')) deleteTransaction(tx.id); }}
                        className="text-red-400 hover:text-red-600 transition-colors text-lg"
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Watermark */}
      <div className="text-center py-2">
        <p className="text-gray-300 dark:text-gray-700 text-xs">
          Developed by <span className="text-amber-500 font-bold">Gondrong STIES (MaddazXD)</span>
        </p>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-card rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">Tambah Transaksi</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            <div className="p-6">
              <TransactionForm onClose={() => setShowForm(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
