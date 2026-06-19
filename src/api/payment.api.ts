import api from '@/lib/axios';

// ─── Interface ────────────────────────────────────────────────────────────────

export interface PaymentFromApi {
  _id: string;
  studentId: string;
  studentName: string;
  moduleId: string;
  moduleName: string;
  amount: number;
  paidDate: string;
  method: 'cash' | 'bank' | 'online';
  status: 'paid' | 'pending' | 'overdue';
  receiptNo: string;
  batch: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type PaymentRecord = PaymentFromApi;

// ─── Payment API ──────────────────────────────────────────────────────────────

export const paymentApi = {
  getAll(): Promise<PaymentFromApi[]> {
    return api.get('/payments');
  },

  create(data: Partial<PaymentFromApi>): Promise<PaymentFromApi> {
    return api.post('/payments', data);
  },

  update(id: string, data: Partial<PaymentFromApi>): Promise<PaymentFromApi> {
    return api.patch(`/payments/${id}`, data);
  },

  getByStudent(studentId: string): Promise<PaymentFromApi[]> {
    return (api.get(`/payments/student/${studentId}`) as Promise<PaymentFromApi[]>)
      .catch(() =>
        (api.get('/payments') as Promise<PaymentFromApi[]>).then((all) =>
          all.filter((p) => p.studentId === studentId)
        )
      );
  },
};

export const getStudentPayments = (
  studentId: string
): Promise<PaymentRecord[]> => paymentApi.getByStudent(studentId);