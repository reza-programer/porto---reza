import fs from 'fs';
import path from 'path';
import type { Project, Experience, Certificate, Profile, ContactMessage } from '@/types';

const dataDir = path.join(process.cwd(), 'src', 'data');

function readJSON<T>(filename: string): T {
  const filePath = path.join(dataDir, filename);
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data) as T;
}

function writeJSON<T>(filename: string, data: T): void {
  const filePath = path.join(dataDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Profile
export function getProfile(): Profile {
  return readJSON<Profile>('profile.json');
}

export function saveProfile(profile: Profile): void {
  writeJSON('profile.json', profile);
}

// Projects
export function getProjects(): Project[] {
  return readJSON<Project[]>('projects.json');
}

export function getProjectById(id: string): Project | undefined {
  const projects = getProjects();
  return projects.find((p) => p.id === id);
}

export function saveProject(project: Project): void {
  const projects = getProjects();
  const index = projects.findIndex((p) => p.id === project.id);
  if (index >= 0) {
    projects[index] = project;
  } else {
    projects.push(project);
  }
  writeJSON('projects.json', projects);
}

export function deleteProject(id: string): void {
  const projects = getProjects().filter((p) => p.id !== id);
  writeJSON('projects.json', projects);
}

// Experience
export function getExperience(): Experience[] {
  const experiences = readJSON<Experience[]>('experience.json');
  return experiences.sort((a, b) => a.order - b.order);
}

export function saveExperience(experience: Experience): void {
  const experiences = readJSON<Experience[]>('experience.json');
  const index = experiences.findIndex((e) => e.id === experience.id);
  if (index >= 0) {
    experiences[index] = experience;
  } else {
    experiences.push(experience);
  }
  writeJSON('experience.json', experiences);
}

export function deleteExperience(id: string): void {
  const experiences = readJSON<Experience[]>('experience.json').filter((e) => e.id !== id);
  writeJSON('experience.json', experiences);
}

// Certificates
export function getCertificates(): Certificate[] {
  return readJSON<Certificate[]>('certificates.json');
}

export function saveCertificate(certificate: Certificate): void {
  const certificates = getCertificates();
  const index = certificates.findIndex((c) => c.id === certificate.id);
  if (index >= 0) {
    certificates[index] = certificate;
  } else {
    certificates.push(certificate);
  }
  writeJSON('certificates.json', certificates);
}

export function deleteCertificate(id: string): void {
  const certificates = getCertificates().filter((c) => c.id !== id);
  writeJSON('certificates.json', certificates);
}

// Messages
export function getMessages(): ContactMessage[] {
  return readJSON<ContactMessage[]>('messages.json');
}

export function saveMessage(message: ContactMessage): void {
  const messages = getMessages();
  messages.push(message);
  writeJSON('messages.json', messages);
}

// Generate unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
