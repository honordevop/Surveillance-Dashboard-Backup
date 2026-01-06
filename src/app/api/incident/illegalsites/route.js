// app/api/incident/months/route.js
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await prisma.IllegalSite.findMany();

    return NextResponse.json({ ok: true, data });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { ok: false, error: "Failed to load months" },
      { status: 500 }
    );
  }
}
