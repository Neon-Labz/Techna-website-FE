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

// ─── Helper: extract array from any response shape ────────────────────────────
// Backend returns: { success, message, data: { success, payments: [...] } }

const extractArray = (res: unknown): PaymentFromApi[] => {
  // Axios wraps response in .data, so res is the axios response object
  const body = (res as any)?.data ?? res;

  // Shape: { data: { payments: [...] } }
  if (Array.isArray(body?.data?.payments)) return body.data.payments;

  // Shape: { data: [...] }
  if (Array.isArray(body?.data)) return body.data;

  // Shape: { payments: [...] }
  if (Array.isArray(body?.payments)) return body.payments;

  // Already an array
  if (Array.isArray(body)) return body;

  console.warn('paymentApi: unexpected response shape', res);
  return [];
};

// ─── Payment API ──────────────────────────────────────────────────────────────

export const paymentApi = {
  getAll(): Promise<PaymentFromApi[]> {
    return api.get('/payments').then(extractArray);
  },

  create(data: Partial<PaymentFromApi>): Promise<PaymentFromApi> {
    return api.post('/payments', data).then(res => res.data ?? res);
  },

  update(id: string, data: Partial<PaymentFromApi>): Promise<PaymentFromApi> {
    return api.patch(`/payments/${id}`, data).then(res => res.data ?? res);
  },

  getByStudent(studentId: string): Promise<PaymentFromApi[]> {
    return api
      .get(`/payments/student/${studentId}`)
      .then(extractArray)
      .catch(() =>
        api.get('/payments')
          .then(extractArray)
          .then(all => all.filter((p: PaymentFromApi) => p.studentId === studentId))
      );
  },
};

export const getStudentPayments = (
  studentId: string
): Promise<PaymentFromApi[]> => paymentApi.getByStudent(studentId);