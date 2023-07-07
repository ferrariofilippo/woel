import { fetchAdById } from "@/lib/Store";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function adHandler(
    _req: NextApiRequest,
    res: NextApiResponse
) {
    res.status(200).json(await fetchAdById(0));
}
