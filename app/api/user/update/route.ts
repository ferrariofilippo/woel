import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Database } from '@/types/supabase';

export type User = Database['public']['Tables']['user_data']['Update'];

export async function PUT(request: Request) {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
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
