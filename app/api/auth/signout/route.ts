import { signOut } from "@/lib/Store";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  return NextResponse.json(await signOut());
};
