import { addAdPicture } from "@/lib/Store";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  if (request.url === undefined || request.body === null)
    return NextResponse.error();

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (id === null)
    return NextResponse.error();

  return NextResponse.json(await addAdPicture(parseInt(id), request.body));
}
