import { getUserAdsPrev } from "@/lib/Store";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  if (request.url === undefined) return NextResponse.error();

  if (params.username === null) return NextResponse.error();

  return NextResponse.json(await getUserAdsPrev(params.username));
}
