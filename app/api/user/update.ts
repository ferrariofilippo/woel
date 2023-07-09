import { updateUser } from "@/lib/Store";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function adHandler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  if (_req.method === 'POST') {
    const body = JSON.parse(_req.body);

    res.status(200).json(await updateUser({
      user_id: body['user_id'],
      first_name: body['first_name'],
      last_name: body['last_name'],
      class: body['class'],
      public_contact: body['public_contact'],
      contact_type: body['contact_type'],
      school_id: body['school_id'],
      specialization_id: body['specialization_id']
    }));
  } else {
    res.status(400).json({ error: 'Bad method. This route requires a POST' });
  }
}
