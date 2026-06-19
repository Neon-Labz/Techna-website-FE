import api from '@/lib/axios';
import type { Student } from '@/types';

type LoginResponse = {
  access_token?: string;
  accessToken?: string;
  token?: string;
  student?: Student;
  user?: Student;
  profile?: Student;
  data?: {
    access_token?: string;
    accessToken?: string;
    token?: string;
    student?: Student;
    user?: Student;
    profile?: Student;
    data?: Student;
  };
};

type SessionResponse =
  | Student
  | {
      student?: Student;
      user?: Student;
      profile?: Student;
      data?: Student | {
        student?: Student;
        user?: Student;
        profile?: Student;
        data?: Student;
      };
      result?: Student;
    };

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

const isStudentLike = (value: unknown): value is Student => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  const item = value as Partial<Student>;

  return Boolean(
    item.email ||
      item._id ||
      item.id ||
      item.studentId ||
      item.fullNameEnglish ||
      item.fullNameTamil,
  );
};

const getLoginToken = (resData: LoginResponse | undefined | null) =>
  resData?.access_token ||
  resData?.accessToken ||
  resData?.token ||
  resData?.data?.access_token ||
  resData?.data?.accessToken ||
  resData?.data?.token;

const getLoginStudent = (
  resData: LoginResponse | undefined | null,
): Student | null => {
  const candidates = [
    resData?.student,
    resData?.user,
    resData?.profile,
    resData?.data?.student,
    resData?.data?.user,
    resData?.data?.profile,
    resData?.data?.data,
  ];

  return candidates.find(isStudentLike) || null;
};

const getSessionStudent = (
  resData: SessionResponse | undefined | null,
): Student | null => {
  const data = (resData as any)?.data;

  const candidates = [
    (resData as any)?.student,
    (resData as any)?.user,
    (resData as any)?.profile,
    data?.student,
    data?.user,
    data?.profile,
    data?.data,
    (resData as any)?.result,
    data,
    resData,
  ];

  return candidates.find(isStudentLike) || null;
};

export const authApi = {
  async loginStudent(email: string, password: string) {
    const res = await api.post<LoginResponse>(
      '/auth/student/login',
      { email, password },
      { headers: { 'X-Skip-Auth': 'true' } },
    );

    const loginData = res.data;
    const token = getLoginToken(loginData);

    if (!token) {
      throw new Error('Login succeeded, but no auth token was returned.');
    }

    let student = getLoginStudent(loginData);

    if (!student) {
      const sessionRes = await api.get<SessionResponse>('/auth/session', {
        headers: { Authorization: `Bearer ${token}` },
      });

      student = getSessionStudent(sessionRes.data);
    }

    if (!student) {
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
    try {
      const res = await api.get<SessionResponse>('/auth/session', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      return getSessionStudent(res.data);
    } catch (error) {
      console.warn('Failed to refresh student session:', error);
      return null;
    }
  },

  async logout() {
    return api.post('/auth/logout');
  },
};

export const registerStudent = authApi.registerStudent;
export const studentLogin = authApi.loginStudent;
export const getSession = authApi.getSession;