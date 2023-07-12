import { signUp } from "@/lib/Store";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  return NextResponse.json(await signUp(
    body['email'],
    body['password'],
    body['first_name'],
    body['last_name'],
    body['class'],
    body['school_id'],
    body['specialization_id']
  ));
}
