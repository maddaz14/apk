import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { useFinanceData } from '../hooks/useFinanceData';

const FinanceContext = createContext(null);

export function FinanceProvider({ children }) {
  const financeData = useFinanceData();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('dana-hemat-dark') === 'true';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('dana-hemat-dark', darkMode);
  }, [darkMode]);

  const toggleDark = () => setDarkMode((v) => !v);

  return (
    <FinanceContext.Provider value={{ ...financeData, darkMode, toggleDark }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error('useFinance must be used inside FinanceProvider');
  return ctx;
}
