import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { XMLParser } from "fast-xml-parser";
import convertISBN10ToISBN13 from "../HelperFunctions/convertISBN";
import { DEFAULT_THICKNESS_IN_CENTIMETERS } from "./books";
const { Logtail } = require("@logtail/node");
const logtail = new Logtail("PxJvYh15v3DCzCNouHKSg874");

const saleRecord = z.object({
    sale: z.object({
        "@_date": z.string(), 
        item: z.array(z.object({isbn: z.string(), qty: z.number().gt(0), price: z.number().gt(0)}))
    })
})

const saleRecordOneSale = z.object({
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
    contentTypes: ["application/xml"],
    protect: true} })
    .input(z.object({ info: z.string().optional() }).catchall(z.any()))
    .output(z.object({ message: z.string(), booksNotFound: z.array(z.string())}))
    .mutation( async ({ input, ctx }) => {
    try{
        if(ctx.req.headers.referer != "bookhook.colab.duke.edu:8001"){
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: `This site is not authorized! ${ctx.req.headers.referer}`,
          });
        }
        const booksNotFound = []
        const booksFound = []
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
            
            const inputSales: {isbn: string, qty: number, price: number}[] = Array.isArray(parsedXml.sale.item) ?  parsedXml.sale.item : [parsedXml.sale.item]
            for (const element of inputSales){
                let isbn: string = element.isbn
                isbn = isbn.replace(/\D/g,'')
                isbn = convertISBN10ToISBN13(isbn)
                const bookValidation = await ctx.prisma.book.findUnique({
                  where:{
                    isbn: isbn
                  }
                })
                if (bookValidation){
                  booksFound.push(element.isbn)
                }
                else{
                  booksNotFound.push(element.isbn)
                }
            }
  

            if (booksNotFound.length === inputSales.length){
              throw new TRPCError({
                code: 'NOT_FOUND',
                message: "None of the books you entered are in our system!",
              });
            }

            for (const sale of inputSales){
              let isbn: string = sale.isbn
              isbn = isbn.replace(/\D/g,'')
              isbn = convertISBN10ToISBN13(isbn)
              let price: number = sale.price

              if (booksFound.includes(sale.isbn)){
                const book = await ctx.prisma.book.findFirst({
                  where:{
                    isbn: isbn
                  }
                })
                if (price === 0){
                  price = book.retailPrice
                }

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
        
        return {message: `The sale was successfully recorded under the following ID: ${newSaleRecord.id}. The list of books not added can be found in booksNotFound.`, booksNotFound: booksNotFound }
    }
    catch(error){
        throw new TRPCError({
            code: error.code ? error.code : 'INTERNAL_SERVER_ERROR',
            message: error.message,
          });
    }
      
    }),
  });

  const validateBooks = async (isbns: string[], ctx)=>{
    const found: string[] = []
    const not_found: string[] = []
      for (const isbn of isbns){
          const book = await ctx.prisma.book.findUnique({
              where: {
                isbn: isbn
              }
          })
          if (book){
            found.push(isbn)
          }
          else{
            not_found.push(isbn)
          }
      }
      return {foundBooks: found, booksNotFound: not_found}
  }