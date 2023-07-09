import { createAd } from "@/lib/Store";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function adHandler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  if (_req.method === 'POST') {
    const body = JSON.parse(_req.body);
    
    res.status(200).json(await createAd({
      id: body['id'],
      owner_id: body['owner_id'],
      book_id: body['book_id'],
      price: body['price'],
      negotiable_price: body['negotiable_price'],
      rating: body['rating'],
      notes: body['notes'],
      status: body['status']
    }));
  } else {
    res.status(400).json({ error: 'Bad method. This route requires a POST' });
  }
}
