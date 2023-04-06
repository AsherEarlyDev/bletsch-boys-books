import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { XMLParser } from "fast-xml-parser";
import convertISBN10ToISBN13 from "../HelperFunctions/convertISBN";
import { DEFAULT_THICKNESS_IN_CENTIMETERS } from "./books";
const { Logtail } = require("@logtail/node");
const { log } = require('@logtail/next');


const remoteBookSchema = z.object({
  title: z.string(),
  authors: z.string().array(),
  isbn13: z.string().length(13),
  isbn10: z.string().length(10).nullable(),
  publisher: z.string(),
  publicationYear: z.number(),
  pageCount: z.number().optional(),
  height: z.number().gte(0).nullable(),
  width: z.number().gte(0).nullable(),
  thickness: z.number().gte(0).nullable(),
  imageLink: z.string().nullable(),
  retailPrice: z.number().gte(0),
  inventoryCount: z.number().gte(0),
}).nullable();
type remoteBook = z.infer<typeof remoteBookSchema>;




export const subsidaryRouter = createTRPCRouter({
  getRemoteBooks: publicProcedure
  .meta({ openapi: { method: "POST",
      path: "/subsidary",
      tags: ["subsidary"],
      summary: "Read remote inventory and book information from Bletsch Book Boys",
      contentTypes: ["application/xml"],
      protect: true} })
  .input(z.object({ isbns: z.string().length(13).array()}))
  .output(z.array(z.record(z.string().length(13).array(), remoteBookSchema)))
  .query( async ({ input }) => {
    const existingRemoteBooks = [];
    for (const isbn of input.isbns) {
      const book = await prisma.book.findFirst({
        where: { isbn: isbn },
        include: {
          author: true,
        },
      });
      if (book) {
        existingRemoteBooks.push({
          [isbn]: {
            title: book.title,
            author: book.author.map((author) => author.name),
            isbn13: book.isbn,
            isbn10: book.isbn10 ?? undefined,
            publisher: book.publisher,
            publicationYear: book.publicationYear,
            pageCount: book.pageCount,
            height: book.dimensions[0],
            width: book.dimensions[1],
            thickness: book.dimensions[2],
            retailPrice: book.retailPrice,
            inventoryCount: book.inventory,
          },
        });
      } else {
        console.log("Book not found: " + isbn);
        existingRemoteBooks.push({ [isbn]: null });
      }
    }
    if (existingRemoteBooks.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No books found",
      });
    }
    return existingRemoteBooks;
  }),
});