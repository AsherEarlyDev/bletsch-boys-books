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
        try {
            const saleRec = await ctx.prisma.saleReconciliation.findFirst({
                where:
                {
                  id: input.saleReconciliationId
                }
              })
            if (saleRec){
                await ctx.prisma.sale.create({
                    data: {
                       saleReconciliationId: input.saleReconciliationId,
                       bookId: input.isbn,
                       quantity: parseInt(input.quantity),
                       price: parseFloat(input.price)
                    },
                });
            }
            else{
                console.log("No sale reconciliation under that ID")
            }
        } catch (error) {
          console.log(error);
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
      try {
        await ctx.prisma.sale.update({
          where:
        {
          id: input.id
      },
        data: {
          saleReconciliationId: input.saleReconciliationId,
          bookId: input.isbn,
          quantity: parseInt(input.quantity),
          price: parseFloat(input.price)
        },
        });
      } catch (error) {
        console.log(error);
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
        await ctx.prisma.sale.delete({
          where: {
            id: input.id
          }
        })
      } catch (error) {
        console.log(error);
      }
    })


});