import { fetchUserByUsername } from "@/lib/Store";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  if (request.url === undefined) return NextResponse.error();

  if (params.username === undefined) return NextResponse.error();

  return NextResponse.json(await fetchUserByUsername(params.username));
}
