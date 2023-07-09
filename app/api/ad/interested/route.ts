import { markAsInterested } from "@/lib/Store";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  return NextResponse.json(await markAsInterested(
    body['advertisement_id'],
    body['user_id']
  ));
}
