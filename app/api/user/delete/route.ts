import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get('id');
  if (!id)
    return NextResponse.error();

  const supabase = createRouteHandlerClient({ cookies });
  const { error } = await supabase
    .from('user_data')
    .delete()
    .eq('user_id', id);

  return NextResponse.json(error);
}
