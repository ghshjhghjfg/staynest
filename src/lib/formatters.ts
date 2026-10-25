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
    return 'bg-[#287A52]/10 text-[#287A52] border border-[#287A52]/20';
  }
  
  if (['pending', 'in progress', 'assigned', 'partially paid', 'submitted'].includes(normalized)) {
    return 'bg-[#A66B16]/10 text-[#A66B16] border border-[#A66B16]/20';
  }
  
  if (['rejected', 'absent', 'overdue', 'cancelled', 'urgent', 'high'].includes(normalized)) {
    return 'bg-[#B54747]/10 text-[#B54747] border border-[#B54747]/20';
  }
  
  if (['checked out', 'closed', 'released', 'on leave'].includes(normalized)) {
    return 'bg-[#727A84]/15 text-[#0C1629] border border-[#727A84]/25';
  }
  
  return 'bg-[#356B9A]/10 text-[#356B9A] border border-[#356B9A]/20';
}
