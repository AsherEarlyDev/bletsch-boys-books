import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { BookBuybackOrder } from "@prisma/client";
import { DEFAULT_THICKNESS_IN_CENTIMETERS } from "./books";

export const buybackOrderRouter = createTRPCRouter({
    createBuybackOrder: publicProcedure
    .input(
        z.object({
          vendorId: z.string(),
          date: z.string(),
          userName: z.string()
        })
      )
      .mutation(async ({ ctx, input }) => {
        try {
            const date  = input.date.replace(/-/g, '\/')
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
                const newBuyback = await ctx.prisma.bookBuybackOrder.create({
                    data: {
                        date: new Date(date),
                        vendorId: input.vendorId,
                        vendorName: vendor.name,
                        userName: input.userName
                    },
                });
                return {id: newBuyback.id, date: date, vendor: vendor}
            }
        } catch (error) {
          throw new TRPCError({
            code: error.code ? error.code : 'INTERNAL_SERVER_ERROR',
            message: error.message,
          });
        }
      }),

      getUniqueBuybackOrders: publicProcedure
      .input(z.string())
      .query(async ({ctx, input}) => {
        const rawData = await ctx.prisma.bookBuybackOrder.findUnique({
          where:{
          id:input
          },
          include:{
            vendor: true,
            buybacks: true,
          }         
        })
        return transformData([rawData])[0]
     }),

      getBuybackOrders: publicProcedure
      .input(z.object({
       pageNumber: z.number(),
       entriesPerPage: z.number(),
       sortBy: z.string(),
       descOrAsc: z.string()
     }))
     .query(async ({ctx, input}) => {
       if(input){
         const rawData = await ctx.prisma.bookBuybackOrder.findMany({
           take: input.entriesPerPage,
           skip: input.pageNumber*input.entriesPerPage,
           include:{
             vendor: true,
             buybacks: true
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
         return transformData(await ctx.prisma.bookBuybackOrder.findMany({
           include:{
             vendor: true
           }
         }))
       }
     }),

    getNumBuybackOrder: publicProcedure
    
   .query(async ({ ctx, input }) => {
     try {
         const orders = await ctx.prisma.bookBuybackOrder.findMany()
         return orders.length
     } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message,
      });
     }
   }),

   getTotalBuybackOrder: publicProcedure
    
   .query(async ({ ctx, input }) => {
     try {
         const orders = await ctx.prisma.bookBuybackOrder.findMany()
         return orders
     } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message,
      });
     }
   }),

  //  getBuybackOrderDetails: publicProcedure
  //     .input(z.object({
  //       pageNumber: z.number(),
  //       entriesPerPage: z.number(),
  //       sortBy: z.string(),
  //       descOrAsc: z.string()
  //     }))
  //    .query(async ({ ctx, input }) => {
  //      try {
  //          const buybackOrderArray = [];
  //          const buybackOrders = await ctx.prisma.bookBuybackOrder.findMany()
  //          if (!buybackOrders) {throw new TRPCError({
  //           code: 'NOT_FOUND',
  //           message: 'No Purchase Orders Found!',
  //         });}
  //          for (const buyback of buybackOrders){
  //             const buybackOrderId = buyback.id
  //             const buybacks = await ctx.prisma.buyback.findMany({
  //               where: {
  //                   buybackOrderId: buybackOrderId
  //               }
  //             })
  //             if (buybacks){
  //                 let unique = new Set()
  //                 let total = 0
  //                 let cost = 0
  //                 buybacks.map((buyback)=>{
  //                   unique.add(buyback.bookId)
  //                   total = total + buyback.quantity
  //                   cost = cost + buyback.quantity*buyback.price
  //                 })


  //                 await ctx.prisma.bookBuybackOrder.update({
  //                   where:{
  //                     id: buybackOrderId
  //                   },
  //                   data:{
  //                     uniqueBooks: unique.size,
  //                     cost: cost,
  //                     totalBooks: total
  //                   }
  //                 })

  //             }
  //             else{
  //               throw new TRPCError({
  //                 code: 'NOT_FOUND',
  //                 message: 'Buybacks or Buyback Orders Not Found!',
  //               });
  //             }
  //           }
  //           const sortedBuybackOrders = await ctx.prisma.bookBuybackOrder.findMany({
  //               take: input.entriesPerPage,
  //               skip: input.pageNumber*input.entriesPerPage,
  //               orderBy: {
  //                 [input.sortBy]: input.descOrAsc
  //               }
  //           })

  //           for (const sorted of sortedBuybackOrders){
  //             const vendor = await ctx.prisma.vendor.findFirst({
  //               where:{
  //                 id: sorted.vendorId
  //               }
  //             })
  //             const buyback = await ctx.prisma.buyback.findMany({
  //               where: {
  //                   buybackOrderId: sorted.id
  //               }
  //             })
  //             let month = sorted.date.getMonth()+1
  //             if (month < 10) month = "0"+month.toString()
  //             const order = {
  //               id: sorted.id,
  //               vendorId: sorted.vendorId,
  //               vendorName: vendor.name,
  //               date: month+"/"+(sorted.date.getDate())+"/"+sorted.date.getFullYear(),
  //               buybacks: buyback,
  //               totalBooks: sorted.totalBooks,
  //               uniqueBooks: sorted.uniqueBooks,
  //               cost: sorted.cost
  //             }
  //             buybackOrderArray.push(order);
  //           }
            
  //           return buybackOrderArray
  //      } catch (error) {
  //       throw new TRPCError({
  //         code: error.code,
  //         message: error.message,
  //       });
  //      }
  //    }),

    modifyBuybackOrder: publicProcedure
    .input(
      z.object({
        buybackOrderId: z.string(),
        vendorId: z.string(),
        date: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const date  = input.date.replace(/-/g, '\/')
        if (date === '' || !date){
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'No date given!',
          });
        }
        await ctx.prisma.bookBuybackOrder.update({
          where:
          {
            id: input.buybackOrderId
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

    deleteBuybackOrder: publicProcedure
    .input(
        z.object({
          id: z.string(),
        })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const buybacks = await ctx.prisma.buyback.findMany({
          where: {
            buybackOrderId: input.id
          }
        })
        
        for (const buyback of buybacks){
          const book = await ctx.prisma.book.findUnique({
            where:{
              isbn: buyback.bookId
            }
          })

          await ctx.prisma.book.update({
            where:{
              isbn: buyback.bookId
            },
            data:{
              inventory: {
                increment: buyback.quantity
              },
              shelfSpace: (book.inventory+buyback.quantity)*(book.dimensions[1] ?? DEFAULT_THICKNESS_IN_CENTIMETERS)
              
            }
          })
  
          await ctx.prisma.buyback.delete({
            where: {
              id: buyback.id
            }
          })
        }
        await ctx.prisma.bookBuybackOrder.delete({
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

  const transformData = (buybackOrder) => {
    return buybackOrder.map((rec) => {
      return({
        ...rec,
        date:(rec.date.getMonth()+1)+"-"+(rec.date.getDate())+"-"+rec.date.getFullYear(),
      })
    })
  }
