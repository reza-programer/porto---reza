import type { IconType } from 'react-icons';
import {
  SiApachejmeter,
  SiCodeigniter,
  SiDocker,
  SiExpo,
  SiFilament,
  SiGit,
  SiGithub,
  SiGooglecolab,
  SiGooglesheets,
  SiJavascript,
  SiJira,
  SiLaravel,
  SiMysql,
  SiNextdotjs,
  SiPhp,
  SiPostgresql,
  SiPostman,
  SiPython,
  SiReact,
  SiSelenium,
  SiTailwindcss,
  SiTypescript,
  SiVuedotjs,
} from 'react-icons/si';
import { TbApi, TbBug, TbChartDots3, TbChecklist, TbCode, TbDatabase, TbServer2 } from 'react-icons/tb';

// Keyed by lower-cased tech name.
const ICONS: Record<string, IconType> = {
  'react native': SiReact,
  react: SiReact,
  'next.js': SiNextdotjs,
  expo: SiExpo,
  typescript: SiTypescript,
  javascript: SiJavascript,
  laravel: SiLaravel,
  php: SiPhp,
  filament: SiFilament,
  mysql: SiMysql,
  postgresql: SiPostgresql,
  'vue.js': SiVuedotjs,
  'tailwind css': SiTailwindcss,
  codeigniter: SiCodeigniter,
  python: SiPython,
  docker: SiDocker,
  postman: SiPostman,
  selenium: SiSelenium,
  jmeter: SiApachejmeter,
  jira: SiJira,
  github: SiGithub,
  git: SiGit,
  'google colab': SiGooglecolab,
  spreadsheets: SiGooglesheets,
  'rest api': TbApi,
  navicat: TbDatabase,
  sql: TbDatabase,
  winscp: TbServer2,
  uat: TbChecklist,
  'manual testing': TbBug,
  'algoritma apriori': TbChartDots3,
};

// Longest names first, so "react native" wins over "react" and "github" over "git".
const KEYS = Object.keys(ICONS).sort((a, b) => b.length - a.length);

/**
 * Icon for a tech name. Matches exactly first, then by containment so labels
 * like "Postman (API Testing)" or "React / Next.js" still find their icon;
 * anything unknown gets a generic code glyph.
 */
export function techIcon(name: string): IconType {
  const key = name.trim().toLowerCase();
  if (ICONS[key]) return ICONS[key];
  const bare = key.replace(/\(.*?\)/g, '').trim();
  const hit = KEYS.find((k) => bare === k || bare.includes(k));
  return hit ? ICONS[hit] : TbCode;
}
