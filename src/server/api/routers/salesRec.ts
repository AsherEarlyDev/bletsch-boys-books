import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { SalesRec } from "../../../types/salesTypes";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { saleReconciliation } from "@prisma/client";

export const salesRecRouter = createTRPCRouter({

  createSaleRec: publicProcedure
  .input(
      z.object({
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
      const newSaleRec = await ctx.prisma.saleReconciliation.create({
        data: {
          date: new Date(date),
        },
      });
      return {id: newSaleRec.id, date: date}
    } catch (error) {
      throw new TRPCError({
        code: error.code ? error.code : 'INTERNAL_SERVER_ERROR',
        message: error.message,
      });
    }
  }),

  getNumSalesRec: publicProcedure
  .query(async ({ ctx, input }) => {
    try {
      const recs = await ctx.prisma.saleReconciliation.findMany()
      return recs.length
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message,
      });
    }
  }),

  getSaleRec: publicProcedure
  .input(
      z.array(z.string())
  )
  .query(async ({ ctx, input }) => {
    try {
      const recs = []
      for (const id of input){
        const saleRec = await ctx.prisma.saleReconciliation.findFirst({
          where: {
            id: id
          },
        });
        recs.push(saleRec)
      }
      return {salesRec: recs}
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message,
      });
    }
  }),

  getUniqueSalesRecs:publicProcedure
  .input(z.string())
  .query(async ({ ctx, input }) => {
    const rawData = await ctx.prisma.saleReconciliation.findUnique({
      where:{
        id:input
      },
      include:{
        sales: true
      }
    })
    return transformData([rawData])[0]
    
  }),

  getSalesRecs:publicProcedure
  .input(z.object({
    pageNumber: z.number(),
    entriesPerPage: z.number(),
    sortBy: z.string(),
    descOrAsc: z.string()
  }))
  .query(async ({ ctx, input }) => {
    if(input){
      const rawData = await ctx.prisma.saleReconciliation.findMany({
        take: input.entriesPerPage,
        skip: input.pageNumber*input.entriesPerPage,
        include:{
          sales: true
        },
        orderBy: 
          {
            [input.sortBy]: input.descOrAsc,
          }
      })
      return transformData(rawData)
    }
  }),
  
  getNumberOfSalesRecs: publicProcedure
    .query(async ({ctx, input})=>{
      return await ctx.prisma.saleReconciliation.count()
    }),

  // getSaleRecDetails: publicProcedure
  // .input(z.object({
  //   pageNumber: z.number(),
  //   entriesPerPage: z.number(),
  //   sortBy: z.string(),
  //   descOrAsc: z.string()
  // }))
  // .query(async ({ ctx, input }) => {
  //   try {
  //     const salesRecArray: SalesRec[] = []
  //     const salesRecs = await ctx.prisma.saleReconciliation.findMany()
  //     if (!salesRecs) {throw new TRPCError({
  //       code: 'NOT_FOUND',
  //       message: 'No Sales Reconciliations Found!',
  //     });}
  //     for (const salesRec of salesRecs){

  //       const salesRecId = salesRec.id
  //       const sales = await ctx.prisma.sale.findMany({
  //         where: {
  //           saleReconciliationId: salesRecId
  //         }

  //       })
  //       if (sales){
  //         let unique = new Set()
  //         let total = 0
  //         let revenue = 0
  //         sales.map((sale)=>{
  //           unique.add(sale.bookId)
  //           total = total + sale.quantity
  //           revenue = revenue + sale.quantity*sale.price
  //         })


  //         await ctx.prisma.saleReconciliation.update({
  //           where:{
  //             id: salesRecId
  //           },
  //           data:{
  //             uniqueBooks: unique.size,
  //             revenue: revenue,
  //             totalBooks: total
  //           }
  //         })
  //       }
  //       else{
  //         throw new TRPCError({
  //           code: 'NOT_FOUND',
  //           message: 'Sale or Sales Reconciliation Not Found!',
  //         });
  //       }
  //     }
  //     const sortedSaleRecs = await ctx.prisma.saleReconciliation.findMany({
  //       take: input.entriesPerPage,
  //       skip: input.pageNumber * input.entriesPerPage,
  //       orderBy: {
  //         [input.sortBy]: input.descOrAsc
  //       }
  //     })

  //     for (const sorted of sortedSaleRecs){
  //       const sales = await ctx.prisma.sale.findMany({
  //         where: {
  //           saleReconciliationId: sorted.id
  //         }
  //       })
  //       let month = sorted.date.getMonth()+1
  //       if (month < 10) month = "0"+month.toString()
  //       const rec = {
  //         id: sorted.id,
  //         date: month+"/"+(sorted.date.getDate())+"/"+sorted.date.getFullYear(),
  //         sales: sales,
  //         totalBooks: sorted.totalBooks,
  //         uniqueBooks: sorted.uniqueBooks,
  //         revenue: sorted.revenue
  //       }
  //       salesRecArray.push(rec);
  //     }
  //     return salesRecArray
  //   } catch (error) {
  //     throw new TRPCError({
  //       code: error.code,
  //       message: error.message,
  //     });
  //   }
  // }),



  modifySaleRec: protectedProcedure
  .input(
      z.object({
        saleRecId: z.string(),
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
      await ctx.prisma.saleReconciliation.update({
        where:
            {
              id: input.saleRecId
            },
        data: {
          date: new Date(date),
        },
      });
    } catch (error) {
      throw new TRPCError({
        code: error.code ? error.code : 'INTERNAL_SERVER_ERROR',
        message: error.message,
      });
    }
  }),

  deleteSaleRec: protectedProcedure
  .input(
      z.object({
        id: z.string(),
      })
  )
  .mutation(async ({ ctx, input }) => {
    try {
      const sales = await ctx.prisma.sale.findMany({
        where: {
          saleReconciliationId: input.id
        }
      })
      for (const sale of sales){
        await ctx.prisma.book.update({
          where:{
            isbn: sale.bookId
          },
          data:{
            inventory: {
              increment: sale.quantity
            }
          }
        })

        await ctx.prisma.sale.delete({
          where: {
            id: sale.id
          }
        })
      }
      await ctx.prisma.saleReconciliation.delete({
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

const transformData = (salesRec: saleReconciliation[]) => {
  return salesRec.map((rec) => {
    return({
      ...rec,
      date:(rec.date.getMonth()+1)+"-"+(rec.date.getDate())+"-"+rec.date.getFullYear(),
    })
  })
}