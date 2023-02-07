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
     .query(async ({ ctx, input }) => {
       try {
        const salesRecArray: SalesRec[] = []
        const salesRecs = await ctx.prisma.saleReconciliation.findMany()
        for (const salesRec of salesRecs){
            const salesRecId = salesRec.id
            const sales = await ctx.prisma.sale.findMany({
                where:
                {
                    saleReconciliationId: salesRecId
                }
                })
            if (sales && salesRec){
                const salesArray: any[] = [];
                let total = 0
                let unique: string[] = []
                let revenue = 0
                for (const sale of sales){
                  total = total + parseInt(sale.quantity)
                  const subtotal = (parseInt(sale.quantity) * parseFloat(sale.price))
                  revenue = revenue + subtotal
                  const sub = {
                    subtotal: subtotal,
                    sale: sale,
                  }
                  unique.push(sale.bookId)
                  salesArray.push(sub)
                }
                let uniqueSet = new Set(unique)
                const rec = {
                  id: salesRecId,
                  date: (salesRec.date.getMonth()+1)+"-"+(salesRec.date.getDate())+"-"+salesRec.date.getFullYear(),
                  sales: salesArray,
                  totalBooks: total,
                  uniqueBooks: uniqueSet.size,
                  revenue: revenue
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