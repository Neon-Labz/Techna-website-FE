export interface Student {
  id: string;
  _id?: string;
  studentId?: string;
  name?: string;
  role?: string;
  modules?: string[];
  enrolledModules?: string[];
  subjectSelection?: {
    subjects?: string[];
    enrolledModules?: string[];
  };
  batch?: string;

  status?: 'pending' | 'approved' | 'rejected';
  admissionNumber?: string;
  serialNumber?: string;
  fullNameTamil?: string;
  fullNameEnglish?: string;
  dateOfBirth?: string;
  dob?: string;
  nicNo?: string;
  address?: string;
  school?: string;
  whatsappNo?: string;
  parentsNo?: string;
  email: string;
  subjects?: string[];

  permanentAddress?: string;
  administrativeDistrict?: string;
  fixedTelephone?: string;
  residingSince?: string;
  race?: string;
  religion?: string;
  citizenByDescent?: string;
  contactAddress?: string;
  postalCode?: string;
  fatherName?: string;
  motherName?: string;
  guardianName?: string;
  contactPerson?: 'Father' | 'Mother' | 'Guardian';
  guardianAddress?: string;
  guardianFixedTel?: string;
  guardianMobile?: string;

  olCategory?: string;
  olYear?: string;
  olIndexNumber?: string;
  olNameUsed?: string;
  olResults?: OLResult[];

  profilePhoto?: string;
  avatar?: string;
  profileImage?: string;
  createdAt?: string;
}

export interface OLResult {
  year: string;
  indexNumber: string;
  english?: string;
  mathematics?: string;
  science?: string;
  sinhala?: string;
  tamil?: string;
}

export interface Module {
  id: string;
  _id?: string;
  name: string;
  code?: string;
  description?: string;
  duration?: string;
  credits?: number;
  instructor?: string;
  schedule?: string;
  category?: string;
  videos?: LectureVideo[];
  notices?: Notice[];
  resources?: LectureVideo[];
  status?: string;
}

export interface LectureVideo {
  id: string;
  _id?: string;
  title: string;
  moduleId?: string;
  moduleName?: string;
  duration?: string;
  uploadedAt?: string;
  createdAt?: string;
  thumbnail?: string;
  url?: string;
  fileUrl?: string;
  fileType?: string;
  description?: string;
  isPublished?: boolean | string;
  published?: boolean | string;
  status?: string;
}

export interface Notice {
  id: string;
  _id?: string;
  title: string;
  content?: string;
  description?: string;
  type: 'exam' | 'general' | 'assignment' | 'holiday';
  date?: string;
  examDate?: string;
  moduleId?: string;
  moduleName?: string;
  module?: string;
  subject?: string;
  batch?: string;
  startTime?: string;
  endTime?: string;
  venue?: string;
  createdAt?: string;
  isPublished?: boolean | string;
  published?: boolean | string;
  status?: string;
}

export interface ExamResult {
  id: string;
  _id?: string;
  studentId?: string;
  moduleId?: string;
  moduleName?: string;
  moduleCode?: string;
  examType?: string;
  marks: number;
  maxMarks: number;
  grade?: string;
  date?: string;
  semester?: string;
}

export interface Payment {
  id: string;
  _id?: string;
  studentId?: string;
  description?: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  date?: string;
  receiptNumber?: string;
  method?: string;
  semester?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  student: Student | null;
  token: string | null;
  hasHydrated: boolean;

  login: (
    student: Student | null,
    token: string,
    rememberMe?: boolean
  ) => void;

  logout: () => void;

  setHasHydrated: (hasHydrated: boolean) => void;

  updateStudent: (student: Student) => void;
}