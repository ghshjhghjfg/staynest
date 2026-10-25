/**
 * Currency, Date, and Visual Status Formatters
 * Adheres to Indian Rupee (INR) formatting and the specified visual design system
 */

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatINRWithDecimals(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString: string | Date | undefined | null): string {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return String(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(dateString: string | Date | undefined | null): string {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return String(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getStatusBadgeClasses(status: string): string {
  const normalized = status.toLowerCase();
  
  if (['paid', 'active', 'approved', 'resolved', 'completed', 'present', 'inside'].includes(normalized)) {
    return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  }
  
  if (['pending', 'in progress', 'assigned', 'partially paid', 'submitted'].includes(normalized)) {
    return 'bg-amber-50 text-amber-700 border border-amber-200';
  }
  
  if (['rejected', 'absent', 'overdue', 'cancelled', 'urgent', 'high'].includes(normalized)) {
    return 'bg-red-50 text-red-700 border border-red-200';
  }
  
  if (['checked out', 'closed', 'released', 'on leave'].includes(normalized)) {
    return 'bg-slate-100 text-slate-700 border border-slate-200';
  }
  
  return 'bg-blue-50 text-[#2563EB] border border-blue-200';
}
