import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

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
              const buybackOrder = await ctx.prisma.bookBuybackOrder.findFirst({
                where:
                {
                  id: input.buybackOrderId
                },
              })
              const book = await ctx.prisma.book.findFirst({
                where:{
                  isbn: input.isbn
                }
              })
            if (buybackOrder && book){
              const inventory: number = book.inventory - parseInt(input.quantity)
              if(inventory >= 0){
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
    })
})