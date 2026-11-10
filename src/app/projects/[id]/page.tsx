import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProfile, getProjectById, getProjects } from '@/lib/data';
import { isLocked, lockedMetadata } from '@/lib/privacy';
import { PrivacyGate } from '@/components/PrivacyGate';
import { getProjectMeta } from '@/lib/project-meta';
import { techIcon } from '@/lib/tech-icons';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Asterisk } from '@/components/ui/Glyphs';
import { NoBreak } from '@/components/ui/NoBreak';
import { Reveal } from '@/components/ui/Reveal';
import { CoverPlate, ScreensGrid } from '@/components/ui/ProjectGallery';

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

// Rendered per request: what a visitor sees depends on their privacy cookie.
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: ProjectDetailPageProps) {
  if (await isLocked()) return lockedMetadata;
  const { id } = await params;
  const project = getProjectById(id);
  return { title: project ? `${project.title.trim()} — Reza Nurpadilah` : 'Project not found' };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;
  const project = getProjectById(id);
  const profile = getProfile();

  if (!project) {
    notFound();
  }

  const projects = getProjects();
  const position = projects.findIndex((p) => p.id === project.id);
  const next = projects[(position + 1) % projects.length];
  const meta = getProjectMeta(project);
  const pad = (n: number) => String(n).padStart(2, '0');

  const facts = [
    { label: 'Category', value: meta.category },
    { label: 'Year', value: meta.year },
    { label: 'Type', value: meta.kind === 'qa' ? 'Quality Assurance' : 'Development' },
    { label: 'Screens', value: pad(meta.images.length) },
  ];

  return (
    <PrivacyGate>
      <div className="site flex min-h-screen flex-col">
        <Navbar />

        <main className="flex-1 pt-[72px]">
          <div className="wrap">
            <div className="flex items-center justify-between border-b border-ink/15 py-5 text-[0.78rem] font-medium uppercase tracking-[0.08em]">
              <Link href="/#projects" className="group flex items-center gap-2 opacity-70 hover:opacity-100">
                <span aria-hidden className="transition-transform duration-300 group-hover:-translate-x-1">
                  ←
                </span>
                All works
              </Link>
              <span className="numeral text-base normal-case tracking-normal">
                {pad(position + 1)} / {pad(projects.length)}
              </span>
            </div>

            <header className="grid grid-cols-12 gap-x-6 gap-y-10 pb-12 pt-12 sm:pt-16">
              <Reveal className="col-span-12">
                <div className="flex items-center gap-3">
                  <Asterisk className="h-7 w-7 text-lime" />
                  <span className="text-[0.78rem] font-medium uppercase tracking-[0.2em]">Case study</span>
                </div>
                <h1 className="display wdth-112 mt-4 text-balance text-[clamp(2.6rem,6.4vw,6.4rem)]">
                  <NoBreak text={project.title} />
                </h1>
              </Reveal>
              <p className="col-span-12 text-[1.05rem] leading-relaxed text-ink/75 md:col-span-6">
                {project.description.replace(/\s+/g, ' ').trim()}
              </p>
              <dl className="col-span-12 grid grid-cols-2 self-end border-t border-ink/15 md:col-span-5 md:col-start-8">
                {facts.map((f, i) => (
                  <div key={f.label} className={`border-b border-ink/15 py-4 ${i % 2 ? 'pl-5' : 'border-r pr-5'}`}>
                    <dt className="label text-ink/50">{f.label}</dt>
                    <dd className="mt-1.5 text-[1.02rem] font-semibold">
                      <NoBreak text={f.value} />
                    </dd>
                  </div>
                ))}
              </dl>
            </header>

            <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <ul className="flex flex-wrap gap-2">
                {meta.tags.map((tag) => {
                  const Icon = techIcon(tag);
                  return (
                    <li key={tag} className="flex items-center gap-1.5 rounded-full border border-ink/15 px-3 py-1.5 text-[0.8rem]">
                      <Icon className="h-3.5 w-3.5" aria-hidden /> {tag}
                    </li>
                  );
                })}
              </ul>
              {(project.liveUrl || project.githubUrl) && (
                <div className="flex shrink-0 gap-2">
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-ink">
                      Live site ↗
                    </a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-outline-ink">
                      Source ↗
                    </a>
                  )}
                </div>
              )}
            </div>

            <CoverPlate images={meta.images} title={project.title.trim()} />

            <section className="mt-24 grid grid-cols-12 gap-x-6 gap-y-6 sm:mt-32">
              <div className="col-span-12 md:col-span-3">
                <div className="numeral text-[2rem] leading-none">01 /</div>
                <h2 className="display wdth-100 mt-2 text-[2.2rem]">Overview</h2>
              </div>
              <Reveal className="col-span-12 md:col-span-8 md:col-start-5">
                <div className="whitespace-pre-line text-[1.08rem] leading-relaxed text-ink/80">
                  {(project.longDescription || project.description).trim()}
                </div>
              </Reveal>
            </section>

            {meta.images.length > 1 && (
              <section className="mt-24 sm:mt-32">
                <div className="mb-8 flex items-end justify-between border-b border-ink/15 pb-5">
                  <div>
                    <div className="numeral text-[2rem] leading-none">02 /</div>
                    <h2 className="display wdth-100 mt-2 text-[2.2rem]">Screens</h2>
                  </div>
                  <span className="text-[0.85rem] text-ink/50">{pad(meta.images.length)} images</span>
                </div>
                <ScreensGrid images={meta.images} title={project.title.trim()} />
              </section>
            )}
          </div>

          {next && next.id !== project.id && (
            <Link href={`/projects/${next.id}`} className="group mt-24 block bg-ink text-sheet sm:mt-32">
              <div className="wrap flex flex-col gap-6 py-14 sm:flex-row sm:items-end sm:justify-between sm:py-20">
                <div>
                  <div className="label text-sheet/50">Next project</div>
                  <div className="display wdth-112 mt-4 text-balance text-[clamp(2.2rem,5.6vw,5.4rem)]">
                    <NoBreak text={next.title} />
                  </div>
                </div>
                <span className="arrow-dot h-16! w-16! shrink-0 text-xl">↗</span>
              </div>
            </Link>
          )}
        </main>

        <Footer profile={profile} />
      </div>
    </PrivacyGate>
  );
}
