import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Database } from '@/interfaces/schema';

export type User = Database['public']['tables']['user_data']['Update'];

export async function PUT(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const user: User = await request.json();

  const { error } = await supabase
    .from('user_data')
    .update({
      first_name: user.first_name,
      last_name: user.last_name,
      class: user.class,
      school_id: user.school_id,
      specialization_id: user.specialization_id
    })
    .eq('user_id', user.user_id);

  return NextResponse.json(error);
}
