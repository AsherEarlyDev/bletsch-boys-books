import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

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
            const purchaseOrder = await ctx.prisma.vendor.findFirst({
                where:
                {
                  id: input.purchaseOrderId
                }
              })
            if (purchaseOrder){
                await ctx.prisma.purchase.create({
                    data: {
                       purchaseOrderId: input.purchaseOrderId,
                       bookId: input.isbn,
                       quantity: parseInt(input.quantity),
                       price: parseFloat(input.price)
                    },
                });
            }
            else{
                console.log("No purchase order under that ID")
            }
        } catch (error) {
          console.log(error);
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
          await ctx.prisma.purchase.update({
            where:
          {
            id: input.id
        },
          data: {
            purchaseOrderId: input.purchaseOrderId,
            bookId: input.isbn,
            quantity: parseInt(input.quantity),
            price: parseFloat(input.price)
          },
          });
        } catch (error) {
          console.log(error);
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
          await ctx.prisma.purchase.delete({
            where: {
              id: input.id
            }
          })
        } catch (error) {
          console.log(error);
        }
      })

  });