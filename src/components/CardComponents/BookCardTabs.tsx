import { useState } from 'react'
import { Tab } from '@headlessui/react'
import { api } from "../../utils/api";
import Link from 'next/link';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

interface BookCardTabsProps{
  title:string
  isbn: string
}

export default function BookCardTabs(props: BookCardTabsProps) {
  const transactionDetails = api.books.getBookTransactionDetails.useQuery(props.isbn).data
  const relatedBooks = api.books.findRelatedBooks.useQuery({isbn:props.isbn, title:props.title}).data
  let [categories] = useState(transactionDetails)
  console.log(transactionDetails)
  return (
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-indigo-300 p-1 mx-5">
          {transactionDetails && ((["Transactions", "Related Books"]).map((category) => (
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
          {transactionDetails &&
          [<Tab.Panel
              className={classNames(
                  'rounded-xl bg-white p-3',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400')}>
            {transactionDetails.length ?
                <div
                    className="flex flex-row justify-between mx-2 border-b border-solid border-indigo-400 p-2 text-left">
                  <h3 className="text-sm font-medium leading-5 w-32">Type</h3>
                  <h3 className="text-sm font-medium leading-5 w-32">Date</h3>
                  <h3 className="text-sm font-medium leading-5 w-32">User</h3>
                  <h3 className="text-sm font-medium leading-5 w-32">Vendor</h3>
                  <h3 className="text-sm font-medium leading-5 w-32">Price</h3>
                  <h3 className="text-sm font-medium leading-5 w-32">Quantity</h3>
                  <h3 className="text-sm font-medium leading-5 w-32">Running Inventory</h3>
                </div>:
                <h2>No specified  transactions available for book.</h2>
            }
            <ul>
              {transactionDetails.map((transaction) => (
                  <Link href={{pathname: (transaction.type==="Sale" ? '/sales' : (transaction.type==="Purchase" ? "/purchases" : "/buybacks")), query:{openView:"true", viewId:(transaction.type==="Sale" ? transaction.saleReconciliation.id : (transaction.type==="Purchase" ? transaction.purchaseOrder.id : (transaction.type==="Buyback" ? transaction.BookBuybackOrder.id : null)))}}}>
                    <li key={transaction.id} className="relative rounded-md p-3 hover:bg-indigo-100 flex flex-row justify-between text-left">
                      <h3 className="text-sm font-medium leading-5 w-32">{transaction.type}</h3>
                      <h3 className="text-sm font-medium leading-5 w-32">{transaction.date}</h3>
                      <h3 className="text-sm font-medium leading-5 w-32">{transaction.userName}</h3>
                      <h3 className="text-sm font-medium leading-5 w-32">{transaction.purchaseOrder?.vendor.name ?? transaction.BookBuybackOrder?.vendor.name ?? "---"}</h3>
                      <h3 className="text-sm font-medium leading-5 w-32">{"$"+((transaction.price?.toFixed(2)) ?? transaction.buybackPrice?.toFixed(2) ?? "---")}</h3>
                      <h3 className="text-sm font-medium leading-5 w-32">{(transaction.quantity > 0) ? "+" + (transaction.quantity) : (transaction.quantity)}</h3>
                      <h3 className="text-sm font-medium leading-5 w-32">{transaction.inventory}</h3>
                    </li>
                  </Link>
              ))}
            </ul>
          </Tab.Panel>,
            relatedBooks &&<Tab.Panel
                className={classNames(
                    'rounded-xl bg-white p-3',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400')}>
              {relatedBooks.length > 0 ?
                  <div
                      className="flex flex-row justify-between mx-2 border-b border-solid border-indigo-400 p-2 text-left">
                    <h3 className="text-sm font-medium leading-5 w-32">Title</h3>
                    <h3 className="text-sm font-medium leading-5 w-32">ISBN</h3>
                    <h3 className="text-sm font-medium leading-5 w-32">Author</h3>
                    <h3 className="text-sm font-medium leading-5 w-32">Publisher</h3>
                    <h3 className="text-sm font-medium leading-5 w-32">Publication Year</h3>
                  </div>:
                  <h2>No related books for this book.</h2>
              }
              <ul>
                {relatedBooks.map((book) => (

                    <Link href={{pathname:'/records', query:{openView:"true",viewId: book.isbn}}}><li
                        className="relative rounded-md p-3 hover:bg-indigo-100 flex flex-row justify-between text-left"
                    >
                      <h3 className="text-sm font-medium leading-5 w-32">{book.title}</h3>
                      <h3 className="text-sm font-medium leading-5 w-32">{book.isbn}</h3>
                      <h3 className="text-sm font-medium leading-5 w-32">{book.authorNames}</h3>
                      <h3 className="text-sm font-medium leading-5 w-32">{book.publisher}</h3>
                      <h3 className="text-sm font-medium leading-5 w-32">{book.publicationYear}</h3>
                    </li></Link>
                ))}
              </ul>
            </Tab.Panel>]

          }
        </Tab.Panels>
      </Tab.Group>
  )
}
