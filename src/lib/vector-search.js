// lib/vector-search.js
import prisma from "./prisma";
import { openai, OPENAI_EMBED_MODEL } from "./openai";

/**
 * queryReports(query, k, threshold)
 */
export async function queryReports(query, k = 10, threshold = null) {
  // 1) Embed query
  const embRes = await openai.embeddings.create({
    model: OPENAI_EMBED_MODEL,
    input: query,
  });
  const qEmbedding = embRes.data[0].embedding;
  if (!Array.isArray(qEmbedding)) {
    throw new Error("Invalid query embedding");
  }
  const vectorLiteral = "[" + qEmbedding.join(",") + "]";

  // 2) Run KNN
  const sql = `
    select r.*, e.embedding <-> $1::vector as distance
    from "IncidentEmbedding" e
    join "IncidentReport" r on r.id = e."incidentReportId"
    order by e.embedding <-> $1::vector
    limit $2;
  `;

  const rows = await prisma.$queryRawUnsafe(sql, vectorLiteral, k);

  // Debug distances
  // console.log("Query:", query);
  rows.forEach(r => {
    console.log(`Report ${r.id} | Date: ${r.date} | Dist: ${r.distance}`);
  });

  // 3) If threshold given, filter
  if (threshold !== null) {
    return rows.filter(r => r.distance <= threshold);
  }
  return rows;
}

