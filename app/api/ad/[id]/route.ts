import { fetchAdById } from "@/lib/Store";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  if (request.url === undefined)
    return NextResponse.error();

  const { searchParams } = new URL(request.url);
  const idString = searchParams.get('id');
  if (idString === null)
    return NextResponse.error();

  const id = parseInt(idString);

  return NextResponse.json(await fetchAdById(id));
}
