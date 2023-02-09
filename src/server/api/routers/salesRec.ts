import { z } from "zod";
import { SalesRec } from "../../../types/salesTypes";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const salesRecRouter = createTRPCRouter({

    createSaleRec: publicProcedure
    .input(
        z.object({
          date: z.string()
        })
      )
      .mutation(async ({ ctx, input }) => {
        try {
            await ctx.prisma.saleReconciliation.create({
                data: {
                    date: new Date(input.date),
                },
            });
        } catch (error) {
          console.log(error);
        }
      }),

    getNumSalesRec: publicProcedure
   .query(async ({ ctx, input }) => {
     try {
         const recs = await ctx.prisma.saleReconciliation.findMany()
         return recs.length
     } catch (error) {
       console.log(error);
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
        console.log(error);
      }
    }),

   getSaleRecDetails: publicProcedure
      .input(z.object({
        pageNumber: z.number(),
        entriesPerPage: z.number(),
        sortBy: z.string(),
        descOrAsc: z.string()
      }))
     .query(async ({ ctx, input }) => {
       try {
        const salesRecArray: SalesRec[] = []
        const salesRecs = await ctx.prisma.saleReconciliation.findMany()
        for (const salesRec of salesRecs){
            
            const salesRecId = salesRec.id
            const sales = await ctx.prisma.sale.findMany({
              where: {
                saleReconciliationId: salesRecId
              }
              
            })
            if (sales){
              let unique = new Set()
              let total = 0
              let revenue = 0
              sales.map((sale)=>{
                unique.add(sale.bookId)
                total = total + sale.quantity
                revenue = revenue + sale.quantity*sale.price
              })


              await ctx.prisma.saleReconciliation.update({
                where:{
                  id: salesRecId
                },
                data:{
                  uniqueBooks: unique.size,
                  revenue: revenue,
                  totalBooks: total
                }
              })
            }
            else{
                console.log("Error in finding sales or saleRec")
            }
          }
          const sortedSaleRecs = await ctx.prisma.saleReconciliation.findMany({
            take: input.entriesPerPage,
            skip: input.pageNumber * input.entriesPerPage,
            orderBy: {
              [input.sortBy]: input.descOrAsc
            }
        })

          for (const sorted of sortedSaleRecs){
            const rec = {
              id: sorted.id,
              date: (sorted.date.getMonth()+1)+"-"+(sorted.date.getDate())+"-"+sorted.date.getFullYear(),
              sales: sorted.sales,
              totalBooks: sorted.totalBooks,
              uniqueBooks: sorted.uniqueBooks,
              revenue: sorted.revenue
            }
            salesRecArray.push(rec);
          }
          return salesRecArray
       } catch (error) {
         console.log(error);
       }
     }),



    modifySaleRec: publicProcedure
    .input(
      z.object({
        saleRecId: z.string(),
        date: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.saleReconciliation.update({
          where:
          {
            id: input.saleRecId
        },
          data: {
            date: new Date(input.date),
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),

    deleteSaleRec: publicProcedure
    .input(
      z.object({
        saleRecId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const sales = await ctx.prisma.sale.findMany({
          where: {
            saleReconciliationId: input.saleRecId
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
            id: input.saleRecId
          }
        })
      } catch (error) {
        console.log(error);
      }
    })

});