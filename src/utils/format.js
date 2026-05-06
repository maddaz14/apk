export function formatRupiah(amount) {
  if (isNaN(amount)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function parseRupiah(str) {
  return parseInt(str.replace(/\D/g, ''), 10) || 0;
}

export function formatRupiahInput(value) {
  const num = value.replace(/\D/g, '');
  if (!num) return '';
  return new Intl.NumberFormat('id-ID').format(parseInt(num, 10));
}

export function exportToCSV(transactions) {
  const headers = ['ID', 'Tanggal', 'Tipe', 'Kategori', 'Nominal', 'Catatan'];
  const rows = transactions.map((t) => [
    t.id,
    t.date,
    t.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
    t.category,
    t.amount,
    `"${(t.note || '').replace(/"/g, '""')}"`,
  ]);
  const csvContent = [headers, ...rows].map((r) => r.join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Laporan_DanaHemat.csv';
  link.click();
  URL.revokeObjectURL(url);
}

export function formatCompact(num) {
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}M`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}Jt`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`;
  return num.toString();
}
