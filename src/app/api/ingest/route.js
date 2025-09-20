import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
import { getEmbedding } from "@/lib/openai";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const { date, location, incidentType, details } = await req.json();

    if (!date || !location || !incidentType || !details) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Create or update IncidentReport
    const report = await prisma.incidentReport.upsert({
      where: {
        incident_unique: {
          date: new Date(date),
          location,
          incidentType,
        },
      },
      update: { details },
      create: {
        date: new Date(date),
        location,
        incidentType,
        details,
      },
    });

    // 2. Generate embedding
    const embedding = await getEmbedding(details);
    const vectorLiteral = `[${embedding.join(",")}]`;

    // 3. Insert or update IncidentEmbedding
    await prisma.$executeRawUnsafe(
      `
      INSERT INTO "IncidentEmbedding" ("incidentReportId", "embedding")
      VALUES ($1::uuid, $2::vector)
      ON CONFLICT ("incidentReportId")
      DO UPDATE SET embedding = $2::vector
      `,
      report.id,
      vectorLiteral
    );

    return NextResponse.json({ success: true, reportId: report.id });
  } catch (error) {
    console.error("ingest error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
