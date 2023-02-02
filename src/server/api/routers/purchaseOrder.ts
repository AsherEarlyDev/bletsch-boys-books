import { Input } from "postcss";
import { z } from "zod";
import { Purchase } from "../../../types/purchaseTypes";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";


export const purchaseOrderRouter = createTRPCRouter({
    createPurchaseOrder: publicProcedure
    .input(
        z.object({
          vendorName: z.string(),
          date: z.string()
        })
      )
      .mutation(async ({ ctx, input }) => {
        try {
            const vendorId = await ctx.prisma.vendor.findFirst({
                where:
                {
                  name: input.vendorName
                }
              })
            if (vendorId){
                await ctx.prisma.purchaseOrder.create({
                    data: {
                        date: new Date(input.date),
                        vendorId: vendorId.id
                    },
                });
            }
        } catch (error) {
          console.log(error);
        }
      }),

   getPurchaseOrderDetails: publicProcedure
   .input(
       z.object({
         purchaseOrderId: z.string()
       })
     )
     .query(async ({ ctx, input }) => {
       try {
           const purchases: any[] = await ctx.prisma.purchase.findMany({
               where:
               {
                 purchaseOrderId: input.purchaseOrderId
               }
             })
           const purchaseOrder: any = await ctx.prisma.purchaseOrder.findFirst(
            {
              where: {
                id: input.purchaseOrderId
              }
            }
           )
           const vendor: any = await ctx.prisma.vendor.findFirst(
            {
              where: {
                id: purchaseOrder.vendorId
              }
            }
           )
           if (purchases && purchaseOrder){
                console.log({
                  id: input.purchaseOrderId,
                  vendorName: vendor.name,
                  vendorId: vendor.id,
                  purchases: purchases
                 })
               return {
                id: input.purchaseOrderId,
                vendorName: vendor.name,
                vendorId: vendor.id,
                purchases: purchases
               }
           }
           else{
            console.log("Error in finding purchases or purchaseOrder")
           }
       } catch (error) {
         console.log(error);
       }
     }),

    modifyPurchaseOrder: publicProcedure
    .input(
      z.object({
        purchaseOrderId: z.string(),
        vendorName: z.string(),
        date: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const vendor = await ctx.prisma.vendor.findFirst(
          {
            where: {
              name: input.vendorName
            }
          }
         )
        await ctx.prisma.purchaseOrder.update({
          where:
          {
            id: input.purchaseOrderId
        },
          data: {
            date: new Date(input.date),
            vendorId: vendor.id
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),

    deletePurchaseOrder: publicProcedure
    .input(
      z.object({
        purchaseOrderId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.purchase.deleteMany({
          where: {
            purchaseOrderId: input.purchaseOrderId
          }
        })
        await ctx.prisma.purchaseOrder.delete({
          where: {
            id: input.purchaseOrderId
          }
        })
      } catch (error) {
        console.log(error);
      }
    })

  });