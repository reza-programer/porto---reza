import { getProfile, getProjects, getExperience, getCertificates } from '@/lib/data';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { CertificatesSection } from '@/components/sections/CertificatesSection';
import { ContactSection } from '@/components/sections/ContactSection';

export const revalidate = 60; // Revalidate data every 60s

export default function Home() {
  const profile = getProfile();
  const projects = getProjects();
  const experiences = getExperience();
  const certificates = getCertificates();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <HeroSection profile={profile} />
        <ProjectsSection projects={projects} />
        <AboutSection profile={profile} />
        <SkillsSection profile={profile} />
        <ExperienceSection experiences={experiences} />
        <CertificatesSection certificates={certificates} />
        <ContactSection profile={profile} />
      </main>

      <Footer profile={profile} />
    </div>
  );
}
