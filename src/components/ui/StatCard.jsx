export default function StatCard({ title, value, icon, color = 'emerald', sub }) {
  const colors = {
    emerald: 'from-emerald-500 to-emerald-700',
    red: 'from-red-400 to-red-600',
    amber: 'from-amber-400 to-amber-600',
    blue: 'from-blue-400 to-blue-600',
  };

  return (
    <div className={`
      bg-gradient-to-br ${colors[color]} rounded-2xl p-5 text-white shadow-lg
      hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200
    `}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/70 text-xs font-medium uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-bold mt-1 leading-tight">{value}</p>
          {sub && <p className="text-white/60 text-xs mt-1">{sub}</p>}
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
}
