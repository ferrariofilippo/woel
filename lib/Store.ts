import { createClient } from '@supabase/supabase-js';
import { Database } from '@/interfaces/schema';

export const SOLD_STATE = 3;

export type User = Database['public']['tables']['user_data']['Update'];

export type Advertisement = Database['public']['tables']['advertisement']['Row'];

export const database = createClient(
  process.env.SUPABASE_URL ?? '',
  process.env.SUPABASE_KEY ?? ''
);

export const logIn = async (email: string, password: string) => {
  try {
    const { data } = await database.auth.signInWithPassword({
      email: email,
      password: password
    });

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const signUp = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  className: string,
  school: number,
  specialization: number
) => {
  try {
    const { data } = await database.auth.signUp({
      email: email,
      password: password,
      // TODO: Use the propert link
      options: {
        emailRedirectTo: 'https://localhost:3000/'
      }
    });

    const { error } = await database
      .from('user_data')
      .insert({
        user_id: data['user']?.id ?? '',
        first_name: firstName,
        last_name: lastName,
        class: className,
        school_id: school,
        specialization_id: specialization,
        email: email
      }); 

    console.log(error);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const signOut = async () => {
  try {
    const { error } = await database.auth.signOut();

    return error;
  } catch (error) {
    console.log(error);
  }
};

export const fetchUserById = async (userId: string) => {
  try {
    const { data } = await database
      .from('user_data')
      .select(
        `user_id, first_name, last_name, class, email,
        specialization:specialization_id (specialization_name),
        school:school_id (school_name)`
      )
      .eq('user_id', userId);

      return data;
  } catch (error) {
    console.log('error', error);
  }
};

export const setUserPicture = async (userId: string, file: ReadableStream<Uint8Array>) => {
  try {
    const { error } = await database
      .storage
      .from('avatars')
      .upload(`${userId}.png`, file, {
          cacheControl: '3600',
          upsert: true
      });

      return error;
  } catch (error) {
    console.log('error', error)
  }
};

export const updateUser = async (user: User) => {
  try {
    const { error } = await database
      .from('user_data')
      .update({
        first_name: user.first_name,
        last_name: user.last_name,
        class: user.class,
        school_id: user.school_id,
        specialization_id: user.specialization_id
      })
      .eq('user_id', user.user_id);

    return error;
  } catch(error) {
    console.log('error', error);
  }
};

export const deleteUser = async (userId: string) => {
  try {
    const { error } = await database
      .from('user_data')
      .delete()
      .eq('user_id', userId);

    return error;
  } catch (error) {
    console.log('error', error);
  }
};

export const fetchAds = async (
  priceGt: string | null,
  priceLt: string | null,
  isbn: string | null,
  title: string | null,
  subject: string | null,
  year: string | null
) => {
  try {
    const { data } = await database
      .from('advertisement')
      .select(
        `id, price, negotiable_price, rating, notes, status,
        book:book_id (isbn, title, author, subject, year),
        owner:owner_id (user_id, first_name, last_name, email)`
      )
      .filter('status', 'eq', 'Available')
      .filter('price', 'gte', parseFloat(priceGt ?? '0'))
      .filter('price', 'lte', parseFloat(priceLt ?? '100'))
      .filter('book.isbn', 'like', isbn ?? '%')
      .filter('book.title', 'like', title ?? '%')
      .filter('book.subject', 'like', subject ?? '%')
      .or(`year.eq.${parseInt(year ?? '5')}, ${year === null}`);

    return data;
  } catch (error) {
    console.log('error', error);
  }
};

export const fetchAdById = async (advertisementId: number) => {
  try {
    const { data } = await database
      .from('advertisement')
      .select(
        `id, price, negotiable_price, rating, notes, status,
        book:book_id (isbn, title, author, subject, year),
        owner:owner_id (user_id, first_name, last_name, email)`
      )
      .eq('id', advertisementId);

      return data;
  } catch (error) {
    console.log('error', error);
  }
};

export const createAd = async (ad: Advertisement) => {
  try {
    await database.from('advertisement').insert(ad);
  } catch (error) {
    console.log('error', error);
  }
};

export const updateAd = async (ad: Advertisement) => {
  try {
    const { error } = await database
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
    
    return error;
  } catch (error) {
    console.log('error', error);
  }
};

export const addAdPicture = async (advertisementId: number, file: ReadableStream<Uint8Array>) => {
  try {
    const { data } = await database
      .from('advertisement_picture')
      .insert({ id: 0, advertisement_id: advertisementId})
      .select(); 
    
    if (data !== null) {
      await database
        .storage
        .from('avatars')
        .upload(`${advertisementId}_${data[0]['id']}.png`, file, {
          cacheControl: '3600',
          upsert: true
        });
    }

    return data;
  } catch (error) {
    console.log(error);
  }
}

export const removeAdPicture = async (advertisementId: number, pictureId: number) => {
  try {
    const { error } = await database
      .from('advertisement_picture')
      .delete()
      .match({ 
        advertisement_id: advertisementId, 
        id: pictureId
      });

    await database
      .storage
      .from('images')
      .remove([ `${advertisementId}_${pictureId}.png` ]);

    return error;
  } catch (error) {
    console.log(error);
  }
}

export const markAsSold = async (advertisementId: number) => {
  try {
    const { error } = await database
      .from('advertisement')
      .update({ status: SOLD_STATE })
      .eq('id', advertisementId);
    
    return error;
  } catch (error) {
    console.log('error', error)
  }
};

export const saveAd = async (advertisementId: number, userId: string) => {
  try {
    const { error } = await database
      .from('saved_ad')
      .insert({ user_id: userId, advertisement_id: advertisementId });
    
    return error;
  } catch (error) {
    console.log('error', error);
  }
};

export const markAsInterested = async (advertisementId: number, userId: string) => {
  try {
    const { error } = await database
      .from('interested_in_ad')
      .insert({ user_id: userId, advertisement_id: advertisementId });

    return error;
  } catch (error) {
    console.log('error', error);
  }
};

export const deleteAd = async (advertisementId: number) => {
  try {
    const { data } = await database
      .from('advertisement_picture')
      .select()
      .eq('advertisement_id', advertisementId);

    data?.forEach(async (entry) => {
      await removeAdPicture(advertisementId, entry['id']);
    });

    const { error } = await database
      .from('advertisement')
      .delete()
      .eq('id', advertisementId);

    return error;
  } catch (error) {
    console.log('error', error);
  }
};
