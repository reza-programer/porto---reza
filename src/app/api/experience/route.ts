import { NextResponse } from 'next/server';
import { getExperience, saveExperience, deleteExperience, generateId } from '@/lib/data';
import type { Experience } from '@/types';

export async function GET() {
  const experiences = getExperience();
  return NextResponse.json(experiences);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const currentExperiences = getExperience();
    const minOrder = currentExperiences.length > 0 ? Math.min(...currentExperiences.map((e) => e.order)) : 0;
    const newExperience: Experience = {
      id: generateId(),
      title: body.title,
      company: body.company,
      logo: body.logo || '',
      location: body.location || '',
      period: body.period,
      description: body.description,
      skills: body.skills || [],
      order: typeof body.order === 'number' ? body.order : minOrder - 1,
    };

    saveExperience(newExperience);
    return NextResponse.json(newExperience, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    saveExperience(body);
    return NextResponse.json(body);
  } catch {
    return NextResponse.json({ error: 'Failed to update experience' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    deleteExperience(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 });
  }
}
