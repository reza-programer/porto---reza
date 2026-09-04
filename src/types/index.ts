export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  image: string;
  gallery?: string[];
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  createdAt: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  logo?: string;
  location?: string;
  period: string;
  description: string;
  skills: string[];
  order: number;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  image: string;
  description?: string;
  credentialUrl?: string;
}

export interface Profile {
  name: string;
  title: string;
  bio: string;
  avatar: string;
  email: string;
  phone?: string;
  location: string;
  resumeUrl?: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
  stats: {
    projectsCompleted: number;
    yearsExperience: number;
    certificatesEarned: number;
  };
  skills: SkillCategory[];
}

export interface SkillCategory {
  category: string;
  skills: Skill[];
}

export interface Skill {
  name: string;
  level: number; // 0-100
  icon?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read: boolean;
}
