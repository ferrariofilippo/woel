import { createAd } from "@/lib/Store";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  return NextResponse.json(
    await createAd(
      await request.json()
    )
  );
}
