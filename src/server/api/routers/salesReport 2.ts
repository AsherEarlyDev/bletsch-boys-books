import { Input } from "postcss";
import { z } from "zod";
import { topSellers } from "../../../types/salesTypes";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";


export const salesReportRouter = createTRPCRouter({

    generateRevenueReport: publicProcedure
    .input(
       z.object({
         startDate: z.string(),
         endDate: z.string()
       })
     )
     .query(async ({ ctx, input }) => {
       try {
          let totalRevenue = 0
          const resultsArray: any[] = []
          const salesRecs = await ctx.prisma.saleReconciliation.findMany({
            where:{
              date: {
                gte: new Date(input.startDate),
                lte: new Date(input.endDate)
              }
            }
          })
          if(salesRecs){
            for (let i = 0; i < salesRecs.length; i++){
              let revenue = 0
              const saleRec = salesRecs[i]
              const sales = await ctx.prisma.sale.findMany({
                where:
                {
                    saleReconciliationId: saleRec.id
                }
                })
              for (let j = 0; j < sales.length; j++){
                revenue += parseInt(sales[j].quantity) * parseFloat(sales[j].price)
              }
              const rec = {
                  revenue: revenue,
                  date: saleRec.date,
                  sales: sales,
              }
              totalRevenue += revenue
              resultsArray.push(rec)
            }
          }
          return {
            totalRevenue: totalRevenue,
            results: resultsArray
          }
       } catch (error) {
         console.log(error);
       }
     }),

     generateCostReport: publicProcedure
    .input(
       z.object({
         startDate: z.string(),
         endDate: z.string()
       })
     )
     .query(async ({ ctx, input }) => {
       try {
          let totalCost = 0
          const resultsArray: any[] = []
          const purchaseOrders = await ctx.prisma.purchaseOrder.findMany({
            where:{
              date: {
                gte: new Date(input.startDate),
                lte: new Date(input.endDate)
              }
            }
          })
          if(purchaseOrders){
            for (let i = 0; i < purchaseOrders.length; i++){
              let cost = 0
              const purchaseOrder = purchaseOrders[i]
              const pur = await ctx.prisma.purchase.findMany({
                where:
                {
                    purchaseOrderId: purchaseOrder.id
                }
                })
              
              for (let j = 0; j < pur.length; j++){
                cost += parseInt(pur[j].quantity) * parseFloat(pur[j].price)
              }
              const rec = {
                  cost: cost,
                  date: purchaseOrder.date,
                  purchases: pur
              }
              totalCost += cost
              resultsArray.push(rec)
            }
          }
          return {
            totalCost: totalCost,
            results: resultsArray
          }
       } catch (error) {
         console.log(error);
       }
     }),

     getTopSelling: publicProcedure
    .input(
       z.object({
         startDate: z.string(),
         endDate: z.string()
       })
     )
     .query(async ({ ctx, input }) => {
       try {
        let books = new Map<string, topSellers>()
        const salesRecs = await ctx.prisma.saleReconciliation.findMany({
          where:{
            date: {
              gte: new Date(input.startDate),
              lte: new Date(input.endDate)
            }
          }
        })
        let purchaseOrders = await ctx.prisma.purchaseOrder.findMany({
          where:{
            date: {
              gte: new Date(input.startDate),
              lte: new Date(input.endDate)
            }
          }
        })
        purchaseOrders = purchaseOrders.sort((a: any, b: any) => (a.date > b.date) ? 1 : -1)
        for (const rec of salesRecs){
          const sales = await ctx.prisma.sale.findMany({
            where:
            {
                saleReconciliationId: rec.id
            }
            })

            for (const sale of sales){
              if (books.get(sale.bookId)){
                let updatedNumBooks = books.get(sale.bookId)?.numBooks + sale.quantity 
                let rev = sale.quantity * sale.price
                let currRev = books.get(sale.bookId)?.revenue
                if(currRev)
                  books.set(sale.bookId, {numBooks: updatedNumBooks, revenue: rev+currRev, 
                    recentCost: 0, profit: 0})
              }
              else{
                books.set(sale.bookId, {numBooks: sale.quantity, revenue: sale.quantity * sale.price, 
                  recentCost: 0, profit: 0})
              }
            }
        }

        for (const order of purchaseOrders){
          const purchases = await ctx.prisma.purchase.findMany({
            where:
            {
                purchaseOrderId: order.id
            }
            })
            for (const purchase of purchases){
                let booksObj = books.get(purchase.bookId)
                if (booksObj)
                books.set(purchase.bookId, {numBooks: booksObj.numBooks, revenue: booksObj.revenue, 
                  recentCost: purchase.price * purchase.quantity, profit: booksObj.revenue - purchase.price * purchase.quantity})
            }
        }
        books = new Map([...books.entries()]
        .sort((a: [string, topSellers], b: [string, topSellers]) => (a[1].numBooks < b[1].numBooks) ? 1 : -1));
        return books
       } catch (error) {
         console.log(error);
       }
     }),


  });