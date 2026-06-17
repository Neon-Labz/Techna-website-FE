import api from '@/lib/axios';

export interface PaymentRecord {
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

export const getPayments = (): Promise<PaymentRecord[]> =>
  api.get('/payments');

export const createPayment = (data: any): Promise<PaymentRecord> =>
  api.post('/payments', data);

export const updatePayment = (id: string, data: any): Promise<PaymentRecord> =>
  api.patch(`/payments/${id}`, data);


export const getStudentPayments = async (studentId: string): Promise<PaymentRecord[]> => {
  try {
   
    return await api.get(`/payments/student/${studentId}`);
  } catch {
    
    const all: PaymentRecord[] = await api.get('/payments');
    return all.filter(p => p.studentId === studentId);
  }
};