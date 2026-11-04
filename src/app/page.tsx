import { getProfile, getProjects, getExperience, getCertificates } from '@/lib/data';
import { isLocked, lockedMetadata } from '@/lib/privacy';
import { PrivacyGate } from '@/components/PrivacyGate';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { CertificatesSection } from '@/components/sections/CertificatesSection';
import { ContactSection } from '@/components/sections/ContactSection';

// Rendered per request: what a visitor sees depends on their privacy cookie.
export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return (await isLocked()) ? lockedMetadata : {};
}

export default function Home() {
  const profile = getProfile();
  const projects = getProjects();
  const experiences = getExperience();
  const certificates = getCertificates();

  return (
    <PrivacyGate>
      <div className="flex min-h-screen flex-col">
        <Navbar />

        <main className="flex-1">
          <HeroSection profile={profile} projects={projects} />
          <ProjectsSection projects={projects} />
          <SkillsSection profile={profile} />
          <ExperienceSection experiences={experiences} />
          <CertificatesSection certificates={certificates} />
          <ContactSection profile={profile} />
        </main>

        <Footer profile={profile} />
      </div>
    </PrivacyGate>
  );
}
