import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiArrowUpRight } from 'react-icons/fi';
import { getProfile, getProjectById, getProjects } from '@/lib/data';
import { isLocked, lockedMetadata } from '@/lib/privacy';
import { PrivacyGate } from '@/components/PrivacyGate';
import { getProjectMeta, slugify } from '@/lib/project-meta';
import { techIcon } from '@/lib/tech-icons';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MarkerText } from '@/components/ui/MarkerText';
import { Reveal } from '@/components/ui/Reveal';
import { ProjectDetailHero, ProjectDetailGalleryGrid } from '@/components/ui/ProjectDetailHero';

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
  const no = String(position + 1).padStart(2, '0');

  const facts = [
    { label: 'Category', value: meta.category },
    { label: 'Year', value: meta.year },
    { label: 'Type', value: meta.kind === 'qa' ? 'Quality Assurance' : 'Development' },
    { label: 'Screens', value: String(meta.images.length) },
  ];

  return (
    <PrivacyGate>
      <div className="flex min-h-screen flex-col bg-chalk text-navy">
        <Navbar />

        <main className="flex-1 pt-24 sm:pt-28">
          <div className="wrap">
            <Link
              href="/#projects"
              className="group inline-flex items-center gap-2 font-mono text-[0.72rem] font-bold uppercase transition-colors hover:text-ocean"
            >
              <FiArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
              Back to work
            </Link>

            <header className="mt-8">
              <Reveal>
                <div className="font-mono text-[0.72rem] font-bold uppercase text-ocean">
                  {no} — Case study
                </div>
                <h1 className="t-marker relative mt-3 inline-block max-w-4xl">
                  <MarkerText>{project.title.trim()}</MarkerText>
                  <span className="absolute -bottom-2 left-0 h-[0.12em] w-2/5 -rotate-1 rounded-full bg-flame" aria-hidden />
                </h1>
                <p className="mt-6 max-w-3xl text-[1.02rem] leading-relaxed text-navy/80">
                  {project.description.replace(/\s+/g, ' ').trim()}
                </p>
              </Reveal>
            </header>

            <dl className="mt-10 grid grid-cols-2 border-[3px] border-navy bg-white md:grid-cols-4">
              {facts.map((f, i) => (
                <div
                  key={f.label}
                  className={`px-4 py-4 md:px-5 ${i % 2 === 1 ? 'border-l-[3px] border-navy' : ''} ${i >= 2 ? 'border-t-[3px] md:border-t-0' : ''} ${
                    i === 2 ? 'md:border-l-[3px]' : ''
                  } border-navy`}
                >
                  <dt className="font-mono text-[0.66rem] font-bold uppercase text-navy/60">{f.label}</dt>
                  <dd className="mt-1 font-hand text-[1.6rem] font-bold leading-tight">{f.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <ul className="flex flex-wrap gap-2">
                {meta.tags.map((tag) => {
                  const Icon = techIcon(tag);
                  return (
                    <li
                      key={tag}
                      className="inline-flex items-center gap-2 rounded-full border-2 border-navy bg-white px-3 py-1.5 font-mono text-[0.68rem] font-bold uppercase"
                    >
                      <Icon className="h-3.5 w-3.5 text-ocean" aria-hidden /> {tag}
                    </li>
                  );
                })}
              </ul>
              <div className="flex items-center gap-3">
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-stamp btn-stamp-ocean">
                    Live demo <FiArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-stamp btn-stamp-paper">
                    Source code <FiArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>

            <div className="mt-12">
              <ProjectDetailHero images={meta.images} title={project.title.trim()} label={`${slugify(project.title)}.app`} />
            </div>

            <section className="mt-20 grid grid-cols-12 gap-x-8 gap-y-4 sm:mt-24">
              <h2 className="col-span-12 font-marker text-3xl uppercase md:col-span-4">
                Overview
                <span className="mt-1 block -rotate-2 font-hand text-2xl normal-case text-flame">the short story</span>
              </h2>
              <Reveal className="col-span-12 md:col-span-8">
                <div className="whitespace-pre-line text-[1.02rem] leading-relaxed text-navy/85">
                  {(project.longDescription || project.description).trim()}
                </div>
              </Reveal>
            </section>

            {meta.images.length > 1 && (
              <section className="mt-20 sm:mt-24">
                <h2 className="mb-8 font-marker text-3xl uppercase">
                  Screens <span className="font-mono text-base text-ocean">{meta.images.length}</span>
                </h2>
                <ProjectDetailGalleryGrid images={meta.images} title={project.title.trim()} />
              </section>
            )}
          </div>

          {/* Next project */}
          {next && next.id !== project.id && (
            <Link href={`/projects/${next.id}`} className="group mt-24 block border-t-[3px] border-navy bg-ocean text-white sm:mt-28">
              <div className="wrap flex flex-col gap-8 py-14 sm:py-16 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-hand text-2xl font-semibold text-sun">next on the menu</div>
                  <div className="mt-2 flex items-center gap-4 font-marker text-[clamp(2rem,4vw,3.25rem)] uppercase leading-none">
                    <span><MarkerText>{next.title.trim()}</MarkerText></span>
                    <span className="shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2" aria-hidden>
                      →
                    </span>
                  </div>
                </div>
                <div className="w-full max-w-[320px] -rotate-2 border-[3px] border-navy bg-white p-2 shadow-[6px_6px_0_#0c2340] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-0 md:w-[30%]">
                  <img
                    src={getProjectMeta(next).images[0]}
                    alt={next.title}
                    loading="lazy"
                    className="block h-auto w-full border-2 border-navy bg-chalk"
                  />
                </div>
              </div>
            </Link>
          )}
        </main>

        <Footer profile={profile} />
      </div>
    </PrivacyGate>
  );
}
