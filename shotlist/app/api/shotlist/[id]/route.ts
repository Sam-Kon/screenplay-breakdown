import { NextResponse } from "next/server";
import { store } from "@/lib/store";

type Ctx = { params: Promise<{ id: string }> }; // params is async in current Next

// GET /api/shotlist/:id
export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const record = store.get(id);
  if (!record) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(record);
}

// DELETE /api/shotlist/:id
export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  if (!store.delete(id)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return new Response(null, { status: 204 }); // success, no body
}