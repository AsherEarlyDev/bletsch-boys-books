import {api} from "../../utils/api";
import {z} from "zod";
import { Loader } from "semantic-ui-react";

export default function DashboardStats() {
  const numberOfBooks = api.books.getNumberOfBooks.useQuery({filters:{
      title: "",
      isbn: "",
      publisher: "",
      genre: "",
      authorNames: ""
    }}).data
  const totalRevenue = api.salesReport.generateRevenueReport.useQuery({startDate: "01-01-0001", endDate: "01-01-2100"}).data
  const totalCost = api.salesReport.generateCostReport.useQuery({startDate: "01-01-0001", endDate: "01-01-2100"}).data
  const stats = [
    { name: 'Total Costs', stat: "$" + totalCost?.totalCost.toFixed(2) },
    { name: 'Total Revenue', stat: "$" + totalRevenue?.totalRevenue.toFixed(2) },
    { name: 'Total Profit', stat: "$" + (totalRevenue?.totalRevenue - totalCost?.totalCost).toFixed(2) },
    { name: 'Quantity of Unique Books', stat: numberOfBooks },
  ]
  return (
      <div  className="p-10">
       {(numberOfBooks && totalCost && totalRevenue) ? <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {stats.map((item) => (
              <div key={item.name} className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{item.stat}</dd>
              </div>
          ))}
        </dl>: null}
      </div>
  )
}
