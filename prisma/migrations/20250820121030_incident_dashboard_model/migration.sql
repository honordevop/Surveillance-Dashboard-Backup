/*
  Warnings:

  - The primary key for the `IncidentEmbedding` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `IncidentReport` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- CreateEnum
CREATE TYPE "public"."SiteCategory" AS ENUM ('ILLEGAL_CONNECTION', 'ILLEGAL_REFINERY', 'OTHER');

-- DropForeignKey
ALTER TABLE "public"."IncidentEmbedding" DROP CONSTRAINT "IncidentEmbedding_incidentReportId_fkey";

-- DropIndex
DROP INDEX "public"."incident_embedding_embedding_ivfflat";

-- AlterTable
ALTER TABLE "public"."IncidentEmbedding" DROP CONSTRAINT "IncidentEmbedding_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "incidentReportId" SET DATA TYPE TEXT,
ADD CONSTRAINT "IncidentEmbedding_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."IncidentReport" DROP CONSTRAINT "IncidentReport_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "IncidentReport_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "public"."Year" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,

    CONSTRAINT "Year_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Month" (
    "id" SERIAL NOT NULL,
    "month" INTEGER NOT NULL,
    "yearId" INTEGER NOT NULL,

    CONSTRAINT "Month_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MonthlyIncident" (
    "id" SERIAL NOT NULL,
    "monthId" INTEGER NOT NULL,
    "illegalConnections" INTEGER NOT NULL DEFAULT 0,
    "illegalRefineries" INTEGER NOT NULL DEFAULT 0,
    "oilLeaks" INTEGER NOT NULL DEFAULT 0,
    "gasLeaks" INTEGER NOT NULL DEFAULT 0,
    "arrestsMade" INTEGER NOT NULL DEFAULT 0,
    "aversions" INTEGER NOT NULL DEFAULT 0,
    "litersAGO" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "litersPMS" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "litersCrude" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "MonthlyIncident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."IllegalSite" (
    "id" SERIAL NOT NULL,
    "monthId" INTEGER NOT NULL,
    "category" "public"."SiteCategory" NOT NULL,
    "location" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "IllegalSite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BurntAsset" (
    "id" SERIAL NOT NULL,
    "monthId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "BurntAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Year_year_key" ON "public"."Year"("year");

-- CreateIndex
CREATE UNIQUE INDEX "Month_yearId_month_key" ON "public"."Month"("yearId", "month");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyIncident_monthId_key" ON "public"."MonthlyIncident"("monthId");

-- AddForeignKey
ALTER TABLE "public"."IncidentEmbedding" ADD CONSTRAINT "IncidentEmbedding_incidentReportId_fkey" FOREIGN KEY ("incidentReportId") REFERENCES "public"."IncidentReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Month" ADD CONSTRAINT "Month_yearId_fkey" FOREIGN KEY ("yearId") REFERENCES "public"."Year"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MonthlyIncident" ADD CONSTRAINT "MonthlyIncident_monthId_fkey" FOREIGN KEY ("monthId") REFERENCES "public"."Month"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."IllegalSite" ADD CONSTRAINT "IllegalSite_monthId_fkey" FOREIGN KEY ("monthId") REFERENCES "public"."Month"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BurntAsset" ADD CONSTRAINT "BurntAsset_monthId_fkey" FOREIGN KEY ("monthId") REFERENCES "public"."Month"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "public"."incident_embedding_unique" RENAME TO "IncidentEmbedding_incidentReportId_key";

-- RenameIndex
ALTER INDEX "public"."incident_unique" RENAME TO "IncidentReport_date_location_incidentType_key";
