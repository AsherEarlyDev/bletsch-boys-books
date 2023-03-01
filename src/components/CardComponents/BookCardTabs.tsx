import { useState } from 'react'
import { Tab } from '@headlessui/react'
import { api } from "../../utils/api";

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
  console.log(categories)

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
                    className="flex flex-row justify-between mx-6 border-b border-solid border-indigo-400 p-2">
                  <h3 className="text-sm font-medium leading-5">
                    {(idx == 1 ? "Date Bought" : (idx == 2 ? "Date Bought Back" : "Date Sold"))}
                  </h3>
                  {idx == 1 &&
                  <h3 className="text-sm font-medium leading-5">
                    Vendor
                  </h3>}
                  <h3 className="text-sm font-medium leading-5">
                    {(idx == 1 ? "Quantity Bought" : (idx == 2 ? "Quantity Bought Back" : "Quantity Sold"))}
                  </h3>
                  <h3 className="text-sm font-medium leading-5">
                    {(idx == 1 ? "Purchase Price" : (idx == 2 ? "Buyback Price" : "Sale Price"))}
                  </h3>
                </div>:
                    <h2>No specified  transactions available for book.</h2>
                }
                  <ul>
                  {transactions.map((transaction) => (
                      <li
                          key={transaction.id}
                          className="relative rounded-md p-3 hover:bg-indigo-100 flex flex-row justify-between"
                      >
                        <h3 className="text-sm font-medium leading-5 w-32">
                          Find way to get date for SR/BB/PO
                        </h3>
                        {idx==1 &&
                        <h3 className="text-sm font-medium leading-5 w-8">
                          Get vendor name for SR/PO/BB
                        </h3>}
                        <h3 className="text-sm font-medium leading-5 w-8">
                          {transaction.quantity}
                        </h3>
                        <h3 className="text-sm font-medium leading-5 w-16">
                          ${transaction.price?.toFixed(2)}
                        </h3>
                      </li>
                  ))}
                </ul>
              </Tab.Panel>

          )))}
        </Tab.Panels>
      </Tab.Group>
  )
}
