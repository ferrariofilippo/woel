import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data } = await supabase
    .from('advertisement')
    .insert(await request.json());

  return NextResponse.json(data);
}
