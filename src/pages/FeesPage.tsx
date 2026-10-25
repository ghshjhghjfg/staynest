import React, { useState, useEffect } from 'react';
import {
  Wallet,
  Search,
  Plus,
  Download,
  Printer,
  CheckCircle2,
  AlertCircle,
  FileText,
  X,
  CreditCard,
  Building2,
} from 'lucide-react';
import { dataStore } from '../services/dataStore';
import { FeeCharge, PaymentRecord, StudentRecord } from '../types';
import { useAuth } from '../features/auth/AuthContext';
import { formatINR, formatDateTime, getStatusBadgeClasses } from '../lib/formatters';

export const FeesPage: React.FC = () => {
  const { role, currentUser } = useAuth();
  const [feeCharges, setFeeCharges] = useState<FeeCharge[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [students, setStudents] = useState<StudentRecord[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [showChargeModal, setShowChargeModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentRecord | null>(null);

  // New Charge State
  const [chargeForm, setChargeForm] = useState({
    student_id: '',
    category: 'Hostel Rent' as FeeCharge['category'],
    amount: 35000,
    due_date: '2026-11-15',
    description: '',
  });

  // Record Payment State
  const [paymentForm, setPaymentForm] = useState({
    student_id: '',
    fee_category: 'Hostel Rent',
    amount: 35000,
    payment_method: 'UPI' as PaymentRecord['payment_method'],
    transaction_reference: '',
    payment_status: 'Confirmed' as PaymentRecord['payment_status'],
  });

  const loadData = () => {
    setFeeCharges(dataStore.getFeeCharges());
    setPayments(dataStore.getPayments());
    setStudents(dataStore.getStudents());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('staynest_store_updated', loadData);
    return () => window.removeEventListener('staynest_store_updated', loadData);
  }, []);

  // Aggregates
  const totalBilled = feeCharges.reduce((sum, c) => sum + c.amount, 0);
  const totalCollected = payments
    .filter((p) => p.payment_status === 'Confirmed')
    .reduce((sum, p) => sum + p.amount, 0);
  const outstandingBalance = Math.max(0, totalBilled - totalCollected);

  // Filtered views
  const filteredCharges = feeCharges.filter((c) => {
    if (role === 'student' && c.student_id !== currentUser?.id) {
      // Students see only their charges
      const studentMatch = students.find((s) => s.email === currentUser?.email);
      if (!studentMatch || c.student_id !== studentMatch.id) return false;
    }
    const matchesSearch =
      c.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.student_code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || c.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleCreateCharge = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find((s) => s.id === chargeForm.student_id);
    if (!student) {
      alert('Please select a student.');
      return;
    }

    dataStore.addFeeCharge({
      student_id: student.id,
      student_name: student.full_name,
      student_code: student.student_code,
      category: chargeForm.category,
      amount: Number(chargeForm.amount),
      due_date: chargeForm.due_date,
      description: chargeForm.description || `${chargeForm.category} dues for semester`,
    });

    setShowChargeModal(false);
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find((s) => s.id === paymentForm.student_id);
    if (!student) {
      alert('Please select a student.');
      return;
    }

    dataStore.recordPayment({
      student_id: student.id,
      student_name: student.full_name,
      student_code: student.student_code,
      fee_category: paymentForm.fee_category,
      amount: Number(paymentForm.amount),
      payment_method: paymentForm.payment_method,
      transaction_reference: paymentForm.transaction_reference || `TXN-${Date.now()}`,
      payment_status: paymentForm.payment_status,
      recorded_by: currentUser?.full_name || 'Accounts Desk',
    });

    setShowPaymentModal(false);
  };

  const handleExportCSV = () => {
    const headers = ['Receipt No', 'Student', 'Roll No', 'Category', 'Amount', 'Method', 'Reference', 'Status', 'Date'];
    const rows = payments.map((p) => [
      p.receipt_number,
      p.student_name,
      p.student_code,
      p.fee_category,
      p.amount,
      p.payment_method,
      p.transaction_reference,
      p.payment_status,
      p.recorded_at,
    ]);
    dataStore.exportToCSV('staynest_fee_payments_report', headers, rows);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0C1629]">Hostel Fee & Payment Administration</h2>
          <p className="text-xs text-[#727A84]">
            Audited ledger of accommodation, mess, utilities, and verified student receipts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-white hover:bg-[#F0F3F3] border border-[#D6DCE0] text-[#0C1629] rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#727A84]" />
            <span>Export Report</span>
          </button>
          {(role === 'admin' || role === 'warden') && (
            <>
              <button
                onClick={() => setShowChargeModal(true)}
                className="px-3 py-2 bg-white hover:bg-[#F0F3F3] border border-[#D6DCE0] text-[#0C1629] rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#727A84]" />
                <span>Assign Fee Charge</span>
              </button>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="px-3.5 py-2 bg-[#0C1629] hover:bg-[#1A2942] text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>Record Payment</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#D6DCE0] shadow-xs">
          <span className="text-xs text-[#727A84] font-medium">Total Billed Charges</span>
          <p className="text-2xl font-bold text-[#0C1629] mt-1">{formatINR(totalBilled)}</p>
          <span className="text-[11px] text-[#727A84] mt-1 block">Includes Rent, Mess & Utilities</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#D6DCE0] shadow-xs">
          <span className="text-xs text-[#727A84] font-medium">Total Confirmed Collections</span>
          <p className="text-2xl font-bold text-[#287A52] mt-1">{formatINR(totalCollected)}</p>
          <span className="text-[11px] text-[#287A52] mt-1 block">
            {payments.filter((p) => p.payment_status === 'Confirmed').length} verified transactions
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#D6DCE0] shadow-xs">
          <span className="text-xs text-[#727A84] font-medium">Outstanding Balances</span>
          <p className="text-2xl font-bold text-[#A66B16] mt-1">{formatINR(outstandingBalance)}</p>
          <span className="text-[11px] text-[#727A84] mt-1 block">Charges minus confirmed payments</span>
        </div>
      </div>

      {/* Charges & Payments Split Views */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Fee Charges Assigned */}
        <div className="lg:col-span-7 space-y-3">
          <div className="bg-white p-3.5 rounded-xl border border-[#D6DCE0] shadow-xs flex items-center justify-between">
            <h3 className="font-semibold text-xs text-[#0C1629]">Scheduled Fee Charges</h3>
            <div className="flex items-center gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-2 py-1 bg-[#F0F3F3] border border-[#D6DCE0] rounded text-xs"
              >
                <option value="ALL">All Categories</option>
                <option value="Hostel Rent">Hostel Rent</option>
                <option value="Mess Fee">Mess Fee</option>
                <option value="Maintenance & Utilities">Maintenance & Utilities</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#D6DCE0] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F0F3F3] text-[#727A84] uppercase text-[10px] font-semibold border-b border-[#D6DCE0]">
                  <tr>
                    <th className="py-2.5 px-3">Student</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Due Date</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D6DCE0]/60">
                  {filteredCharges.map((c) => (
                    <tr key={c.id} className="hover:bg-[#F0F3F3]/50">
                      <td className="py-2.5 px-3">
                        <span className="font-semibold text-[#0C1629] block">{c.student_name}</span>
                        <span className="text-[10px] text-[#727A84]">{c.student_code}</span>
                      </td>
                      <td className="py-2.5 px-3 text-[#0C1629]">{c.category}</td>
                      <td className="py-2.5 px-3 font-semibold text-[#0C1629]">{formatINR(c.amount)}</td>
                      <td className="py-2.5 px-3 text-[#727A84]">{c.due_date}</td>
                      <td className="py-2.5 px-3 text-right">
                        {(role === 'admin' || role === 'warden') && (
                          <button
                            onClick={() => {
                              setPaymentForm({
                                student_id: c.student_id,
                                fee_category: c.category,
                                amount: c.amount,
                                payment_method: 'UPI',
                                transaction_reference: '',
                                payment_status: 'Confirmed',
                              });
                              setShowPaymentModal(true);
                            }}
                            className="text-[11px] text-[#356B9A] font-semibold hover:underline"
                          >
                            Record Pay
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Payment Ledger & Receipt Generation */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-white p-3.5 rounded-xl border border-[#D6DCE0] shadow-xs flex items-center justify-between">
            <h3 className="font-semibold text-xs text-[#0C1629]">Recent Payment Records</h3>
            <span className="text-[10px] text-[#727A84]">{payments.length} entries</span>
          </div>

          <div className="bg-white rounded-xl border border-[#D6DCE0] shadow-xs overflow-hidden">
            <div className="divide-y divide-[#D6DCE0]/60 max-h-[480px] overflow-y-auto">
              {payments.map((p) => (
                <div key={p.id} className="p-3.5 hover:bg-[#F0F3F3]/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-xs text-[#0C1629]">{p.student_name}</span>
                      <span className="text-[10px] font-mono text-[#727A84] ml-2">{p.receipt_number}</span>
                    </div>
                    <span className="font-bold text-xs text-[#287A52]">{formatINR(p.amount)}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-[#727A84]">
                    <span>
                      {p.fee_category} • {p.payment_method}
                    </span>
                    <button
                      onClick={() => setSelectedReceipt(p)}
                      className="text-[#356B9A] font-medium flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Printer className="w-3 h-3" />
                      <span>Receipt</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Assign Fee Charge Modal */}
      {showChargeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-[#D6DCE0]">
            <div className="flex items-center justify-between pb-3 border-b border-[#D6DCE0]">
              <h3 className="font-bold text-base text-[#0C1629]">Assign Fee Charge</h3>
              <button onClick={() => setShowChargeModal(false)} className="text-[#727A84] hover:text-[#0C1629]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateCharge} className="py-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#0C1629] mb-1">Select Student *</label>
                <select
                  required
                  value={chargeForm.student_id}
                  onChange={(e) => setChargeForm({ ...chargeForm, student_id: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                >
                  <option value="">-- Choose Student --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.full_name} ({s.student_code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#0C1629] mb-1">Fee Category *</label>
                <select
                  value={chargeForm.category}
                  onChange={(e) => setChargeForm({ ...chargeForm, category: e.target.value as any })}
                  className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                >
                  <option value="Hostel Rent">Hostel Rent</option>
                  <option value="Mess Fee">Mess Fee</option>
                  <option value="Maintenance & Utilities">Maintenance & Utilities</option>
                  <option value="Security Deposit">Security Deposit</option>
                  <option value="Gym & Amenities">Gym & Amenities</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0C1629] mb-1">Amount (INR) *</label>
                  <input
                    type="number"
                    min="100"
                    required
                    value={chargeForm.amount}
                    onChange={(e) => setChargeForm({ ...chargeForm, amount: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0C1629] mb-1">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={chargeForm.due_date}
                    onChange={(e) => setChargeForm({ ...chargeForm, due_date: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0C1629] mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Semester 5 Accommodation Dues"
                  value={chargeForm.description}
                  onChange={(e) => setChargeForm({ ...chargeForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#D6DCE0]">
                <button
                  type="button"
                  onClick={() => setShowChargeModal(false)}
                  className="px-4 py-2 border border-[#D6DCE0] rounded-md"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[#0C1629] text-white rounded-md font-semibold">
                  Save Charge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-[#D6DCE0]">
            <div className="flex items-center justify-between pb-3 border-b border-[#D6DCE0]">
              <h3 className="font-bold text-base text-[#0C1629]">Record Confirmed Payment</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-[#727A84] hover:text-[#0C1629]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleRecordPayment} className="py-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#0C1629] mb-1">Select Student *</label>
                <select
                  required
                  value={paymentForm.student_id}
                  onChange={(e) => setPaymentForm({ ...paymentForm, student_id: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                >
                  <option value="">-- Choose Student --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.full_name} ({s.student_code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#0C1629] mb-1">Fee Category *</label>
                <select
                  value={paymentForm.fee_category}
                  onChange={(e) => setPaymentForm({ ...paymentForm, fee_category: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                >
                  <option value="Hostel Rent">Hostel Rent</option>
                  <option value="Mess Fee">Mess Fee</option>
                  <option value="Maintenance & Utilities">Maintenance & Utilities</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0C1629] mb-1">Amount Paid (INR) *</label>
                  <input
                    type="number"
                    min="100"
                    required
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0C1629] mb-1">Payment Method</label>
                  <select
                    value={paymentForm.payment_method}
                    onChange={(e) => setPaymentForm({ ...paymentForm, payment_method: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                  >
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Bank Transfer (NEFT)</option>
                    <option value="Demand Draft">Demand Draft</option>
                    <option value="Cash Receipt">Cash Receipt</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0C1629] mb-1">Transaction Ref / Cheque No *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UPI/772834112930/HDFC"
                  value={paymentForm.transaction_reference}
                  onChange={(e) => setPaymentForm({ ...paymentForm, transaction_reference: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#D6DCE0]">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 border border-[#D6DCE0] rounded-md"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[#0C1629] text-white rounded-md font-semibold">
                  Record & Issue Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-[#D6DCE0] animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#D6DCE0] no-print">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#0C1629]" />
                <h3 className="font-bold text-sm text-[#0C1629]">staynest Payment Voucher</h3>
              </div>
              <button onClick={() => setSelectedReceipt(null)} className="text-[#727A84] hover:text-[#0C1629]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Receipt printable layout */}
            <div className="py-6 space-y-4 text-xs font-sans print:py-0">
              <div className="text-center pb-4 border-b border-dashed border-[#D6DCE0]">
                <h2 className="text-base font-bold text-[#0C1629] uppercase tracking-wide">
                  Central Hostel Administration
                </h2>
                <p className="text-[11px] text-[#727A84]">Institutional Student Welfare Accounts</p>
                <div className="mt-2 inline-block px-3 py-1 bg-[#F0F3F3] rounded text-xs font-mono font-bold text-[#0C1629]">
                  Receipt No: {selectedReceipt.receipt_number}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-[#F0F3F3] rounded-lg">
                <div>
                  <span className="text-[#727A84]">Resident Student:</span>
                  <p className="font-bold text-[#0C1629] text-sm">{selectedReceipt.student_name}</p>
                  <p className="font-mono text-[11px] text-[#727A84]">ID: {selectedReceipt.student_code}</p>
                </div>
                <div>
                  <span className="text-[#727A84]">Date of Payment:</span>
                  <p className="font-medium text-[#0C1629]">{formatDateTime(selectedReceipt.recorded_at)}</p>
                  <span className="text-[#727A84]">Method: {selectedReceipt.payment_method}</span>
                </div>
              </div>

              <table className="w-full text-left border border-[#D6DCE0] rounded overflow-hidden">
                <thead className="bg-[#F0F3F3] text-[#727A84] text-[10px] uppercase font-semibold">
                  <tr>
                    <th className="p-2.5">Category Particulars</th>
                    <th className="p-2.5 text-right">Amount Paid</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2.5 border-t border-[#D6DCE0] font-medium text-[#0C1629]">
                      {selectedReceipt.fee_category}
                      <span className="block text-[10px] text-[#727A84] font-mono">
                        Ref: {selectedReceipt.transaction_reference}
                      </span>
                    </td>
                    <td className="p-2.5 border-t border-[#D6DCE0] text-right font-bold text-base text-[#0C1629]">
                      {formatINR(selectedReceipt.amount)}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="pt-2 text-[11px] text-[#727A84] flex items-center justify-between">
                <span>Verified by: {selectedReceipt.recorded_by}</span>
                <span className="text-[#287A52] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  CONFIRMED
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#D6DCE0] flex items-center justify-between no-print">
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2 border border-[#D6DCE0] rounded-md text-xs text-[#0C1629]"
              >
                Close
              </button>
              <button
                onClick={handlePrintReceipt}
                className="px-4 py-2 bg-[#0C1629] hover:bg-[#1A2942] text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
