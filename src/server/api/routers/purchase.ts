import { TRPCError } from "@trpc/server";
import { z } from "zod";
import convertISBN10ToISBN13 from "../HelperFunctions/convertISBN";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { DEFAULT_THICKNESS_IN_CENTIMETERS } from "./Books";

export const purchaseRouter = createTRPCRouter({

    createPurchase: publicProcedure
    .input(
        z.object({
          purchaseOrderId: z.string(),
          isbn: z.string(),
          quantity: z.string(),
          price: z.string()
        })
      )
      .mutation(async ({ ctx, input }) => {
        try {
            const isbn = convertISBN10ToISBN13(input.isbn)
            const purchaseOrder = await ctx.prisma.purchaseOrder.findFirst({
                where:
                {
                  id: input.purchaseOrderId
                }
              })
              const book = await ctx.prisma.book.findUnique({
                where:{
                  isbn: isbn
                }
              })
            if (purchaseOrder){
                const uniqueBooks = await ctx.prisma.purchase.findMany({
                  where: {
                    purchaseOrderId: input.purchaseOrderId,
                    bookId: isbn
                  }
                });
                let unique = uniqueBooks.length === 0 ? 1 : 0
                await ctx.prisma.purchase.create({
                    data: {
                       purchaseOrderId: input.purchaseOrderId,
                       bookId: isbn,
                       quantity: parseInt(input.quantity),
                       price: parseFloat(input.price),
                       subtotal: parseInt(input.quantity)*parseFloat(input.price)
                    },
                });

                await ctx.prisma.book.update({
                  where: {
                    isbn: isbn
                  },
                  data:{
                    inventory: {
                      increment: parseInt(input.quantity)
                    },
                    shelfSpace: (book.inventory+parseInt(input.quantity))*(book.dimensions[1] ?? DEFAULT_THICKNESS_IN_CENTIMETERS)
                  }
                })
                await ctx.prisma.purchaseOrder.update({
                  where: {
                    id: input.purchaseOrderId
                  },
                  data:{
                    totalBooks: {
                      increment: parseInt(input.quantity)
                    },
                    cost: {
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
                code: 'NOT_FOUND',
                message: 'No Purchase Order found!',
              });
            }
        } catch (error) {
          throw new TRPCError({
            code: error.code,
            message: "Create Purchase Failed! "+error.message
          })
        }
      }),
      
      modifyPurchase: publicProcedure
      .input(
        z.object({
            id: z.string(),
            purchaseOrderId: z.string(),
            isbn: z.string(),
            quantity: z.string(),
            price: z.string()
          })
      )
      .mutation(async ({ ctx, input }) => {
        try {
          const isbn = convertISBN10ToISBN13(input.isbn)
          const purchase = await ctx.prisma.purchase.findFirst({
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
          const change: number = parseInt(input.quantity) - purchase.quantity 
          if (book.inventory + change >= 0){
            const uniqueBooks = await ctx.prisma.purchase.findMany({
              where: {
                purchaseOrderId: input.purchaseOrderId,
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
                shelfSpace: (book.inventory + change) * (book.dimensions[1] ?? DEFAULT_THICKNESS_IN_CENTIMETERS)
              }
            })
            await ctx.prisma.purchase.update({
              where:
            {
              id: input.id
            },
            data: {
              purchaseOrderId: input.purchaseOrderId,
              bookId: isbn,
              quantity: parseInt(input.quantity),
              price: parseFloat(input.price),
              subtotal: parseInt(input.quantity)*parseFloat(input.price)
            },
            });

            await ctx.prisma.purchaseOrder.update({
              where: {
                id: input.purchaseOrderId
              },
              data:{
                totalBooks: {
                  increment:   parseInt(input.quantity) - purchase.quantity
                },
                cost: {
                  increment: parseInt(input.quantity)*parseFloat(input.price) - purchase.subtotal
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
        } catch (error) {
          throw new TRPCError({
            code: error.code,
            message: "Modify Purchase Failed! "+error.message
          })
        }
      }),

      deletePurchase: publicProcedure
      .input(
        z.object({
          id: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        try {
          const purchase = await ctx.prisma.purchase.findFirst({
            where: {
              id: input.id
            }
          })
          if (purchase){
            const book = await ctx.prisma.book.findFirst({
              where:{
                isbn: purchase.bookId
              }
            })
            const inventory: number = parseInt(book.inventory) - parseInt(purchase.quantity)
            if (inventory >= 0){
              const uniqueBooks = await ctx.prisma.purchase.findMany({
                where: {
                  purchaseOrderId: purchase.purchaseOrderId,
                  bookId: purchase.bookId
                }
              });
              let unique = uniqueBooks.length === 1 ? 1 : 0
              await ctx.prisma.book.update({
                where:{
                  isbn: purchase.bookId
                },
                data:{
                  inventory: inventory,
                  shelfSpace: (book.dimensions[1]?? DEFAULT_THICKNESS_IN_CENTIMETERS) * inventory 
                }
              })
              await ctx.prisma.purchaseOrder.update({
                where: {
                  id: purchase.purchaseOrderId
                },
                data:{
                  totalBooks: {
                    decrement:  purchase.quantity
                  },
                  cost: {
                    decrement: purchase.subtotal
                  },
                  uniqueBooks: {
                    decrement: unique
                  }
                }
              })
              await ctx.prisma.purchase.delete({
                where: {
                  id: input.id
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
          
          
        } catch (error) {
          throw new TRPCError({
            code: error.code,
            message: "Delete Purchase Failed! "+error.message
          })
        }
      }),

      getPurchasesByOrderId: publicProcedure
    .input(
      z.object({
        purchaseOrderId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.purchase.findMany({
          where:{
            purchaseOrderId: input.purchaseOrderId
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