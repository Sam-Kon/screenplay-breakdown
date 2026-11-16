import { NextResponse } from "next/server";
import { RequestSchema, type Shot } from "@/lib/schemas";
import { generateShots } from "@/lib/llm";
import { store, type ShotListRecord } from "@/lib/store";

// Exporting a function named POST handles POST requests to /api/shotlist
// POST /api/shotlist creates a shot list from a scene
export async function POST(req: Request) {
  // 1. Parse the body. Anyone can send garbage, so treat it as unknown.
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // 2. Validate
  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  // 3. Generate 

  try {
    const shots = await generateShots(parsed.data.scene);
    const record: ShotListRecord = {
      id: crypto.randomUUID(),
      scene: parsed.data.scene,
      shots,
      createdAt: new Date().toISOString(),
    };
    store.set(record.id, record);
    return NextResponse.json(record, {
      status: 201, // created
      headers: { Location: `/api/shotlist/${record.id}` },
    })
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Shot list generation failed" }, { status: 500 });
  }
}

// GET /api/shotlist retrieves all shot lists
export async function GET() {
  return NextResponse.json(Array.from(store.values()));
}
