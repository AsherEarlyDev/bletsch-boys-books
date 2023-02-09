import { Input } from "postcss";
import { z } from "zod";
import { Cost, Revenue, topSellers } from "../../../types/salesTypes";
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
          let dateMap = new Map<Date, Revenue>();
          const salesRecs = await ctx.prisma.saleReconciliation.findMany({
            where:{
              date: {
                gte: new Date(input.startDate),
                lte: new Date(input.endDate)
              }
            }
          })
          if(salesRecs){
            for (const saleRec of salesRecs){
              let revenue = 0
              const sales = await ctx.prisma.sale.findMany({
                where:
                {
                    saleReconciliationId: saleRec.id
                }
                })
              for (const sale of sales){
                revenue += sale.quantity * sale.price
              }
              const dateMapObj = dateMap.get(saleRec.date)
              if (dateMapObj){
                dateMap.set(saleRec.date, {
                  revenue: dateMapObj.revenue + revenue,
                  sales: [...dateMapObj.sales, ...sales]
                })
              }
              else{
                dateMap.set(saleRec.date, {
                  revenue: revenue,
                  sales: [...sales]
                })
              }
              
              totalRevenue += revenue
            }
          }
          
          return {
            totalRevenue: totalRevenue,
            resultsMap: new Map([...dateMap.entries()]
            .sort((a: [Date, Revenue], b: [Date, Revenue]) => (a[0] > b[0]) ? 1 : -1))
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
          let dateMap = new Map<Date, Cost>();
          const purchaseOrders = await ctx.prisma.purchaseOrder.findMany({
            where:{
              date: {
                gte: new Date(input.startDate),
                lte: new Date(input.endDate)
              }
            }
          })
          if(purchaseOrders){
            for (const purchaseOrder of purchaseOrders){
              let cost = 0
              const purchases = await ctx.prisma.purchase.findMany({
                where:
                {
                    purchaseOrderId: purchaseOrder.id
                }
                })
              
              for (const pur of purchases){
                cost += pur.quantity * pur.price
              }
              const dateMapObj = dateMap.get(purchaseOrder.date)
              if (dateMapObj){
                dateMap.set(purchaseOrder.date, {
                  cost: dateMapObj.cost + cost,
                  purchases: [...dateMapObj.purchases, ...purchases]
                })
              }
              else{
                dateMap.set(purchaseOrder.date, {
                  cost: cost,
                  purchases: [...purchases]
                })
              }
              totalCost += cost
            }
          }
          return {
            totalCost: totalCost,
            resultsMap: new Map([...dateMap.entries()]
            .sort((a: [Date, Cost], b: [Date, Cost]) => (a[0] > b[0]) ? 1 : -1))
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
              const book = await ctx.prisma.book.findFirst({
                where:{
                  isbn: sale.bookId
                }
              })
              if (books.get(sale.bookId)){
                let updatedNumBooks = books.get(sale.bookId)?.numBooks + sale.quantity 
                let rev = sale.quantity * sale.price
                let currRev = books.get(sale.bookId)?.revenue
                if(currRev && book)
                  books.set(sale.bookId, {numBooks: updatedNumBooks, revenue: rev+currRev, 
                    recentCost: 0, profit: 0, title: book.title})
              }
              else{
                books.set(sale.bookId, {numBooks: sale.quantity, revenue: sale.quantity * sale.price, 
                  recentCost: 0, profit: 0, title: book.title})
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
            console.log(purchases)
            for (const purchase of purchases){
              
                let booksObj = books.get(purchase.bookId)
                if (booksObj){
                  console.log("Revenue: "+booksObj.revenue)
                  console.log("Price: "+purchase.price)
                  console.log("NumBooks: "+booksObj.numBooks)
                  books.set(purchase.bookId, {numBooks: booksObj.numBooks, revenue: booksObj.revenue, 
                    recentCost: purchase.price * booksObj.numBooks, profit: booksObj.revenue - purchase.price * booksObj.numBooks,
                     title: booksObj.title})
                }
            }
        }
        let results = []
        console.log(books)
        books.forEach( (value,key)=> {
          
          const res = {
            isbn: key,
            title: value.title,
            numBooks: value.numBooks,
            recentCost: value.recentCost,
            revenue: value.revenue,
            profit: value.profit
          }
          results.push(res)
        })

        results = results.sort((a: any, b: any) => (a.numBooks > b.numBooks) ? 1 : -1)
        return results.slice(0,10)
       } catch (error) {
         console.log(error);
       }
     }),


  });