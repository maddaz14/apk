import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';

const EMOJIS = ['🏠','🚗','🍜','🛒','💊','🎮','📃','📚','✈️','🎵','💄','⚽','🐾','🌿','💡','🔧','🎁','💍','🏋️','🎨'];

export default function Settings() {
  const { categories, addCategory, deleteCategory, darkMode, toggleDark } = useFinance();
  const [newCat, setNewCat] = useState({ name: '', emoji: '🏷️', type: 'expense' });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [error, setError] = useState('');

  const handleAdd = async () => {
    if (!newCat.name.trim()) { setError('Nama kategori wajib diisi'); return; }
    if (categories.find((c) => c.name.toLowerCase() === newCat.name.trim().toLowerCase())) {
      setError('Kategori sudah ada'); return;
    }
    await addCategory({ name: newCat.name.trim(), emoji: newCat.emoji, type: newCat.type, isDefault: false });
    setNewCat({ name: '', emoji: '🏷️', type: 'expense' });
    setError('');
  };

  const incCats = categories.filter((c) => c.type === 'income');
  const expCats = categories.filter((c) => c.type === 'expense');

  return (
    <div className="p-4 lg:p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Pengaturan</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Kelola preferensi dan kategori</p>
      </div>

      {/* Dark mode */}
      <div className="bg-white dark:bg-dark-card rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white">Tampilan</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Mode gelap / terang</p>
          </div>
          <button
            onClick={toggleDark}
            className={`relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none
              ${darkMode ? 'bg-emerald-600' : 'bg-gray-300'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md
              transition-transform duration-300 flex items-center justify-center text-xs
              ${darkMode ? 'translate-x-7' : 'translate-x-0'}`}>
              {darkMode ? '🌙' : '☀️'}
            </span>
          </button>
        </div>
      </div>

      {/* Add category */}
      <div className="bg-white dark:bg-dark-card rounded-2xl p-5 shadow-lg">
        <h3 className="font-semibold text-gray-800 dark:text-white mb-4">➕ Tambah Kategori</h3>

        <div className="flex gap-2 mb-3 flex-wrap">
          {['expense', 'income'].map((t) => (
            <button
              key={t}
              onClick={() => setNewCat({ ...newCat, type: t })}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all
                ${newCat.type === t
                  ? t === 'expense' ? 'bg-red-500 text-white' : 'bg-emerald-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
            >
              {t === 'expense' ? '💸 Pengeluaran' : '💰 Pemasukan'}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {/* Emoji picker */}
          <div className="relative">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="w-12 h-12 rounded-xl border border-gray-200 dark:border-gray-700
                bg-gray-50 dark:bg-gray-800 text-xl flex items-center justify-center
                hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {newCat.emoji}
            </button>
            {showEmojiPicker && (
              <div className="absolute top-14 left-0 z-10 bg-white dark:bg-gray-800 rounded-2xl p-3
                shadow-xl border border-gray-100 dark:border-gray-700 grid grid-cols-5 gap-2 w-48">
                {EMOJIS.map((e) => (
                  <button
                    key={e}
                    onClick={() => { setNewCat({ ...newCat, emoji: e }); setShowEmojiPicker(false); }}
                    className="text-xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-1 transition-colors"
                  >
                    {e}
                  </button>
                ))}
              </div>
            )}
          </div>

          <input
            type="text"
            value={newCat.name}
            onChange={(e) => { setNewCat({ ...newCat, name: e.target.value }); setError(''); }}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Nama kategori..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
              bg-gray-50 dark:bg-gray-800 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <button
            onClick={handleAdd}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold
              rounded-xl shadow-md transition-all whitespace-nowrap"
          >
            Tambah
          </button>
        </div>
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      </div>

      {/* Category list */}
      <div className="bg-white dark:bg-dark-card rounded-2xl p-5 shadow-lg">
        <h3 className="font-semibold text-gray-800 dark:text-white mb-4">📋 Daftar Kategori</h3>

        {[
          { label: '💸 Pengeluaran', cats: expCats },
          { label: '💰 Pemasukan', cats: incCats },
        ].map(({ label, cats }) => (
          <div key={label} className="mb-5">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">{label}</p>
            <div className="grid grid-cols-2 gap-2">
              {cats.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between px-3 py-2.5
                  bg-gray-50 dark:bg-gray-800 rounded-xl group">
                  <span className="text-sm dark:text-gray-200">{cat.emoji} {cat.name}</span>
                  {!cat.isDefault && (
                    <button
                      onClick={() => { if (confirm(`Hapus kategori "${cat.name}"?`)) deleteCategory(cat.id); }}
                      className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100
                        transition-all text-sm ml-2"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* About */}
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-5 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-xl">💎</div>
          <div>
            <h3 className="font-bold text-lg">Dana Hemat</h3>
            <p className="text-emerald-200 text-xs">v1.0.0 — Local-First Finance App</p>
          </div>
        </div>
        <p className="text-emerald-100 text-sm leading-relaxed">
          Aplikasi manajemen keuangan pribadi yang mengutamakan privasi. Semua data tersimpan lokal di perangkat Anda.
        </p>
        <div className="mt-4 pt-3 border-t border-white/20 text-center">
          <p className="text-emerald-200 text-xs">Developed by</p>
          <p className="text-amber-400 font-bold text-sm font-mono mt-0.5">Gondrong STIES (MaddazXD)</p>
        </div>
      </div>
    </div>
  );
}
