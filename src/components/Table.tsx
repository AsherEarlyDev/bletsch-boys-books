import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { api } from "../utils/api";
import AddBookModal from "./AddBookModal";

const book = [
  { title: 'Book 1', isbn: '13478392489', author: 'John Snow', price: 100, genre: 'comedy', inventory: 5},
  // More people...
]
;


export default function Table() {
  const  books = api.googleBooks.getAllInternalBooks.useQuery().data
  
  return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Users</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all the books in inventory.
            </p>
          </div>
          <AddBookModal buttonText="Add Book" submitText="Add Book(s)"></AddBookModal>
        </div>
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300 table-auto">
                  <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      <a href="#" className="group inline-flex">
                        Book Title
                        <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                          <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      </a>
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      <a href="#" className="group inline-flex">
                        ISBN
                        <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                          <ChevronDownIcon
                              className="invisible ml-2 h-5 w-5 flex-none rounded text-gray-400 group-hover:visible group-focus:visible"
                              aria-hidden="true"
                          />
                        </span>
                      </a>
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      <a href="#" className="group inline-flex">
                        Author(s)
                        <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                          <ChevronDownIcon
                              className="invisible ml-2 h-5 w-5 flex-none rounded text-gray-400 group-hover:visible group-focus:visible"
                              aria-hidden="true"
                          />
                        </span>
                      </a>
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      <a href="#" className="group inline-flex">
                        Price
                        <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                          <ChevronDownIcon
                              className="invisible ml-2 h-5 w-5 flex-none rounded text-gray-400 group-hover:visible group-focus:visible"
                              aria-hidden="true"
                          />
                        </span>
                      </a>
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      <a href="#" className="group inline-flex">
                        Genre
                        <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                          <ChevronDownIcon
                              className="invisible ml-2 h-5 w-5 flex-none rounded text-gray-400 group-hover:visible group-focus:visible"
                              aria-hidden="true"
                          />
                        </span>
                      </a>
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      <a href="#" className="group inline-flex">
                        Inventory
                        <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                          <ChevronDownIcon
                              className="invisible ml-2 h-5 w-5 flex-none rounded text-gray-400 group-hover:visible group-focus:visible"
                              aria-hidden="true"
                          />
                        </span>
                      </a>
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-0 sm:pr-6">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {books ?  books.map((book) => (
                      <tr>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {book.title}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{book.isbn}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{book.author.map((author) => author.name).join(", ")}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{book.retailPrice}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{book.genre.name}</td>
                        {/* <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{book.inventory}</td> */}
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <a href="#" className="text-indigo-600 hover:text-indigo-900">
                            Edit<span className="sr-only">, {book.title}</span>
                          </a>
                        </td>
                      </tr>
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
