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
            const sales: any[] = await ctx.prisma.sale.findMany({
                where:
                {
                    salesReconciliationId: salesRecId
                }
                })
            const saleRec: any = await ctx.prisma.saleReconciliation.findFirst(
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
         datesArray: z.array(z.string())
       })
     )
     .query(async ({ ctx, input }) => {
       try {
        const datesRecArray: any[] = []
        for (const date of input.datesArray){
            const saleRec: any = await ctx.prisma.saleReconciliation.findMany(
                {
                where: {
                    date: new Date(date)
                }
                }
            )

            if (saleRec){
                const salesRecArray: any[] = []
                for (const record of saleRec){
                    const sales: any[] = await ctx.prisma.sale.findMany({
                        where:
                        {
                            salesReconciliationId: record.id
                        }
                        })

                    if (sales){
                            console.log({
                            id: record.id,
                            sales: sales
                            })
                        const rec = {
                            id: record.id,
                            sales: sales
                        }
        
                        salesRecArray.push(rec)
                    }
                }
                datesRecArray.push({
                    date: date,
                    salesRecs: salesRecArray
                })
            }
            
          }
          return datesRecArray
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
        await ctx.prisma.sale.deleteMany({
          where: {
            salesReconciliationId: input.saleRecId
          }
        })
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