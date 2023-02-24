import { TRPCError } from "@trpc/server";
import { z } from "zod";
import convertISBN10ToISBN13 from "../HelperFunctions/convertISBN";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const salesRouter = createTRPCRouter({
    createSale: publicProcedure
    .input(
        z.object({
          saleReconciliationId: z.string(),
          isbn: z.string(),
          quantity: z.string(),
          price: z.string()
        })
      )
      .mutation(async ({ ctx, input }) => {
        try {
            let price = parseFloat(input.price)
            const isbn = convertISBN10ToISBN13(input.isbn)
            const saleRec = await ctx.prisma.saleReconciliation.findFirst({
                where:
                {
                  id: input.saleReconciliationId
                },
              })
            const book = await ctx.prisma.book.findFirst({
                where:{
                  isbn: isbn
                }
              })
            if (price === 0){
              price = book.retailPrice
            }
            if (saleRec && book){
              
              const inventory: number = book.inventory - parseInt(input.quantity)
              if(inventory >= 0){
                const uniqueBooks = await ctx.prisma.sale.findMany({
                  where: {
                    saleReconciliationId: input.saleReconciliationId,
                    bookId: isbn
                  }
                });
                let unique = uniqueBooks.length === 0 ? 1 : 0
                await ctx.prisma.sale.create({
                    data: {
                       saleReconciliationId: input.saleReconciliationId,
                       bookId: isbn,
                       quantity: parseInt(input.quantity),
                       price: price,
                       subtotal: parseInt(input.quantity) * price
                    },
                });
                await ctx.prisma.book.update({
                  where: {
                    isbn: book.isbn
                  },
                  data:{
                    inventory: inventory
                  }
                })
                await ctx.prisma.saleReconciliation.update({
                  where: {
                    id: input.saleReconciliationId
                  },
                  data:{
                    totalBooks: {
                      increment: parseInt(input.quantity)
                    },
                    revenue: {
                      increment: parseInt(input.quantity)*parseFloat(input.price)
                    },
                    uniqueBooks: {
                      increment: unique
                    }
                  }
                })
              }
              else{
                throw new TRPCError({
                  code: 'CONFLICT',
                  message: 'Inventory cannot go below 0!',
                });
              }
            }
            else{
              throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'No book found under that ISBN!',
              });
            }
        }
        catch(error){
          throw new TRPCError({
            code: error.code,
            message: "Add Sale Failed! "+error.message
          })
        }
            
        
      }),

    modifySale: publicProcedure
    .input(
      z.object({
          id: z.string(),
          saleReconciliationId: z.string(),
          isbn: z.string(),
          quantity: z.string(),
          price: z.string()
        })
    )
    .mutation(async ({ ctx, input }) => {
      try{
            const isbn = convertISBN10ToISBN13(input.isbn)
            const sale = await ctx.prisma.sale.findFirst({
              where:
            {
              id: input.id
            }
          });
          const book = await ctx.prisma.book.findFirst({
            where:{
              isbn: isbn
            }
          })
          if (!book){
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'No book found under that ISBN!',
            });
          }
          const change: number = sale.quantity - parseInt(input.quantity)  
          if(book.inventory + change >= 0) {
            const uniqueBooks = await ctx.prisma.sale.findMany({
              where: {
                saleReconciliationId: input.saleReconciliationId,
                bookId: isbn
              }
            });
            let unique = uniqueBooks.length === 0 ? 1 : 0
            await ctx.prisma.book.update({
              where:{
                isbn: book.isbn
              },
              data:{
                inventory: book.inventory + change
              }
            })

            await ctx.prisma.sale.update({
              where:
            {
              id: input.id
          },
            data: {
              saleReconciliationId: input.saleReconciliationId,
              bookId: book.isbn,
              quantity: parseInt(input.quantity),
              price: parseFloat(input.price),
              subtotal: parseFloat(input.price) * parseInt(input.quantity)
            },
            });
            await ctx.prisma.saleReconciliation.update({
              where: {
                id: input.saleReconciliationId
              },
              data:{
                totalBooks: {
                  increment:   parseInt(input.quantity) - sale.quantity
                },
                revenue: {
                  increment: parseInt(input.quantity)*parseFloat(input.price) - sale.subtotal
                },
                uniqueBooks: {
                  increment: unique
                }
              }
            })
          }
          else{
            throw new TRPCError({
              code: 'CONFLICT',
              message: 'Inventory cannot go below 0.',
            });
          }
      }
      catch(error){
        throw new TRPCError({
          code: error.code,
          message: "Modify Sale Failed! "+error.message
        })
      }
        
        
    }),

    deleteSale: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const sale = await ctx.prisma.sale.findFirst({
          where:{
            id: input.id
          }
        })
        if(sale){
          await ctx.prisma.book.update({
            where: {
              isbn: sale.bookId
            },
            data:{
              inventory: {
                increment: sale.quantity
              }
            }
          })
        }
        const uniqueBooks = await ctx.prisma.sale.findMany({
          where: {
            saleReconciliationId: sale.saleReconciliationId,
            bookId: sale.bookId
          }
        });
        let unique = uniqueBooks.length === 1 ? 1 : 0

        await ctx.prisma.saleReconciliation.update({
          where: {
            id: sale.saleReconciliationId
          },
          data:{
            totalBooks: {
              decrement:  sale.quantity
            },
            revenue: {
              decrement: sale.subtotal
            },
            uniqueBooks: {
              decrement: unique
            }
          }
        })
        
        await ctx.prisma.sale.delete({
          where: {
            id: input.id
          }
        })
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }
    }),

    getSalesByRecId: publicProcedure
    .input(
      z.object({
        saleRecId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.sale.findMany({
          where:{
            saleReconciliationId: input.saleRecId
          }
        })
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }
    }),
});