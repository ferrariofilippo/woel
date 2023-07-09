import { markAsSold } from "@/lib/Store";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function adHandler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  if (_req.method === 'POST') {
    const body = JSON.parse(_req.body);

    res.status(200).json(await markAsSold(body['id']));
  } else {
    res.status(400).json({ error: 'Bad method. This route requires a POST' });
  }
}
