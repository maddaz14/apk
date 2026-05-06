import { useState } from 'react';
import { formatRupiah, formatRupiahInput, parseRupiah } from '../utils/format';

function CompoundInterest() {
  const [form, setForm] = useState({ principal: '', monthly: '', rate: '', years: '' });
  const [result, setResult] = useState(null);

  const calculate = () => {
    const P = parseRupiah(form.principal);
    const PMT = parseRupiah(form.monthly);
    const r = parseFloat(form.rate) / 100 / 12;
    const n = parseInt(form.years) * 12;
    if (!n || isNaN(r)) return;
    const futureValuePrincipal = P * Math.pow(1 + r, n);
    const futureValueContrib = r > 0 ? PMT * ((Math.pow(1 + r, n) - 1) / r) : PMT * n;
    const fv = futureValuePrincipal + futureValueContrib;
    const totalDeposited = P + PMT * n;
    const interest = fv - totalDeposited;
    setResult({ fv, totalDeposited, interest });
  };

  const input = (key, label, placeholder, isRupiah) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      {isRupiah ? (
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Rp</span>
          <input type="text" inputMode="numeric"
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: formatRupiahInput(e.target.value) })}
            placeholder={placeholder}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
              bg-gray-50 dark:bg-gray-800 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      ) : (
        <input type="number" min="0"
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
            bg-gray-50 dark:bg-gray-800 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {input('principal', '💰 Modal Awal', '0', true)}
        {input('monthly', '📅 Setoran Bulanan', '0', true)}
        {input('rate', '📈 Suku Bunga / Tahun (%)', 'mis: 8', false)}
        {input('years', '⏳ Jangka Waktu (Tahun)', 'mis: 10', false)}
      </div>
      <button onClick={calculate}
        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all">
        Hitung Nilai Masa Depan
      </button>
      {result && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 space-y-2 border border-emerald-200 dark:border-emerald-800">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Total Disetor</span>
            <span className="font-semibold dark:text-white">{formatRupiah(result.totalDeposited)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Bunga Majemuk</span>
            <span className="font-semibold text-emerald-600">{formatRupiah(result.interest)}</span>
          </div>
          <div className="h-px bg-emerald-200 dark:bg-emerald-700" />
          <div className="flex justify-between">
            <span className="font-bold text-gray-800 dark:text-white">Nilai Masa Depan</span>
            <span className="font-bold text-xl text-emerald-700 dark:text-emerald-300">{formatRupiah(result.fv)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function LoanCalculator() {
  const [form, setForm] = useState({ principal: '', rate: '', months: '' });
  const [result, setResult] = useState(null);

  const calculate = () => {
    const P = parseRupiah(form.principal);
    const r = parseFloat(form.rate) / 100 / 12;
    const n = parseInt(form.months);
    if (!P || !n) return;
    let monthly, totalPaid, totalInterest;
    if (r === 0) {
      monthly = P / n;
      totalPaid = P;
      totalInterest = 0;
    } else {
      monthly = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
      totalPaid = monthly * n;
      totalInterest = totalPaid - P;
    }
    const schedule = Array.from({ length: Math.min(n, 12) }, (_, i) => {
      const bunga = P * r;
      const pokok = monthly - bunga;
      return { bulan: i + 1, pokok: Math.round(pokok), bunga: Math.round(bunga) };
    });
    setResult({ monthly, totalPaid, totalInterest, schedule });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">💳 Jumlah Pinjaman</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Rp</span>
            <input type="text" inputMode="numeric"
              value={form.principal}
              onChange={(e) => setForm({ ...form, principal: formatRupiahInput(e.target.value) })}
              placeholder="0"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
                bg-gray-50 dark:bg-gray-800 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">📈 Bunga / Tahun (%)</label>
          <input type="number" min="0" value={form.rate}
            onChange={(e) => setForm({ ...form, rate: e.target.value })}
            placeholder="mis: 12"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
              bg-gray-50 dark:bg-gray-800 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">📅 Tenor (Bulan)</label>
          <input type="number" min="1" value={form.months}
            onChange={(e) => setForm({ ...form, months: e.target.value })}
            placeholder="mis: 36"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
              bg-gray-50 dark:bg-gray-800 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>
      <button onClick={calculate}
        className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-all">
        Simulasi Angsuran
      </button>
      {result && (
        <div className="space-y-3">
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 space-y-2 border border-amber-200 dark:border-amber-800">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Angsuran per Bulan</span>
              <span className="font-bold text-lg text-amber-700 dark:text-amber-400">{formatRupiah(result.monthly)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Total Bayar</span>
              <span className="font-semibold dark:text-white">{formatRupiah(result.totalPaid)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Total Bunga</span>
              <span className="font-semibold text-red-500">{formatRupiah(result.totalInterest)}</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr className="bg-gray-50 dark:bg-gray-800">
                <th className="px-3 py-2 text-left text-gray-500 dark:text-gray-400">Bulan</th>
                <th className="px-3 py-2 text-right text-gray-500 dark:text-gray-400">Pokok</th>
                <th className="px-3 py-2 text-right text-gray-500 dark:text-gray-400">Bunga</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {result.schedule.map((r) => (
                  <tr key={r.bulan} className="dark:text-gray-300">
                    <td className="px-3 py-1.5">Bulan {r.bulan}</td>
                    <td className="px-3 py-1.5 text-right text-emerald-600">{formatRupiah(r.pokok)}</td>
                    <td className="px-3 py-1.5 text-right text-red-500">{formatRupiah(r.bunga)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {parseInt(form.months) > 12 && (
              <p className="text-center text-xs text-gray-400 mt-2">Menampilkan 12 bulan pertama</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function InflationCalculator() {
  const [form, setForm] = useState({ amount: '', inflation: '', years: '' });
  const [result, setResult] = useState(null);

  const calculate = () => {
    const P = parseRupiah(form.amount);
    const r = parseFloat(form.inflation) / 100;
    const n = parseInt(form.years);
    if (!P || isNaN(r) || !n) return;
    const futureValue = P * Math.pow(1 + r, n);
    const realValueToday = P / Math.pow(1 + r, n);
    const loss = P - realValueToday;
    setResult({ futureValue, realValueToday, loss, deprPct: ((loss / P) * 100).toFixed(1) });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">💵 Nilai Uang Saat Ini</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Rp</span>
            <input type="text" inputMode="numeric"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: formatRupiahInput(e.target.value) })}
              placeholder="0"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
                bg-gray-50 dark:bg-gray-800 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">📉 Inflasi / Tahun (%)</label>
          <input type="number" min="0" value={form.inflation}
            onChange={(e) => setForm({ ...form, inflation: e.target.value })}
            placeholder="mis: 3.5"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
              bg-gray-50 dark:bg-gray-800 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">⏳ Proyeksi (Tahun)</label>
          <input type="number" min="1" value={form.years}
            onChange={(e) => setForm({ ...form, years: e.target.value })}
            placeholder="mis: 10"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
              bg-gray-50 dark:bg-gray-800 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>
      <button onClick={calculate}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all">
        Hitung Depresiasi
      </button>
      {result && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 space-y-2 border border-blue-200 dark:border-blue-800">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Biaya di Masa Depan</span>
            <span className="font-bold text-red-500">{formatRupiah(result.futureValue)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Nilai Riil Uangmu Sekarang</span>
            <span className="font-semibold dark:text-white">{formatRupiah(result.realValueToday)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Kehilangan Daya Beli</span>
            <span className="font-semibold text-red-500">{formatRupiah(result.loss)}</span>
          </div>
          <div className="h-px bg-blue-200 dark:bg-blue-700" />
          <div className="flex justify-between">
            <span className="font-bold text-gray-800 dark:text-white">Depresiasi Total</span>
            <span className="font-bold text-xl text-red-500">{result.deprPct}%</span>
          </div>
        </div>
      )}
    </div>
  );
}

const TABS = [
  { id: 'compound', label: '📈 Bunga Majemuk', Component: CompoundInterest },
  { id: 'loan', label: '💳 Kredit Efektif', Component: LoanCalculator },
  { id: 'inflation', label: '📉 Inflasi', Component: InflationCalculator },
];

export default function Calculator() {
  const [activeTab, setActiveTab] = useState('compound');

  const ActiveComp = TABS.find((t) => t.id === activeTab)?.Component;

  return (
    <div className="p-4 lg:p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Kalkulator Finansial</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Simulasi presisi tinggi untuk keputusan keuanganmu</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 rounded-2xl p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-semibold transition-all duration-200
              ${activeTab === tab.id
                ? 'bg-white dark:bg-dark-card text-emerald-700 dark:text-emerald-400 shadow-md'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Calculator card */}
      <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-lg">
        {ActiveComp && <ActiveComp />}
      </div>

      <div className="text-center py-2">
        <p className="text-gray-300 dark:text-gray-700 text-xs">
          Developed by <span className="text-amber-500 font-bold">Gondrong STIES (MaddazXD)</span>
        </p>
      </div>
    </div>
  );
}
