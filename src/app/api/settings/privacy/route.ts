import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { hash } from 'bcryptjs';
import { authOptions } from '@/lib/auth';
import { getSettings, saveSettings } from '@/lib/data';
import { ACCESS_CHOICES } from '@/lib/privacy';

const MIN_PASSWORD = 4;

/** What the admin panel sees: the switch, the duration and whether a password exists, never the hash. */
function publicState() {
  const { privateMode, passwordHash, accessMinutes } = getSettings();
  return { privateMode, hasPassword: !!passwordHash, accessMinutes };
}

export async function GET() {
  if (!(await getServerSession(authOptions))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json(publicState());
}

/** Body: `{ privateMode?: boolean, password?: string, accessMinutes?: number }`. */
export async function PUT(request: Request) {
  if (!(await getServerSession(authOptions))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const settings = getSettings();

  if (typeof body.password === 'string') {
    const password = body.password.trim();
    if (password.length < MIN_PASSWORD) {
      return NextResponse.json({ error: `Password minimal ${MIN_PASSWORD} karakter.` }, { status: 400 });
    }
    settings.passwordHash = await hash(password, 10);
  }

  if (typeof body.privateMode === 'boolean') {
    if (body.privateMode && !settings.passwordHash) {
      return NextResponse.json({ error: 'Atur password dulu sebelum menyalakan mode privasi.' }, { status: 400 });
    }
    settings.privateMode = body.privateMode;
  }

  if (body.accessMinutes !== undefined) {
    if (!ACCESS_CHOICES.includes(body.accessMinutes)) {
      return NextResponse.json({ error: 'Durasi akses tidak dikenal.' }, { status: 400 });
    }
    settings.accessMinutes = body.accessMinutes;
  }

  try {
    saveSettings(settings);
  } catch {
    // Hosts like Netlify run from a read-only copy of the repo.
    return NextResponse.json(
      {
        error:
          'Server ini tidak bisa menyimpan pengaturan (penyimpanan hosting hanya-baca). Ubah dari admin di komputer lokal, lalu push ke GitHub.',
      },
      { status: 500 }
    );
  }
  return NextResponse.json(publicState());
}
