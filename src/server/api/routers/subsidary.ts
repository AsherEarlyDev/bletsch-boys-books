import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../db";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
const { Logtail } = require("@logtail/node");
const { log } = require('@logtail/next');


const remoteBookSchema = z.object({
  title: z.string(),
  authors: z.string().array(),
  isbn13: z.string().length(13),
  isbn10: z.string().length(10).nullable(),
  publisher: z.string(),
  publicationYear: z.number(),
  pageCount: z.number().nullable(),
  height: z.number().gte(0).nullable(),
  width: z.number().gte(0).nullable(),
  thickness: z.number().gte(0).nullable(),
  imageUrl: z.string().url().nullable(),
  retailPrice: z.number().gte(0),
  inventoryCount: z.number().gte(0),
});
type remoteBook = z.infer<typeof remoteBookSchema>;




export const subsidaryRouter = createTRPCRouter({
  getRemoteBooks: publicProcedure
  .meta({ openapi: { method: "POST",
      path: "/subsidary",
      tags: ["subsidary"],
      summary: "Read remote inventory and book information from Bletsch Book Boys",
      contentTypes: ["application/json"],
      protect: true} })
  .input(z.object({ isbns: z.string().length(13).array()}))
  .output(z.record(z.string(), remoteBookSchema.nullable()))
  .query( async ({ input }) => {
    try{
      const existingRemoteBooks: {[isbn:string]: remoteBook | null} = {};
      for (const isbn of input.isbns) {
          const book = await prisma.book.findFirst({
            where: { isbn: isbn },
            include: {
              author: true,
            },
          });
          if (book) {
            existingRemoteBooks[isbn] = {
              title: book.title,
              authors: book.author.map((author) => author.name),
              isbn13: book.isbn,
              isbn10: book.isbn10,
              publisher: book.publisher,
              publicationYear: book.publicationYear,
              pageCount: book.pageCount ?? null,
              height: book.dimensions[0] ?? null,
              width: book.dimensions[1] ?? null,
              thickness: book.dimensions[2] ?? null,
              imageUrl: (book.imageLink == undefined || book.imageLink=="") ? null : book.imageLink ,
              retailPrice: book.retailPrice,
              inventoryCount: (book.inventory < 0 ? 0 : book.inventory),
            } as remoteBook;
          } else {
            existingRemoteBooks[isbn] = null;
          }
      }
      if (Object.keys(existingRemoteBooks).length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No books found",
        });
      }
      console.log(existingRemoteBooks)
      return existingRemoteBooks;
    }
    catch(error){
      log.info(error)
      throw new TRPCError({
        code: error.code ? error.code : 'INTERNAL_SERVER_ERROR',
        message: error.message,
      });
    }
  }),
});