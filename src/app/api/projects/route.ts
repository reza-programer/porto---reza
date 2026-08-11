import { NextResponse } from 'next/server';
import { getProjects, saveProject, generateId } from '@/lib/data';
import type { Project } from '@/types';

export async function GET() {
  const projects = getProjects();
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newProject: Project = {
      id: generateId(),
      title: body.title,
      description: body.description,
      longDescription: body.longDescription || '',
      image: body.image || '/images/projects/project1.svg',
      tags: body.tags || [],
      liveUrl: body.liveUrl || '',
      githubUrl: body.githubUrl || '',
      featured: body.featured ?? true,
      createdAt: new Date().toISOString().split('T')[0],
    };

    saveProject(newProject);
    return NextResponse.json(newProject, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
