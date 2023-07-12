import { logIn } from "@/lib/Store";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  return NextResponse.json(await logIn(body['email'], body['password']));
};
