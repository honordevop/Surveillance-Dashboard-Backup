// app/api/incident/report/route.js
import prisma from '@/lib/prisma';
import { UpsertIncidentSchema } from '@/lib/schemas';
import { createSupabaseServer, OPERATIONS_BUCKET } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const year = parseInt(searchParams.get('year') || '', 10);
    const month = parseInt(searchParams.get('month') || '', 10);

    if (!year || !month) {
      return NextResponse.json({ ok: false, error: 'year and month are required' }, { status: 400 });
    }

    const result = await prisma.month.findFirst({
      where: { month, year: { year } },
      include: {
        year: true,
        monthlyIncident: true,
        illegalSites: true,
        burntAssets: true,
        leakageSites: true,
        operationImages: true, // includes path + caption
      },
    });

    if (!result || !result.monthlyIncident) {
      return NextResponse.json({ ok: true, data: null });
    }

      // Build signed URLs for private bucket (1 hour expiry)
    const supabase = createSupabaseServer();

    let operationImages = [];
    if (result.operationImages && result.operationImages.length > 0) {
      const promises = result.operationImages.map(async (img) => {
        const { data, error } = await supabase
          .storage
          .from(OPERATIONS_BUCKET)
          .createSignedUrl(img.path, 60 * 60);
        if (error) {
          console.warn('[report GET] Signed URL error:', error.message);
          return { id: img.id, caption: img.caption || null, path: img.path, signedUrl: null };
        }
        return { id: img.id, caption: img.caption || null, path: img.path, signedUrl: data.signedUrl };
      });
      operationImages = await Promise.all(promises);
    }

    const payload = {
      year: result.year.year,
      month: result.month,
      report: result.monthlyIncident,
      illegalSites: result.illegalSites,
      burntAssets: result.burntAssets,
      leakageSites: result.leakageSites,
      operationImages, // signed URLs for dashboard/admin previews
    };

    return NextResponse.json({ ok: true, data: payload });
  } catch (e) {
    console.error('[report GET]', e);
    return NextResponse.json({ ok: false, error: 'Failed to load report' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    // const input = await req.json();
    // console.log(body)
    const parsed = UpsertIncidentSchema.safeParse(body);
    console.log(parsed)
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const input = parsed.data;
    // console.log(input)

    // ✅ First, ensure year + month exist
    const yearRow = await prisma.year.upsert({
      where: { year: input.year },
      update: {},
      create: { year: input.year },
    });

    let monthRow = await prisma.month.findFirst({
      where: { month: input.month, yearId: yearRow.id },
    });

    // console.log(monthRow)

    if (!monthRow) {
      monthRow = await prisma.month.create({
        data: { month: input.month, yearId: yearRow.id },
      });
    }

    const metrics = {
      illegalConnections: input.illegalConnections,
      illegalRefineries: input.illegalRefineries,
      oilLeaks: input.oilLeaks,
      gasLeaks: input.gasLeaks,
      arrestsMade: input.arrestsMade,
      aversions: input.aversions,
      litersAGO: input.litersAGO,
      litersPMS: input.litersPMS,
      litersCrude: input.litersCrude,
    };

    // ✅ Prepare queries (batched form)
    const queries = [
      prisma.monthlyIncident.upsert({
        where: { monthId: monthRow.id },
        update: metrics,
        create: { monthId: monthRow.id, ...metrics },
      }),
    ];

    if (monthRow) {
      // Existing month → wipe children
      queries.push(prisma.illegalSite.deleteMany({ where: { monthId: monthRow.id } }));
      queries.push(prisma.burntAsset.deleteMany({ where: { monthId: monthRow.id } }));
      queries.push(prisma.leakageSite.deleteMany({ where: { monthId: monthRow.id } }));
    }

    if (input.illegalSites?.length) {
      queries.push(
        prisma.illegalSite.createMany({
          data: input.illegalSites.map((s) => ({
            monthId: monthRow.id,
            category: s.category,
            location: s.location,
            lat: s.lat,
            lng: s.lng,
          })),
        })
      );
    }

    if (input.burntAssets?.length) {
      queries.push(
        prisma.burntAsset.createMany({
          data: input.burntAssets.map((a) => ({
            monthId: monthRow.id,
            name: a.name,
            notes: a.notes || null,
          })),
        })
      );
    }

    if (input.leakageSites?.length) {
      queries.push(
        prisma.leakageSite.createMany({
          data: input.leakageSites.map((s) => ({
            monthId: monthRow.id,
            category: s.category,
            location: s.location,
            lat: s.lat,
            lng: s.lng,
          })),
        })
      );
    }

    // ✅ Run everything in one short-lived atomic transaction
    // console.log(queries)
    await prisma.$transaction(queries);

    return NextResponse.json(
      { ok: true, data: { year: yearRow.year, month: monthRow.month } },
      { status: 201 }
    );
  } catch (e) {
    console.error("[report POST]", e);
    return NextResponse.json(
      { ok: false, error: "Failed to upsert report" },
      { status: 500 }
    );
  }
}

