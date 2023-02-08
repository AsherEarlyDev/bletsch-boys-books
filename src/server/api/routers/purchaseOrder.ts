import { createWSClient } from "@trpc/client";
import { Input } from "postcss";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";


export const purchaseOrderRouter = createTRPCRouter({
    createPurchaseOrder: publicProcedure
    .input(
        z.object({
          vendorId: z.string(),
          date: z.string()
        })
      )
      .mutation(async ({ ctx, input }) => {
        try {
            const vendor = await ctx.prisma.vendor.findFirst({
                where:
                {
                  id: input.vendorId
                }
              })
            if (vendor){
                await ctx.prisma.purchaseOrder.create({
                    data: {
                        date: new Date(input.date),
                        vendorId: input.vendorId
                    },
                });
            }
        } catch (error) {
          console.log(error);
        }
      }),

   getPurchaseOrderDetails: publicProcedure
     .query(async ({ ctx, input }) => {
       try {
           const purchaseOrderArray = [];
           const purchaseOrders = await ctx.prisma.purchaseOrder.findMany()
           for (const pur of purchaseOrders){
              const purchaseOrderId = pur.id
              const purchases = await ctx.prisma.purchase.findMany({
                  where:
                  {
                    purchaseOrderId: purchaseOrderId
                  }
                })
              const purchaseOrder: any = await ctx.prisma.purchaseOrder.findFirst(
                {
                  where: {
                    id: purchaseOrderId
                  }
                }
              )
              if (purchases && purchaseOrder){
                  const purchasesArray: any[] = [];
                  let total = 0
                  let unique: string[] = []
                  let cost = 0
                  for (const purchase of purchases){
                    total = total + purchase.quantity
                    const subtotal = (purchase.quantity * purchase.price)
                    cost = cost + subtotal
                    const sub = {
                      subtotal: subtotal,
                      purchase: purchase,
                    }
                    unique.push(purchase.bookId)
                    purchasesArray.push(sub)
                  }
                  let uniqueSet = new Set(unique)

                  const vendor = await ctx.prisma.vendor.findFirst({
                    where:{
                      id: purchaseOrder.vendorId
                    }
                  })

                  const order = {
                    id: purchaseOrderId,
                    vendorId: purchaseOrder.vendorId,
                    vendorName: vendor.name,
                    date: (purchaseOrder.date.getMonth()+1)+"-"+(purchaseOrder.date.getDay())+"-"+purchaseOrder.date.getFullYear(),
                    purchases: purchasesArray,
                    totalBooks: total,
                    uniqueBooks: uniqueSet.size,
                    cost: cost
                  }
                  purchaseOrderArray.push(order);
              }
              else{
                console.log("Error in finding purchases or purchaseOrder")
              }
            }
            return purchaseOrderArray
       } catch (error) {
         console.log(error);
       }
     }),

    modifyPurchaseOrder: publicProcedure
    .input(
      z.object({
        purchaseOrderId: z.string(),
        vendorId: z.string(),
        date: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.purchaseOrder.update({
          where:
          {
            id: input.purchaseOrderId
        },
          data: {
            date: new Date(input.date),
            vendorId: input.vendorId
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
        const purchases = await ctx.prisma.purchase.findMany({
          where: {
            purchaseOrderId: input.purchaseOrderId
          }
        })
        for (const purch of purchases){
          const book = await ctx.prisma.book.findFirst({
            where:{
              isbn: purch.bookId
            }
          })
          const inventory: number = book.inventory - purch.quantity
          console.log(inventory)
          if (inventory >= 0){
            await ctx.prisma.purchase.delete({
              where:{
                id: purch.id
              }
            })

            await ctx.prisma.book.update({
              where:{
                isbn: purch.bookId
              },
              data:{
                inventory: inventory
              }
            })
          }
          else{
            let errorString: string = 'Cannot delete Purchase Order, "'+ book.title +'" would have a negative inventory'
            throw new Error(errorString)
          }
        }
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