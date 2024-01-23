import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const id = parseInt(new URL(request.url).searchParams.get('id') ?? '0');
  if (!id)
    return NextResponse.error();

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
      .remove([`${id}_${entry['id']}.png`]);
  });

  const { error } = await supabase
    .from('advertisement')
    .delete()
    .eq('id', id);

  return NextResponse.json(error);
}
