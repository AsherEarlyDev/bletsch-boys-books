import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import convertISBN10ToISBN13 from "../HelperFunctions/convertISBN";

export const buybackRouter = createTRPCRouter({
    createBuyback: publicProcedure
    .input(
        z.object({
          buybackOrderId: z.string(),
          isbn: z.string(),
          quantity: z.string(),
          price: z.string()
        })
      )
      .mutation(async ({ ctx, input }) => {
        try{
              let price = parseFloat(input.price)
              let costMostRecent: number = 0
              const isbn = convertISBN10ToISBN13(input.isbn)
              const buybackOrder = await ctx.prisma.bookBuybackOrder.findFirst({
                where:
                {
                  id: input.buybackOrderId
                },
              })
              const purchaseOrders = await ctx.prisma.purchaseOrder.findMany({
                where:{
                  vendorName: buybackOrder.vendorName
                },
                orderBy:{
                  date: 'desc'
                }
              })
              let i = 0
              while (costMostRecent === 0){
                const purchase = await ctx.prisma.purchase.findFirst({
                  where: {
                    purchaseOrderId: purchaseOrders[i].id,
                    bookId: isbn
                  }
                })
                if (purchase){
                  costMostRecent = purchase.price
                }
                i += 1
              }
              const vendor = await ctx.prisma.vendor.findFirst({
                where:{
                  name: buybackOrder.vendorName
                }
              })
              
              const book = await ctx.prisma.book.findFirst({
                where:{
                  isbn: input.isbn
                }
              })
              if (price === 0){
                price = costMostRecent * vendor.bookBuybackPercentage 
              }
            if (buybackOrder && book){
              const inventory: number = book.inventory - parseInt(input.quantity)
              if(inventory >= 0){
                const uniqueBooks = await ctx.prisma.buyback.findMany({
                  where: {
                    buybackOrderId: input.buybackOrderId,
                    bookId: isbn
                  }
                });
                let unique = uniqueBooks.length === 0 ? 1 : 0
                await ctx.prisma.buyback.create({
                    data: {
                      buybackOrderId: input.buybackOrderId,
                      bookId: input.isbn,
                      quantity: parseInt(input.quantity),
                      price: parseFloat(input.price),
                      subtotal: parseInt(input.quantity) * parseFloat(input.price)
                    },
                });
                await ctx.prisma.book.update({
                  where: {
                    isbn: input.isbn
                  },
                  data:{
                    inventory: inventory
                  }
                })
                await ctx.prisma.bookBuybackOrder.update({
                  where: {
                    id: input.buybackOrderId
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
                  message: 'Book Inventory cannot go below 0!',
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
            message: "Add Buyback Failed! "+error.message
          })
        }
            
        
      }),

    modifyBuyback: publicProcedure
    .input(
      z.object({
          id: z.string(),
          buybackOrderId: z.string(),
          isbn: z.string(),
          quantity: z.string(),
          price: z.string()
        })
    )
    .mutation(async ({ ctx, input }) => {
      try{
            const isbn = convertISBN10ToISBN13(input.isbn)
            const buyback = await ctx.prisma.buyback.findFirst({
              where:
            {
              id: input.id
            }
          });
          const book = await ctx.prisma.book.findFirst({
            where:{
              isbn: input.isbn
            }
          })
          if (!book){
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'No book found under that ISBN!',
            });
          }
          const change: number = buyback.quantity - parseInt(input.quantity)  
          if(book.inventory + change >= 0) {
            const uniqueBooks = await ctx.prisma.buyback.findMany({
              where: {
                buybackOrderId: input.buybackOrderId,
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

            await ctx.prisma.buyback.update({
              where:
            {
              id: input.id
          },
            data: {
              buybackOrderId: input.buybackOrderId,
              bookId: input.isbn,
              quantity: parseInt(input.quantity),
              price: parseFloat(input.price),
              subtotal: parseFloat(input.price) * parseInt(input.quantity)
            },
            });
            await ctx.prisma.bookBuybackOrder.update({
              where: {
                id: input.buybackOrderId
              },
              data:{
                totalBooks: {
                  increment:   parseInt(input.quantity) - buyback.quantity
                },
                revenue: {
                  increment: parseInt(input.quantity)*parseFloat(input.price) - buyback.subtotal
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
              message: 'Book Inventory cannot go below 0.',
            });
          }
      }
      catch(error){
        throw new TRPCError({
          code: error.code,
          message: "Modify Buyback Failed! "+error.message
        })
      }
        
        
    }),

    deleteBuyback: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const buyback = await ctx.prisma.buyback.findFirst({
          where:{
            id: input.id
          }
        })
        if(buyback){
          await ctx.prisma.book.update({
            where: {
              isbn: buyback.bookId
            },
            data:{
              inventory: {
                increment: buyback.quantity
              }
            }
          })
        }

        const uniqueBooks = await ctx.prisma.buyback.findMany({
          where: {
            buybackOrderId: buyback.buybackOrderId,
            bookId: buyback.bookId
          }
        });
        let unique = uniqueBooks.length === 1 ? 1 : 0

        await ctx.prisma.bookBuybackOrder.update({
          where: {
            id: buyback.buybackOrderId
          },
          data:{
            totalBooks: {
              decrement:  buyback.quantity
            },
            revenue: {
              decrement: buyback.subtotal
            },
            uniqueBooks: {
              decrement: unique
            }
          }
        })
        
        await ctx.prisma.buyback.delete({
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

    getBuybacksByOrderId: publicProcedure
    .input(
      z.object({
        buybackOrderId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.purchase.findMany({
          where:{
            buybackOrderId: input.buybackOrderId
          }
        })
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }
    }),
})