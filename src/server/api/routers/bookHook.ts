import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { XMLParser } from "fast-xml-parser";
import convertISBN10ToISBN13 from "../HelperFunctions/convertISBN";
import { DEFAULT_THICKNESS_IN_CENTIMETERS } from "./books";
const { Logtail } = require("@logtail/node");
const logtail = new Logtail("PxJvYh15v3DCzCNouHKSg874");

const saleRecord = z.object({
    "?xml": z.object({'@_version': z.string(), '@_encoding': z.string()}),
    sale: z.object({
        "@_date": z.string(), 
        item: z.array(z.object({isbn: z.string(), qty: z.number().gt(0), price: z.number().gt(0)}))
    })
})

const saleRecordOneSale = z.object({
  "?xml": z.object({'@_version': z.string(), '@_encoding': z.string()}),
  sale: z.object({
      "@_date": z.string(), 
      item: z.object({isbn: z.string(), qty: z.number().gt(0), price: z.number().gt(0)})
  })
})




export const bookHookRouter = createTRPCRouter({
    createSaleRecord: publicProcedure
    .meta({ openapi: { method: "POST",
    path: "/bookhook",
    tags: ["bookhook"],
    summary: "Add new sales to the system",
    contentTypes: ["application/xml"],} })
    .input(z.object({ info: z.string().optional() }).catchall(z.any()))
    .output(z.object({ id: z.string().optional(), booksNotFound: z.array(z.string()).optional()}))
    .mutation( async ({ input, ctx }) => {
    try{
        const booksNotFound = []
        const options = {
            attributeNamePrefix : "@_",
            ignoreAttributes : false,
            ignoreNameSpace: false,
            numberParseOptions: {
              "hex": false,
              "leadingZeros": false
          },
            arrayMode: 'strict'
        };
        const parser = new XMLParser(options);
        const xml = Object.values(input).join("");
        const parsedXml = parser.parse(xml);
        logtail.info("parsedXml")
        logtail.flush()
        if (!saleRecord.safeParse(parsedXml).success && !saleRecordOneSale.safeParse(parsedXml).success){
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: "Data in improper format!",
          });
        }

        const inputDate = parsedXml.sale["@_date"].replace(/-/g, '\/')
        const newSaleRecord = await ctx.prisma.saleReconciliation.create({
          data: {
            date: new Date(inputDate),
          },
        });
        let inventory: number
        if (newSaleRecord.id){
            const inputSales = Array.isArray(parsedXml.sale.item) ?  parsedXml.sale.item : [parsedXml.sale.item]
            for (const sale of inputSales){
              let isbn: string = sale.isbn
              isbn = isbn.replace(/\D/g,'')
              let price: number = sale.price
              isbn = convertISBN10ToISBN13(isbn)
              const book = await ctx.prisma.book.findFirst({
                where:{
                  isbn: isbn
                }
              })

              if (price === 0){
                price = book.retailPrice
              }

              if (book){
                inventory = book.inventory - sale.qty
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
                      quantity: sale.qty,
                      price: price,
                      subtotal: price * sale.qty
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
                    increment: sale.qty
                    },
                    revenue: {
                    increment: sale.qty*price
                    },
                    uniqueBooks: {
                    increment: unique
                    }
                }
                })
                if (inventory < 0){
                  await ctx.prisma.inventoryCorrection.create({
                    data:{
                      userName: ctx.session.user?.name,
                      date: new Date(inputDate),
                      adjustment: -inventory,
                      bookId: isbn
                    }
                  })
                  await ctx.prisma.book.update({
                    where: {
                        isbn: book.isbn
                    },
                    data:{
                      increment:{
                        inventory: -inventory,
                      },
                      shelfSpace: 0
                    }
                    })
                }
              }
              else{
                booksNotFound.push(sale.isbn)
              }

            }
        }
        else{
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: "No Sale Record Created",
              });
        }
        return {id: newSaleRecord.id, booksNotFound: booksNotFound }
    }
    catch(error){
        throw new TRPCError({
            code: error.code ? error.code : 'INTERNAL_SERVER_ERROR',
            message: error.message,
          });
    }
      
    }),
  });