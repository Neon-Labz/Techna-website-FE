

export const MAX_MAIN_SUBJECTS = 2;
export const MAX_BASKET_SUBJECTS = 1;

export type SubjectCategory = 'main' | 'basket';

// Fixed A/L Technology stream subjects.
export const MAIN_SUBJECTS = [
  'Engineering Technology',
  'Bio Systems Technology',
  'Science For Technology',
];

export const BASKET_SUBJECTS = [
  'Information Communication Technology',
  'Agricultural Science',
  'Mathematics',
  'Geography',
];

// Canonical main subjects (compared case-insensitively).
const MAIN_SUBJECT_KEYS = [
  'engineering technology',
  'bio systems technology',
  'science for technology',
];

const normalizeKey = (subject: string) =>
  subject.trim().toLowerCase().replace(/\s+/g, ' ');


export function getSubjectCategory(subject: string): SubjectCategory {
  return MAIN_SUBJECT_KEYS.includes(normalizeKey(subject)) ? 'main' : 'basket';
}

// Count selected subjects per category given a flat list of selected names.
export function countSubjectsByCategory(selected: string[] = []) {
  return selected.reduce(
    (acc, subject) => {
      acc[getSubjectCategory(subject)] += 1;
      return acc;
    },
    { main: 0, basket: 0 } as Record<SubjectCategory, number>,
  );
}
