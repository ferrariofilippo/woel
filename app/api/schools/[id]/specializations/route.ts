import { fetchSchoolSpecializations } from "@/lib/Store";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: number } }
) {
  if (request.url === undefined) return NextResponse.error();

  if (params.id === null) return NextResponse.error();

  return NextResponse.json(await fetchSchoolSpecializations(params.id));
}
