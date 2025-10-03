// app/api/incident/images/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import prisma from "@/lib/prisma";
import { createSupabaseServer } from "@/lib/supabase-server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const OPERATIONS_BUCKET =
  process.env.OPERATIONS_IMAGES_BUCKET || "operationImages";

export async function POST(req) {
  const { searchParams } = new URL(req.url);

  // const year = searchParams.get('year');
  // const month = searchParams.get('month');
  // const form = await req.formData();
  // const captions = form.getAll("captions") || null;
  // console.log(form)
  // console.log(captions)

  try {
    const form = await req.formData();
    const year = form.get("year") || searchParams.get("year");
    const month = form.get("month") || searchParams.get("month");
    const captions = form.getAll("captions") || null;
    const files = form.getAll("files");

    // console.log("[images POST] year:", year, "month:", month, "files count:", files.length);
    // console.log(form)
    // console.log(captions)
    // console.log(`year: ${year} month: ${month} file available: ${files.length === 0}`)

    if (!year || !month || files.length === 0) {
      return NextResponse.json(
        { ok: false, error: "year, month, and files are required" },
        { status: 400 }
      );
    }

    // ✅ Use your supabase client (don’t duplicate)
    const supabase = createSupabaseServer();

    // --- Step 1: Ensure Year row exists ---
    const yearRow = await prisma.year.upsert({
      where: { year: parseInt(year, 10) },
      update: {},
      create: { year: parseInt(year, 10) },
    });

    // --- Step 2: Ensure Month row exists ---
    const monthRow = await prisma.month.upsert({
      where: {
        yearId_month: { yearId: yearRow.id, month: parseInt(month, 10) },
      },
      update: {},
      create: { yearId: yearRow.id, month: parseInt(month, 10) },
    });

    // --- Step 3: Upload files to Supabase ---
    const uploads = [];
    let i = 0; // ✅ Initialize i before the loop
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filePath = `${year}/${month}/${Date.now()}-${file.name}`;

      console.log("[images POST] Uploading:", {
        bucket: OPERATIONS_BUCKET,
        path: filePath,
        type: file.type,
        size: file.size,
      });

      const { error: uploadError } = await supabase.storage
        .from(OPERATIONS_BUCKET)
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("[images POST] Supabase upload error:", uploadError);
        throw new Error(`Failed upload: ${uploadError.message}`);
      }

      const { data: urlData } = supabase.storage
        .from(OPERATIONS_BUCKET)
        .getPublicUrl(filePath);

      uploads.push({
        monthId: monthRow.id,
        path: filePath,
        publicUrl: urlData?.publicUrl || null,
        caption: captions[i] || null, // ✅ Protect against index overflow
      });

      i++; // ✅ Increment after each upload
    }

    // --- Step 4: Insert OperationImage rows ---
    await prisma.operationImage.createMany({ data: uploads });

    return NextResponse.json({ ok: true, count: uploads.length });
  } catch (err) {
    console.error("[images POST] Error", err);
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}
