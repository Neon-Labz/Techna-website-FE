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


function normalize(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s*\([^)]*\)\s*$/, '')
    .trim();
}
export function getModuleIcon(name: string): LucideIcon {
  const target = normalize(name);
  const match = subjectsConfig.find((s) => normalize(s.name) === target);

  if (!match && process.env.NODE_ENV !== 'production') {
    console.warn(
      `[moduleIcons] No icon mapping found for subject "${name}" (normalized: "${target}"). Falling back to default icon. Check subjectsConfig in src/lib/moduleIcons.ts.`
    );
  }

  return match?.icon ?? DEFAULT_ICON;
}
export function sortModulesByConfig<T extends { name: string }>(modules: T[]): T[] {
  const orderMap = new Map(subjectsConfig.map((s) => [normalize(s.name), s.order]));

  return [...modules].sort((a, b) => {
    const orderA = orderMap.get(normalize(a.name)) ?? 999;
    const orderB = orderMap.get(normalize(b.name)) ?? 999;
    return orderA - orderB;
  });
}