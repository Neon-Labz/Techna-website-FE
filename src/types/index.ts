export interface Student {
  id: string;
  admissionNumber: string;
  serialNumber: string;
  fullNameTamil: string;
  fullNameEnglish: string;
  dateOfBirth: string;
  nicNo: string;
  address: string;
  school: string;
  whatsappNo: string;
  parentsNo: string;
  email: string;
  subjects: string[];
  // Personal Details
  permanentAddress: string;
  administrativeDistrict: string;
  fixedTelephone: string;
  residingSince: string;
  race: string;
  religion: string;
  citizenByDescent: string;
  contactAddress: string;
  postalCode: string;
  fatherName: string;
  motherName: string;
  guardianName: string;
  contactPerson: 'Father' | 'Mother' | 'Guardian';
  guardianAddress: string;
  guardianFixedTel: string;
  guardianMobile: string;
  // OL Results
  olCategory: string;
  olYear: string;
  olIndexNumber: string;
  olNameUsed: string;
  olResults: OLResult[];
  profilePhoto?: string;
  createdAt: string;
}

export interface OLResult {
  year: string;
  indexNumber: string;
  english: string;
  mathematics: string;
  science: string;
  sinhala: string;
  tamil: string;
}

export interface Module {
  id: string;
  name: string;
  code: string;
  description: string;
  duration: string;
  credits: number;
  instructor: string;
  schedule: string;
  category: string;
  videos: LectureVideo[];
  notices: Notice[];
}

export interface LectureVideo {
  id: string;
  title: string;
  moduleId: string;
  moduleName: string;
  duration: string;
  uploadedAt: string;
  thumbnail: string;
  url: string;
  description: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  type: 'exam' | 'general' | 'assignment' | 'holiday';
  date: string;
  moduleId?: string;
}

export interface ExamResult {
  id: string;
  studentId: string;
  moduleId: string;
  moduleName: string;
  moduleCode: string;
  examType: string;
  marks: number;
  maxMarks: number;
  grade: string;
  date: string;
  semester: string;
}

export interface Payment {
  id: string;
  studentId: string;
  description: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  date: string;
  receiptNumber: string;
  method: string;
  semester: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  student: Student | null;
  token: string | null;
  login: (student: Student, token: string) => void;
  logout: () => void;
  updateStudent: (student: Student) => void;
}
