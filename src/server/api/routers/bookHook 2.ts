import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { XMLParser } from "fast-xml-parser";
import convertISBN10ToISBN13 from "../HelperFunctions/convertISBN";
import { DEFAULT_THICKNESS_IN_CENTIMETERS } from "./books";


type ParsedXML = {
    xml: string
    root: {sale: {
        date: string, 
        sales: {isbn: string, quantity: number, price: number}[]
    }}
}

export const bookHookRouter = createTRPCRouter({
    createSaleRecord: publicProcedure
    .meta({ openapi: { method: "POST",
    path: "/bookhook",
    tags: ["bookhook"],
    summary: "Add new sales to the system",
    contentTypes: ["application/xml"],} })
    .input(z.object({ info: z.string().optional() }).catchall(z.any()))
    .output(z.object({ id: z.string(), inventory: z.boolean() }))
    .mutation( async ({ input, ctx }) => {
    try{
        const parser = new XMLParser();
        const xml = Object.values(input).join("");
        const parsedXml = parser.parse(xml) as ParsedXML;
        const inputDate = parsedXml.root.sale.date.replace(/-/g, '\/')
        const newSaleRecord = await ctx.prisma.saleReconciliation.create({
          data: {
            date: new Date(inputDate),
          },
        });
        let inventory: number
        if (newSaleRecord.id){
            const inputSales = parsedXml.root.sale.sales
            for (const sale of inputSales){
              let price = sale.price
              const isbn = convertISBN10ToISBN13(sale.isbn)
              const book = await ctx.prisma.book.findFirst({
                where:{
                  isbn: isbn
                }
              })
              if (price === 0){
                price = book.retailPrice
              }

              if (book){
                inventory = book.inventory - sale.quantity
                const uniqueBooks = await ctx.prisma.sale.findMany({
                where: {
                    saleReconciliationId: newSaleRecord.id,
                    bookId: isbn
                }
                });
                let unique = uniqueBooks.length === 0 ? 1 : 0
                await ctx.prisma.sale.create({
                    data: {
                      saleReconciliationId: newSaleRecord.id,
                      bookId: isbn,
                      quantity: sale.quantity,
                      price: price,
                      subtotal: price * sale.quantity
                    },
                  });
                await ctx.prisma.book.update({
                where: {
                    isbn: book.isbn
                },
                data:{
                    inventory: inventory,
                    shelfSpace: inventory*(book.dimensions[1] ?? DEFAULT_THICKNESS_IN_CENTIMETERS)
                }
                })
                await ctx.prisma.saleReconciliation.update({
                where: {
                    id: newSaleRecord.id
                },
                data:{
                    totalBooks: {
                    increment: sale.quantity
                    },
                    revenue: {
                    increment: sale.quantity*price
                    },
                    uniqueBooks: {
                    increment: unique
                    }
                }
                })
              }
              else{
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: `No Book found under ISBN: ${sale.isbn}`,
                  });
              }

              
            }
        }
        else{
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: "No Sale Record Created",
              });
        }
        
        return {id: newSaleRecord.id, inventory: inventory >= 0 }
    }
    catch(error){
        throw new TRPCError({
            code: error.code ? error.code : 'INTERNAL_SERVER_ERROR',
            message: error.message,
          });
    }
      
    }),
  });