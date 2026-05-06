import { NavLink } from 'react-router-dom';
import { useFinance } from '../../context/FinanceContext';

const navItems = [
  { to: '/', label: 'Dashboard', icon: '🏠' },
  { to: '/transactions', label: 'Transaksi', icon: '💳' },
  { to: '/budget', label: 'Anggaran', icon: '📊' },
  { to: '/calculator', label: 'Kalkulator', icon: '🧮' },
  { to: '/settings', label: 'Pengaturan', icon: '⚙️' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { darkMode, toggleDark, netWorth } = useFinance();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-30 w-64 flex flex-col
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:flex
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          bg-emerald-700 dark:bg-dark-card
          shadow-2xl lg:shadow-none
        `}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b border-emerald-600 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-xl shadow-glow-gold">
              💎
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-tight">Dana Hemat</h1>
              <p className="text-emerald-200 text-xs">Kelola Keuanganmu</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto scrollbar-hide">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-white/20 text-white shadow-inner backdrop-blur-sm border border-white/20'
                  : 'text-emerald-100 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Dark mode toggle */}
        <div className="px-4 py-3 border-t border-emerald-600 dark:border-gray-700">
          <button
            onClick={toggleDark}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
              text-emerald-100 hover:bg-white/10 hover:text-white transition-all duration-200"
          >
            <span className="text-lg">{darkMode ? '☀️' : '🌙'}</span>
            {darkMode ? 'Mode Terang' : 'Mode Gelap'}
          </button>
        </div>

        {/* Developer watermark */}
        <div className="px-4 py-4 text-center">
          <p className="text-emerald-300 text-[10px] font-mono leading-tight">
            Developed by
          </p>
          <p className="text-amber-400 text-[11px] font-bold font-mono">
            Gondrong STIES (MaddazXD)
          </p>
        </div>
      </aside>
    </>
  );
}
