import { fetchUserById } from "@/lib/Store";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  if (request.url === undefined)
    return NextResponse.error();

  const url = new URL(request.url).href;
  const id = url.split('/').pop();
  if (id === undefined)
    return NextResponse.error();

  return NextResponse.json(await fetchUserById(id));
}
