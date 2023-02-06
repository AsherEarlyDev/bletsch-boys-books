import { Input } from "postcss";
import { z } from "zod";
import { Purchase } from "../../../types/purchaseTypes";
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
   .input(
       z.object({
         purchaseOrderIdArray: z.array(z.string())
       })
     )
     .query(async ({ ctx, input }) => {
       try {
           const purchaseOrderArray = [];
           for (const purchaseOrderId of input.purchaseOrderIdArray){
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
                    total = total + parseInt(purchase.quantity)
                    const subtotal = (parseInt(purchase.quantity) * parseFloat(purchase.price))
                    cost = cost + subtotal
                    const sub = {
                      subtotal: subtotal,
                      purchase: purchase,
                    }
                    unique.push(purchase.bookId)
                    purchasesArray.push(sub)
                  }
                  let uniqueSet = new Set(unique)

                  const order = {
                    id: purchaseOrderId,
                    vendorId: purchaseOrder.vendorId,
                    date: purchaseOrder.date,
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
          const inventory: number = parseInt(book.inventory) - parseInt(purch.quantity)
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