import { TRPCError } from "@trpc/server";
import { z } from "zod";
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
        try{
              const saleRec = await ctx.prisma.saleReconciliation.findFirst({
                where:
                {
                  id: input.saleReconciliationId
                },
              })
              const book = await ctx.prisma.book.findFirst({
                where:{
                  isbn: input.isbn
                }
              })
            if (saleRec && book){
              const inventory: number = book.inventory - parseInt(input.quantity)
              if(inventory >= 0){
                await ctx.prisma.sale.create({
                    data: {
                      saleReconciliationId: input.saleReconciliationId,
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
          console.log(error.code)
          throw new TRPCError({
            code: error.code,
            message: "Sale Failed! "+error.message
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
        const sale = await ctx.prisma.sale.findFirst({
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
      const change: number = sale.quantity - parseInt(input.quantity)  
      if(book.inventory + change >= 0) {
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
          message: 'Inventory cannot go below 0.',
        });
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
    })
});