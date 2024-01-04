import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Database } from '@/types/supabase';

export type Advertisement = Database['public']['Tables']['advertisement']['Update'];

export async function PUT(request: Request) {
  const ad: Advertisement = await request.json();
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

  const { error } = await supabase
    .from('advertisement')
    .update({
      owner_id: ad.owner_id,
      book_id: ad.book_id,
      price: ad.price,
      negotiable_price: ad.negotiable_price,
      rating: ad.rating,
      notes: ad.notes,
      status: ad.status
    })
    .eq('id', ad.id);

  return NextResponse.json(error);
}
