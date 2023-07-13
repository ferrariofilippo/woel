import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Database } from '@/interfaces/schema';

export type Advertisement = Database['public']['tables']['advertisement']['Update'];

export async function PUT(request: Request) {
  const ad: Advertisement = await request.json();
  const supabase = createRouteHandlerClient({ cookies });

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
