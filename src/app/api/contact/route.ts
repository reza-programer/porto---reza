import { NextResponse } from 'next/server';
import { saveMessage, generateId } from '@/lib/data';
import type { ContactMessage } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newMessage: ContactMessage = {
      id: generateId(),
      name: body.name,
      email: body.email,
      message: body.message,
      createdAt: new Date().toISOString(),
      read: false,
    };

    saveMessage(newMessage);
    return NextResponse.json({ success: true, message: newMessage }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 });
  }
}
