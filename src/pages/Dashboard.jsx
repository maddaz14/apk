import { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, BarChart, Bar, Legend, ResponsiveContainer
} from 'recharts';
import { useFinance } from '../context/FinanceContext';
import StatCard from '../components/ui/StatCard';
import TransactionForm from '../components/ui/TransactionForm';
import { formatRupiah, formatCompact } from '../utils/format';

const COLORS = ['#059669','#f59e0b','#3b82f6','#ef4444','#8b5cf6','#ec4899','#06b6d4','#84cc16'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-3 border border-gray-100 dark:border-gray-700 text-xs">
        <p className="font-bold text-gray-700 dark:text-gray-200 mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: {formatRupiah(p.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const {
    netWorth, thisMonthIncome, thisMonthExpense,
    last7Days, expenseByCategory, transactions,
    lastMonthExpense, loading
  } = useFinance();

  const [showForm, setShowForm] = useState(false);

  // Compare bar data
  const compareData = [
    { name: 'Bulan Lalu', pengeluaran: lastMonthExpense },
    { name: 'Bulan Ini', pengeluaran: thisMonthExpense },
  ];

  const recentTxs = transactions.slice(0, 5);

  if (loading) return (
    <div className="flex items-center justify-center h-full min-h-screen">
      <div className="text-center">
        <div className="text-5xl mb-4 animate-bounce">💎</div>
        <p className="text-gray-500 dark:text-gray-400">Memuat data...</p>
      </div>
    </div>
  );

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {new Date().toLocaleDateString('id-ID', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700
            text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg
            transition-all duration-200 transform hover:-translate-y-0.5"
        >
          <span className="text-lg">+</span> Tambah
        </button>
      </div>

      {/* Net Worth Hero */}
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 dark:shadow-glow-green
        rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-10 -translate-x-10" />
        <div className="relative">
          <p className="text-emerald-200 text-sm font-medium uppercase tracking-widest">Kekayaan Bersih</p>
          <p className={`text-4xl font-bold mt-2 ${netWorth < 0 ? 'text-red-300' : 'text-white'}`}>
            {formatRupiah(netWorth)}
          </p>
          <div className="mt-4 h-px bg-white/20" />
          <div className="mt-4">
            <p className="text-emerald-200 text-xs mb-2 font-medium">Tren 7 Hari Terakhir</p>
            <ResponsiveContainer width="100%" height={80}>
              <AreaChart data={last7Days} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a7f3d0" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#a7f3d0" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fca5a5" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#fca5a5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="pemasukan" stroke="#a7f3d0" fill="url(#incomeGrad)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="pengeluaran" stroke="#fca5a5" fill="url(#expenseGrad)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Pemasukan Bulan Ini" value={formatCompact(thisMonthIncome)} icon="💰" color="emerald" sub={formatRupiah(thisMonthIncome)} />
        <StatCard title="Pengeluaran Bulan Ini" value={formatCompact(thisMonthExpense)} icon="💸" color="red" sub={formatRupiah(thisMonthExpense)} />
        <StatCard title="Saldo Bersih" value={formatCompact(thisMonthIncome - thisMonthExpense)} icon="📊" color="blue" />
        <StatCard title="Transaksi" value={transactions.length} icon="🔢" color="amber" sub="total semua waktu" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Area chart full */}
        <div className="bg-white dark:bg-dark-card rounded-2xl p-5 shadow-lg">
          <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-4">📈 Arus Kas 7 Hari</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={last7Days}>
              <defs>
                <linearGradient id="gi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ge" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => formatCompact(v)} tick={{ fontSize: 11 }} width={50} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area type="monotone" dataKey="pemasukan" name="Pemasukan" stroke="#059669" fill="url(#gi)" strokeWidth={2} />
              <Area type="monotone" dataKey="pengeluaran" name="Pengeluaran" stroke="#ef4444" fill="url(#ge)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="bg-white dark:bg-dark-card rounded-2xl p-5 shadow-lg">
          <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-4">🥧 Pengeluaran per Kategori</h3>
          {expenseByCategory.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">Belum ada pengeluaran bulan ini</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={expenseByCategory}
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  innerRadius={35}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {expenseByCategory.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatRupiah(v)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Bar comparison + Recent transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar chart */}
        <div className="bg-white dark:bg-dark-card rounded-2xl p-5 shadow-lg">
          <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-4">📊 Perbandingan Pengeluaran</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={compareData} barSize={50}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v) => formatCompact(v)} tick={{ fontSize: 11 }} width={50} />
              <Tooltip formatter={(v) => formatRupiah(v)} />
              <Bar dataKey="pengeluaran" name="Pengeluaran" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent transactions */}
        <div className="bg-white dark:bg-dark-card rounded-2xl p-5 shadow-lg">
          <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-4">⚡ Transaksi Terbaru</h3>
          {recentTxs.length === 0 ? (
            <div className="text-center text-gray-400 text-sm py-8">Belum ada transaksi</div>
          ) : (
            <div className="space-y-3">
              {recentTxs.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm
                      ${tx.type === 'income' ? 'bg-emerald-100 dark:bg-emerald-900' : 'bg-red-100 dark:bg-red-900'}`}>
                      {tx.type === 'income' ? '💰' : '💸'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{tx.category}</p>
                      <p className="text-xs text-gray-400">{new Date(tx.date).toLocaleDateString('id-ID')}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${tx.type === 'income' ? 'text-emerald-600' : 'text-red-500'}`}>
                    {tx.type === 'income' ? '+' : '-'}{formatRupiah(tx.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer watermark */}
      <div className="text-center py-4">
        <p className="text-gray-400 dark:text-gray-600 text-xs">
          Developed by <span className="text-amber-500 font-bold">Gondrong STIES (MaddazXD)</span>
        </p>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-card rounded-2xl w-full max-w-md shadow-2xl
            transform transition-all duration-300 scale-100">
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">Tambah Transaksi</h3>
              <button onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl leading-none">×</button>
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
