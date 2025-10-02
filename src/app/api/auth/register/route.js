// app/api/auth/signup/route.js
import prisma from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password, corridor, role } = body || {};

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: 'email and password are required' },
        { status: 400 }
      );
    }

    // check existing user
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ ok: false, error: 'User already exists' }, { status: 409 });
    }

    const hashed = await hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name: name || null,
        email,
        password: hashed,
        corridor: corridor || null,
        role: role || 'admin',
      },
      select: {
        id: true,
        name: true,
        email: true,
        corridor: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ ok: true, data: user }, { status: 201 });
  } catch (err) {
    console.error('[signup POST]', err);
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 });
  }
}
