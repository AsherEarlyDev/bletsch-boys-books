import TableDetails from "../TableComponents/TableDetails";
import FilterableColumnHeading from "../TableComponents/FilterableColumnHeading";
import TableHeader from "../TableComponents/TableHeader";
import SalesReportTableRow from "../TableComponents/SalesReportTableRow";
import { api } from '../../utils/api';

interface salesReportProps {
    start: string
    end: string
}

export default function SalesReport(props:salesReportProps){
    const revenueReport = api.salesReport.generateRevenueReport.useQuery({startDate: props.start, endDate: props.end})
    const costReport = api.salesReport.generateCostReport.useQuery({startDate: props.start, endDate: props.end})
    const topSellers = api.salesReport.getTopSelling.useQuery({startDate: props.start, endDate: props.end})
    return (
        <div className="px-4 sm:px-6 lg:px-8">
        <TableDetails tableName="Sales Report"
                      tableDescription="A summary of financial information by date">
        </TableDetails>
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div
                  className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300 table-auto">
                <TableHeader>
                    <FilterableColumnHeading label="Date"
                                             firstEntry={true}></FilterableColumnHeading>
                    <FilterableColumnHeading label="Cost"></FilterableColumnHeading>
                    <FilterableColumnHeading label="Revenue"></FilterableColumnHeading>
                    <FilterableColumnHeading label="Profit"></FilterableColumnHeading>
                  </TableHeader>
                  <tbody className="divide-y divide-gray-200 bg-white">
                  {/* {salesRecs ? salesRecs.map((rec) => (
                      <SalesReportTableRow salesReportInfo={}></SalesReportTableRow>
                  )) : null} */}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <TableDetails tableName="Top Selling Books"
                      tableDescription="Top 10 Highest Selling Books">
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
                    <FilterableColumnHeading label="Total Cost Most-Recent"></FilterableColumnHeading>
                    <FilterableColumnHeading label="Total Revenue"></FilterableColumnHeading>
                    <FilterableColumnHeading label="Total Profit"></FilterableColumnHeading>
                  </TableHeader>
                  <tbody className="divide-y divide-gray-200 bg-white">
                  {/* {salesRecs ? salesRecs.map((rec) => (
                      <SalesReportTableRow salesReportInfo={}></SalesReportTableRow>
                  )) : null} */}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      
    )
}