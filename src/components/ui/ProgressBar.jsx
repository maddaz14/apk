export default function ProgressBar({ label, current, limit, color = 'emerald' }) {
  const pct = limit > 0 ? Math.min((current / limit) * 100, 100) : 0;
  const isOver = current > limit;

  const barColor = isOver
    ? 'bg-red-500'
    : pct > 80
    ? 'bg-amber-500'
    : `bg-${color}-500`;

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <span className={`text-xs font-bold ${isOver ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
          {pct.toFixed(0)}%
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
