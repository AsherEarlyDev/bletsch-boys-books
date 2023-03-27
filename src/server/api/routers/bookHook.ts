import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { XMLParser } from "fast-xml-parser";
import convertISBN10ToISBN13 from "../HelperFunctions/convertISBN";
import { DEFAULT_THICKNESS_IN_CENTIMETERS } from "./books";
const { Logtail } = require("@logtail/node");
const { log } = require('@logtail/next');

const saleRecord = z.object({
    sale: z.object({
        "@_date": z.string(), 
        "item": z.array(z.object({"isbn": z.any(), "qty": z.number().gt(0), "price": z.any()}))
    })
})

const saleRecordOneSale = z.object({
  sale: z.object({
      "@_date": z.string(), 
      "item": z.object({"isbn": z.any(), "qty": z.number().gt(0), "price": z.any()})
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
    .output(z.object({ message: z.string(), booksNotFound: z.array(z.string()), inventoryCounts: z.map(z.string(), z.number())}))
    .mutation( async ({ input, ctx }) => {
    try{
        if(ctx.req.headers["x-real-ip"] != "152.3.54.108"){
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: `This site is not authorized!`,
          });
        }
        const inventoryCounts = new Map<string, number>();
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
            message: `Data in improper format!`,
          });
        }

        let inputDate
        if (Date.parse(parsedXml.sale["@_date"])){
          inputDate = parsedXml.sale["@_date"].replace(/-/g, '\/')
        }
        else{
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: "Date is in improper format! Must be of form YYYY-MM-DD.",
          });
        }
        const newSaleRecord = await ctx.prisma.saleReconciliation.create({
          data: {
            date: new Date(inputDate),
          },
        });
        let inventory: number
        if (newSaleRecord.id){
            
            const inputSales: {isbn: string, qty: number, price: number}[] = Array.isArray(parsedXml.sale.item) ?  parsedXml.sale.item : [parsedXml.sale.item]
            if (inputSales.length === 0){
              throw new TRPCError({
                code: 'BAD_REQUEST',
                message: "No sales information was given!",
              });
            }
            for (const element of inputSales){
                let isbn: string
                if (typeof(element.isbn) === "string"){
                  isbn = element.isbn
                }
                else if (typeof(element.isbn) === "number"){
                  isbn = parseInt(element.isbn).toString()
                }
                else{
                  throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: "ISBN must be a string or number!",
                  });
                }
                isbn = isbn.replaceAll("-",'')
                if (!(/^\d+$/.test(isbn))){
                  throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: "ISBN must be a 10 or 13-digit number that may only contain a dash in between numbers. EX: 978-**********",
                  });
                }
                const unconvertedISBN = isbn
                isbn = convertISBN10ToISBN13(isbn)
                const bookValidation = await ctx.prisma.book.findUnique({
                  where:{
                    isbn: isbn
                  }
                })
                if (bookValidation){
                  booksFound.push(unconvertedISBN)
                }
                else{
                  booksNotFound.push(unconvertedISBN)
                }
            }
  

            if (booksNotFound.length === inputSales.length){
              throw new TRPCError({
                code: 'NOT_FOUND',
                message: "None of the books you entered are in our system!",
              });
            }

            for (const sale of inputSales){
              let isbn: string = typeof(sale.isbn) === "string" ? sale.isbn : parseInt(sale.isbn).toString()
              isbn = isbn.replaceAll("-",'')
              const unconvertedISBN = isbn
              isbn = convertISBN10ToISBN13(isbn)
              let price: number
              let priceString: string = sale.price.toString()
              if (parseFloat(priceString.replaceAll("$", ""))){
                price = parseFloat(priceString.replaceAll("$", ""))
              }
              else{
                throw new TRPCError({
                  code: 'BAD_REQUEST',
                  message: "Price must be a float with at most a $ sign at the front! EX: X.XX or $X.XX",
                });
              }

              if (booksFound.includes(sale.isbn)){
                const book = await ctx.prisma.book.findFirst({
                  where:{
                    isbn: isbn
                  }
                })
                if (price === 0){
                  price = book.retailPrice
                }
                else if(price < 0){
                  throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: "Price must be greater than 0!",
                  });
                }

                inventory = book.inventory - sale.qty

                const uniqueBooks = await ctx.prisma.sale.findMany({
                where: {
                    saleReconciliationId: newSaleRecord.id,
                    bookId: isbn
                }
                });
                let unique = uniqueBooks.length === 0 ? 1 : 0
                log.info("Updating books and creating sale")
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
                inventoryCounts.set(unconvertedISBN, inventory)
              }


            }
        }
        else{
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: "No Sale Record Created",
              });
        }
        
        return {message: `The sale was successfully recorded under the following ID: ${newSaleRecord.id}. 
        The list of books not added can be found in booksNotFound. If the inventory value returned is negative, 
        please make an inventory correction on the books page!`, booksNotFound: booksNotFound, inventoryCounts: inventoryCounts }
    }
    catch(error){
        throw new TRPCError({
            code: error.code ? error.code : 'INTERNAL_SERVER_ERROR',
            message: "Something is going wrong!",
          });
    }
      
    }),
  });

  // const validateBooks = async (isbns: string[], ctx)=>{
  //   const found: string[] = []
  //   const not_found: string[] = []
  //     for (const isbn of isbns){
  //         const book = await ctx.prisma.book.findUnique({
  //             where: {
  //               isbn: isbn
  //             }
  //         })
  //         if (book){
  //           found.push(isbn)
  //         }
  //         else{
  //           not_found.push(isbn)
  //         }
  //     }
  //     return {foundBooks: found, booksNotFound: not_found}
  // }