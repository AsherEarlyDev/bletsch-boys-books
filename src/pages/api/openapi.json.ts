import type { NextApiRequest, NextApiResponse } from "next";
import { openApiDocument } from "../../server/api/openapi";


const handler = (req: NextApiRequest, res: NextApiResponse) => {
  return res.status(200).send(openApiDocument);
};

export default handler;