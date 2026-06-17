'use client';

import { useState } from 'react';
import {
  CreditCard,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  Filter,
  Receipt,
  DollarSign,
} from 'lucide-react';
import { mockPayments } from '../../data/mockData';
import type { Payment } from '../../types';

const statusConfig = {
  paid: {
    label: 'Paid',
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: CheckCircle,
    dot: 'bg-green-500',
  },
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    icon: Clock,
    dot: 'bg-yellow-500',
  },
  overdue: {
    label: 'Overdue',
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: AlertCircle,
    dot: 'bg-red-500',
  },
};

const formatDate = (
  date?: string,
  options?: Intl.DateTimeFormatOptions
) => {
  if (!date) return '-';

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return '-';

  return parsedDate.toLocaleDateString('en-GB', options);
};

export default function PaymentsSection() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [semesterFilter, setSemesterFilter] = useState('all');

  const semesters = [
    ...new Set(mockPayments.map((p) => p.semester).filter(Boolean)),
  ];

  const filtered = mockPayments.filter((p) => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (semesterFilter !== 'all' && p.semester !== semesterFilter) return false;
    return true;
  });

  const totalPaid = mockPayments
    .filter((p) => p.status === 'paid')
    .reduce((a, p) => a + p.amount, 0);

  const totalPending = mockPayments
    .filter((p) => p.status === 'pending')
    .reduce((a, p) => a + p.amount, 0);

  const totalOverdue = mockPayments
    .filter((p) => p.status === 'overdue')
    .reduce((a, p) => a + p.amount, 0);

  const generateReceipt = (payment: Payment) => {
    const receiptNo = payment.receiptNumber || `receipt-${payment.id}`;

    const content = `
TECHNA TECHNICAL INSTITUTE
A/L Technology Stream
Payment Receipt
===============================
Receipt No : ${receiptNo}
Date       : ${formatDate(payment.date)}
Description: ${payment.description || '-'}
Amount     : LKR ${payment.amount.toLocaleString()}.00
Method     : ${payment.method || '-'}
Status     : ${payment.status.toUpperCase()}
Semester   : ${payment.semester || '-'}
===============================
Student    : RAVEENDRAN GANESH
Admission  : ADM-2024-0042
===============================
Thank you for your payment.
This is a computer generated receipt.
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = `${receiptNo}.txt`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-950 to-blue-800 rounded-3xl p-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <CreditCard className="w-7 h-7 text-yellow-400" /> Payments
            </h1>
            <p className="text-blue-300 text-sm mt-1">
              View payment history and download receipts
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="bg-white/10 rounded-xl px-4 py-2.5 text-center">
              <p className="text-green-400 font-bold text-lg">
                LKR {totalPaid.toLocaleString()}
              </p>
              <p className="text-blue-200 text-xs">Total Paid</p>
            </div>

            <div className="bg-white/10 rounded-xl px-4 py-2.5 text-center">
              <p className="text-yellow-400 font-bold text-lg">
                LKR {totalPending.toLocaleString()}
              </p>
              <p className="text-blue-200 text-xs">Pending</p>
            </div>

            <div className="bg-white/10 rounded-xl px-4 py-2.5 text-center">
              <p className="text-red-400 font-bold text-lg">
                LKR {totalOverdue.toLocaleString()}
              </p>
              <p className="text-blue-200 text-xs">Overdue</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: 'Total Paid',
            value: totalPaid,
            icon: CheckCircle,
            color: 'text-green-600 bg-green-50',
            count: mockPayments.filter((p) => p.status === 'paid').length,
          },
          {
            label: 'Pending Payments',
            value: totalPending,
            icon: Clock,
            color: 'text-yellow-600 bg-yellow-50',
            count: mockPayments.filter((p) => p.status === 'pending').length,
          },
          {
            label: 'Overdue Payments',
            value: totalOverdue,
            icon: AlertCircle,
            color: 'text-red-600 bg-red-50',
            count: mockPayments.filter((p) => p.status === 'overdue').length,
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4"
            >
              <div
                className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center shrink-0`}
              >
                <Icon className="w-6 h-6" />
              </div>

              <div>
                <p className="text-xs text-gray-500 font-medium">
                  {item.label}
                </p>
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

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-blue-700" />
            <span className="text-sm font-semibold text-gray-700">
              Filter:
            </span>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500">Semester:</label>
            <select
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Semesters</option>
              {semesters.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="ml-auto">
            <span className="text-xs text-gray-400">
              {filtered.length} records
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center gap-2">
          <Receipt className="w-5 h-5 text-blue-700" />
          <h3 className="font-bold text-gray-900 text-sm">
            Payment History
          </h3>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <CreditCard className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No payments match your filters.</p>
          </div>
        ) : (
          <>
            <div className="sm:hidden divide-y divide-gray-50">
              {filtered.map((payment) => {
                const cfg = statusConfig[payment.status];
                const Icon = cfg.icon;

                return (
                  <div key={payment.id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          {payment.description || '-'}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {payment.receiptNumber || '-'}
                        </p>
                      </div>

                      <span
                        className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-xl border ${cfg.color}`}
                      >
                        <Icon className="w-3 h-3" /> {cfg.label}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-gray-900">
                          LKR {payment.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDate(payment.date)}
                        </p>
                      </div>

                      {payment.status === 'paid' && (
                        <button
                          onClick={() => generateReceipt(payment)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-xl hover:bg-blue-100 transition-all"
                        >
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
                    {[
                      'Receipt No.',
                      'Description',
                      'Semester',
                      'Amount',
                      'Method',
                      'Date',
                      'Status',
                      'Action',
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-50">
                  {filtered.map((payment) => {
                    const cfg = statusConfig[payment.status];

                    return (
                      <tr
                        key={payment.id}
                        className="hover:bg-gray-50 transition-all"
                      >
                        <td className="px-5 py-4 text-xs font-mono text-gray-500">
                          {payment.receiptNumber || '-'}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                              <DollarSign className="w-4 h-4 text-blue-700" />
                            </div>
                            <p className="font-medium text-gray-900 text-sm">
                              {payment.description || '-'}
                            </p>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg">
                            {payment.semester || '-'}
                          </span>
                        </td>

                        <td className="px-5 py-4 font-bold text-gray-900 text-sm">
                          LKR {payment.amount.toLocaleString()}
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-500">
                          {payment.method || '-'}
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-500">
                          {formatDate(payment.date, {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-xl border w-fit ${cfg.color}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}
                            />
                            {cfg.label}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          {payment.status === 'paid' ? (
                            <button
                              onClick={() => generateReceipt(payment)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium rounded-xl transition-all"
                            >
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
              <p className="text-xs text-gray-400">
                Total:{' '}
                <strong>
                  LKR{' '}
                  {filtered
                    .reduce((a, p) => a + p.amount, 0)
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