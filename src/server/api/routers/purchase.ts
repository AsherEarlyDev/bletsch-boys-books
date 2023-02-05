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
            const purchaseOrder = await ctx.prisma.purchaseOrder.findFirst({
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
                await ctx.prisma.book.update({
                  where: {
                    isbn: input.isbn
                  },
                  data:{
                    inventory: {
                      increment: parseInt(input.quantity)
                    }
                  }
                })
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
              console.log("Inventory: "+inventory)
              await ctx.prisma.purchase.delete({
                where: {
                  id: input.id
                }
              })
              await ctx.prisma.book.update({
                where:{
                  isbn: purchase.bookId
                },
                data:{
                  inventory: inventory
                }
              })
            }
            else{
              console.log("Deleting this purchase makes the inventory negative")
            }
          }
          
          
        } catch (error) {
          console.log(error);
        }
      })

  });