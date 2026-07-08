'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  Filter,
  Receipt,
  BookOpen,
  Wallet,
} from 'lucide-react';
import jsPDF from 'jspdf';
import { paymentApi, type PaymentRecord } from '@/api/payment.api';
import { useAuthStore } from '@/store/authStore';

const statusConfig = {
  paid: {
    label: 'PAID',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    icon: CheckCircle,
    dot: 'bg-emerald-500',
  },
  pending: {
    label: 'PENDING',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    icon: Clock,
    dot: 'bg-amber-500',
  },
  overdue: {
    label: 'OVERDUE',
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: AlertCircle,
    dot: 'bg-red-500',
  },
};

const formatDate = (date?: string, options?: Intl.DateTimeFormatOptions) => {
  if (!date) return '-';
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return '-';
  return parsedDate.toLocaleDateString('en-GB', options);
};

interface StudentInfo {
  name: string;
  admissionNumber: string;
  batch: string;
  studentId: string;
}

export default function PaymentsSection() {
  const { student } = useAuthStore();

  const [statusFilter, setStatusFilter] = useState('all');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const studentInfo: StudentInfo = useMemo(
    () => ({
      name:
        student?.fullNameEnglish ??
        student?.fullNameTamil ??
        student?.name ??
        student?.email ??
        'N/A',
      admissionNumber: student?.admissionNumber ?? student?.studentId ?? 'N/A',
      batch: student?.batch ?? 'N/A',
      studentId: student?._id ?? student?.studentId ?? '',
    }),
    [student],
  );

  useEffect(() => {
    const fetchPayments = async () => {
      if (!studentInfo.studentId) {
        setPayments([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await paymentApi.getByStudent(studentInfo.studentId);
        setPayments(data || []);
      } catch (err) {
        console.error('Failed to fetch payments:', err);
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchPayments();
  }, [studentInfo.studentId]);

  const modules = [...new Set(payments.map((p) => p.moduleName).filter(Boolean))];

  const filtered = payments.filter((p) => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (moduleFilter !== 'all' && p.moduleName !== moduleFilter) return false;
    return true;
  });

  const totalPaid = payments
    .filter((p) => p.status === 'paid')
    .reduce((a, p) => a + (p.amount ?? 0), 0);

  const totalPending = payments
    .filter((p) => p.status === 'pending')
    .reduce((a, p) => a + (p.amount ?? 0), 0);

  const totalOverdue = payments
    .filter((p) => p.status === 'overdue')
    .reduce((a, p) => a + (p.amount ?? 0), 0);

  const generateReceipt = (payment: PaymentRecord) => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageW = 210;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.text('TECHNA', pageW / 2, 25, { align: 'center' });

    doc.setFontSize(13);
    doc.text('PAYMENT RECEIPT', pageW / 2, 42, { align: 'center' });

    doc.setLineWidth(0.5);
    doc.line(14, 50, pageW - 14, 50);

    let y = 65;

    const row = (label: string, value?: string) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(label, 20, y);

      doc.setFont('helvetica', 'normal');
      doc.text(value || '-', 75, y);
      y += 9;
    };

    row('Student Name', studentInfo.name);
    row('Admission No', studentInfo.admissionNumber);
    row('Batch', studentInfo.batch);

    y += 5;

    row('Receipt No', payment.receiptNo);
    row('Subject', payment.moduleName);
    row('Amount', `LKR ${(payment.amount ?? 0).toLocaleString()}.00`);
    row('Method', payment.method);
    row('Date', formatDate(payment.paidDate));
    row('Status', (payment.status ?? '-').toUpperCase());
    row('Notes', payment.notes ?? '-');

    y += 15;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(`TOTAL: LKR ${(payment.amount ?? 0).toLocaleString()}.00`, pageW / 2, y, {
      align: 'center',
    });

    y += 20;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.text(
      'This is a computer-generated receipt. No signature required.',
      pageW / 2,
      y,
      { align: 'center' },
    );

    doc.save(`${payment.receiptNo || 'receipt'}.pdf`);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-2xl border border-gray-100 bg-white"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            label: 'Total Paid',
            value: totalPaid,
            icon: CheckCircle,
            color: 'text-emerald-600 bg-emerald-50',
            count: payments.filter((p) => p.status === 'paid').length,
          },
          {
            label: 'Pending Payments',
            value: totalPending,
            icon: Clock,
            color: 'text-amber-600 bg-amber-50',
            count: payments.filter((p) => p.status === 'pending').length,
          },
          {
            label: 'Overdue Payments',
            value: totalOverdue,
            icon: AlertCircle,
            color: 'text-red-600 bg-red-50',
            count: payments.filter((p) => p.status === 'overdue').length,
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.color}`}
              >
                <Icon className="h-6 w-6" />
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500">{item.label}</p>
                <p className="text-xl font-bold text-gray-900">
                  LKR {item.value.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400">
                  {item.count} payment{item.count !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-indigo-600" />
            <span className="text-sm font-semibold text-gray-700">Filter:</span>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="paid">PAID</option>
              <option value="pending">PENDING</option>
              <option value="overdue">OVERDUE</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500">Subject:</label>
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Subjects</option>
              {modules.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="ml-auto">
            <span className="text-xs text-gray-400">{filtered.length} records</span>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-gray-100 p-5">
          <Receipt className="h-5 w-5 text-indigo-600" />
          <h3 className="text-sm font-bold text-gray-900">Payment History</h3>
        </div>

        {filtered.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <Receipt className="mx-auto mb-3 h-10 w-10 opacity-30" />
            <p>No payments found.</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-50 sm:hidden">
              {filtered.map((payment) => {
                const statusKey = (payment.status ?? 'pending') as keyof typeof statusConfig;
                const cfg = statusConfig[statusKey] || statusConfig.pending;
                const Icon = cfg.icon;

                return (
                  <div key={payment._id || payment.receiptNo} className="p-4">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {payment.moduleName || '-'}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-400">
                          {payment.receiptNo || '-'}
                        </p>
                      </div>

                      <span
                        className={`flex items-center gap-1 rounded-xl border px-2.5 py-1 text-xs font-semibold ${cfg.color}`}
                      >
                        <Icon className="h-3 w-3" /> {cfg.label}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-gray-900">
                          LKR {(payment.amount ?? 0).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDate(payment.paidDate)}
                        </p>
                      </div>

                      {payment.status === 'paid' && (
                        <button
                          onClick={() => generateReceipt(payment)}
                          className="flex items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
                        >
                          <Download className="h-3.5 w-3.5" /> Receipt
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="hidden overflow-x-auto sm:block">
              <table className="w-full">
                <thead className="border-b border-gray-100 bg-gray-50">
                  <tr>
                    {[
                      'Receipt No.',
                      'Subject',
                      'Amount',
                      'Method',
                      'Date',
                      'Status',
                      'Action',
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-50">
                  {filtered.map((payment) => {
                    const statusKey = (payment.status ?? 'pending') as keyof typeof statusConfig;
                    const cfg = statusConfig[statusKey] || statusConfig.pending;

                    return (
                      <tr
                        key={payment._id || payment.receiptNo}
                        className="transition-all hover:bg-gray-50"
                      >
                        <td className="px-5 py-4 font-mono text-xs text-gray-500">
                          {payment.receiptNo || '-'}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
                              <BookOpen className="h-4 w-4 text-indigo-600" />
                            </div>
                            <p className="text-sm font-medium text-gray-900">
                              {payment.moduleName || '-'}
                            </p>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm font-bold text-gray-900">
                          LKR {(payment.amount ?? 0).toLocaleString()}
                        </td>

                        <td className="px-5 py-4 text-sm capitalize text-gray-500">
                          {payment.method || '-'}
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-500">
                          {formatDate(payment.paidDate, {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`flex w-fit items-center gap-1.5 rounded-xl border px-2.5 py-1 text-xs font-semibold ${cfg.color}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                            {cfg.label}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          {payment.status === 'paid' ? (
                            <button
                              onClick={() => generateReceipt(payment)}
                              className="flex items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
                            >
                              <Download className="h-3.5 w-3.5" /> Receipt
                            </button>
                          ) : (
                            <button className="flex items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100">
                              <Wallet className="h-3.5 w-3.5" /> Pay Now
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 p-4">
              <p className="text-xs text-gray-400">
                Total:{' '}
                <strong>
                  LKR{' '}
                  {filtered
                    .reduce((a, p) => a + (p.amount ?? 0), 0)
                    .toLocaleString()}
                </strong>
              </p>
              <p className="text-xs text-gray-400">
                Only paid receipts can be downloaded
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}