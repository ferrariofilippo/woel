import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const id = parseInt(new URL(request.url).searchParams.get('id') ?? '0');
  if (!id)
    return NextResponse.error();

  const supabase = createRouteHandlerClient({ cookies });
  const { data } = await supabase
    .from('advertisement_picture')
    .select()
    .eq('advertisement_id', id);

  data?.forEach(async (entry) => {
    await supabase
      .from('advertisement_picture')
      .delete()
      .match({ 
        advertisement_id: id, 
        id: entry['id']
      });

    await supabase
      .storage
      .from('images')
      .remove([ `${id}_${entry['id']}.png` ]);
  });

  const { error } = await supabase
    .from('advertisement')
    .delete()
    .eq('id', id);

  return NextResponse.json(error);
}
