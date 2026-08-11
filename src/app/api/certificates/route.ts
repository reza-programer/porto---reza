import { NextResponse } from 'next/server';
import { getCertificates, saveCertificate, deleteCertificate, generateId } from '@/lib/data';
import type { Certificate } from '@/types';

export async function GET() {
  const certificates = getCertificates();
  return NextResponse.json(certificates);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newCertificate: Certificate = {
      id: generateId(),
      title: body.title,
      issuer: body.issuer,
      date: body.date,
      image: body.image || '/images/certificates/cert1.svg',
      credentialUrl: body.credentialUrl || '',
    };

    saveCertificate(newCertificate);
    return NextResponse.json(newCertificate, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create certificate' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    saveCertificate(body);
    return NextResponse.json(body);
  } catch {
    return NextResponse.json({ error: 'Failed to update certificate' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    deleteCertificate(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete certificate' }, { status: 500 });
  }
}
