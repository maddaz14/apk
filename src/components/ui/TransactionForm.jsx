import { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatRupiahInput, parseRupiah } from '../../utils/format';

export default function TransactionForm({ onClose }) {
  const { addTransaction, categories } = useFinance();
  const [form, setForm] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    type: 'expense',
    category: '',
    note: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const filteredCats = categories.filter((c) => c.type === form.type);

  const validate = () => {
    const e = {};
    if (!form.amount || parseRupiah(form.amount) <= 0) e.amount = 'Nominal harus lebih dari 0';
    if (!form.date) e.date = 'Tanggal wajib diisi';
    if (!form.category) e.category = 'Pilih kategori';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    await addTransaction({
      amount: parseRupiah(form.amount),
      date: form.date,
      type: form.type,
      category: form.category,
      note: form.note,
    });
    setLoading(false);
    onClose?.();
  };

  const inputClass = (field) =>
    `w-full px-4 py-2.5 rounded-xl border text-sm
    bg-white dark:bg-gray-800 dark:text-white
    focus:outline-none focus:ring-2 focus:ring-emerald-500
    transition-colors duration-200
    ${errors[field] ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Type toggle */}
      <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
        {['expense', 'income'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setForm({ ...form, type: t, category: '' })}
            className={`flex-1 py-2.5 text-sm font-semibold transition-colors duration-200
              ${form.type === t
                ? t === 'expense'
                  ? 'bg-red-500 text-white'
                  : 'bg-emerald-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
          >
            {t === 'expense' ? '💸 Pengeluaran' : '💰 Pemasukan'}
          </button>
        ))}
      </div>

      {/* Amount */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Nominal (Rp)
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">Rp</span>
          <input
            type="text"
            inputMode="numeric"
            value={form.amount}
            onChange={(e) => {
              setForm({ ...form, amount: formatRupiahInput(e.target.value) });
              setErrors({ ...errors, amount: '' });
            }}
            placeholder="0"
            className={`${inputClass('amount')} pl-10`}
          />
        </div>
        {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tanggal</label>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className={inputClass('date')}
        />
        {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kategori</label>
        <select
          value={form.category}
          onChange={(e) => { setForm({ ...form, category: e.target.value }); setErrors({ ...errors, category: '' }); }}
          className={inputClass('category')}
        >
          <option value="">-- Pilih Kategori --</option>
          {filteredCats.map((c) => (
            <option key={c.id} value={c.name}>{c.emoji} {c.name}</option>
          ))}
        </select>
        {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
      </div>

      {/* Note */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Catatan</label>
        <input
          type="text"
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          placeholder="Opsional..."
          className={inputClass('note')}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50
          text-white font-semibold rounded-xl shadow-md hover:shadow-lg
          transition-all duration-200 transform hover:-translate-y-0.5"
      >
        {loading ? '⏳ Menyimpan...' : '✅ Simpan Transaksi'}
      </button>
    </form>
  );
}
