import { fetchUserById } from "@/lib/Store";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  if (request.url === undefined) return NextResponse.error();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id === null) return NextResponse.error();

  return NextResponse.json(await fetchUserById(id));
}
