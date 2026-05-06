import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useFinance } from '../../context/FinanceContext';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { darkMode } = useFinance();

  return (
    <div className={`flex h-screen overflow-hidden bg-gray-50 dark:bg-dark-bg transition-colors duration-300`}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar mobile */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3
          bg-emerald-700 dark:bg-dark-card shadow-md z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-white font-bold text-lg">💎 Dana Hemat</span>
          <div className="w-10" />
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
