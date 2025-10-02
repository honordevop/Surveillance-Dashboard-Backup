-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."SiteCategory" AS ENUM ('ILLEGAL_CONNECTION', 'ILLEGAL_REFINERY', 'OTHER');

-- CreateTable
CREATE TABLE "public"."IncidentReport" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "location" TEXT NOT NULL,
    "incidentType" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IncidentReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."IncidentEmbedding" (
    "incidentReportId" TEXT NOT NULL,
    "embedding" vector NOT NULL,

    CONSTRAINT "IncidentEmbedding_pkey" PRIMARY KEY ("incidentReportId")
);

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

-- CreateTable
CREATE TABLE "public"."leakage_sites" (
    "id" SERIAL NOT NULL,
    "monthId" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "leakage_sites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OperationImage" (
    "id" SERIAL NOT NULL,
    "monthId" INTEGER NOT NULL,
    "path" TEXT NOT NULL,
    "publicUrl" TEXT NOT NULL,
    "caption" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OperationImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IncidentReport_date_location_incidentType_key" ON "public"."IncidentReport"("date", "location", "incidentType");

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

-- AddForeignKey
ALTER TABLE "public"."leakage_sites" ADD CONSTRAINT "leakage_sites_monthId_fkey" FOREIGN KEY ("monthId") REFERENCES "public"."Month"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OperationImage" ADD CONSTRAINT "OperationImage_monthId_fkey" FOREIGN KEY ("monthId") REFERENCES "public"."Month"("id") ON DELETE CASCADE ON UPDATE CASCADE;

