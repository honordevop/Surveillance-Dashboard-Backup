create index if not exists incident_embedding_embedding_ivfflat
  on "IncidentEmbedding" using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

analyze "IncidentEmbedding";

-- create RPC for local dev
create or replace function public.incident_counts_monthly(start_date date, end_date date)
returns table(incident_type text, cnt integer)
language sql
as $$
  select "incidentType"::text as incident_type, count(*)::int as cnt
  from "IncidentReport"
  where date >= start_date and date < end_date
  group by "incidentType"
  order by cnt desc;
$$;
