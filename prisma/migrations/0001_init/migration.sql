create extension if not exists vector;

create table if not exists "IncidentReport" (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  location text not null,
  "incidentType" text not null,
  details text not null,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now(),
  constraint incident_unique unique (date, location, "incidentType")
);

create table if not exists "IncidentEmbedding" (
  id uuid primary key default gen_random_uuid(),
  "incidentReportId" uuid not null references "IncidentReport"(id) on delete cascade,
  embedding vector(1536) not null,
  constraint incident_embedding_unique unique ("incidentReportId")
);
