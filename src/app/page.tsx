import { getProfile, getProjects, getExperience, getCertificates } from '@/lib/data';
import { isLocked, lockedMetadata } from '@/lib/privacy';
import { PrivacyGate } from '@/components/PrivacyGate';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
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
      <div className="site flex min-h-screen flex-col">
        <Navbar />

        <main className="flex-1">
          <HeroSection profile={profile} />
          <ProjectsSection projects={projects} />
          <AboutSection profile={profile} experiences={experiences} />
          <SkillsSection profile={profile} />
          <CertificatesSection certificates={certificates} />
          <ContactSection profile={profile} />
        </main>

        <Footer profile={profile} />
      </div>
    </PrivacyGate>
  );
}
