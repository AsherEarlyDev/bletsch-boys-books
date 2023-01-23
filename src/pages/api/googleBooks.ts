// src/server/api/routers/googleBooks.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import {z} from "zod"
import { createTRPCRouter, publicProcedure } from '../../server/api/trpc';
import axios from "axios";
type Data = {
  title: string
}
//export const googleBooksRouter = createTRPCRouter({
//  getBookFromISBN: publicProcedure.input(
//    z.string()
//  ).mutation(async )
//})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const URL = `https://www.googleapis.com/books/v1/volumes?q=isbn:0393356256&key=${process.env.SECRET_KEY_GOOGLE_API}`;
  const response = await axios.get(URL);
  res.status(200).json(response.data)
}
