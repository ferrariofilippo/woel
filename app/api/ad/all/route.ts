import { fetchAds } from "@/lib/Store";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  if (request.url === undefined)
    return NextResponse.error();
            
  const { searchParams } = new URL(request.url);

  return NextResponse.json(await fetchAds(
    searchParams.get('priceGT'),
    searchParams.get('priceLT'),
    searchParams.get('isbn'),
    searchParams.get('title'),
    searchParams.get('subject'),
    searchParams.get('year')
  ));
}
