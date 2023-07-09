import { markAsSold } from "@/lib/Store";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  return NextResponse.json(
    await markAsSold(
      (await request.json())['id']
    )
  );
}
