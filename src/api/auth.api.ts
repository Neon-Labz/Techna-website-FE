import api from '@/lib/axios';
import type { Student } from '@/types';

type LoginResponse = {
  access_token?: string;
  accessToken?: string;
  token?: string;
  student?: Student;
  user?: Student;
  data?: {
    access_token?: string;
    accessToken?: string;
    token?: string;
    student?: Student;
    user?: Student;
  };
};

type SessionResponse = Student | { data?: Student };

export type RegisterStudentPayload = {
  account: {
    email: string;
    password: string;
  };
  personal: {
    fullNameTamil?: string;
    fullNameEnglish: string;
    dateOfBirth?: string;
    dobDay?: number;
    dobMonth?: number;
    dobYear?: number;
    nicNo: string;
    school?: string;
    whatsappNo: string;
    parentsNo?: string;
    permanentAddress: string;
    administrativeDistrict: string;
    fixedTelephone?: string;
    residingSince?: string;
    race?: string;
    religion?: string;
    citizenByDescent?: string;
    contactAddress?: string;
    postalCode?: string;
  };
  parent?: {
    fatherName?: string;
    motherName?: string;
    guardianName?: string;
    contactPerson?: 'Father' | 'Mother' | 'Guardian';
    guardianAddress?: string;
    guardianFixedTel?: string;
    guardianMobile?: string;
  };
  olRecords?: {
    olCategory?: string;
    olYear?: string;
    olIndexNumber?: string;
    olNameUsed?: string;
    olAccept?: 'Accept' | 'Change';
    olResults?: Array<{
      year: string;
      indexNumber: string;
      english?: string;
      mathematics?: string;
      science?: string;
      sinhala?: string;
      tamil?: string;
    }>;
  };
  subjectSelection: {
    subjects: string[];
    agreed: boolean;
  };
  batch?: string;
};

export type RegisterStudentResponse = {
  message?: string;
  applicationReference?: string;
  reference?: string;
  data?: Student & {
    applicationReference?: string;
    reference?: string;
  };
};

const getLoginToken = (resData: LoginResponse) =>
  resData?.access_token ||
  resData?.accessToken ||
  resData?.token ||
  resData?.data?.access_token ||
  resData?.data?.accessToken ||
  resData?.data?.token;

const getLoginStudent = (resData: LoginResponse): Student | undefined =>
  resData?.student || resData?.user || resData?.data?.student || resData?.data?.user;

const getSessionStudent = (resData: SessionResponse): Student =>
  'data' in resData && resData.data ? resData.data : (resData as Student);

export const authApi = {
 async loginStudent(email: string, password: string) {
  const loginData = (await api.post(
    '/auth/student/login',
    { email, password },
    { headers: { 'X-Skip-Auth': 'true' } },
  )) as LoginResponse;

  console.log('LOGIN RESPONSE:', loginData);

  const token = getLoginToken(loginData);

  if (!token) {
    throw new Error('Login succeeded, but no auth token was returned.');
  }

  let student = getLoginStudent(loginData);

  if (!student) {
    const sessionData = (await api.get('/auth/session', {
      headers: { Authorization: `Bearer ${token}` },
    })) as SessionResponse;

    student = getSessionStudent(sessionData);
  }

  if (!student?.email) {
    throw new Error('Login succeeded, but no student profile was returned.');
  }

  return { student, token };
},

  async registerStudent(payload: RegisterStudentPayload | FormData) {
    const res = await api.post<RegisterStudentResponse>(
      '/students/register',
      payload,
      { headers: { 'X-Skip-Auth': 'true' } },
    );

    return res.data;
  },

 async getSession(token?: string) {
  const sessionData = (await api.get('/auth/session', {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })) as SessionResponse;

  return getSessionStudent(sessionData);
},

  async logout() {
    return api.post('/auth/logout');
  },
};

export const registerStudent = authApi.registerStudent;
export const studentLogin = authApi.loginStudent;
export const getSession = authApi.getSession;