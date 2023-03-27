import { TRPCError } from "@trpc/server";
import { Input } from "postcss";
import { z } from "zod";
import { BuybackRevenue, Cost, Revenue, topSellers } from "../../../types/salesTypes";
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
                  revenue: parseFloat((dateMapObj.revenue + revenue).toFixed(2)),
                  sales: [...dateMapObj.sales, ...sales]
                })
              }
              else{
                dateMap.set(saleRec.date, {
                  revenue: parseFloat(revenue.toFixed(2)),
                  sales: [...sales]
                })
              }
              
              totalRevenue += parseFloat(revenue.toFixed(2))
            }
          }
          
          return {
            totalRevenue: totalRevenue,
            resultsMap: new Map([...dateMap.entries()]
            .sort((a: [Date, Revenue], b: [Date, Revenue]) => (a[0] > b[0]) ? 1 : -1))
          }
       } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
       }
     }),

     generateBuybacksReport: publicProcedure
    .input(
       z.object({
         startDate: z.string(),
         endDate: z.string()
       })
     )
     .query(async ({ ctx, input }) => {
       try {
          let totalRevenue = 0
          let dateMap = new Map<Date, BuybackRevenue>();
          const buybacks = await ctx.prisma.bookBuybackOrder.findMany({
            where:{
              date: {
                gte: new Date(input.startDate),
                lte: new Date(input.endDate)
              }
            }
          })
          console.log(buybacks)
          if(buybacks){
            for (const buyback of buybacks){
              let revenue = 0
              const buy = await ctx.prisma.buyback.findMany({
                where:
                {
                    buybackOrderId: buyback.id
                }
                })
                console.log(buy)
              for (const b of buy){
                revenue += b.quantity * b.buybackPrice
              }
              const dateMapObj = dateMap.get(buyback.date)
              if (dateMapObj){
                dateMap.set(buyback.date, {
                  revenue: parseFloat((dateMapObj.revenue + revenue).toFixed(2)),
                  buybacks: [...dateMapObj.buybacks, ...buy]
                })
              }
              else{
                dateMap.set(buyback.date, {
                  revenue: parseFloat(revenue.toFixed(2)),
                  buybacks: [...buy]
                })
              }
              totalRevenue += parseFloat(revenue.toFixed(2))
            }
          }
          
          return {
            totalRevenue: totalRevenue,
            resultsMap: new Map([...dateMap.entries()]
            .sort((a: [Date, BuybackRevenue], b: [Date, BuybackRevenue]) => (a[0] > b[0]) ? 1 : -1))
          }
       } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
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
                  cost: parseFloat((dateMapObj.cost + cost).toFixed(2)),
                  purchases: [...dateMapObj.purchases, ...purchases]
                })
              }
              else{
                dateMap.set(purchaseOrder.date, {
                  cost: parseFloat(cost.toFixed(2)),
                  purchases: [...purchases]
                })
              }
              totalCost += parseFloat(cost.toFixed(2))
            }
          }
          return {
            totalCost: totalCost,
            resultsMap: new Map([...dateMap.entries()]
            .sort((a: [Date, Cost], b: [Date, Cost]) => (a[0] > b[0]) ? 1 : -1))
          }
       } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
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
                    recentCost: 0, title: book.title})
              }
              else{
                books.set(sale.bookId, {numBooks: sale.quantity, revenue: sale.quantity * sale.price, 
                  recentCost: 0, title: book.title})
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
                if (booksObj){
                  books.set(purchase.bookId, {numBooks: booksObj.numBooks, revenue: booksObj.revenue, 
                    recentCost: purchase.price * booksObj.numBooks, title: booksObj.title})
                }
            }
        }
        let results = []

        books.forEach( (value,key)=> {
          
          const res = {
            isbn: key,
            title: value.title,
            numBooks: value.numBooks,
            recentCost: value.recentCost.toFixed(2),
            revenue: value.revenue.toFixed(2),
            profit: (value.revenue - value.recentCost).toFixed(2)
          }
          results.push(res)
        })

        results = results.sort((a: any, b: any) => (a.numBooks < b.numBooks) ? 1 : -1)
        return results.slice(0,10)
       } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
       }
     }),


  });