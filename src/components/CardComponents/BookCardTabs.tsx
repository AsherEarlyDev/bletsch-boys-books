import { useState } from 'react'
import { Tab } from '@headlessui/react'
import { api } from "../../utils/api";
import Link from 'next/link';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

interface BookCardTabsProps{
  isbn: string
}

export default function BookCardTabs(props: BookCardTabsProps) {
  const transactionDetails = api.books.getBookTransactionDetails.useQuery(props.isbn).data
  console.log(transactionDetails)
  let [categories] = useState(transactionDetails)

  return (
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-indigo-300 p-1 mx-5">
          {transactionDetails && (Object.keys(transactionDetails).map((category) => (
              <Tab
                  key={category}
                  className={({ selected }) =>
                      classNames(
                          'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-indigo-600',
                          'ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-600 focus:outline-none focus:ring-2',
                          selected
                              ? 'bg-white shadow'
                              : 'text-indigo-100 hover:bg-indigo-500 hover:text-white'
                      )
                  }
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Tab>
              )))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          {transactionDetails && (Object.values(transactionDetails).map((transactions, idx) => (
              <Tab.Panel
                  key={idx}
                  className={classNames(
                      'rounded-xl bg-white p-3',
                      'ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400'
                  )}
              >
                {transactions.length ?
                <div
                    className="flex flex-row justify-between mx-2 border-b border-solid border-indigo-400 p-2 text-left">
                  <h3 className="text-sm font-medium leading-5 w-32">
                    {(idx == 1 ? "Date Bought" : (idx == 2 ? "Date Bought Back" : "Date Sold"))}
                  </h3>
                  {(idx == 1 || idx==2) &&
                  <h3 className="text-sm font-medium leading-5 w-32">
                    Vendor
                  </h3>}
                  <h3 className="text-sm font-medium leading-5 w-32">
                    {(idx == 1 ? "Quantity Bought" : (idx == 2 ? "Quantity Returned" : "Quantity Sold"))}
                  </h3>
                  <h3 className="text-sm font-medium leading-5 w-32">
                    {(idx == 1 ? "Purchase Price" : (idx == 2 ? "Buyback Price" : "Sale Price"))}
                  </h3>
                </div>:
                    <h2>No specified  transactions available for book.</h2>
                }
                  <ul>
                  {transactions.map((transaction) => (
                      <Link href={{pathname: (idx==0 ? '/sales' : (idx==1 ? "/purchases" : "/buybacks")), query:{openView:"true", viewId:(idx==0 ? transaction.saleReconciliation.id : (idx==1 ? transaction.purchaseOrder.id : transaction.bookBuybackOrder.id))}}}><li
                          key={transaction.id}
                          className="relative rounded-md p-3 hover:bg-indigo-100 flex flex-row justify-between text-left"
                      >
                        <h3 className="text-sm font-medium leading-5 w-32">
                          {transaction.purchaseOrder?.date.toLocaleDateString("en-US") || transaction.bookBuybackOrder?.date.toLocaleDateString("en-US")  || transaction.saleReconciliation?.date.toLocaleDateString("en-US")}
                        </h3>
                        {(idx==1 || idx==2) &&
                        <h3 className="text-sm font-medium leading-5 w-32">
                          {transaction.purchaseOrder?.vendor.name || transaction.bookBuybackOrder?.vendor.name}
                        </h3>}
                        <h3 className="text-sm font-medium leading-5 w-32">
                          {transaction.quantity}
                        </h3>
                        <h3 className="text-sm font-medium leading-5 w-32">
                          ${transaction.price?.toFixed(2)}
                        </h3>
                      </li></Link>
                  ))}
                </ul>
              </Tab.Panel>

          )))}
        </Tab.Panels>
      </Tab.Group>
  )
}
