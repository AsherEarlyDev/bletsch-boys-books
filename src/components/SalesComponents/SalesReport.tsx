import TableDetails from "../TableComponents/TableDetails";
import FilterableColumnHeading from "../TableComponents/TableColumnHeadings/FilterableColumnHeading";
import TableHeader from "../TableComponents/TableHeader";
import {SalesReportTableRow, SalesReportTotalTableRow, TopSellingTableRow} from "../TableComponents/TableRows/SalesReportTableRow";
import { api } from '../../utils/api';
import { Cost, Revenue, Sale } from "../../types/salesTypes";
import { jsPDF,HTMLOptionImage } from "jspdf";
import autoTable from 'jspdf-autotable'
import { resourceLimits } from "worker_threads";
import { report } from "process";



export function createSalesReportArray(rev: {totalRevenue: number, resultsMap: Map<Date,Revenue>}, 
  cost: {totalCost: number, resultsMap: Map<Date,Cost>}, start: string, end: string) {
        let resultsArray = []
        const revMap = rev?.resultsMap
        const costMap = cost?.resultsMap
        const totalMap = new Map<string, {cost: number, revenue: number}>()
        const dates = generateDatesArray(start, end);
        dates.map((date)=>totalMap.set((date.getMonth()+1)+"/"+(date.getDate())+"/"+date.getFullYear(), {cost: 0, revenue: 0}))
        if (revMap && costMap){
          revMap.forEach((value,key)=>{
            totalMap.set((key.getMonth()+1)+"/"+(key.getDate())+"/"+key.getFullYear(), {cost: 0, revenue: value.revenue})
          })
          costMap.forEach((value,key)=>{
            const date = (key.getMonth()+1)+"/"+(key.getDate())+"/"+key.getFullYear()
            const mapObj = totalMap.get(date)
            totalMap.set(date, {cost: value.cost, revenue: mapObj.revenue})
          })
        }

        totalMap.forEach((value,key)=>{
          let date = new Date(key)
          resultsArray.push({
            date: (date.getMonth()+1)+"/"+(date.getDate())+"/"+date.getFullYear(),
            cost: value.cost,
            revenue: value.revenue,
            profit: value.revenue - value.cost
          })
        })
        resultsArray = resultsArray.sort((a: any, b: any) => (a.date > b.date) ? 1 : -1)
        return {resultsArray: resultsArray, totalRev: rev?.totalRevenue, totalCost: cost?.totalCost}
    }

    function generateDatesArray(start: string, end: string){
      for(var arr=[],dt=new Date(start); dt<=new Date(end); dt.setDate(dt.getDate()+1)){
        arr.push(new Date(dt));
    }
    return arr;
    }

    export function generateSalesReportPDF(results: {date: string, cost: number, revenue: number, profit: number}[],
      topSellers: {recentCost: number, revenue: number, profit: number, isbn: string, title: string, numBooks: number}[],
      totalCost: number, totalRevenue: number){
      const report = new jsPDF();
      const totalProfit = totalRevenue-totalCost
      const totalTableCol = ["Total Cost", "Total Revenue", "Total Profit"]
      const tableCol = ["Date","Cost", "Revenue", "Profit"]
      const topSellersColumn = ["Book ISBN","Book Title","Quantity Sold","Total Cost Most-Recent", "Total Revenue", "Total Profit"]
      let totalRow = [totalCost, totalRevenue, totalProfit]
      let dailyRow = []
      let topSellersRow = []
      if (results && topSellers){
        results.map((result)=>{
          let dailyTemp = [result.date, result.cost, result.revenue, result.profit]
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

