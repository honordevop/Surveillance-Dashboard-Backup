// scripts/seed.js
import prisma from "../lib/prisma.js";
// import prisma from "../lib/prisma";
import { openai, OPENAI_EMBED_MODEL } from "../lib/openai.js";

// const prisma = require("../lib/prisma.js");

async function main() {
  const examples = [
    {
      date: "2025-07-12",
      location: "Water Ferry Front, Zone 6, Ogba/Egbema/Ndoni",
      incidentType: "Illegal Connection",
      details: "Illegal connection detected and clamped by asset owners.",
    },
    {
      date: "2025-07-13",
      location: "Zone 4 Junction",
      incidentType: "Vandalism",
      details: "Transformer vandalized overnight; reported to security.",
    },
  ];

  for (const ex of examples) {
    const r = await prisma.incidentReport.create({
      data: {
        date: new Date(ex.date),
        location: ex.location,
        incidentType: ex.incidentType,
        details: ex.details,
      },
    });

    const text = `Date: ${ex.date}\nLocation: ${ex.location}\nIncident Type: ${ex.incidentType}\nDetails: ${ex.details}`;
    const embRes = await openai.embeddings.create({
      model: OPENAI_EMBED_MODEL,
      input: text,
    });
    const embedding = embRes.data[0].embedding;
    const vectorLiteral = "[" + embedding.join(",") + "]";
    const upsertSql = `
      insert into "IncidentEmbedding" ("incidentReportId", embedding)
      values ($1, $2::vector)
      on conflict ("incidentReportId") do update
      set embedding = EXCLUDED.embedding
      returning id;
    `;
    await prisma.$queryRawUnsafe(upsertSql, r.id, vectorLiteral);
    // console.log("Seeded report", r.id);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
