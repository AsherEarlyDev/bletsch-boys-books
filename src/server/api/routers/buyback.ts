import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import convertISBN10ToISBN13 from "../HelperFunctions/convertISBN";
import { DEFAULT_THICKNESS_IN_CENTIMETERS } from "./books";

export const buybackRouter = createTRPCRouter({
    createBuyback: protectedProcedure
    .input(
        z.object({
          id: z.string(),
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
                  id: input.id
                },
              })
              const purchaseOrders = await ctx.prisma.purchaseOrder.findMany({
                where:{
                  vendorId: buybackOrder.vendorId
                },
                orderBy:{
                  date: 'desc'
                }
              })
              if (purchaseOrders.length != 0){
                let i = 0
                while (costMostRecent === 0 && i < purchaseOrders.length){
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
              }
              else{
                throw new TRPCError({
                  code: "NOT_FOUND",
                  message: "No purchase orders found under this vendor!"
                })
              }
              
              const vendor = await ctx.prisma.vendor.findFirst({
                where:{
                  id: buybackOrder.vendorId
                }
              })
              
              const book = await ctx.prisma.book.findFirst({
                where:{
                  isbn: input.isbn
                }
              })
              if (price === 0 && costMostRecent > 0){
                price = costMostRecent * vendor.bookBuybackPercentage 
              }
              else if (price === 0 && costMostRecent === 0){
                throw new TRPCError({
                  code: 'NOT_FOUND',
                  message: "There are no recorded purchases for " + book.title + " under " + vendor.name +"!"
                })
              }

            if (buybackOrder && book){
              const inventory: number = book.inventory - parseInt(input.quantity)
              if(inventory >= 0){
                const uniqueBooks = await ctx.prisma.buyback.findMany({
                  where: {
                    buybackOrderId: input.id,
                    bookId: isbn
                  }
                });
                let unique = uniqueBooks.length === 0 ? 1 : 0
                await ctx.prisma.buyback.create({
                    data: {
                      buybackOrderId: input.id,
                      bookId: input.isbn,
                      quantity: parseInt(input.quantity),
                      buybackPrice: price,
                      subtotal: parseInt(input.quantity) * price
                    },
                });
                await ctx.prisma.book.update({
                  where: {
                    isbn: input.isbn
                  },
                  data:{
                    inventory: inventory,
                    shelfSpace: (inventory)*(book.dimensions[1] ?? DEFAULT_THICKNESS_IN_CENTIMETERS)
                  }
                })
                await ctx.prisma.bookBuybackOrder.update({
                  where: {
                    id: input.id
                  },
                  data:{
                    totalBooks: {
                      increment: parseInt(input.quantity)
                    },
                    revenue: {
                      increment: parseInt(input.quantity)*price
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

    modifyBuyback: protectedProcedure
    .input(
      z.object({
          id: z.string(),
          orderId: z.string(),
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
                buybackOrderId: input.orderId,
                bookId: isbn
              }
            });
            let unique = uniqueBooks.length === 0 ? 1 : 0
            await ctx.prisma.book.update({
              where:{
                isbn: book.isbn
              },
              data:{
                inventory: book.inventory + change,
                shelfSpace: (book.inventory+change)*(book.dimensions[1] ?? DEFAULT_THICKNESS_IN_CENTIMETERS)
              }
            })

            await ctx.prisma.buyback.update({
              where:
            {
              id: input.id
          },
            data: {
              buybackOrderId: input.orderId,
              bookId: input.isbn,
              quantity: parseInt(input.quantity),
              buybackPrice: parseFloat(input.price),
              subtotal: parseFloat(input.price) * parseInt(input.quantity)
            },
            });
            await ctx.prisma.bookBuybackOrder.update({
              where: {
                id: input.orderId
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

    deleteBuyback: protectedProcedure
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
        const book = await ctx.prisma.book.findUnique({
          where:{
            isbn: buyback.bookId
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
              },
              shelfSpace: (book.inventory+buyback.quantity)*(book.dimensions[1] ?? DEFAULT_THICKNESS_IN_CENTIMETERS)
              
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
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.buyback.findMany({
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