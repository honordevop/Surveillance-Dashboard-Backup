// app/api/user/route.js
import prisma from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    if (!email) {
      return NextResponse.json({ ok: false, error: 'email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, corridor: true, role: true, createdAt: true },
    });

    if (!user) {
      return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, data: user });
  } catch (err) {
    console.error('[user GET]', err);
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const body = await req.json();
    const { email, newPassword } = body || {};
    if (!email || !newPassword) {
      return NextResponse.json({ ok: false, error: 'email and newPassword are required' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (!existing) {
      return NextResponse.json({ ok: false, error: 'User not found' }, { status: 404 });
    }

    const hashed = await hash(newPassword, 10);
    await prisma.user.update({
      where: { email },
      data: { password: hashed },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[user PATCH]', err);
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 });
  }
}
