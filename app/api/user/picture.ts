import { setUserPicture } from "@/lib/Store";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function adHandler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  if (_req.method === 'POST') {
    if (_req.url === undefined) {
      res.status(400);
      return;
    }
    
    const { searchParams } = new URL(_req.url);
    const id = searchParams.get('id');
    if (id === null) {
      res.status(400).json({ error: "Missing 'id' parameter" });
      return;
    }
    
    res.status(200).json(await setUserPicture(id, _req.body));
  } else {
    res.status(400).json({ error: 'Bad method. This route requires a POST' });
  }
}
