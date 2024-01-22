import { fetchSchools } from "@/lib/Store";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  if (request.url === undefined) return NextResponse.error();

  return NextResponse.json(await fetchSchools());
}
