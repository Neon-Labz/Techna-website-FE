import api from '@/lib/axios';

export interface PaymentFromApi {
  _id: string;
  id?: string;
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

const extractArray = (res: unknown): PaymentFromApi[] => {
  const body = (res as any)?.data ?? res;

  if (Array.isArray(body?.data?.payments)) return body.data.payments;
  if (Array.isArray(body?.data)) return body.data;
  if (Array.isArray(body?.payments)) return body.payments;
  if (Array.isArray(body)) return body;

  console.warn('paymentApi: unexpected response shape', res);
  return [];
};

const extractItem = (res: unknown): PaymentFromApi => {
  const body = (res as any)?.data ?? res;

  return (
    body?.data?.payment ||
    body?.data ||
    body?.payment ||
    body
  ) as PaymentFromApi;
};

export const paymentApi = {
  getAll(): Promise<PaymentFromApi[]> {
    return api.get('/payments').then(extractArray);
  },

  create(data: Partial<PaymentFromApi>): Promise<PaymentFromApi> {
    return api.post('/payments', data).then(extractItem);
  },

  update(id: string, data: Partial<PaymentFromApi>): Promise<PaymentFromApi> {
    return api.patch(`/payments/${id}`, data).then(extractItem);
  },

  getByStudent(studentId: string): Promise<PaymentFromApi[]> {
    return api
      .get(`/payments/student/${studentId}`)
      .then(extractArray)
      .catch(() =>
        api
          .get('/payments')
          .then(extractArray)
          .then((all) => all.filter((p) => p.studentId === studentId)),
      );
  },
};

export const getStudentPayments = (
  studentId: string,
): Promise<PaymentRecord[]> => paymentApi.getByStudent(studentId);