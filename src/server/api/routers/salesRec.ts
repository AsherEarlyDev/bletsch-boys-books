import { z } from "zod";
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

   getSaleRecDetails: publicProcedure
   .input(
       z.object({
         salesRecIdArray: z.array(z.string())
       })
     )
     .query(async ({ ctx, input }) => {
       try {
        const salesRecArray: any[] = []
        for (const salesRecId of input.salesRecIdArray){
            const sales = await ctx.prisma.sale.findMany({
                where:
                {
                    saleReconciliationId: salesRecId
                }
                })
            const saleRec = await ctx.prisma.saleReconciliation.findFirst(
                {
                where: {
                    id: salesRecId
                }
                }
            )
            if (sales && saleRec){
                    console.log({
                    date: saleRec.date,
                    id: salesRecId,
                    sales: sales
                    })
                const rec = {
                    date: saleRec.date,
                    id: salesRecId,
                    sales: sales
                }

                salesRecArray.push(rec)
            }
            else{
                console.log("Error in finding sales or saleRec")
            }
          }
          return salesRecArray
       } catch (error) {
         console.log(error);
       }
     }),

     getSaleRecDetailsByDate: publicProcedure
   .input(
       z.object({
         startDate: z.string(),
         endDate: z.string()
       })
     )
     .query(async ({ ctx, input }) => {
       try {
          const salesRecArray: any[] = []
          const salesRecs = await ctx.prisma.saleReconciliation.findMany({
            where:{
              date: {
                gte: new Date(input.startDate),
                lte: new Date(input.endDate)
              }
            }
          })
          console.log(salesRecs)
          if(salesRecs){
            console.log("Found SaleRecs")
            for (const saleRec of salesRecs ){
              const sales = await ctx.prisma.sale.findMany({
                where:
                {
                    saleReconciliationId: saleRec.id
                }
                })
                console.log({
                  date: saleRec.date,
                  id: saleRec.id,
                  sales: sales
                  })
              const rec = {
                  date: saleRec.date,
                  id: saleRec.id,
                  sales: sales
              }
              salesRecArray.push(rec)
            }
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