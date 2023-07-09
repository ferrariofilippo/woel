import { deleteAd } from "@/lib/Store";
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
    const idString = searchParams.get('id');
    if (idString === null) {
        res.status(400).json({ error: "Missing 'id' parameter" });
        return;
    }

    const id = parseInt(idString);
    res.status(200).json(await deleteAd(id));
  } else {
    res.status(400).json({ error: 'Bad method. This route requires a GET' });
  }
}
