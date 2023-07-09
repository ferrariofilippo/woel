import { fetchAds } from "@/lib/Store";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function adHandler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  if (_req.method === 'GET') {
    if (_req.url === undefined) {
      res.status(400);
      return;
    }
          
    const { searchParams } = new URL(_req.url);
    
    res.status(200).json(await fetchAds(
      searchParams.get('priceGT'),
      searchParams.get('priceLT'),
      searchParams.get('isbn'),
      searchParams.get('title'),
      searchParams.get('subject'),
      searchParams.get('year')
    ));
  } else {
    res.status(400).json({ error: 'Bad method. This route requires a GET' });
  }
}
