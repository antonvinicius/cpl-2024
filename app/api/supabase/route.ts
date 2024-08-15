import { NextResponse } from "next/server";
import { supabase } from "./client";

export async function GET(req: Request) {
  const { data, error } = await supabase.from("tickets").select("*");

  return NextResponse.json({ data }, { status: 200 });
}
