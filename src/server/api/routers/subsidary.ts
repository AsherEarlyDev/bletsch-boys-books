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
  imageLink: z.string().url().nullable(),
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
      log.info(input)
      const existingRemoteBooks: {[isbn:string]: remoteBook | null} = {};
      for (const isbn of input.isbns) {
        try{
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
              imageLink: (book.imageLink == undefined || book.imageLink=="") ? null : book.imageLink ,
              retailPrice: book.retailPrice,
              inventoryCount: book.inventory,
            } as remoteBook;
          } else {
            console.log("Book not found: " + isbn);
            existingRemoteBooks[isbn] = null;
          }
        }
        catch (error){
          log.info(error)
          throw new TRPCError({
            code: error.code ? error.code : 'INTERNAL_SERVER_ERROR',
            message: error.message,
          });
        }
      }
      if (Object.keys(existingRemoteBooks).length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No books found",
        });
      }
      return existingRemoteBooks;
    }
    catch(error){
      log.info(error)
      console.log(error)
      throw new TRPCError({
        code: error.code ? error.code : 'INTERNAL_SERVER_ERROR',
        message: error.message,
      });
    }
  }),
});