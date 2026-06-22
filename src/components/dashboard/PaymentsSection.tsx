'use client';
import { useState, useEffect } from 'react';
import { CreditCard, Download, CheckCircle, Clock, AlertCircle, Filter, Receipt, DollarSign } from 'lucide-react';
import { paymentApi, type PaymentFromApi } from '@/api/payment.api';
import { useAuthStore } from '@/store/authStore';
import jsPDF from 'jspdf';

type PaymentRecord = PaymentFromApi;

const statusConfig = {
  paid: { label: 'Paid', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle, dot: 'bg-green-500' },
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock, dot: 'bg-yellow-500' },
  overdue: { label: 'Overdue', color: 'bg-red-100 text-red-700 border-red-200', icon: AlertCircle, dot: 'bg-red-500' },
};

interface StudentInfo {
  name: string;
  admissionNumber: string;
  batch: string;
  studentId: string;
}

export default function PaymentsSection() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const { student } = useAuthStore();

  const studentInfo: StudentInfo = {
    name:
      student?.fullNameEnglish ??
      student?.fullNameTamil ??
      (student as any)?.name ??
      student?.email ??
      'N/A',
    admissionNumber:
      (student as any)?.admissionNumber ??
      (student as any)?.studentId ??
      'N/A',
    batch: (student as any)?.batch ?? 'N/A',
    studentId: (student as any)?._id ?? (student as any)?.id ?? '',
  };

  useEffect(() => {
    if (!studentInfo.studentId) {
      setLoading(false);
      return;
    }
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const data = await paymentApi.getByStudent(studentInfo.studentId);
        setPayments(data);
      } catch (err) {
        console.error('Failed to fetch payments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [studentInfo.studentId]);

  const modules = [...new Set(payments.map(p => p.moduleName))];
  const filtered = payments.filter(p => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (moduleFilter !== 'all' && p.moduleName !== moduleFilter) return false;
    return true;
  });

  const totalPaid = payments.filter(p => p.status === 'paid').reduce((a, p) => a + (p.amount ?? 0), 0);
  const totalPending = payments.filter(p => p.status === 'pending').reduce((a, p) => a + (p.amount ?? 0), 0);
  const totalOverdue = payments.filter(p => p.status === 'overdue').reduce((a, p) => a + (p.amount ?? 0), 0);

  // ── PDF Receipt Generator ──
  const generateReceipt = (payment: PaymentRecord) => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageW = 210;
    const blue = '#34BFF3';
    const darkBlue = '#1a6fa8';
    const textDark = '#0a0a0f';
    const textGray = '#6b7280';
    const rowBg = '#EEF6FB';
    let built = false;

    // Truncate text to fit within a max width in the PDF
    const truncate = (text: string, maxWidth: number, fontSize: number): string => {
      doc.setFontSize(fontSize);
      if (doc.getTextWidth(text) <= maxWidth) return text;
      let truncated = text;
      while (doc.getTextWidth(truncated + '…') > maxWidth && truncated.length > 0) {
        truncated = truncated.slice(0, -1);
      }
      return truncated + '…';
    };

    const buildPDF = () => {
      if (built) return;
      built = true;

      doc.setFont('helvetica', 'bold'); doc.setFontSize(32); doc.setTextColor(blue);
      doc.text('TECHNA', pageW / 2, 24, { align: 'center' });
      doc.setFontSize(10); doc.setTextColor(darkBlue);
      doc.text('A/L Technology Stream', pageW / 2, 34, { align: 'center' });
      doc.setFontSize(8); doc.setTextColor(textGray);
      doc.text('Email: sivasakthy22@gmail.com  |  Contact: +94 77 170 3549', pageW / 2, 40, { align: 'center' });
      doc.setFont('helvetica', 'bold'); doc.setFontSize(13); doc.setTextColor(blue);
      doc.text('PAYMENT RECEIPT', pageW / 2, 49, { align: 'center' });
      doc.setDrawColor(blue); doc.setLineWidth(0.8);
      doc.line(14, 54, pageW - 14, 54);

      const drawSectionHeader = (x: number, y: number, label: string) => {
        doc.setFillColor(blue); doc.rect(x, y - 4, 2.5, 5, 'F');
        doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(darkBlue);
        doc.text(label, x + 5, y);
      };

      const drawRow = (x: number, y: number, w: number, label: string, value: string, shaded: boolean) => {
        if (shaded) { doc.setFillColor(rowBg); doc.rect(x, y - 5, w, 8, 'F'); }
        doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(textDark);
        doc.text(label, x + 3, y);
        doc.setFont('helvetica', 'normal'); doc.setTextColor(textDark);
        // value column starts at halfway, max width = remaining space minus small margin
        const valueX = x + w * 0.5;
        const maxValueWidth = w * 0.5 - 4;
        const safeValue = truncate(value, maxValueWidth, 9);
        doc.text(safeValue, valueX, y);
      };

      const col1X = 14, col2X = pageW / 2 + 6, colW = pageW / 2 - 20;
      let y = 66;
      drawSectionHeader(col1X, y, 'STUDENT INFORMATION');
      drawSectionHeader(col2X, y, 'PAYMENT DETAILS');
      y += 6;

      const studentRows = [
        ['Student Name', studentInfo.name],
        ['Admission No', studentInfo.admissionNumber],
        ['Batch', studentInfo.batch],
      ];
      const paymentRows: [string, string][] = [
  ['Receipt No', payment.receiptNo ?? '-'],
  ['Date', payment.paidDate ? new Date(payment.paidDate).toLocaleDateString('en-GB') : '-'],
  ['Subject', payment.moduleName ?? '-'],
  ['Amount', `LKR ${(payment.amount ?? 0).toLocaleString()}.00`],
  ['Method', payment.method ?? '-'],
  ['Status', (payment.status ?? '-').toUpperCase()],
  ['Notes', payment.notes ?? '-'],
];

      studentRows.forEach((row, i) => drawRow(col1X, y + i * 10, colW, row[0], row[1], i % 2 === 0));
      paymentRows.forEach((row, i) => drawRow(col2X, y + i * 10, colW, row[0], row[1], i % 2 === 0));

      y += Math.max(studentRows.length, paymentRows.length) * 10 + 16;
      doc.setFillColor(blue);
      doc.roundedRect(14, y, pageW - 28, 36, 6, 6, 'F');
      doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor('#ffffff');
      doc.text('TOTAL AMOUNT PAID', pageW / 2, y + 10, { align: 'center' });
      doc.setFont('helvetica', 'bold'); doc.setFontSize(24);
      doc.text(`LKR ${ (payment.amount ?? 0).toLocaleString() }.00`, pageW / 2, y + 26, { align: 'center' });
      y += 50;
      doc.setFont('helvetica', 'italic'); doc.setFontSize(8); doc.setTextColor(textGray);
      doc.text('This is a computer-generated receipt. No signature required.', pageW / 2, y, { align: 'center' });
      doc.save(`${payment.receiptNo}.pdf`);
    };

    const logo = new Image();
    logo.src = '/newlogo.png';
    logo.onload = () => {
      // Neat, proportionate logo in its original top-left position
      const maxBoxSize = 50;
      const ratio = logo.naturalWidth && logo.naturalHeight ? logo.naturalWidth / logo.naturalHeight : 1;
      let drawW = maxBoxSize;
      let drawH = maxBoxSize / ratio;
      if (drawH > maxBoxSize) {
        drawH = maxBoxSize;
        drawW = maxBoxSize * ratio;
      }
      doc.addImage(logo, 'PNG', 14, 10, drawW, drawH);
      buildPDF();
    };
    logo.onerror = () => buildPDF();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 h-24 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Paid', value: totalPaid, icon: CheckCircle, color: 'text-green-600 bg-green-50', count: payments.filter(p => p.status === 'paid').length },
          { label: 'Pending Payments', value: totalPending, icon: Clock, color: 'text-yellow-600 bg-yellow-50', count: payments.filter(p => p.status === 'pending').length },
          { label: 'Overdue Payments', value: totalOverdue, icon: AlertCircle, color: 'text-red-600 bg-red-50', count: payments.filter(p => p.status === 'overdue').length },
        ].map(item => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
              <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">{item.label}</p>
                <p className="text-xl font-bold text-gray-900">LKR {item.value.toLocaleString()}</p>
                <p className="text-xs text-gray-400">{item.count} payment{item.count !== 1 ? 's' : ''}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-blue-700" />
            <span className="text-sm font-semibold text-gray-700">Filter:</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500">Status:</label>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500">Subject:</label>
            <select value={moduleFilter} onChange={e => setModuleFilter(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Subjects</option>
              {modules.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="ml-auto">
            <span className="text-xs text-gray-400">{filtered.length} records</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center gap-2">
          <Receipt className="w-5 h-5 text-blue-700" />
          <h3 className="font-bold text-gray-900 text-sm">Payment History</h3>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <CreditCard className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No payments found.</p>
          </div>
        ) : (
          <>
            <div className="sm:hidden divide-y divide-gray-50">
              {filtered.map(payment => {
                const statusKey = (payment.status ?? 'pending') as keyof typeof statusConfig;
                const cfg = statusConfig[statusKey];
                const Icon = cfg.icon;
                return (
                  <div key={payment._id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{payment.moduleName}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{payment.receiptNo}</p>
                      </div>
                      <span className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-xl border ${cfg.color}`}>
                        <Icon className="w-3 h-3" /> {cfg.label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-gray-900">LKR { (payment.amount ?? 0).toLocaleString() }</p>
                        <p className="text-xs text-gray-400">{payment.paidDate ? new Date(payment.paidDate).toLocaleDateString('en-GB') : '-'}</p>
                      </div>
                      {payment.status === 'paid' && (
                        <button onClick={() => generateReceipt(payment)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-xl hover:bg-blue-100 transition-all">
                          <Download className="w-3.5 h-3.5" /> Receipt
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Receipt No.', 'Subject', 'Amount', 'Method', 'Date', 'Status', 'Action'].map(h => (
                      <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(payment => {
                    const statusKey = (payment.status ?? 'pending') as keyof typeof statusConfig;
                    const cfg = statusConfig[statusKey];
                    return (
                      <tr key={payment._id} className="hover:bg-gray-50 transition-all">
                        <td className="px-5 py-4 text-xs font-mono text-gray-500">{payment.receiptNo ?? '-'}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                              <DollarSign className="w-4 h-4 text-blue-700" />
                            </div>
                            <p className="font-medium text-gray-900 text-sm">{payment.moduleName ?? '-'}</p>
                          </div>
                        </td>
                        <td className="px-5 py-4 font-bold text-gray-900 text-sm">LKR { (payment.amount ?? 0).toLocaleString() }</td>
                        <td className="px-5 py-4 text-sm text-gray-500 capitalize">{payment.method ?? '-'}</td>
                        <td className="px-5 py-4 text-sm text-gray-500">
                          {payment.paidDate ? new Date(payment.paidDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-xl border w-fit ${cfg.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          {payment.status === 'paid' ? (
                            <button onClick={() => generateReceipt(payment)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium rounded-xl transition-all">
                              <Download className="w-3.5 h-3.5" /> Receipt
                            </button>
                          ) : (
                            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 text-xs font-medium rounded-xl transition-all">
                              <CreditCard className="w-3.5 h-3.5" /> Pay Now
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <p className="text-xs text-gray-400">Total: <strong>LKR {filtered.reduce((a, p) => a + (p.amount ?? 0), 0).toLocaleString()}</strong></p>
              <p className="text-xs text-gray-400">Only paid receipts can be downloaded</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}