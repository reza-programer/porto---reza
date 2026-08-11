import { getProjectById, getProjects } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getProfile } from '@/lib/data';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { MacbookFrame } from '@/components/ui/MacbookFrame';
import { FiArrowLeft, FiExternalLink, FiGithub, FiCalendar, FiImage } from 'react-icons/fi';

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const projects = getProjects();
  return projects.map((p) => ({ id: p.id }));
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;
  const project = getProjectById(id);
  const profile = getProfile();

  if (!project) {
    notFound();
  }

  const allImages = [project.image, ...(project.gallery || [])].filter(Boolean);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Back Button */}
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 mb-8 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" /> Back to Projects
          </Link>

          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">
              {project.title}
            </h1>
            <p className="text-slate-500 text-sm flex items-center gap-2">
              <FiCalendar className="w-4 h-4" /> Added on {project.createdAt}
            </p>
          </div>

          {/* Laptop MacBook Display Gallery Preview */}
          <div className="mb-12 p-4 sm:p-6 bg-slate-200/60 rounded-3xl border border-slate-300/60 shadow-inner">
            <MacbookFrame images={allImages} alt={project.title} />
          </div>

          {/* Main Content & Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                  Project Overview
                </h3>
                <div className="text-slate-600 leading-relaxed space-y-4 text-sm sm:text-base whitespace-pre-line">
                  {project.longDescription || project.description}
                </div>
              </Card>

              {/* Gallery Thumbnails List */}
              {allImages.length > 1 && (
                <Card>
                  <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                    <FiImage className="w-5 h-5 text-blue-600" /> Screenshot Gallery ({allImages.length})
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {allImages.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="aspect-16/10 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 group"
                      >
                        <img
                          src={imgUrl}
                          alt={`${project.title} ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            {/* Sidebar info */}
            <div className="space-y-6">
              <Card>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                  Project Links
                </h3>
                <div className="space-y-3">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button
                        variant="primary"
                        size="md"
                        className="w-full justify-center"
                        icon={<FiExternalLink className="w-4 h-4" />}
                      >
                        Live Demo
                      </Button>
                    </a>
                  )}

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full block"
                    >
                      <Button
                        variant="outline"
                        size="md"
                        className="w-full justify-center"
                        icon={<FiGithub className="w-4 h-4" />}
                      >
                        Source Code
                      </Button>
                    </a>
                  )}
                </div>
              </Card>

              <Card>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer profile={profile} />
    </div>
  );
}
