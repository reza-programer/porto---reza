import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiArrowRight, FiArrowUpRight } from 'react-icons/fi';
import { getProfile, getProjectById, getProjects } from '@/lib/data';
import { getProjectMeta, slugify } from '@/lib/project-meta';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Reveal } from '@/components/ui/Reveal';
import { ProjectDetailHero, ProjectDetailGalleryGrid } from '@/components/ui/ProjectDetailHero';

// Divider rules for the 4 fact cells: 2 columns on phones, 4 from md up.
const FACT_CELL = ['border-r', 'pl-4 md:border-r md:pl-6', 'border-r md:pl-6', 'pl-4 md:pl-6'];

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const projects = getProjects();
  return projects.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: ProjectDetailPageProps) {
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
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 pt-24 sm:pt-28">
        <div className="wrap">
          <Link href="/#projects" className="eyebrow group inline-flex items-center gap-2 transition-colors hover:text-ink">
            <FiArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
            Back to work
          </Link>

          <header className="mt-8 border-t border-line pt-6">
            <Reveal>
              <div className="eyebrow">
                <span className="text-ink">{no}</span> — Case study
              </div>
              <h1 className="t-h1 mt-3 max-w-4xl">{project.title.trim()}</h1>
              <p className="t-lead mt-4 max-w-3xl text-muted">{project.description.replace(/\s+/g, ' ').trim()}</p>
            </Reveal>
          </header>

          <dl className="mt-10 grid grid-cols-2 border-t border-line md:grid-cols-4">
            {facts.map((f, i) => (
              <div key={f.label} className={`border-b border-line py-5 pr-4 ${FACT_CELL[i]}`}>
                <dt className="eyebrow">{f.label}</dt>
                <dd className="t-body mt-1.5 font-medium text-ink">{f.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <ul className="flex flex-wrap gap-1.5">
              {meta.tags.map((tag) => (
                <li key={tag} className="chip">
                  {tag}
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-2">
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary py-2.5">
                  Live demo <FiArrowUpRight className="h-3.5 w-3.5" />
                </a>
              )}
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline py-2.5">
                  Source code <FiArrowUpRight className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>

          <div className="mt-10">
            <ProjectDetailHero images={meta.images} title={project.title.trim()} label={`${slugify(project.title)}.app`} />
          </div>

          <section className="mt-20 grid grid-cols-12 gap-x-8 gap-y-4 border-t border-line pt-6 sm:mt-24">
            <h2 className="t-h3 col-span-12 md:col-span-4">Overview</h2>
            <Reveal className="col-span-12 md:col-span-8">
              <div className="t-lead whitespace-pre-line text-ink-2">
                {(project.longDescription || project.description).trim()}
              </div>
            </Reveal>
          </section>

          {meta.images.length > 1 && (
            <section className="mt-20 border-t border-line pt-6 sm:mt-24">
              <h2 className="t-h3 mb-8">
                Screens <span className="text-faint">{meta.images.length}</span>
              </h2>
              <ProjectDetailGalleryGrid images={meta.images} title={project.title.trim()} />
            </section>
          )}
        </div>

        {/* Next project */}
        {next && next.id !== project.id && (
          <Link href={`/projects/${next.id}`} className="group mt-24 block border-t border-line sm:mt-28">
            <div className="wrap flex flex-col gap-6 py-12 sm:py-16 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="eyebrow">Next project</div>
                <div className="t-h2 mt-3 flex items-center gap-3 transition-colors group-hover:text-accent">
                  <span>{next.title.trim()}</span>
                  <FiArrowRight className="h-[0.8em] w-[0.8em] shrink-0 text-faint transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 group-hover:text-accent" />
                </div>
              </div>
              <div className="w-full max-w-[300px] overflow-hidden rounded-lg border border-line opacity-80 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:opacity-100 md:w-[30%]">
                <img
                  src={getProjectMeta(next).images[0]}
                  alt={next.title}
                  loading="lazy"
                  className="aspect-[21/10] w-full bg-surface object-contain"
                />
              </div>
            </div>
          </Link>
        )}
      </main>

      <Footer profile={profile} />
    </div>
  );
}
