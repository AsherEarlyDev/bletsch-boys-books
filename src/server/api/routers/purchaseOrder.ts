import { PurchaseOrder } from "@prisma/client";
import { createWSClient } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { Input } from "postcss";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";


export const purchaseOrderRouter = createTRPCRouter({
    createPurchaseOrder: publicProcedure
    .input(z.object({
          vendorId: z.string(),
          date: z.string(),
          userName: z.string()
        }))
    .mutation(async ({ ctx, input }) => {
        try {
            const date  = input.date.replace(/-/g, '\/')
            console.log("DATE: " + date)
            if (date === '' || !date){
              throw new TRPCError({
                code: 'CONFLICT',
                message: 'No date given!',
              });
            }
            const vendor = await ctx.prisma.vendor.findFirst({
                where:
                {
                  id: input.vendorId
                }
              })
            if (vendor){
                const newPurchaseOrder = await ctx.prisma.purchaseOrder.create({
                    data: {
                        date: new Date(date),
                        vendorId: input.vendorId,
                        vendorName: vendor.name,
                        userName: input.userName
                    },
                });
                return {id: newPurchaseOrder.id, date: date, vendor: vendor}
            }   
        } catch (error) {
          throw new TRPCError({
            code: error.code ? error.code : 'INTERNAL_SERVER_ERROR',
            message: error.message,
          });
        }
      }),

    getNumPurchaseOrder: publicProcedure
   .query(async ({ ctx, input }) => {
     try {
         const orders = await ctx.prisma.purchaseOrder.findMany()
         return orders.length
     } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message,
      });
     }
   }),

   getPurchaseOrders: publicProcedure
   .input(z.object({
    pageNumber: z.number(),
    entriesPerPage: z.number(),
    sortBy: z.string(),
    descOrAsc: z.string()
  }))
   .query(async ({ctx, input}) => {
    if(input){
      const rawData = await ctx.prisma.purchaseOrder.findMany({
        take: input.entriesPerPage,
        skip: input.pageNumber*input.entriesPerPage,
        include:{
          vendor: true,
          purchases: true
        },
        orderBy: input.sortBy==="vendorName" ? {
          vendor:{
            name: input.descOrAsc
          }
        } :  
          {
            [input.sortBy]: input.descOrAsc,
          }
        
      
      })
      return transformData(rawData)
    }
    else{
      return transformData(await ctx.prisma.purchaseOrder.findMany({
        include:{
          vendor: true
        }
      }))
    }
  }),

   getPurchaseOrderDetails: publicProcedure
   .input(z.object({
        pageNumber: z.number(),
        entriesPerPage: z.number(),
        sortBy: z.string(),
        descOrAsc: z.string()
      }))
   .query(async ({ ctx, input }) => {
       try {
           const purchaseOrderArray = [];
           const purchaseOrders = await ctx.prisma.purchaseOrder.findMany()
           if (!purchaseOrders) {throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'No Purchase Orders Found!',
          });}
           for (const pur of purchaseOrders){
              const purchaseOrderId = pur.id
              const purchases = await ctx.prisma.purchase.findMany({
                where: {
                  purchaseOrderId: purchaseOrderId
                }
              })
              if (purchases){
                  let unique = new Set()
                  let total = 0
                  let cost = 0
                  purchases.map((purch)=>{
                    unique.add(purch.bookId)
                    total = total + purch.quantity
                    cost = cost + purch.quantity*purch.price
                  })


                  await ctx.prisma.purchaseOrder.update({
                    where:{
                      id: purchaseOrderId
                    },
                    data:{
                      uniqueBooks: unique.size,
                      cost: cost,
                      totalBooks: total
                    }
                  })

              }
              else{
                throw new TRPCError({
                  code: 'NOT_FOUND',
                  message: 'Purchases or Purchase Orders Not Found!',
                });
              }
            }
            const sortedPurchaseOrders = await ctx.prisma.purchaseOrder.findMany({
                take: input.entriesPerPage,
                skip: input.pageNumber*input.entriesPerPage,
                orderBy: {
                  [input.sortBy]: input.descOrAsc
                }
            })

            for (const sorted of sortedPurchaseOrders){
              const vendor = await ctx.prisma.vendor.findFirst({
                where:{
                  id: sorted.vendorId
                }
              })
              const purch = await ctx.prisma.purchase.findMany({
                where: {
                  purchaseOrderId: sorted.id
                }
              })
              let month = (sorted.date.getMonth()+1).toString()
              if (parseInt(month) < 10) month = "0"+month.toString()
              const order = {
                id: sorted.id,
                vendorId: sorted.vendorId,
                vendorName: vendor.name,
                date: month+"/"+(sorted.date.getDate())+"/"+sorted.date.getFullYear(),
                purchases: purch,
                totalBooks: sorted.totalBooks,
                uniqueBooks: sorted.uniqueBooks,
                cost: sorted.cost
              }
              purchaseOrderArray.push(order);
            }
            
            return purchaseOrderArray
       } catch (error) {
        throw new TRPCError({
          code: error.code,
          message: error.message,
        });
       }
     }),

    modifyPurchaseOrder: publicProcedure
    .input(z.object({
        purchaseOrderId: z.string(),
        vendorId: z.string(),
        date: z.string()
      }))
    .mutation(async ({ ctx, input }) => {
      try {
        const date  = input.date.replace(/-/g, '\/')
        if (date === '' || !date){
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'No date given!',
          });
        }
        await ctx.prisma.purchaseOrder.update({
          where:
          {
            id: input.purchaseOrderId
        },
          data: {
            date: new Date(date),
            vendorId: input.vendorId
          },
        });
      } catch (error) {
        throw new TRPCError({
          code: error.code ? error.code : 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }
    }),

    deletePurchaseOrder: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const purchases = await ctx.prisma.purchase.findMany({
          where: {
            purchaseOrderId: input.id
          }
        })
        for (const purch of purchases){
          const book = await ctx.prisma.book.findFirst({
            where:{
              isbn: purch.bookId
            }
          })
          const inventory: number = book.inventory - purch.quantity
          if (inventory >= 0){
            await ctx.prisma.purchase.delete({
              where:{
                id: purch.id
              }
            })

            await ctx.prisma.book.update({
              where:{
                isbn: book.isbn
              },
              data:{
                inventory: inventory
              }
            })
          }
          else{
            throw new TRPCError({
              code: 'CONFLICT',
              message: 'Cannot delete Purchase Order, "'+ book.title +'" would have a negative inventory',
            });
          }

        }
        await ctx.prisma.purchaseOrder.delete({
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
    getNumberOfPurchaseOrders: publicProcedure
    .query(async ({ctx, input})=>{
      return await ctx.prisma.purchaseOrder.count()
    })

  });

  const transformData = (purchaseOrder:PurchaseOrder[]) => {
    return purchaseOrder.map((order) => {
      return({
        ...order,
        date:(order.date.getMonth()+1)+"-"+(order.date.getDate())+"-"+order.date.getFullYear(),
      })
    })
  }