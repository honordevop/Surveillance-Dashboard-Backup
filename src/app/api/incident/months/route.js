// app/api/incident/months/route.js
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';


export async function GET() {
  try {
    const months = await prisma.month.findMany({
      where: { monthlyIncident: { isNot: null } },
      include: { year: true },
      orderBy: [{ year: { year: 'desc' } }, { month: 'desc' }],
    });

    const data = months.map((m) => ({
      year: m.year.year,
      month: m.month,
    }));

    return NextResponse.json({ ok: true, data });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: 'Failed to load months' }, { status: 500 });
  }
}
