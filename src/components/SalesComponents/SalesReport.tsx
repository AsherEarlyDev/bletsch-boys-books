import TableDetails from "../TableComponents/TableDetails";
import FilterableColumnHeading from "../TableComponents/TableColumnHeadings/FilterableColumnHeading";
import TableHeader from "../TableComponents/TableHeader";
import {SalesReportTableRow, SalesReportTotalTableRow, TopSellingTableRow} from "../TableComponents/TableRows/SalesReportTableRow";
import { api } from '../../utils/api';
import { Cost, Revenue, Sale } from "../../types/salesTypes";

interface salesReportProps {
    start: string
    end: string
}

export default function SalesReport(props:salesReportProps){
    const revenueReport = api.salesReport.generateRevenueReport.useQuery({startDate: props.start, endDate: props.end}).data
    const totalRevenue = revenueReport?.totalRevenue
    const revMap = revenueReport?.resultsMap
    const costReport = api.salesReport.generateCostReport.useQuery({startDate: props.start, endDate: props.end}).data
    const totalCost = costReport?.totalCost
    const costMap = costReport?.resultsMap
    const reportArray = createSalesReportArray(revMap, costMap)
    const totalProfit = totalRevenue - totalCost
    const topSellers = api.salesReport.getTopSelling.useQuery({startDate: props.start, endDate: props.end}).data
    console.log(topSellers)

    function createSalesReportArray(revMap: Map<Date,Revenue>, costMap: Map<Date,Cost>) {
        const resultsArray = []
        const totalMap = new Map<string, {cost: number, revenue: number}>()
        if (revMap && costMap){
          revMap.forEach((value,key)=>{
            totalMap.set((key.getMonth()+1)+"/"+(key.getDate())+"/"+key.getFullYear(), {cost: 0, revenue: value.revenue})
          })

          costMap.forEach((value,key)=>{
            const date = (key.getMonth()+1)+"/"+(key.getDate())+"/"+key.getFullYear()
            const mapObj = totalMap.get(date)
            if (mapObj){
              totalMap.set(date, {cost: value.cost, revenue: mapObj.revenue})
            }
            else{
              totalMap.set(date, {cost: value.cost, revenue: 0})
            }
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
        return resultsArray.sort((a: any, b: any) => (a.date > b.date) ? 1 : -1)

    }

    return (
        <div className="my-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg border border-grey-400 shadow-md p-8 sm:px-6 lg:px-8">
        <TableDetails tableName="Sales Report"
                      tableDescription={"A summary of financial information from: " + props.start + " to " + props.end}>
        </TableDetails>
        <div className="mb-14 mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300 table-auto">
                  <TableHeader>
                    <FilterableColumnHeading label="Date"
                                             firstEntry={true}></FilterableColumnHeading>
                    <FilterableColumnHeading label="Cost"></FilterableColumnHeading>
                    <FilterableColumnHeading label="Revenue"></FilterableColumnHeading>
                    <FilterableColumnHeading label="Profit"></FilterableColumnHeading>
                  </TableHeader>
                  <tbody className="divide-y divide-gray-200 bg-white">
                  {reportArray ? reportArray.map((result) => (
                      <SalesReportTableRow salesReportInfo={{
                        date: result.date, cost: result.cost, revenue: result.revenue, profit: result.profit}}></SalesReportTableRow>
                  )) : null}
                  </tbody>
                  <TableHeader>
                    <FilterableColumnHeading label={""} firstEntry={true}></FilterableColumnHeading>
                    <FilterableColumnHeading label="Total Cost"></FilterableColumnHeading>
                    <FilterableColumnHeading label="Total Revenue"></FilterableColumnHeading>
                    <FilterableColumnHeading label="Total Profit"></FilterableColumnHeading>
                  </TableHeader>
                  <tbody className="divide-y divide-gray-200 bg-white">
                  {<SalesReportTotalTableRow salesReportInfo={{cost: totalCost,
                    revenue: totalRevenue, profit: totalProfit}}></SalesReportTotalTableRow>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <TableDetails tableName="Top Selling Books"
                      tableDescription={"Top 10 selling books from: " + props.start + " to " + props.end}>
        </TableDetails>
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div
                  className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300 table-auto">
                <TableHeader>
                    <FilterableColumnHeading label="Book ISBN"
                                             firstEntry={true}></FilterableColumnHeading>
                    <FilterableColumnHeading label="Book Title"></FilterableColumnHeading>
                    <FilterableColumnHeading label="Number of Books"></FilterableColumnHeading>
                    <FilterableColumnHeading label="Total Revenue"></FilterableColumnHeading>
                    <FilterableColumnHeading label="Total Cost Most-Recent"></FilterableColumnHeading>
                    <FilterableColumnHeading label="Total Profit"></FilterableColumnHeading>
                  </TableHeader>
                  <tbody className="divide-y divide-gray-200 bg-white">
                  {topSellers ? topSellers.map((result) => (
                      <TopSellingTableRow topBooksInfo={{
                        isbn: result.isbn, title: result.title, numBooks: result.numBooks, recentCost: result.recentCost, revenue: result.revenue, profit: result.profit}}></TopSellingTableRow>
                    )) : null}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}