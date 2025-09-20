/*
  Warnings:

  - The primary key for the `IncidentEmbedding` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `IncidentEmbedding` table. All the data in the column will be lost.
*/

-- Drop constraint (not the index!)
ALTER TABLE "public"."IncidentEmbedding" DROP CONSTRAINT "IncidentEmbedding_incidentReportId_key";

-- Alter table: drop PK and `id` column, then add new PK
ALTER TABLE "public"."IncidentEmbedding"
  DROP CONSTRAINT "IncidentEmbedding_pkey",
  DROP COLUMN "id",
  ADD CONSTRAINT "IncidentEmbedding_pkey" PRIMARY KEY ("incidentReportId");
