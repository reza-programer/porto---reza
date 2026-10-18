import type { Project } from '@/types';

// Tags are typed by hand in the admin panel, so casing drifts ("Mysql", "MysQL").
// Normalise for display only; the stored data is left untouched.
const TAG_ALIASES: Record<string, string> = {
  'vue.js': 'Vue.js',
  mysql: 'MySQL',
  'win scp': 'WinSCP',
  'tailwind css': 'Tailwind CSS',
  codeigniter: 'CodeIgniter',
  spreedsheets: 'Spreadsheets',
  spreadsheets: 'Spreadsheets',
  jmeter: 'JMeter',
  'resposive web design': 'Responsive Web Design',
  datasest: 'Dataset',
};

export function formatTag(tag: string): string {
  const key = tag.trim().toLowerCase();
  return TAG_ALIASES[key] ?? tag.trim();
}

export function formatTags(tags: string[]): string[] {
  return Array.from(new Set(tags.map(formatTag)));
}

// Some titles are stored in ALL CAPS ("DATABASES"). Show them in title case so
// every card reads the same; mixed-case titles ("MSIB Batch 6") are kept as-is.
const SMALL_WORDS = new Set(['and', 'of', 'the', 'for', 'in', 'on', 'dan', 'di', 'ke']);

export function formatTitle(title: string): string {
  const t = title.trim();
  if (t !== t.toUpperCase() || !/[A-Z]/.test(t)) return t;
  return t
    .toLowerCase()
    .split(/\s+/)
    .map((w, i) => (i > 0 && SMALL_WORDS.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ');
}

export const slugify = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export type ProjectKind = 'dev' | 'qa';

export interface ProjectMeta {
  kind: ProjectKind;
  category: string;
  year: string;
  images: string[];
  tags: string[];
}

export function getProjectMeta(project: Project): ProjectMeta {
  const title = project.title.toLowerCase();
  const isQA = /\buat\b|testing|\btest\b/.test(title);

  let category = 'Web Application';
  if (isQA) category = 'Quality Assurance';
  else if (title.includes('mizuki')) category = 'Hotel Reservation';
  else if (title.includes('simtah')) category = 'GIS & Gov Platform';
  else if (project.tags.some((t) => t.toLowerCase().includes('apriori'))) category = 'Data Mining · E‑Commerce';
  else if (title.includes('sparta')) category = 'E‑Commerce';
  else if (title.includes('office')) category = 'Enterprise System';

  return {
    kind: isQA ? 'qa' : 'dev',
    category,
    year: project.createdAt.substring(0, 4),
    images: [project.image, ...(project.gallery || [])].filter(Boolean),
    tags: formatTags(project.tags),
  };
}
