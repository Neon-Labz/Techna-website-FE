import {
  Cog,
  Dna,
  FlaskConical,
  Monitor,
  Leaf,
  Calculator,
  Globe,
  BookOpen,
  type LucideIcon,
} from 'lucide-react';


export const subjectsConfig: { name: string; icon: LucideIcon; order: number }[] = [
  { name: 'Engineering Technology (ET)', icon: Cog, order: 1 },
  { name: 'Bio Systems Technology', icon: Dna, order: 2 },
  { name: 'Science For Technology', icon: FlaskConical, order: 3 },
  { name: 'Information & Communication Technology (ICT)', icon: Monitor, order: 4 },
  { name: 'Agricultural Science', icon: Leaf, order: 5 },
  { name: 'Mathematics', icon: Calculator, order: 6 },
  { name: 'Geography', icon: Globe, order: 7 },
];

const DEFAULT_ICON: LucideIcon = BookOpen;

/** Returns the fixed icon for a subject name. Falls back to BookOpen if not found. */
export function getModuleIcon(name: string): LucideIcon {
  const match = subjectsConfig.find(
    (s) => s.name.trim().toLowerCase() === name.trim().toLowerCase()
  );

  if (!match && process.env.NODE_ENV !== 'production') {
    console.warn(
      `[moduleIcons] No icon mapping found for subject "${name}". Falling back to default icon. Check subjectsConfig in src/lib/moduleIcons.ts for a name mismatch.`
    );
  }

  return match?.icon ?? DEFAULT_ICON;
}

/** Sorts any array of modules (from API) into the fixed order above. Unknown subjects go last, in original relative order. */
export function sortModulesByConfig<T extends { name: string }>(modules: T[]): T[] {
  const orderMap = new Map(
    subjectsConfig.map((s) => [s.name.trim().toLowerCase(), s.order])
  );

  return [...modules].sort((a, b) => {
    const orderA = orderMap.get(a.name.trim().toLowerCase()) ?? 999;
    const orderB = orderMap.get(b.name.trim().toLowerCase()) ?? 999;
    return orderA - orderB;
  });
}