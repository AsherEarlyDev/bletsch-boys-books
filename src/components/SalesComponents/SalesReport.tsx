import { BuybackRevenue, Cost, Revenue, Sale } from "../../types/salesTypes";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'




export function createSalesReportArray(rev: {totalRevenue: number, resultsMap: Map<Date,Revenue>}, 
  buyback: {totalRevenue: number, resultsMap: Map<Date,BuybackRevenue>}, 
  cost: {totalCost: number, resultsMap: Map<Date,Cost>}, start: string, end: string) {
        let resultsArray = []
        const revMap = rev?.resultsMap
        const costMap = cost?.resultsMap
        const buybackMap = buyback?.resultsMap
        const totalMap = new Map<string, {cost: number, revenue: number, buybackRevenue: number}>()
        const dates = generateDatesArray(start, end);
        dates.map((date)=>totalMap.set((date.getMonth()+1)+"/"+(date.getDate())+"/"+date.getFullYear(), {cost: 0, revenue: 0, buybackRevenue: 0}))
        if (revMap && costMap && buybackMap){
          revMap.forEach((value,key)=>{
            totalMap.set((key.getMonth()+1)+"/"+(key.getDate())+"/"+key.getFullYear(), {cost: 0, revenue: value.revenue, buybackRevenue: 0})
          })
          costMap.forEach((value,key)=>{
            const date = (key.getMonth()+1)+"/"+(key.getDate())+"/"+key.getFullYear()
            const mapObj = totalMap.get(date)
            totalMap.set(date, {cost: value.cost, revenue: mapObj.revenue, buybackRevenue: 0})
          })
          console.log(buybackMap)
          buybackMap.forEach((value,key)=>{
            const date = (key.getMonth()+1)+"/"+(key.getDate())+"/"+key.getFullYear()
            const mapObj = totalMap.get(date)
            totalMap.set(date, {cost: mapObj.cost, revenue: mapObj.revenue, buybackRevenue: value.revenue})
          })
        }
        console.log(totalMap)

        totalMap.forEach((value,key)=>{
          let date = new Date(key)
          resultsArray.push({
            date: (date.getMonth()+1)+"/"+(date.getDate())+"/"+date.getFullYear(),
            cost: value.cost.toFixed(2),
            revenue: value.revenue.toFixed(2),
            profit: (value.revenue + value.buybackRevenue - value.cost).toFixed(2),
            buybackRevenue: value.buybackRevenue.toFixed(2)
          })
        })
        resultsArray = resultsArray.sort((a: any, b: any) => (new Date(a.date) > new Date(b.date)) ? 1 : -1)
        return {resultsArray: resultsArray, totalRev: rev?.totalRevenue + buyback?.totalRevenue, totalCost: cost?.totalCost}
    }

    export function generateDatesArray(start: string, end: string){
      let endDate = end.split("-")
      let date = parseInt(endDate[2])+1
      endDate[2] = date.toString()
      for(var arr=[],dt=new Date(start); dt<=new Date(endDate.join("-")); dt.setDate(dt.getDate()+1)){
        arr.push(new Date(dt));
    }
    return arr;
    }

    export function generateSalesReportPDF(results: {date: string, cost: number, revenue: number, profit: number, buybackRevenue: number}[],
      topSellers: {recentCost: number, revenue: number, profit: number, isbn: string, title: string, numBooks: number}[],
      totalCost: number, totalRevenue: number){
      const report = new jsPDF();
      const totalProfit = (totalRevenue-totalCost)
      const totalTableCol = ["Total Cost", "Total Revenue", "Total Profit"]
      const tableCol = ["Date","Daily Cost", "Daily Sale Revenue", "Daily Buyback Revenue", "Daily Profit"]
      const topSellersColumn = ["Book ISBN","Book Title","Quantity Sold","Total Cost Most-Recent", "Total Revenue", "Total Profit"]
      let totalRow = [totalCost.toFixed(2), totalRevenue.toFixed(2), totalProfit.toFixed(2)]
      let dailyRow = []
      let topSellersRow = []
      if (results && topSellers){
        results.map((result)=>{
          let dailyTemp = [result.date, result.cost, result.revenue, result.buybackRevenue, result.profit]
          dailyRow.push(dailyTemp)
        })
  
        topSellers.map((top)=>{
          let topTemp = [top.isbn, top.title, top.numBooks, top.recentCost, top.revenue, top.profit]
          topSellersRow.push(topTemp)
        })
  
        autoTable(report, {
          head: [totalTableCol],
          body: [totalRow]
        })

        autoTable(report, {
          head: [tableCol],
          body: dailyRow
        })

        autoTable(report, {
          head: [topSellersColumn],
          body: topSellersRow
        })

        var file = `SalesReport.pdf`
        report.save(file)
      }

      
    }

